"use client";

import { useState, useEffect, useRef } from "react";

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition(): MousePosition {
  const [mouse, setMouse] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  const rafId = useRef<number>(0);
  const latest = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      latest.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const { x, y } = latest.current;
      setMouse({
        x,
        y,
        normalizedX: (x / window.innerWidth) * 2 - 1,
        normalizedY: -(y / window.innerHeight) * 2 + 1,
      });
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return mouse;
}
