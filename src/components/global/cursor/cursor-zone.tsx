'use client'

import { useEffect, useRef } from "react";
import { useCursor } from "@/hooks/use-cursor";
import type { CursorVariant } from "@/lib/cursor-variants";

interface CursorZoneProps {
  variant: CursorVariant;
  label?: string;
  children: React.ReactNode;
  /** Render as a specific element */
  as?: React.ElementType;
  className?: string;
}

export function CursorZone({
  variant,
  label,
  children,
  as: Tag = "div",
  className,
  ...props
}: CursorZoneProps) {
  const { setVariant, resetVariant } = useCursor();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enter = () => setVariant(variant, label);
    const leave = () => resetVariant();
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [variant, label, setVariant, resetVariant]);

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={className} {...props}>{children}</Tag>;
}