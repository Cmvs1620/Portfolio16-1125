import React from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// Full-screen, minimal, guaranteed render path.
// Uses your working URL: /assets/models/earth.obj
function EarthModel() {
  const obj = useLoader(OBJLoader, "/Models/earth.obj");
  // Slow spin so you *see* it move (and know it's alive)
  useFrame(() => {
    obj.rotation.y += 0.005;
  });
  return <primitive object={obj} scale={1} />;
}

export default function ThreeTest() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      {/* Minimal overlay for quick status */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 1,
          fontSize: 12,
          padding: "6px 10px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
          color: "white",
        }}
      >
        Earth OBJ • /Models/earth.obj
      </div>

      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <EarthModel />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}
