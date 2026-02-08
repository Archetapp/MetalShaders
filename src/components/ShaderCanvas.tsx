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
  onRecompileReady?: (recompile: (src: string) => string | null) => void;
}

export default function ShaderCanvas({
  fragSource,
  width = 400,
  height = 300,
  className = "",
  alwaysVisible = false,
  paused = false,
  onRecompileReady,
}: ShaderCanvasProps) {
  const [observerRef, isIntersecting] = useIntersectionObserver(0.1);
  const isVisible = !paused && (alwaysVisible || isIntersecting);

  const { canvasRef, error, recompile, setMouse } = useShaderRenderer({
    fragSource,
    isVisible,
    width,
    height,
  });

  useShaderRendererRecompileRef(recompile, onRecompileReady);

  const mouseDownRef = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mouseDownRef.current = true;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * width;
      const y = (1 - (e.clientY - rect.top) / rect.height) * height;
      setMouse(x, y);
    },
    [width, height, setMouse]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mouseDownRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * width;
      const y = (1 - (e.clientY - rect.top) / rect.height) * height;
      setMouse(x, y);
    },
    [width, height, setMouse]
  );

  const handleMouseUp = useCallback(() => {
    mouseDownRef.current = false;
    setMouse(0, 0);
  }, [setMouse]);

  const handleMouseLeave = useCallback(() => {
    mouseDownRef.current = false;
    setMouse(0, 0);
  }, [setMouse]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * width;
      const y = (1 - (touch.clientY - rect.top) / rect.height) * height;
      setMouse(x, y);
    },
    [width, height, setMouse]
  );

  const handleTouchEnd = useCallback(() => {
    setMouse(0, 0);
  }, [setMouse]);

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
