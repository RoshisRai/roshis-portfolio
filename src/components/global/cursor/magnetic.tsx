'use client'

import { useEffect, useRef } from "react";
import { useCursor } from "@/hooks/use-cursor";

interface MagneticProps {
  children: React.ReactNode;
  /** 0 = no pull, 1 = snap to center. Default 0.35 */
  strength?: number;
  /** Activation radius multiplier (1 = element bounds). Default 1.4 */
  radius?: number;
  /** Visual pull on the element itself (translate). Default 0.2 */
  elementPull?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.35,
  radius = 1.4,
  elementPull = 0.2,
  className,
}: MagneticProps) {
  const { refs, setMagnet, subscribe } = useCursor();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || refs.current.isTouch) return;

    let active = false;

    const unsub = subscribe((rc) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = rc.mouse.x - cx;
      const dy = rc.mouse.y - cy;
      const distance = Math.hypot(dx, dy);
      const activationRadius = Math.max(rect.width, rect.height) * 0.5 * radius;

      if (distance < activationRadius) {
        if (!active) {
          active = true;
          setMagnet({ x: cx, y: cy, strength });
        }
        // Pull the element itself toward the cursor
        el.style.transform = `translate3d(${dx * elementPull}px, ${dy * elementPull}px, 0)`;
      } else if (active) {
        active = false;
        setMagnet(null);
        el.style.transform = "translate3d(0, 0, 0)";
      }
    });

    return () => {
      unsub();
      setMagnet(null);
      if (el) el.style.transform = "";
    };
  }, [strength, radius, elementPull, refs, setMagnet, subscribe]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        display: "inline-block",
        willChange: "transform",
        transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}
