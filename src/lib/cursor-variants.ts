// src/lib/cursor-variants.ts

export type CursorVariant =
  | "default"
  | "link"        // small links / nav items
  | "button"      // CTAs — bigger, filled
  | "text"        // text selection context (I-beam feel)
  | "view"        // "View Project" — large ring with label
  | "drag"        // draggable elements (carousels, sliders)
  | "scene"       // over Three.js canvas
  | "hidden"      // inside inputs, code blocks, etc.
  | "project";

export interface CursorVariantConfig {
  /** Inner dot size in px */
  dotSize: number;
  /** Outer ring/trail size in px */
  ringSize: number;
  /** Ring opacity 0-1 */
  ringOpacity: number;
  /** Dot opacity 0-1 */
  dotOpacity: number;
  /** Ring border width in px */
  ringBorder: number;
  /** Optional text label (e.g., "View") */
  label?: string;
  /** Glow radius (0 = no glow) */
  glow: number;
  /** Dot color (CSS var or literal) */
  ringDamping: number;
  /** Ring Scale */
  ringScale?: number;
}

// Damping: 1 = instant, 0.1 = very trailing
const BASE_DAMPING = 0.18;

export const CURSOR_VARIANTS: Record<CursorVariant, CursorVariantConfig> = {
  default: {
    dotSize: 6,
    ringSize: 32,
    ringOpacity: 0.4,
    dotOpacity: 1,
    ringBorder: 1.5,
    glow: 0,
    ringDamping: BASE_DAMPING,
  },
  link: {
    dotSize: 20,
    ringSize: 0,
    ringOpacity: 0,
    dotOpacity: 1,
    ringBorder: 0.5, // filled instead of border
    glow: 0,
    ringDamping: 0.22,
  },
  button: {
    dotSize: 20,
    ringSize: 0,
    ringOpacity: 0,
    dotOpacity: 1,
    ringBorder: 0.5, // filled instead of border
    glow: 0,
    ringDamping: 0.25,
  },
  text: {
    dotSize: 2,
    ringSize: 4, // thin I-beam feel via scale
    ringOpacity: 0,
    dotOpacity: 1,
    ringBorder: 0,
    glow: 0,
    ringDamping: 0.3,
  },
  view: {
    dotSize: 0,
    ringSize: 96,
    ringOpacity: 1,
    dotOpacity: 0,
    ringBorder: 0,
    label: "View",
    glow: 0,
    ringDamping: 0.2,
  },
  drag: {
    dotSize: 4,
    ringSize: 56,
    ringOpacity: 0.8,
    dotOpacity: 1,
    ringBorder: 1.5,
    glow: 0,
    ringDamping: 0.2,
  },
  scene: {
    // Over the Three.js canvas — airy, glowy, no blend (3D owns the visuals)
    dotSize: 4,
    ringSize: 48,
    ringOpacity: 0.35,
    dotOpacity: 0.9,
    ringBorder: 1,
    glow: 120,
    ringDamping: 0.14, // more trail over the scene
  },
  hidden: {
    dotSize: 0,
    ringSize: 0,
    ringOpacity: 0,
    dotOpacity: 0,
    ringBorder: 0,
    glow: 0,
    ringDamping: 0.3,
  },
  project: {
    dotSize: 6,
    ringSize: 64,
    ringOpacity: 0.9,
    dotOpacity: 1,
    ringBorder: 1.5,
    label: 'View',
    glow: 0,
    ringDamping: 0.2,
    ringScale: 1.1
  },
};
