"use client";

import { useCallback, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useShaderRenderer } from "@/hooks/useShaderRenderer";
import ShaderError from "./ShaderError";

interface ShaderCanvasProps {
  fragSource: string;
  width?: number;
  height?: number;
  className?: string;
  alwaysVisible?: boolean;
  paused?: boolean;
  mouseMode?: "hover" | "press";
  onRecompileReady?: (recompile: (src: string) => string | null) => void;
}

export default function ShaderCanvas({
  fragSource,
  width = 400,
  height = 300,
  className = "",
  alwaysVisible = false,
  paused = false,
  mouseMode,
  onRecompileReady,
}: ShaderCanvasProps) {
  const [observerRef, isIntersecting] = useIntersectionObserver(0.1);
  const isVisible = !paused && (alwaysVisible || isIntersecting);

  const { canvasRef, error, recompile, setMouse, setMousePressed } = useShaderRenderer({
    fragSource,
    isVisible,
    width,
    height,
  });

  useShaderRendererRecompileRef(recompile, onRecompileReady);

  const mouseDownRef = useRef(false);

  const computeMouse = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      const x = ((clientX - rect.left) / rect.width) * width;
      const y = (1 - (clientY - rect.top) / rect.height) * height;
      setMouse(x, y);
    },
    [width, height, setMouse]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mouseMode) return;
      mouseDownRef.current = true;
      computeMouse(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
      if (mouseMode === "press") setMousePressed(true);
    },
    [mouseMode, computeMouse, setMousePressed]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mouseMode) return;
      if (mouseMode === "press" && !mouseDownRef.current) return;
      computeMouse(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
    },
    [mouseMode, computeMouse]
  );

  const handleMouseUp = useCallback(() => {
    if (!mouseMode) return;
    mouseDownRef.current = false;
    if (mouseMode === "press") {
      setMousePressed(false);
    } else {
      setMouse(0, 0);
    }
  }, [mouseMode, setMouse, setMousePressed]);

  const handleMouseLeave = useCallback(() => {
    if (!mouseMode) return;
    mouseDownRef.current = false;
    if (mouseMode === "press") {
      setMousePressed(false);
    } else {
      setMouse(0, 0);
    }
  }, [mouseMode, setMouse, setMousePressed]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!mouseMode) return;
      const touch = e.touches[0];
      if (!touch) return;
      computeMouse(touch.clientX, touch.clientY, e.currentTarget.getBoundingClientRect());
      if (mouseMode === "press") setMousePressed(true);
    },
    [mouseMode, computeMouse, setMousePressed]
  );

  const handleTouchEnd = useCallback(() => {
    if (!mouseMode) return;
    if (mouseMode === "press") {
      setMousePressed(false);
    } else {
      setMouse(0, 0);
    }
  }, [mouseMode, setMouse, setMousePressed]);

  return (
    <div
      ref={observerRef as React.RefObject<HTMLDivElement>}
      className={`relative ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
      {error && <ShaderError error={error} />}
    </div>
  );
}

function useShaderRendererRecompileRef(
  recompile: (src: string) => string | null,
  onRecompileReady?: (recompile: (src: string) => string | null) => void
) {
  const sentRef = useRef(false);
  useEffect(() => {
    if (onRecompileReady && !sentRef.current) {
      sentRef.current = true;
      onRecompileReady(recompile);
    }
  }, [recompile, onRecompileReady]);
}
