"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getContextPool } from "@/lib/webgl/ContextPool";
import {
  createRenderer,
  startRenderLoop,
  stopRenderLoop,
  destroyRenderer,
  RendererState,
} from "@/lib/webgl/ShaderRenderer";

interface UseShaderRendererOptions {
  fragSource: string;
  isVisible: boolean;
  width?: number;
  height?: number;
}

interface UseShaderRendererResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  error: string | null;
  recompile: (newSource: string) => string | null;
}

export function useShaderRenderer({
  fragSource,
  isVisible,
  width = 512,
  height = 512,
}: UseShaderRendererOptions): UseShaderRendererResult {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<RendererState | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastFrameRef = useRef<string | null>(null);

  const captureFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      try {
        lastFrameRef.current = canvas.toDataURL("image/png");
      } catch {
        // Canvas may be tainted
      }
    }
  }, []);

  const restoreFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && lastFrameRef.current) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = lastFrameRef.current;
      }
    }
  }, []);

  const recompile = useCallback(
    (newSource: string): string | null => {
      const gl = glRef.current;
      if (!gl) return "No WebGL context available";

      const { state: newState, error: compileError } = createRenderer(
        gl,
        newSource
      );

      if (!newState || compileError) {
        setError(compileError);
        return compileError;
      }

      if (stateRef.current) {
        stopRenderLoop(stateRef.current);
        destroyRenderer(gl, stateRef.current);
      }

      setError(null);
      newState.startTime = stateRef.current?.startTime ?? newState.startTime;
      stateRef.current = newState;
      startRenderLoop(gl, newState, canvasRef.current);
      return null;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
  }, [width, height]);

  useEffect(() => {
    if (!isVisible) {
      if (stateRef.current && glRef.current) {
        captureFrame();
        stopRenderLoop(stateRef.current);
        destroyRenderer(glRef.current, stateRef.current);
        stateRef.current = null;

        const pool = getContextPool();
        pool.release(glRef.current);
        glRef.current = null;
      }
      return;
    }

    const pool = getContextPool();
    const acquired = pool.acquire();
    if (!acquired) {
      setError("No WebGL context available");
      return;
    }

    const { gl } = acquired;
    glRef.current = gl;

    const offscreenCanvas = gl.canvas as OffscreenCanvas;
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    const { state, error: compileError } = createRenderer(gl, fragSource);
    if (!state || compileError) {
      setError(compileError);
      pool.release(gl);
      glRef.current = null;
      return;
    }

    setError(null);
    stateRef.current = state;
    startRenderLoop(gl, state, canvasRef.current);

    return () => {
      if (stateRef.current && glRef.current) {
        captureFrame();
        destroyRenderer(glRef.current, stateRef.current);
        stateRef.current = null;
        pool.release(glRef.current);
        glRef.current = null;
      }
    };
  }, [isVisible, fragSource, width, height, captureFrame]);

  useEffect(() => {
    if (!isVisible && lastFrameRef.current) {
      restoreFrame();
    }
  }, [isVisible, restoreFrame]);

  return { canvasRef, error, recompile };
}
