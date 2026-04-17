"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCursor } from "@/hooks/use-cursor";
import { cn } from "@/lib/utils";

export function Cursor() {
  const { refs, subscribe } = useCursor();

  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const r = refs.current;

    // Hide native cursor on desktop only
    if (!r.isTouch) {
      document.documentElement.classList.add("cursor-custom");
    }

    const unsub = subscribe((rc) => {
      if (!rootRef.current || !dotRef.current || !ringRef.current) return;

      const { mouse, ring, rendered, visible, pressed } = rc;

      // Root visibility
      rootRef.current.style.opacity = visible ? "1" : "0";

      // Dot: instant follow (pure mouse coords)
      dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%) scale(${pressed ? 0.6 : 1})`;
      dotRef.current.style.width = `${rendered.dotSize}px`;
      dotRef.current.style.height = `${rendered.dotSize}px`;
      dotRef.current.style.opacity = `${rendered.dotOpacity}`;

      // Ring: lerped follow (trail)
      const ringScale = pressed ? 0.85 : 1;
      ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      ringRef.current.style.width = `${rendered.ringSize}px`;
      ringRef.current.style.height = `${rendered.ringSize}px`;
      ringRef.current.style.opacity = `${rendered.ringOpacity}`;
      // Filled vs outlined based on border width
      if (rendered.ringBorder < 0.5) {
        ringRef.current.style.border = "0";
      } else {
        ringRef.current.style.background = "transparent";
      }

      // Glow (scene variant)
      if (glowRef.current) {
        if (rendered.glow > 0.5) {
          glowRef.current.style.opacity = "0.6";
          glowRef.current.style.width = `${rendered.glow}px`;
          glowRef.current.style.height = `${rendered.glow}px`;
          glowRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
          glowRef.current.style.background = `radial-gradient(circle, var(--color-accent), transparent)`;
        } else {
          glowRef.current.style.opacity = "0";
        }
      }

      // Label
      if (labelRef.current) {
        labelRef.current.textContent = rendered.label ?? "";
        labelRef.current.style.opacity = rendered.label ? "1" : "0";
      }
    });

    return () => {
      unsub();
      document.documentElement.classList.remove("cursor-custom");
    };
  }, [refs, subscribe]);

  // Don't render on touch / SSR
  if (refs.current.isTouch) return null;

  const node = (
    <div
        ref={rootRef}
        aria-hidden
        className={cn(
        "fixed inset-0 pointer-events-none z-9999",
        "opacity-0 transition-opacity duration-250 ease-out"
        )}
    >
        {/* Glow (behind everything) */}
        <div
        ref={glowRef}
        className={cn(
            "absolute top-0 left-0 rounded-full",
            "blur-2xl opacity-0 transition-opacity duration-300 ease-out",
            "will-change-[transform,opacity,width,height]",
        )}
        />

        {/* Ring */}
        <div
        ref={ringRef}
        className={cn(
            "absolute top-0 left-0 rounded-full",
            "flex items-center justify-center",
            "text-[11px] font-semibold tracking-[0.05em] uppercase",
            "bg-text-primary border border-text-primary/50",
            "will-change-[transform,width,height,opacity,background,border]"
        )}
        >
        <span
            ref={labelRef}
            className="opacity-0 transition-opacity duration-200 ease-out"
        />
        </div>

        {/* Dot */}
        <div
        ref={dotRef}
        className={cn(
            "absolute top-0 left-0 rounded-full",
            "bg-text-primary",
            "will-change-[transform,width,height,opacity]"
        )}
        />
    </div>
    );

  return createPortal(node, document.body);
}
