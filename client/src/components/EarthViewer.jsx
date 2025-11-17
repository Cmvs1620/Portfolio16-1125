import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

function EarthModel() {
  const obj = useLoader(OBJLoader, "/Models/earth.obj");
  useFrame(() => {
    obj.rotation.y += 0.003; // slow spin
  });
  return <primitive object={obj} scale={1} />;
}

export default function EarthViewer() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 1, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <EarthModel />
        <OrbitControls enableDamping enableZoom={false} />
      </Canvas>
    </div>
  );
}
