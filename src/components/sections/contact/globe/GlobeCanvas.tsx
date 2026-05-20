"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type Globe } from "cobe";

const hexToRgb = (hex: string): [number, number, number] => {
  const sanitized = hex.replace("#", "");
  const rgb = parseInt(sanitized, 16);
  return [
    ((rgb >> 16) & 255) / 255,
    ((rgb >> 8) & 255) / 255,
    (rgb & 255) / 255,
  ];
};

export const GlobeCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const rotationRef = useRef(0);
  const tiltRef = useRef(0.3);
  const dragStart = useRef({ phi: 0, theta: 0 });
  const sizeRef = useRef(0);
  const globeRef = useRef<Globe | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 2, 2);

    const getThemeColors = () => {
        const computed = getComputedStyle(document.documentElement);
        const borderHex = computed.getPropertyValue("--color-border").trim() || "#1e1e26";
        const accentHex = computed.getPropertyValue("--color-accent").trim() || "#6366f1";
        const isLight = document.documentElement.getAttribute("data-theme") === "light";

        return {
            baseColor: hexToRgb(borderHex),
            markerColor: hexToRgb(accentHex),
            glowColor: hexToRgb(accentHex),
            dark: isLight ? 0 : 1,
        };
    };

    const getMapSamples = () => {
        if (window.innerWidth < 768) return 8000;
        if (window.innerWidth >= 1280 && sizeRef.current >= 520) return 40000;
        return 16000;
    };

    const initGlobe = () => {
        if (!canvasRef.current || globeRef.current || sizeRef.current === 0) return;

        const colors = getThemeColors();

        globeRef.current = createGlobe(canvasRef.current, {
            devicePixelRatio: dpr,
            width: sizeRef.current,
            height: sizeRef.current,
            phi: rotationRef.current,
            theta: tiltRef.current,
            diffuse: 1.2,
            mapSamples: getMapSamples(),
            mapBrightness: 6,
            markers: [
            { location: [43.6532, -79.3832] as [number, number], size: 0.08, id: "toronto" },
            ],
            ...colors,
        });
    };

    const updateSize = () => {
        const nextSize =
            canvasRef.current?.offsetWidth || canvasRef.current?.parentElement?.offsetWidth || 0;
        if (nextSize === 0) return;
        sizeRef.current = nextSize;

        if (globeRef.current) {
            globeRef.current.update({
            width: nextSize,
            height: nextSize,
            mapSamples: getMapSamples(),
            });
        } else {
            initGlobe();
        }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);
    updateSize();

    const themeObserver = new MutationObserver(() => {
        if (globeRef.current) globeRef.current.update(getThemeColors());
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    });

    const tick = () => {
        if (globeRef.current) {
            if (!pointerInteracting.current) rotationRef.current += 0.0015;
                globeRef.current.update({
                phi: rotationRef.current,
                theta: tiltRef.current,
            });
        }
        rafRef.current = window.requestAnimationFrame(tick);
    };

    const startAnimation = () => {
        if (!rafRef.current) rafRef.current = window.requestAnimationFrame(tick);
    };

    const stopAnimation = () => {
        if (rafRef.current) {
            window.cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) startAnimation();
        else stopAnimation();
    });
    visibilityObserver.observe(canvas);

    startAnimation();

    const fadeInTimer = window.setTimeout(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 200);

    return () => {
        window.clearTimeout(fadeInTimer);
        resizeObserver.disconnect();
        themeObserver.disconnect();
        visibilityObserver.disconnect();
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        globeRef.current?.destroy();
        globeRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-500 ease-out pointer-events-auto"
        style={{ maxWidth: "100%", aspectRatio: "1/1" }}
        onPointerDown={(e) => {
            pointerInteracting.current = true;
            pointerStart.current = { x: e.clientX, y: e.clientY };
            dragStart.current = { phi: rotationRef.current, theta: tiltRef.current };
            if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
            pointerInteracting.current = false;
            if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
            pointerInteracting.current = false;
        }}
        onPointerMove={(e) => {
            if (!pointerInteracting.current) return;
            const dx = e.clientX - pointerStart.current.x;
            const dy = e.clientY - pointerStart.current.y;
            rotationRef.current = dragStart.current.phi + dx / 150;
            const nextTheta = dragStart.current.theta + dy / 150;
            tiltRef.current = Math.max(-1.0, Math.min(1.0, nextTheta));
        }}
      />
      <div
        className="absolute z-20 pointer-events-none font-mono text-[10px] font-semibold uppercase tracking-wider text-text-primary bg-surface border border-border px-1.5 py-0.5 rounded shadow-md transition-all duration-200 transform -translate-x-1/2 -translate-y-full mb-2"
        style={{
            positionAnchor: "--cobe-toronto",
            left: "anchor(center)",
            bottom: "calc(anchor(top) - 20px)",
            opacity: "var(--cobe-visible-toronto, 0)",
            filter: "blur(calc((1 - var(--cobe-visible-toronto, 0)) * 4px))",
        }}
      >
        Toronto
      </div>
    </div>
  );
};