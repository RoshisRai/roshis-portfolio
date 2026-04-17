"use client";

import { useState, useEffect, useRef } from "react";
import { useCursor } from "./use-cursor";

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

/**
 * Reads mouse position from the global CursorProvider.
 * - By default, returns a ref (zero re-renders). Use `.current` to read.
 * - Pass `{ enableState: true, throttleMs: 16 }` only if you NEED React state.
 */
export function useMousePosition(options?: { enableState?: boolean; throttleMs?: number }) {
  const { enableState = false, throttleMs = 16 } = options || {};
  const { refs, subscribe } = useCursor();

  const mouseRef = useRef<MousePosition>(refs.current.mouse);
  const [mouseState, setMouseState] = useState<MousePosition>(refs.current.mouse);

  useEffect(() => {
    // Keep ref in sync (cheap pointer swap)
    mouseRef.current = refs.current.mouse;

    if (!enableState) return;

    // Throttle state updates to avoid excessive re-renders
    let last = 0;
    const unsub = subscribe((r) => {
      const now = performance.now();
      if (now - last < throttleMs) return;
      last = now;
      setMouseState({ ...r.mouse });
    });
    return unsub;
  }, [enableState, throttleMs, refs, subscribe]);

  return { mouse: enableState ? mouseState : refs.current.mouse, mouseRef };
}