// src/components/Hero3D.jsx
// Refined lighting + optional environment map.
// Keeps your rotation, pivot, scale logic intact.

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
import { GLTFLoader, DRACOLoader, OBJLoader } from "three-stdlib";

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
        // ⚠️ This will override ALL original materials (textures, colors, roughness maps, etc.)
        // Only use this if you really want a flat, unified look.
        child.material = new THREE.MeshStandardMaterial({
          color: materialOverride.color || "#c084fc",
          metalness: materialOverride.metalness ?? 0.2,
          roughness: materialOverride.roughness ?? 0.6,
        });
      } else if (child.material) {
        // More realistic shading: front side only by default
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

/* --- GLB model --- */
function ModelGLB({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  materialOverride,
  dracoPath = "/draco/",
  autoRotate,
  pivotFineTune,
}) {
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath(dracoPath);
    loader.setDRACOLoader(draco);

    let mounted = true;

    loader.load(
      src,
      (loaded) => {
        if (!mounted) return;
        applyMaterialOverrides(loaded.scene, materialOverride);
        setGltf(loaded);
      },
      undefined,
      (err) => {
        console.error("ModelGLB load error:", err);
      }
    );

    return () => {
      mounted = false;
    };
  }, [src, materialOverride, dracoPath]);

  if (!gltf?.scene) return null;

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

/* --- Smart loader: try GLTF (including DRACO) then fall back to OBJ text parsing --- */
function ModelSmart({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  materialOverride,
  dracoPath = "/draco/",
  autoRotate,
  pivotFineTune,
}) {
  const [object3d, setObject3d] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadModel() {
      // Try GLTFLoader first (handles .glb and .gltf, with DRACO support)
      try {
        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath(dracoPath);
        loader.setDRACOLoader(draco);
        const gltf = await loader.loadAsync(src);
        if (!mounted) return;
        applyMaterialOverrides(gltf.scene, materialOverride);
        setObject3d(gltf.scene);
        return;
      } catch (gltfErr) {
        // GLTF failed — try to fetch as text and parse as OBJ
        try {
          const res = await fetch(src);
          const text = await res.text();
          if (!mounted) return;

          const isObj = /(^|\n)v\s+/m.test(text) || /(^|\n)o\s+/m.test(text);
          if (isObj) {
            const objLoader = new OBJLoader();
            const obj = objLoader.parse(text);
            applyMaterialOverrides(obj, materialOverride);
            setObject3d(obj);
            return;
          }

          throw gltfErr;
        } catch (fallbackErr) {
          console.error("ModelSmart: failed to load", src, gltfErr, fallbackErr);
        }
      }
    }

    loadModel();
    return () => {
      mounted = false;
    };
  }, [src, materialOverride, dracoPath]);

  const s = scale * GLOBAL_MODEL_SCALE;
  const r = { ...GLOBAL_ROTATE, ...(autoRotate || {}) };
  const fine = pivotFineTune ?? GLOBAL_PIVOT_FINE_TUNE;

  if (!object3d) return null;

  return (
    <group position={position} rotation={rotation}>
      <Rotator enabled={!!r.enabled} speed={r.speed} axis={r.axis}>
        <CenterPivot fineTune={fine}>
          <primitive object={object3d} scale={s} dispose={null} />
        </CenterPivot>
      </Rotator>
    </group>
  );
}

/* --- AUTO DETECT --- */
function ModelAuto(props) {
  // You can extend this if you ever want different loaders per extension.
  return <ModelSmart {...props} />;
}

/* === MAIN HERO 3D === */
export default function Hero3D({ model, environment = "studio" }) {
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
        {/* Softer, more realistic base lighting */}
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

        {/* Optional environment lighting */}
        {environment !== "none" && (
          <Environment
            // If you want to avoid external CDNs, use a custom HDR:
            // PLACEHOLDER: drop your HDR in /public/assets/hdr/studio.hdr
            // and switch to:
            // files="/assets/hdr/studio.hdr"
            preset={environment === "studio" || environment === "city" ? environment : "studio"}
            background={false}
            intensity={1}
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
            <Suspense fallback={<CenterLoader />}>
              {model?.src ? <ModelAuto {...model} /> : null}
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

      {/* Background glow – tweak or remove */}
      {/* <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-60 bg-gradient-to-tr from-primary/30 via-purple-500/20 to-pink-500/30" /> */}
    </div>
  );
}
