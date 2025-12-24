// src/components/Hero3D.jsx
// Google GLB with automatic local fallback (/public/smiley.glb)

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  PresentationControls,
  ContactShadows,
  Html,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader, DRACOLoader } from "three-stdlib";

/* === GLOBAL KNOBS === */
const GLOBAL_MODEL_SCALE = 1.0;
const GLOBAL_ROTATE = { enabled: true, speed: 0.3, axis: "y" };
const GLOBAL_PIVOT_FINE_TUNE = [0, 0, 0];

/* === FALLBACK === */
const FALLBACK_GLB = "/torus3.glb";

/* =================== */

function applyMaterialOverrides(root, materialOverride) {
  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      if (materialOverride) {
        child.material = new THREE.MeshStandardMaterial({
          color: materialOverride.color || "#c084fc",
          metalness: materialOverride.metalness ?? 0.2,
          roughness: materialOverride.roughness ?? 0.6,
        });
      } else if (child.material) {
        child.material.side = THREE.FrontSide;
        child.material.needsUpdate = true;
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
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const box = new THREE.Box3().setFromObject(ref.current);
    const center = box.getCenter(new THREE.Vector3());
    ref.current.position.sub(center);
    ref.current.position.x += fineTune[0] || 0;
    ref.current.position.y += fineTune[1] || 0;
    ref.current.position.z += fineTune[2] || 0;
  }, [children, fineTune]);
  return <group ref={ref}>{children}</group>;
}

function CenterLoader({ label }) {
  return (
    <Html center>
      <div className="px-3 py-2 text-xs rounded-md border bg-background/70 backdrop-blur-sm">
        {label}
      </div>
    </Html>
  );
}

/* === GLB LOADER WITH FALLBACK === */
function ModelGLB({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  materialOverride,
  autoRotate,
  pivotFineTune,
}) {
  const [scene, setScene] = useState(null);
  const [loadingLabel, setLoadingLabel] = useState("Loading 3D…");

  useEffect(() => {
    let mounted = true;

    const load = (url, isFallback = false) => {
      const loader = new GLTFLoader();
      const draco = new DRACOLoader();
      draco.setDecoderPath("/draco/");
      loader.setDRACOLoader(draco);

      loader.load(
        url,
        (gltf) => {
          if (!mounted) return;
          applyMaterialOverrides(gltf.scene, materialOverride);
          setScene(gltf.scene);
        },
        undefined,
        (err) => {
          if (!mounted) return;

          if (!isFallback) {
            console.warn(
              "[Hero3D] Primary model failed, using fallback:",
              err
            );
            setLoadingLabel("Loading fallback…");
            load(FALLBACK_GLB, true);
          } else {
            console.error("[Hero3D] Fallback model failed:", err);
          }
        }
      );
    };

    setScene(null);
    setLoadingLabel("Loading 3D…");
    load(src, false);

    return () => {
      mounted = false;
    };
  }, [src, materialOverride]);

  if (!scene) return <CenterLoader label={loadingLabel} />;

  const s = scale * GLOBAL_MODEL_SCALE;
  const r = { ...GLOBAL_ROTATE, ...(autoRotate || {}) };
  const fine = pivotFineTune ?? GLOBAL_PIVOT_FINE_TUNE;

  return (
    <group position={position} rotation={rotation}>
      <Rotator enabled={!!r.enabled} speed={r.speed} axis={r.axis}>
        <CenterPivot fineTune={fine}>
          <primitive object={scene} scale={s} dispose={null} />
        </CenterPivot>
      </Rotator>
    </group>
  );
}

/* === MAIN HERO 3D === */
export default function Hero3D({ model, environment = "studio" }) {
  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[500px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.shadowMap.enabled = true;
          scene.background = null;
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 8]} intensity={0.9} castShadow />
        <spotLight position={[-6, 3, 2]} intensity={0.4} angle={0.4} />

        {environment !== "none" && (
          <Environment
            preset={environment === "city" ? "city" : "studio"}
            background={false}
          />
        )}

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
            <Suspense fallback={<CenterLoader label="Loading…" />}>
              {model?.src && <ModelGLB {...model} />}
            </Suspense>
          </Float>
        </PresentationControls>

        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.35}
          scale={10}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}
