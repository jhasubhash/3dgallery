import React, { Suspense, useCallback, useRef } from "react";
import styled from "styled-components";
import { Canvas, useThree } from "@react-three/fiber";
import ReactThreeCanvas from "./ReactThreeCanvas";
import { Loader } from "@react-three/drei";
import * as THREE from "three";
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
  let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 2;
  camera.position.z = 20;
  return (
    <>
      <Canvas shadows camera={camera} ref={canvasRef}>
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
