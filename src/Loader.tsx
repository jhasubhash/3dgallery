import { Html, useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  console.log(progress);
  return <Html style={{ color: "white" }}>{progress} % loaded</Html>;
}

export default Loader;
