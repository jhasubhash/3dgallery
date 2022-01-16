import React, { Suspense, useCallback, useRef, useState } from "react";
import {
  Environment,
  FirstPersonControls,
  Loader,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  PointerLockControls,
  useGLTF,
} from "@react-three/drei";
import Model from "./Test";

import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

function ReactThreeCanvas() {
  let planeRef = useRef([]);
  let controlRef = useRef(null);
  let planeMaterial = new THREE.MeshPhongMaterial();
  planeMaterial.side = THREE.DoubleSide;
  planeMaterial.color = new THREE.Color("grey");

  let groundMaterial = new THREE.MeshPhongMaterial();
  groundMaterial.side = THREE.DoubleSide;
  groundMaterial.color = new THREE.Color("grey");

  const zOffset = 0.01;
  const objects: any[] = [];
  const velocityVal = 400;

  let prevTime = performance.now();
  let time;
  let delta;

  const { camera } = useThree();

  let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false;

  let canJump = false;

  let velocity = new THREE.Vector3();
  let direction = new THREE.Vector3();

  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, 0, -1),
    0,
    2
  );
  raycaster.camera = camera;

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
    (controlRef.current as any).moveRight(-rightVal);
    (controlRef.current as any).moveForward(fwdVal);
    const intersections = raycaster.intersectObjects(planeRef.current, false);
    if (isMoving() && intersections.length == 0) {
      (controlRef.current as any).moveRight(rightVal);
      (controlRef.current as any).moveForward(-fwdVal);
    } else {
      direction = oldDirection;
      velocity = oldVelocity;
    }
    if (intersections.length) console.log("collided");
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

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

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
        <Plane
          args={[5, 200]}
          rotation={[0, 2.5, Math.PI / 2]}
          position={[0, zOffset, -50]}
          material={planeMaterial}
          receiveShadow={true}
          ref={(element) => ((planeRef as any).current[0] = element)}
        />
      </Suspense>
      <PointerLockControls
        position={[0, 15, 0]}
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
