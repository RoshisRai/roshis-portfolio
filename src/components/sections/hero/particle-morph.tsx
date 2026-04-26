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

function reorderShapeByCylindrical(points: Float32Array): Float32Array {
  const count = points.length / 3;
  const indexed = Array.from({ length: count }, (_, i) => {
    const x = points[i * 3];
    const y = points[i * 3 + 1];
    const z = points[i * 3 + 2];
    const angle = Math.atan2(z, x);
    const radius = Math.hypot(x, z);
    return { i, y, angle, radius };
  });

  indexed.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    if (a.angle !== b.angle) return a.angle - b.angle;
    return a.radius - b.radius;
  });

  const ordered = new Float32Array(points.length);
  for (let dst = 0; dst < count; dst++) {
    const src = indexed[dst].i * 3;
    ordered[dst * 3] = points[src];
    ordered[dst * 3 + 1] = points[src + 1];
    ordered[dst * 3 + 2] = points[src + 2];
  }

  return ordered;
}

// ─── shader source ─────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uPixelRatio;
  uniform float uTheme;

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
    float noiseVal = snoise(morphed * 0.8 + uTime * 0.15) * 0.24;
    morphed += normal * noiseVal * (1.0 - uMorph * 0.5);

    // mouse influence (subtle gravity pull)
    vec3 mouseInfluence = vec3(uMouseX * 0.35, uMouseY * 0.35, 0.0);
    float dist = length(morphed - mouseInfluence * 2.3);
    float mousePull = smoothstep(4.0, 0.0, dist) * 0.36;
    float tailDamp = 1.0 - smoothstep(0.8, 1.0, uMorph) * 0.45;
    mousePull *= tailDamp;
    morphed += normalize(mouseInfluence * 2.3 - morphed) * mousePull;

    // breathing / pulsation
    float pulse = sin(uTime * 1.2 + aRandom * 6.28) * 0.04;
    morphed *= 1.0 + pulse;

    vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // size attenuation
    float size = aSize * uPixelRatio * (180.0 / -mvPosition.z);
    gl_PointSize = clamp(size, 1.2, 9.0);

    // pass to fragment
    float depth = smoothstep(-5.0, 5.0, morphed.z);
    vAlpha = (0.5 + 0.5 * depth) * (0.6 + 0.4 * sin(uTime + aRandom * 10.0));
    vRandom = aRandom;

    // dynamic color based on position + time
    float hue = aRandom * 0.15 + morphed.y * 0.05 + uTime * 0.02;
    vec3 darkCol1 = vec3(0.40, 0.50, 1.00);
    vec3 darkCol2 = vec3(0.65, 0.30, 1.00);
    vec3 darkCol3 = vec3(0.20, 0.90, 1.00);
    vec3 lightCol1 = vec3(0.10, 0.28, 0.66);
    vec3 lightCol2 = vec3(0.33, 0.20, 0.60);
    vec3 lightCol3 = vec3(0.00, 0.48, 0.54);
    vec3 col1 = mix(darkCol1, lightCol1, uTheme);
    vec3 col2 = mix(darkCol2, lightCol2, uTheme);
    vec3 col3 = mix(darkCol3, lightCol3, uTheme);
    float mixer = sin(hue * 6.28) * 0.5 + 0.5;
    float mixer2 = cos(hue * 6.28 + 2.094) * 0.5 + 0.5;
    vColor = mix(mix(col1, col2, mixer), col3, mixer2);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTheme;
  varying float vAlpha;
  varying float vRandom;
  varying vec3 vColor;

  void main() {
    // circular soft particle
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    float halo = smoothstep(0.5, 0.14, dist);
    float core = smoothstep(0.22, 0.0, dist);
    float alpha = (halo * 0.55 + core * 0.95) * vAlpha;

    vec3 finalColor = vColor * mix(0.92 + core * 0.38, 0.84 + core * 0.22, uTheme);

    gl_FragColor = vec4(finalColor, alpha * mix(0.82, 0.92, uTheme));
  }
`;

// ─── component ─────────────────────────────────────────────────────
interface ParticleMorphProps {
  mouseXRef: React.RefObject<number>;
  mouseYRef: React.RefObject<number>;
  themeMode?: "light" | "dark";
}

const PARTICLE_COUNT = 8000;
const BASE_SCALE = 0.83;
const MORPH_SCALE = 0.74;
const DEPTH_FLOAT = 0.18;
const MORPH_RATE_FAST = 0.42;
const MORPH_RATE_SLOW = 0.31;

function computeAdaptiveMorphRate(source: Float32Array, target: Float32Array): number {
  const stride = 18;
  let sum = 0;
  let count = 0;

  for (let i = 0; i < source.length; i += stride * 3) {
    const dx = target[i] - source[i];
    const dy = target[i + 1] - source[i + 1];
    const dz = target[i + 2] - source[i + 2];
    sum += Math.sqrt(dx * dx + dy * dy + dz * dz);
    count += 1;
  }

  const avgDist = count > 0 ? sum / count : 0;
  const normalized = THREE.MathUtils.clamp((avgDist - 1.25) / 1.85, 0, 1);

  return THREE.MathUtils.lerp(MORPH_RATE_FAST, MORPH_RATE_SLOW, normalized);
}

export default function ParticleMorph({ mouseXRef, mouseYRef, themeMode = "dark" }: ParticleMorphProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // pre-compute all shapes
  const shapes = useMemo(() => [
    reorderShapeByCylindrical(generateSphere(PARTICLE_COUNT, 2.0)),
    reorderShapeByCylindrical(generateTorus(PARTICLE_COUNT, 1.8, 0.7)),
    reorderShapeByCylindrical(generateDNA(PARTICLE_COUNT, 5)),
    reorderShapeByCylindrical(generateIcosahedron(PARTICLE_COUNT, 2.0)),
  ], []);

  const shapeIndex = useRef(0);
  const nextShapeTime = useRef(2.5);
  const morphProgress = useRef(0);
  const isMorphing = useRef(false);
  const morphRate = useRef(MORPH_RATE_FAST);

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
      uTheme: { value: themeMode === "light" ? 1 : 0 },
    }),
    [themeMode],
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
    mat.uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 2);
    mat.uniforms.uTheme.value = themeMode === "light" ? 1 : 0;
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
      const posAttr = geo.attributes.position;
      const nextShape = shapes[nextIndex];

      morphRate.current = computeAdaptiveMorphRate(
        posAttr.array as Float32Array,
        nextShape,
      );

      for (let i = 0; i < nextShape.length; i++) {
        (targetAttr.array as Float32Array)[i] = nextShape[i];
      }
      targetAttr.needsUpdate = true;
      shapeIndex.current = nextIndex;
    }

    if (isMorphing.current) {
      morphProgress.current += delta * morphRate.current;
      const t = Math.min(morphProgress.current, 1);
      const easedProgress = easeInOutCubic(t);
      const settleProgress = 1 - Math.pow(1 - t, 2);
      const tailBlend = THREE.MathUtils.clamp((t - 0.8) / 0.2, 0, 1);
      mat.uniforms.uMorph.value = THREE.MathUtils.lerp(easedProgress, settleProgress, tailBlend);

      if (morphProgress.current >= 1) {
        // morph complete – swap positions to target, reset
        const geo = meshRef.current.geometry;
        const posAttr = geo.attributes.position;
        const targetAttr = geo.attributes.aTarget;

        (posAttr.array as Float32Array).set(targetAttr.array as Float32Array);
        posAttr.needsUpdate = true;
        mat.uniforms.uMorph.value = 0;
        isMorphing.current = false;
        nextShapeTime.current = elapsed + 4;
      }
    }

    const morphT = isMorphing.current ? Math.min(morphProgress.current, 1) : 0;
    const squash = Math.sin(morphT * Math.PI);
    const targetScale = THREE.MathUtils.lerp(BASE_SCALE, MORPH_SCALE, squash);
    const nextScale = THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 5.5, delta);
    meshRef.current.scale.setScalar(nextScale);

    const targetDepth = Math.sin(elapsed * 0.55) * DEPTH_FLOAT + mat.uniforms.uMouseX.value * 0.08;
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetDepth, 2.6, delta);

    // Add multi-axis rotation so the silhouette reads as spatial, not flat.
    meshRef.current.rotation.y += delta * 0.22;
    meshRef.current.rotation.x = Math.sin(elapsed * 0.45) * 0.2 + mat.uniforms.uMouseY.value * 0.16;
    meshRef.current.rotation.z = Math.sin(elapsed * 0.32) * 0.06 + mat.uniforms.uMouseX.value * 0.08;
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
        blending={themeMode === "light" ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}
