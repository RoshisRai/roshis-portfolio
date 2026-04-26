// src/components/sections/hero/hero-scene.tsx
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ParticleMorph from "./particle-morph";
import FloatingOrbs from "./floating-orbs";
import { useCursor } from "@/hooks/use-cursor";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "@/providers/theme-provider";

type HeroQuality = "high" | "balanced" | "performance";
type ThemeMode = "light" | "dark";

export default function HeroScene() {
  const { setVariant, resetVariant } = useCursor();
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<HeroQuality>("high");
  const [dprCap, setDprCap] = useState(2);
  const themeMode: ThemeMode = theme === "light" ? "light" : "dark";

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
        dpr={[1.2, dprCap]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <QualityAutoTune
            onDprCapChange={setDprCap}
            onQualityChange={setQuality}
          />
          {themeMode === "light" ? (
            <>
              <ambientLight intensity={0.52} color="#f6f7ff" />
              <directionalLight position={[4, 5, 6]} intensity={0.9} color="#e7ecff" />
              <pointLight position={[-3, 1, 3]} intensity={0.46} color="#4f8cff" />
              <pointLight position={[2, -2, 2]} intensity={0.36} color="#00a8b6" />
            </>
          ) : (
            <>
              <ambientLight intensity={0.3} color="#c7d8ff" />
              <directionalLight position={[4, 5, 6]} intensity={0.95} color="#e9f0ff" />
              <pointLight position={[-3, 1, 3]} intensity={0.55} color="#7dd3fc" />
              <pointLight position={[2, -2, 2]} intensity={0.4} color="#a78bfa" />
            </>
          )}
          <SceneCameraRig />
          <SceneInteractionBridge quality={quality} themeMode={themeMode} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Reads cursor refs every frame inside R3F and passes smoothed values
 * to ParticleMorph without touching refs during render.
 */
function SceneInteractionBridge({ quality, themeMode }: { quality: HeroQuality; themeMode: ThemeMode }) {
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

  return (
    <>
      <ParticleMorph mouseXRef={mx} mouseYRef={my} themeMode={themeMode} />
      <FloatingOrbs quality={quality} mouseXRef={mx} mouseYRef={my} themeMode={themeMode} />
    </>
  );
}

function SceneCameraRig() {
  const { refs } = useCursor();

  useFrame((state, delta) => {
    const camera = state.camera;
    const tx = refs.current.mouse.normalizedX * 0.3;
    const ty = refs.current.mouse.normalizedY * 0.2;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 3.2, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function QualityAutoTune({
  onDprCapChange,
  onQualityChange,
}: {
  onDprCapChange: (dprCap: number) => void;
  onQualityChange: (quality: HeroQuality) => void;
}) {
  const avgMs = useRef(16.6);
  const modeRef = useRef<HeroQuality>("high");
  const slowStreak = useRef(0);
  const verySlowStreak = useRef(0);
  const fastStreak = useRef(0);
  const lastSwitchAt = useRef(-Infinity);
  const SWITCH_COOLDOWN_S = 2.5;

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const frameMs = delta * 1000;
    avgMs.current = THREE.MathUtils.lerp(avgMs.current, frameMs, 0.08);
    const canSwitch = elapsed - lastSwitchAt.current > SWITCH_COOLDOWN_S;

    if (avgMs.current > 24) {
      verySlowStreak.current += 1;
      slowStreak.current += 1;
      fastStreak.current = 0;
    } else if (avgMs.current > 19.5) {
      slowStreak.current += 1;
      verySlowStreak.current = 0;
      fastStreak.current = 0;
    } else if (avgMs.current < 15.2) {
      fastStreak.current += 1;
      slowStreak.current = 0;
      verySlowStreak.current = 0;
    } else if (avgMs.current < 17) {
      fastStreak.current += 1;
      slowStreak.current = 0;
      verySlowStreak.current = 0;
    } else {
      slowStreak.current = 0;
      verySlowStreak.current = 0;
      fastStreak.current = 0;
    }

    if (canSwitch && modeRef.current === "high" && verySlowStreak.current > 35) {
      modeRef.current = "performance";
      onDprCapChange(1.45);
      onQualityChange("performance");
      lastSwitchAt.current = elapsed;
      slowStreak.current = 0;
      verySlowStreak.current = 0;
      return;
    }

    if (canSwitch && modeRef.current === "high" && slowStreak.current > 45) {
      modeRef.current = "balanced";
      onDprCapChange(1.7);
      onQualityChange("balanced");
      lastSwitchAt.current = elapsed;
      slowStreak.current = 0;
      verySlowStreak.current = 0;
      return;
    }

    if (canSwitch && modeRef.current === "balanced" && verySlowStreak.current > 35) {
      modeRef.current = "performance";
      onDprCapChange(1.45);
      onQualityChange("performance");
      lastSwitchAt.current = elapsed;
      slowStreak.current = 0;
      verySlowStreak.current = 0;
      return;
    }

    if (canSwitch && modeRef.current === "performance" && fastStreak.current > 120 && avgMs.current < 17) {
      modeRef.current = "balanced";
      onDprCapChange(1.7);
      onQualityChange("balanced");
      lastSwitchAt.current = elapsed;
      fastStreak.current = 0;
      return;
    }

    if (canSwitch && modeRef.current === "balanced" && fastStreak.current > 180 && avgMs.current < 15.2) {
      modeRef.current = "high";
      onDprCapChange(2);
      onQualityChange("high");
      lastSwitchAt.current = elapsed;
      fastStreak.current = 0;
      return;
    }

    if (canSwitch && typeof document !== "undefined" && document.hidden && modeRef.current !== "performance") {
      modeRef.current = "performance";
      onDprCapChange(1.45);
      onQualityChange("performance");
      lastSwitchAt.current = elapsed;
      slowStreak.current = 0;
      verySlowStreak.current = 0;
      fastStreak.current = 0;
      return;
    }

    if (canSwitch && typeof document !== "undefined" && !document.hidden && modeRef.current === "performance" && avgMs.current < 17 && fastStreak.current > 90) {
      modeRef.current = "balanced";
      onDprCapChange(1.7);
      onQualityChange("balanced");
      lastSwitchAt.current = elapsed;
      fastStreak.current = 0;
      return;
    }
  });

  return null;
}
