"use client";

import { useRef, useMemo, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type OrbQuality = "high" | "balanced" | "performance";
type ThemeMode = "light" | "dark";

interface FloatingOrbsProps {
  quality?: OrbQuality;
  mouseXRef?: RefObject<number>;
  mouseYRef?: RefObject<number>;
  themeMode?: ThemeMode;
}

const mulberry32 = (seed: number): () => number => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export default function FloatingOrbs({
  quality = "high",
  mouseXRef,
  mouseYRef,
  themeMode = "dark",
}: FloatingOrbsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const segments = quality === "high" ? 26 : quality === "balanced" ? 20 : 14;

  const orbData = useMemo(() => {
    const random = mulberry32(20260416);

    return Array.from({ length: 5 }, () => ({
      position: [
        (random() - 0.5) * 6.4,
        (random() - 0.5) * 3.6,
        (random() - 0.5) * 3 - 1.5,
      ] as [number, number, number],
      scale: random() * 0.4 + 0.15,
      speed: random() * 0.5 + 0.3,
      offset: random() * Math.PI * 2,
      driftX: random() * 0.35 + 0.25,
      driftY: random() * 0.7 + 0.5,
      driftZ: random() * 0.35 + 0.2,
      spin: random() * 0.45 + 0.25,
      color: new THREE.Color().setHSL(0.6 + random() * 0.15, 0.8, 0.6),
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const cursorX = mouseXRef?.current ?? 0;
    const cursorY = mouseYRef?.current ?? 0;
    const t = state.clock.elapsedTime;
    const halfW = state.viewport.width * 0.5 * 0.82;
    const halfH = state.viewport.height * 0.5 * 0.76;

    const group = groupRef.current;
    group.position.x = THREE.MathUtils.damp(group.position.x, cursorX * 0.45, 2.8, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, cursorY * 0.3, 2.8, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, cursorX * 0.1, 3.2, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -cursorY * 0.08, 3.2, delta);

    group.children.forEach((child, i) => {
      const data = orbData[i];
      const cursorPushX = cursorX * (0.12 + data.scale * 0.18);
      const cursorPushY = cursorY * (0.1 + data.scale * 0.16);

      const nextX =
        data.position[0] + Math.cos(t * data.speed * 0.7 + data.offset) * data.driftX + cursorPushX;
      const nextY =
        data.position[1] + Math.sin(t * data.speed + data.offset) * data.driftY + cursorPushY;

      child.position.x = THREE.MathUtils.clamp(nextX, -halfW, halfW);
      child.position.y = THREE.MathUtils.clamp(nextY, -halfH, halfH);
      child.position.z =
        data.position[2] + Math.sin(t * data.speed * 0.6 + data.offset * 1.3) * data.driftZ + cursorX * 0.06;

      child.rotation.y += delta * (data.spin + Math.abs(cursorX) * 0.35);
      child.rotation.x = Math.sin(t * data.speed * 0.5 + data.offset) * 0.35 + cursorY * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {orbData.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale} frustumCulled={false}>
          <sphereGeometry args={[1, segments, segments]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={themeMode === "light" ? 0.06 : 0.12}
            metalness={themeMode === "light" ? 0.34 : 0.58}
            roughness={themeMode === "light" ? 0.42 : 0.26}
            envMapIntensity={themeMode === "light" ? 0.68 : 0.9}
            transparent
            opacity={themeMode === "light" ? 0.14 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export { mulberry32 }