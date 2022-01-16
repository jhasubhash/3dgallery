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

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [85, 15, 85], fov: 50, rotation: [0, 90, 0] }}
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
