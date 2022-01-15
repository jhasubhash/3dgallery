import React, { Suspense } from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { Environment, Loader, OrbitControls, useGLTF } from "@react-three/drei";
import Model from "./Test";
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
  return (
    <>
      <Canvas shadows camera={{ position: [-10, 15, 15], fov: 50 }}>
        <ambientLight intensity={0.1} />
        <pointLight castShadow position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Environment files={"./assets/model/test.hdr"} preset={"night"} />
          <Model />
        </Suspense>
        <OrbitControls
          addEventListener={undefined}
          hasEventListener={undefined}
          removeEventListener={undefined}
          dispatchEvent={undefined}
        />
      </Canvas>
      <Loader
        innerStyles={{
          margin: "50%",
        }}
      />
    </>
  );
}

export default ReactThreeLoader;
