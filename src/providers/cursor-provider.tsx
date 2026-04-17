'use client'

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { CURSOR_VARIANTS, type CursorVariant, type CursorVariantConfig } from "@/lib/cursor-variants";

export interface CursorRefs {
  /** Raw mouse position — updated every mousemove (0 rerenders) */
  mouse: { x: number; y: number; normalizedX: number; normalizedY: number };
  /** Smoothed ring position — updated every RAF */
  ring: { x: number; y: number };
  /** Current variant (ref, not state) */
  variant: CursorVariant;
  /** Current interpolated config (what the cursor renders) */
  rendered: CursorVariantConfig & { label?: string };
  /** Target config (lerped toward) */
  target: CursorVariantConfig & { label?: string };
  /** Magnetic target position override (null = follow mouse) */
  magnet: { x: number; y: number; strength: number } | null;
  /** Is device touch-only? */
  isTouch: boolean;
  /** Respects prefers-reduced-motion */
  reducedMotion: boolean;
  /** Mouse is pressed down */
  pressed: boolean;
  /** Mouse is visible on screen */
  visible: boolean;
}

export interface CursorAPI {
  refs: React.RefObject<CursorRefs>;
  setVariant: (variant: CursorVariant, label?: string) => void;
  resetVariant: () => void;
  setMagnet: (target: { x: number; y: number; strength?: number } | null) => void;
  /** Subscribe to RAF-driven updates (for R3F, GSAP, etc.) */
  subscribe: (fn: (refs: CursorRefs) => void) => () => void;
}

export const CursorContext = createContext<CursorAPI | null>(null);

// Linear interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Detect touch-only devices (no hover + coarse pointer)
function detectTouch(): boolean {
    if (typeof window === "undefined") return false;
    return (
        !window.matchMedia("(hover: hover)").matches ||
        window.matchMedia("(pointer: coarse)").matches
    )
}

function detectReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
    // Everything lives in refs to avoid unnecessary re-renders — the consumer can subscribe to RAF updates for smooth animations
    const refs = useRef<CursorRefs>({
        mouse: { x: 0, y: 0, normalizedX: 0, normalizedY: 0 },
        ring: { x: 0, y: 0 },
        variant: "default",
        rendered: {...CURSOR_VARIANTS.default },
        target: {...CURSOR_VARIANTS.default },
        magnet: null,
        isTouch: false,
        reducedMotion: false,
        pressed: false,
        visible: false,
    });

    const subscribersRef = useRef<Set<(r: CursorRefs) => void>>(new Set());
    const rafRef = useRef<number | null>(null);

    // ── Setters (stable, ref-based) ────────────────────────────────────
    const setVariant = useCallback((variant: CursorVariant, label?: string) => {
        const cfg = CURSOR_VARIANTS[variant];
        refs.current.variant = variant;
        refs.current.target = { ...cfg, label: label ?? cfg.label };
    }, []);

    const resetVariant = useCallback(() => {
        refs.current.variant = "default";
        refs.current.target = { ...CURSOR_VARIANTS.default };
    }, []);

    const setMagnet = useCallback(
        (target: { x: number; y: number; strength?: number } | null) => {
        refs.current.magnet = target
            ? { x: target.x, y: target.y, strength: target.strength ?? 0.35 }
            : null;
        },
        []
    );

    const subscribe = useCallback((fn: (r: CursorRefs) => void) => {
        subscribersRef.current.add(fn);
        return () => subscribersRef.current.delete(fn) as unknown as void;
    }, []);

    // ── Mount: event listeners + RAF loop ──────────────────────────────
    useEffect(() => {
        const r = refs.current;
        r.isTouch = detectTouch();
        r.reducedMotion = detectReducedMotion();

        // Bail on touch — no listeners, no RAF
        if (r.isTouch) return;

        const handleMove = (e: MouseEvent) => {
            r.mouse.x = e.clientX;
            r.mouse.y = e.clientY;
            r.mouse.normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
            r.mouse.normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
            r.visible = true;
        };

        const handleDown = () => (r.pressed = true);
        const handleUp = () => (r.pressed = false);
        const handleLeave = () => (r.visible = false);
        const handleEnter = () => (r.visible = true);

        const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleMotion = () => (r.reducedMotion = mqMotion.matches);

        window.addEventListener("mousemove", handleMove, { passive: true });
        window.addEventListener("mousedown", handleDown, { passive: true });
        window.addEventListener("mouseup", handleUp, { passive: true });
        document.addEventListener("mouseleave", handleLeave);
        document.addEventListener("mouseenter", handleEnter);
        mqMotion.addEventListener("change", handleMotion);

        // ── RAF: lerp + notify subscribers ────────────────────────────────
        const tick = () => {
            const rc = refs.current;

            // Magnet vs mouse target
            let tx = rc.mouse.x;
            let ty = rc.mouse.y;
            if (rc.magnet) {
                tx = lerp(rc.mouse.x, rc.magnet.x, rc.magnet.strength);
                ty = lerp(rc.mouse.y, rc.magnet.y, rc.magnet.strength);
            }

            // Ring position lerp (trail effect)
            const damping = rc.reducedMotion ? 1 : rc.target.ringDamping;
            rc.ring.x = lerp(rc.ring.x, tx, damping);
            rc.ring.y = lerp(rc.ring.y, ty, damping);

            // Config lerp (smooth variant transition) — same damping curve
            const t = rc.reducedMotion ? 1 : 0.18;
            const rd = rc.rendered;
            const tg = rc.target;

            rd.dotSize = lerp(rd.dotSize, tg.dotSize, t);
            rd.ringSize = lerp(rd.ringSize, tg.ringSize, t);
            rd.ringOpacity = lerp(rd.ringOpacity, tg.ringOpacity, t);
            rd.dotOpacity = lerp(rd.dotOpacity, tg.dotOpacity, t);
            rd.ringBorder = lerp(rd.ringBorder, tg.ringBorder, t);
            rd.glow = lerp(rd.glow, tg.glow, t);

            // Non-numeric props
            rd.label = tg.label;

            // Notify subscribers (Cursor component, R3F, etc.)
            subscribersRef.current.forEach((fn) => fn(rc));

            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mousedown", handleDown);
            window.removeEventListener("mouseup", handleUp);
            document.removeEventListener("mouseleave", handleLeave);
            document.removeEventListener("mouseenter", handleEnter);
            mqMotion.removeEventListener("change", handleMotion);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }
    }, []);

    const api = useMemo<CursorAPI>(
        () => ({ refs, setVariant, resetVariant, setMagnet, subscribe }),
        [setVariant, resetVariant, setMagnet, subscribe]
    );
    
    return (
        <CursorContext.Provider value={api}>
            {children}
        </CursorContext.Provider>
    )
}