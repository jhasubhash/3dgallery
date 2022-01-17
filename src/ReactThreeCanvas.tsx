import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Environment,
  FirstPersonControls,
  Loader,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  Point,
  PointerLockControls,
  Points,
  Sphere,
  useGLTF,
} from "@react-three/drei";
import Model from "./Test";

import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

function ReactThreeCanvas() {
  let planeRef = useRef([]);
  let controlRef = useRef(null);
  let pointerRef = useRef(null);
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
  (window as any).pos = new THREE.Vector3(0, 0, 0);
  let mousePos = { x: 0, y: 0 };

  let planeMaterial = new THREE.MeshPhongMaterial();
  planeMaterial.side = THREE.DoubleSide;
  planeMaterial.color = new THREE.Color("grey");

  let groundMaterial = new THREE.MeshPhongMaterial();
  groundMaterial.side = THREE.DoubleSide;
  groundMaterial.color = new THREE.Color("grey");

  let pointerMaterial = new THREE.PointsMaterial();
  pointerMaterial.side = THREE.BackSide;
  pointerMaterial.color = new THREE.Color("yellow");

  const zOffset = 0.01;
  const objects: any[] = [];
  const velocityVal = 200;

  let prevTime = performance.now();
  let time;
  let delta;

  const { camera, mouse, scene } = useThree();

  let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false;

  let canJump = false;

  let velocity = new THREE.Vector3();
  let direction = new THREE.Vector3();
  let prevDirection = new THREE.Vector3(0, 1, 0);

  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, 0, -1),
    0,
    1
  );
  raycaster.camera = camera;

  /*var vec = new THREE.Vector3();
  var pos = new THREE.Vector3();
  document.addEventListener("mousemove", (event: any) => {
    mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
    vec.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0.5
    );
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    var distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
  });*/

  let raycaster1 = new THREE.Raycaster();
  function onMouseClick(event: any) {
    if (
      controlRef &&
      controlRef.current &&
      (controlRef.current as any).isLocked
    ) {
      let vec3 = (pointerRef.current as any).position.project(camera);
      let vec = new THREE.Vector2(vec3.x, vec3.y);
      raycaster1.setFromCamera(vec, camera);
      /*scene.add(
        new THREE.ArrowHelper(
          raycaster1.ray.direction,
          raycaster1.ray.origin,
          300,
          0xffffff
        )
      );*/
      var isIntersected = raycaster1.intersectObjects(scene.children, true);
      if (isIntersected) {
        console.log("Mesh clicked!");
        console.log(isIntersected);
      }
    }
  }

  useEffect(() => {
    document.addEventListener("click", onMouseClick);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("click", onMouseClick);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const isMovingInSameDirection = () => {
    return (
      (moveLeft || moveRight || moveForward || moveBackward) &&
      prevDirection == direction
    );
  };

  const isMoving = () => {
    return moveLeft || moveRight || moveForward || moveBackward;
  };

  const moveCamera = () => {
    requestAnimationFrame(moveCamera);
    if (!controlRef || !controlRef.current) return;

    time = performance.now();
    delta = (time - prevTime) / 1000;

    let oldDirection = direction;
    let oldVelocity = velocity;
    velocity.x -= velocity.x * 10 * delta;
    velocity.z -= velocity.z * 10 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward)
      velocity.z -= direction.z * velocityVal * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * velocityVal * delta;

    prevTime = time;
    let fwdVal = velocity.z * delta;
    let rightVal = velocity.x * delta;

    (controlRef.current as any).moveRight(rightVal);
    (controlRef.current as any).moveForward(-fwdVal);
    raycaster.ray.origin.copy((controlRef.current as any).getObject().position);
    //raycaster.ray.direction.copy(direction);
    (controlRef.current as any).moveRight(-rightVal);
    (controlRef.current as any).moveForward(fwdVal);
    const intersections = raycaster.intersectObjects(planeRef.current, false);
    prevDirection = direction;
    if (isMoving() && intersections.length == 0) {
      (controlRef.current as any).moveRight(rightVal);
      (controlRef.current as any).moveForward(-fwdVal);
    } else {
      direction = oldDirection;
      velocity = oldVelocity;
    }
    if (pointerRef && pointerRef.current) {
      const distanceFromCamera = 0.1; // 3 units
      const target = new THREE.Vector3(0, 0, -distanceFromCamera);
      target.applyMatrix4(camera.matrixWorld);
      if ((pointerRef.current as any).position != target) {
        (pointerRef.current as any).position.lerp(target, 1);
        //(pointerRef.current as any).position.set(target);
      }
      /*(pointerRef.current as any).position.lerp(
        (controlRef.current as any).getObject().position,
        1
      );*/
      //setPosition((controlRef.current as any).getObject().position);
    }
    /*(pointerRef.current as any).position = (
      controlRef.current as any
    ).getObject().position;*/
  };

  moveCamera();

  const onKeyDown = function (event: any) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function (event: any) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight castShadow position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Environment files={"./assets/model/test.hdr"} preset={"night"} />
        <Model />
        <Plane
          args={[1000, 1000]}
          rotation={[(Math.PI / 2) * 3, 0, 0]}
          position={[0, zOffset, 0]}
          material={groundMaterial}
          receiveShadow={true}
          name={"ground"}
        />
        <Sphere
          args={[0.001]}
          position={position}
          ref={pointerRef}
          material={pointerMaterial}
        />
        <Plane
          args={[5, 200]}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, 2.5 + zOffset, -50]}
          material={planeMaterial}
          receiveShadow={true}
          ref={(element) => ((planeRef as any).current[0] = element)}
        />
      </Suspense>
      <PointerLockControls
        position={[0, 0, 0]}
        ref={controlRef}
        camera={camera}
        minPolarAngle={Math.PI / 2 - 1}
        maxPolarAngle={Math.PI / 2 + 1}
      />
    </>
  );
}

/*

        <Plane
          args={[200, 200]}
          position={[-100, 100 + zOffset, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={planeMaterial}
          receiveShadow={true}
          ref={(element) => ((planeRef as any).current[1] = element)}
        />
        <Plane
          args={[200, 200]}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, 100 + zOffset, 100]}
          material={planeMaterial}
          receiveShadow={true}
          ref={(element) => ((planeRef as any).current[2] = element)}
        />
        <Plane
          args={[200, 200]}
          rotation={[0, 0, Math.PI / 2]}
          position={[0, 100 + zOffset, -100]}
          material={planeMaterial}
          receiveShadow={true}
          ref={(element) => ((planeRef as any).current[3] = element)}
        />
*/
export default ReactThreeCanvas;
