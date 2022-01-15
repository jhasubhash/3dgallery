import "@google/model-viewer/dist/model-viewer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

function ModelViewLoader() {
  return (
    <div>
      <model-viewer
        bounds="tight"
        src="test.glb"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        environment-image="test.hdr"
        shadow-intensity="2.7"
        exposure="1"
        shadow-softness="0.69"
        autoplay
      ></model-viewer>
    </div>
  );
}

export default ModelViewLoader;
