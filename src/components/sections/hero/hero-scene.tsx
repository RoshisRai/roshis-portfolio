"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleMorph from "./particle-morth";
import FloatingOrbs from "./floating-orbs";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function HeroScene() {
  const mouse = useMousePosition();
  const reducedMotion = useReducedMotion();
  
  if (reducedMotion) {
    // Static fallback for reduced motion users
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent">
        <div className="text-text-secondary text-lg opacity-70">3D animation disabled for reduced motion</div>
      </div>
    );
  }


  return (
    <div className="absolute inset-0 z-10 overflow-visible">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ParticleMorph
            mouseX={mouse.normalizedX}
            mouseY={mouse.normalizedY}
          />
          <FloatingOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
}
