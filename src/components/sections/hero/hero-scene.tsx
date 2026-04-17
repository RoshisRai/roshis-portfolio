// src/components/sections/hero/hero-scene.tsx
"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import ParticleMorph from "./particle-morph";
import FloatingOrbs from "./floating-orbs";
import { useCursor } from "@/hooks/use-cursor";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function HeroScene() {
  const { setVariant, resetVariant } = useCursor();
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Set "scene" variant while hovering the canvas
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const enter = () => setVariant("scene");
    const leave = () => resetVariant();
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [setVariant, resetVariant]);

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent">
        <div className="text-lg text-text-secondary opacity-70">
          3D animation disabled for reduced motion
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="absolute inset-0 z-10 overflow-visible">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ParticleMorphBridge />
          <FloatingOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Reads cursor refs every frame inside R3F and passes smoothed values
 * to ParticleMorph without touching refs during render.
 */
function ParticleMorphBridge() {
  const { refs } = useCursor();
  const mx = useRef(0);
  const my = useRef(0);

  useFrame(() => {
    // Smooth interpolation (same feel as cursor trail)
    const tx = refs.current.mouse.normalizedX;
    const ty = refs.current.mouse.normalizedY;
    mx.current += (tx - mx.current) * 0.08;
    my.current += (ty - my.current) * 0.08;
  });

  return <ParticleMorph mouseXRef={mx} mouseYRef={my} />;
}
