"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const mulberry32 = (seed: number): () => number => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export default function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  const orbData = useMemo(() => {
    const random = mulberry32(20260416);

    return Array.from({ length: 5 }, () => ({
      position: [
        (random() - 0.5) * 8,
        (random() - 0.5) * 5,
        (random() - 0.5) * 4 - 2,
      ] as [number, number, number],
      scale: random() * 0.4 + 0.15,
      speed: random() * 0.5 + 0.3,
      offset: random() * Math.PI * 2,
      color: new THREE.Color().setHSL(0.6 + random() * 0.15, 0.8, 0.6),
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const data = orbData[i];
      child.position.y =
        data.position[1] + Math.sin(t * data.speed + data.offset) * 0.8;
      child.position.x =
        data.position[0] + Math.cos(t * data.speed * 0.7 + data.offset) * 0.4;
    });
  });

  return (
    <group ref={groupRef}>
      {orbData.map((orb, i) => (
        <mesh key={i} position={orb.position} scale={orb.scale}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.08}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export { mulberry32 }