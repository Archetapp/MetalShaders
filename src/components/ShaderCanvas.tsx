"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useShaderRenderer } from "@/hooks/useShaderRenderer";
import ShaderError from "./ShaderError";

interface ShaderCanvasProps {
  fragSource: string;
  width?: number;
  height?: number;
  className?: string;
  alwaysVisible?: boolean;
  onRecompileReady?: (recompile: (src: string) => string | null) => void;
}

export default function ShaderCanvas({
  fragSource,
  width = 400,
  height = 300,
  className = "",
  alwaysVisible = false,
  onRecompileReady,
}: ShaderCanvasProps) {
  const [observerRef, isIntersecting] = useIntersectionObserver(0.1);
  const isVisible = alwaysVisible || isIntersecting;

  const { canvasRef, error, recompile } = useShaderRenderer({
    fragSource,
    isVisible,
    width,
    height,
  });

  useShaderRendererRecompileRef(recompile, onRecompileReady);

  return (
    <div
      ref={observerRef as React.RefObject<HTMLDivElement>}
      className={`relative ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
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

import { useEffect, useRef } from "react";

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
