"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "./floating-orbs";

// ─── shape generators ──────────────────────────────────────────────
function generateSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * Math.PI * 2;
    const r = radius * Math.cbrt(Math.random()); // uniform volume fill
    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);
  }
  return positions;
}

function generateTorus(count: number, R: number, r: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const jitter = (Math.random() - 0.5) * 0.15;
    positions[i * 3] = (R + (r + jitter) * Math.cos(theta)) * Math.cos(phi);
    positions[i * 3 + 1] = (r + jitter) * Math.sin(theta);
    positions[i * 3 + 2] = (R + (r + jitter) * Math.cos(theta)) * Math.sin(phi);
  }
  return positions;
}

function generateDNA(count: number, height: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * height - height / 2;
    const strand = i % 2 === 0 ? 1 : -1;
    const angle = t * 2.5;
    const radius = 1.2;
    positions[i * 3] = Math.cos(angle + (strand === 1 ? 0 : Math.PI)) * radius;
    positions[i * 3 + 1] = t;
    positions[i * 3 + 2] = Math.sin(angle + (strand === 1 ? 0 : Math.PI)) * radius;
    // Add slight noise
    positions[i * 3] += (Math.random() - 0.5) * 0.12;
    positions[i * 3 + 1] += (Math.random() - 0.5) * 0.12;
    positions[i * 3 + 2] += (Math.random() - 0.5) * 0.12;
  }
  return positions;
}

function generateIcosahedron(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const geo = new THREE.IcosahedronGeometry(radius, 4);
  const verts = geo.attributes.position.array as Float32Array;
  for (let i = 0; i < count; i++) {
    const vi = (i % (verts.length / 3)) * 3;
    const jitter = 0.08;
    positions[i * 3] = verts[vi] + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 1] = verts[vi + 1] + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 2] = verts[vi + 2] + (Math.random() - 0.5) * jitter;
  }
  geo.dispose();
  return positions;
}

// ─── shader source ─────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uPixelRatio;

  attribute vec3 aTarget;
  attribute float aRandom;
  attribute float aSize;

  varying float vAlpha;
  varying float vRandom;
  varying vec3 vColor;

  //  simplex noise helper
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    // morph between current position and target
    vec3 morphed = mix(position, aTarget, uMorph);

    // organic noise displacement
    float noiseVal = snoise(morphed * 0.8 + uTime * 0.15) * 0.35;
    morphed += normal * noiseVal * (1.0 - uMorph * 0.5);

    // mouse influence (subtle gravity pull)
    vec3 mouseInfluence = vec3(uMouseX * 0.4, uMouseY * 0.4, 0.0);
    float dist = length(morphed - mouseInfluence * 3.0);
    float mousePull = smoothstep(4.0, 0.0, dist) * 0.6;
    morphed += normalize(mouseInfluence * 3.0 - morphed) * mousePull;

    // breathing / pulsation
    float pulse = sin(uTime * 1.2 + aRandom * 6.28) * 0.04;
    morphed *= 1.0 + pulse;

    vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // size attenuation
    float size = aSize * uPixelRatio * (180.0 / -mvPosition.z);
    gl_PointSize = max(size, 1.0);

    // pass to fragment
    float depth = smoothstep(-5.0, 5.0, morphed.z);
    vAlpha = (0.5 + 0.5 * depth) * (0.6 + 0.4 * sin(uTime + aRandom * 10.0));
    vRandom = aRandom;

    // dynamic color based on position + time
    float hue = aRandom * 0.15 + morphed.y * 0.05 + uTime * 0.02;
    vec3 col1 = vec3(0.40, 0.50, 1.00); // blue
    vec3 col2 = vec3(0.65, 0.30, 1.00); // purple
    vec3 col3 = vec3(0.20, 0.90, 1.00); // cyan
    float mixer = sin(hue * 6.28) * 0.5 + 0.5;
    float mixer2 = cos(hue * 6.28 + 2.094) * 0.5 + 0.5;
    vColor = mix(mix(col1, col2, mixer), col3, mixer2);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vRandom;
  varying vec3 vColor;

  void main() {
    // circular soft particle
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;

    // glow core
    float core = smoothstep(0.3, 0.0, dist);
    vec3 finalColor = vColor + core * 0.5;

    gl_FragColor = vec4(finalColor, alpha * 0.85);
  }
`;

// ─── component ─────────────────────────────────────────────────────
interface ParticleMorphProps {
  mouseXRef: React.RefObject<number>;
  mouseYRef: React.RefObject<number>;
}

const PARTICLE_COUNT = 8000;

export default function ParticleMorph({ mouseXRef, mouseYRef }: ParticleMorphProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // pre-compute all shapes
  const shapes = useMemo(() => [
    generateSphere(PARTICLE_COUNT, 2.0),
    generateTorus(PARTICLE_COUNT, 1.8, 0.7),
    generateDNA(PARTICLE_COUNT, 5),
    generateIcosahedron(PARTICLE_COUNT, 2.0),
  ], []);

  const shapeIndex = useRef(0);
  const nextShapeTime = useRef(0);
  const morphProgress = useRef(0);
  const isMorphing = useRef(false);

  // initial geometry attributes
  const { positions, targets, randoms, sizes, normals } = useMemo(() => {
    const random = mulberry32(20260421);
    const positions = new Float32Array(shapes[0]);
    const targets = new Float32Array(shapes[1]);
    const randoms = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const normals = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      randoms[i] = random();
      sizes[i] = random() * 0.6 + 0.3;
      // approximate normal from position direction
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      normals[i * 3] = x / len;
      normals[i * 3 + 1] = y / len;
      normals[i * 3 + 2] = z / len;
    }

    return { positions, targets, randoms, sizes, normals };
  }, [shapes]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    [],
  );

  // smooth morph using custom easing
  const easeInOutCubic = useCallback((t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const mat = materialRef.current;

    // update uniforms
    mat.uniforms.uTime.value = elapsed;
    mat.uniforms.uMouseX.value += (mouseXRef.current - mat.uniforms.uMouseX.value) * 0.05;
    mat.uniforms.uMouseY.value += (mouseYRef.current - mat.uniforms.uMouseY.value) * 0.05;

    // auto-morph every 4 seconds
    if (elapsed > nextShapeTime.current && !isMorphing.current) {
      isMorphing.current = true;
      morphProgress.current = 0;
      // set target to next shape
      const nextIndex = (shapeIndex.current + 1) % shapes.length;
      const geo = meshRef.current.geometry;
      const targetAttr = geo.attributes.aTarget;
      const nextShape = shapes[nextIndex];
      for (let i = 0; i < nextShape.length; i++) {
        (targetAttr.array as Float32Array)[i] = nextShape[i];
      }
      targetAttr.needsUpdate = true;
      shapeIndex.current = nextIndex;
    }

    if (isMorphing.current) {
      morphProgress.current += delta * 0.45; // controls morph speed
      const easedProgress = easeInOutCubic(Math.min(morphProgress.current, 1));
      mat.uniforms.uMorph.value = easedProgress;

      if (morphProgress.current >= 1) {
        // morph complete – swap positions to target, reset
        const geo = meshRef.current.geometry;
        const posAttr = geo.attributes.position;
        const targetAttr = geo.attributes.aTarget;
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          (posAttr.array as Float32Array)[i] = (targetAttr.array as Float32Array)[i];
        }
        posAttr.needsUpdate = true;
        mat.uniforms.uMorph.value = 0;
        isMorphing.current = false;
        nextShapeTime.current = elapsed + 4;
      }
    }

    // gentle rotation
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.1;
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-normal"
          args={[normals, 3]}
        />
        <bufferAttribute
          attach="attributes-aTarget"
          args={[targets, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
