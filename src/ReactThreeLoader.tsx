import React, { Suspense, useCallback, useRef } from "react";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import ReactThreeCanvas from "./ReactThreeCanvas";
import { Loader } from "@react-three/drei";
//import Loader from "./Loader";
//import testHdr from './assets/models/test.hdr'

const MainWrapper = styled.div`
  text-align: center;
`;

/*function Model(_props: any) {
  const { scene } = useGLTF("/test.glb");
  return <primitive object={scene} />;
}*/

function ReactThreeLoader() {
  let canvasRef = useRef(null);
  /*let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 2;
  camera.position.z = 20;*/

  return (
    <>
      <Canvas
        shadows
        camera={{
          position: [0, 2, 20],
          fov: 75,
          rotation: [0, 0, 0],
          near: 0.1,
          far: 2000,
        }}
        ref={canvasRef}
      >
        <ReactThreeCanvas />
      </Canvas>
      <Loader
        innerStyles={{
          margin: "50%",
        }}
      />
    </>
  );
}

//<OrbitControls ref={controlRef} />
//<PerspectiveCamera makeDefault position={[50, 20 + zOffset, 50]} />

export default ReactThreeLoader;
