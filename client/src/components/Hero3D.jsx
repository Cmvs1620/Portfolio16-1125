// src/components/Hero3D.jsx
// Production-safe:
// - Environment is isolated so it can't block model rendering
// - If remote GLB fails, automatically falls back to /smiley.glb in /public
// - Shows a small "Loading..." while model loads, and swaps to fallback on error

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
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

/* === knobs === */
const GLOBAL_MODEL_SCALE = 1.0;
const GLOBAL_ROTATE = { enabled: true, speed: 0.3, axis: "y" };
const GLOBAL_PIVOT_FINE_TUNE = [0, 0, 0];
/* ============ */

function applyMaterialOverrides(root, materialOverride) {
  root.traverse((child) => {
    if (!child.isMesh) return;

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

/**
 * Loads a GLB/GLTF via GLTFLoader (DRACO optional).
 * Calls onLoad / onError so parent can swap to fallback.
 */
function ModelGLTF({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  materialOverride,
  dracoPath = "/draco/",
  autoRotate,
  pivotFineTune,
  onLoad,
  onError,
}) {
  const [sceneObj, setSceneObj] = useState(null);

  useEffect(() => {
    if (!src) return;

    let mounted = true;

    const loader = new GLTFLoader();
    const draco = new DRACOLoader();

    // If you don't deploy DRACO decoders, this is still OK for non-DRACO models.
    // If your model *is* DRACO-compressed, you must host decoders at /public/draco/.
    draco.setDecoderPath(dracoPath);
    loader.setDRACOLoader(draco);

    loader.load(
      src,
      (gltf) => {
        if (!mounted) return;
        try {
          applyMaterialOverrides(gltf.scene, materialOverride);
        } catch (e) {
          // ignore material override errors
        }
        setSceneObj(gltf.scene);
        onLoad?.();
      },
      undefined,
      (err) => {
        if (!mounted) return;
        console.error("[Hero3D] GLTF load error:", src, err);
        onError?.(err);
      }
    );

    return () => {
      mounted = false;
    };
  }, [src, materialOverride, dracoPath, onLoad, onError]);

  if (!sceneObj) return null;

  const s = scale * GLOBAL_MODEL_SCALE;
  const r = { ...GLOBAL_ROTATE, ...(autoRotate || {}) };
  const fine = pivotFineTune ?? GLOBAL_PIVOT_FINE_TUNE;

  return (
    <group position={position} rotation={rotation}>
      <Rotator enabled={!!r.enabled} speed={r.speed} axis={r.axis}>
        <CenterPivot fineTune={fine}>
          <primitive object={sceneObj} scale={s} dispose={null} />
        </CenterPivot>
      </Rotator>
    </group>
  );
}

export default function Hero3D({
  model,
  environment = "city",
  fallbackSrc = "/smiley.glb",
}) {
  // primary src from HeroSection
  const primarySrc = model?.src || "";

  const [activeSrc, setActiveSrc] = useState(primarySrc);
  const [loading, setLoading] = useState(!!primarySrc);
  const [failedPrimary, setFailedPrimary] = useState(false);

  // If user changes model.src, reset loader state
  useEffect(() => {
    setActiveSrc(primarySrc);
    setFailedPrimary(false);
    setLoading(!!primarySrc);
  }, [primarySrc]);

  const mergedModel = useMemo(() => {
    return {
      ...(model || {}),
      src: activeSrc,
    };
  }, [model, activeSrc]);

  const handleLoaded = () => setLoading(false);

  const handleError = () => {
    // If remote fails, swap to /smiley.glb once
    if (!failedPrimary && fallbackSrc && activeSrc !== fallbackSrc) {
      setFailedPrimary(true);
      setActiveSrc(fallbackSrc);
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[500px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.1, 5], fov: 45, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
        onCreated={({ gl, scene }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.physicallyCorrectLights = true;
          gl.shadowMap.enabled = true;
          scene.background = null;
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[4, 6, 8]}
          intensity={0.9}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight
          position={[-6, 3, 2]}
          intensity={0.4}
          angle={0.4}
          penumbra={0.6}
          castShadow
        />

        {/* IMPORTANT:
            Environment is isolated so it can't block the model forever in production. */}
        {environment !== "none" ? (
          <Suspense fallback={null}>
            <Environment
              preset={
                environment === "studio" || environment === "city"
                  ? environment
                  : "studio"
              }
              background={false}
              intensity={1}
            />
          </Suspense>
        ) : null}

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
            {/* Loader overlay while model loads */}
            {loading ? <CenterLoader label="Loading…" /> : null}

            {mergedModel?.src ? (
              <ModelGLTF
                {...mergedModel}
                onLoad={handleLoaded}
                onError={handleError}
              />
            ) : null}
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
