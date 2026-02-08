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
}

export default function ShaderCanvas({
  fragSource,
  width = 400,
  height = 300,
  className = "",
  alwaysVisible = false,
}: ShaderCanvasProps) {
  const [observerRef, isIntersecting] = useIntersectionObserver(0.1);
  const isVisible = alwaysVisible || isIntersecting;

  const { canvasRef, error } = useShaderRenderer({
    fragSource,
    isVisible,
    width,
    height,
  });

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
        className="w-full h-full object-cover rounded-t-2xl"
      />
      {error && <ShaderError error={error} />}
    </div>
  );
}
