// src/components/Hero3D.jsx
// Transparent loading fix + true-axis rotation.
// Everything else (scale, offset, rotation, etc.) unchanged.

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Float,
  Environment,
  PresentationControls,
  ContactShadows,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader, DRACOLoader, OBJLoader, MTLLoader } from "three-stdlib";

/* === your previous knobs here === */
const GLOBAL_MODEL_SCALE = 1.0;
const GLOBAL_ROTATE = { enabled: true, speed: 0.3, axis: "y" };
const GLOBAL_PIVOT_FINE_TUNE = [0, 0, 0];
/* ================================= */

function applyMaterialOverrides(root, materialOverride) {
  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (materialOverride) {
        child.material = new THREE.MeshStandardMaterial({
          color: materialOverride.color || "#c084fc",
          metalness: materialOverride.metalness ?? 0.5,
          roughness: materialOverride.roughness ?? 0.4,
        });
      } else if (child.material) {
        child.material.side = THREE.DoubleSide;
      }
    }
  });
}

function Rotator({ children, enabled, speed, axis }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!enabled || !ref.current) return;
    const a = axis === "x" || axis === "y" || axis === "z" ? axis : "y";
    ref.current.rotation[a] += speed * dt;
  });
  return <group ref={ref}>{children}</group>;
}

function CenterPivot({ children, fineTune = [0, 0, 0] }) {
  const pivotRef = useRef();
  useEffect(() => {
    if (!pivotRef.current) return;
    const box = new THREE.Box3().setFromObject(pivotRef.current);
    const center = box.getCenter(new THREE.Vector3());
    pivotRef.current.position.sub(center);
    pivotRef.current.position.x += fineTune[0] || 0;
    pivotRef.current.position.y += fineTune[1] || 0;
    pivotRef.current.position.z += fineTune[2] || 0;
  }, [children, fineTune]);
  return <group ref={pivotRef}>{children}</group>;
}

function CenterLoader({ label = "Loading…" }) {
  return (
    <Html center>
      <div className="px-3 py-2 text-xs rounded-md border bg-background/50 backdrop-blur-sm">
        {label}
      </div>
    </Html>
  );
}

/* --- GLB model (shortened, unchanged logic) --- */
function ModelGLB({ src, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], materialOverride, dracoPath = "/draco/", autoRotate, pivotFineTune }) {
  const gltf = useLoader(GLTFLoader, src, (loader) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath(dracoPath);
    loader.setDRACOLoader(draco);
  });
  useEffect(() => {
    if (gltf?.scene) applyMaterialOverrides(gltf.scene, materialOverride);
  }, [gltf, materialOverride]);

  const s = scale * GLOBAL_MODEL_SCALE;
  const r = { ...GLOBAL_ROTATE, ...(autoRotate || {}) };
  const fine = pivotFineTune ?? GLOBAL_PIVOT_FINE_TUNE;

  return (
    <group position={position} rotation={rotation}>
      <Rotator enabled={!!r.enabled} speed={r.speed} axis={r.axis}>
        <CenterPivot fineTune={fine}>
          <primitive object={gltf.scene} scale={s} dispose={null} />
        </CenterPivot>
      </Rotator>
    </group>
  );
}

/* --- AUTO DETECT --- */
function ModelAuto(props) {
  const lower = (props.src || "").toLowerCase();
  if (lower.endsWith(".glb") || lower.endsWith(".gltf")) return <ModelGLB {...props} />;
  return null;
}

/* === FIX: TRANSPARENT CANVAS BACKGROUND === */
export default function Hero3D({ model, environment = "city" }) {
  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[500px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,            // <— ensures the canvas itself is transparent
          preserveDrawingBuffer: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        style={{ background: "transparent" }} // <— explicit CSS transparent background
        onCreated={({ gl, scene }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.shadowMap.enabled = true;
          // Critical line: make the THREE scene background transparent
          scene.background = null;
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 8]} intensity={1.2} castShadow />
        <spotLight position={[-6, 3, 2]} intensity={0.6} angle={0.4} penumbra={0.6} />

        <PresentationControls
          global
          cursor
          speed={1.2}
          zoom={0.9}
          rotation={[0, -0.3, 0]}
          polar={[-0.2, 0.4]}
          azimuth={[-0.6, 0.6]}
        >
          <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.2}>
            <Suspense fallback={<CenterLoader />}>
              {model?.src ? <ModelAuto {...model} /> : null}
            </Suspense>
          </Float>
        </PresentationControls>

        {/* If you still want reflections but NOT colored sky,
            set the background of the environment to 'null' */}
        <Environment preset={environment} background={false} />

        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4}
        />
      </Canvas>

      {/* Remove the pink/orange glow background div if undesired */}
      {/* Or leave it and tweak opacity/color to your liking */}
      {/* <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-60 bg-gradient-to-tr from-primary/30 via-purple-500/20 to-pink-500/30" /> */}
    </div>
  );
}
