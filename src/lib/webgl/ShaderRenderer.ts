import { compileProgram } from "./shaderCompiler";
import { getVertexShaderSource, createQuadVAO, drawQuad } from "./fullscreenQuad";
import { locateUniforms, setUniforms, Uniforms } from "./uniformManager";

export interface RendererState {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  uniforms: Uniforms;
  startTime: number;
  animationId: number | null;
  mouseX: number;
  mouseY: number;
}

export interface CreateRendererResult {
  state: RendererState | null;
  error: string | null;
}

export function createRenderer(
  gl: WebGL2RenderingContext,
  fragSource: string
): CreateRendererResult {
  const { program, error } = compileProgram(
    gl,
    getVertexShaderSource(),
    fragSource
  );

  if (!program || error) {
    return { state: null, error: error || "Failed to compile program" };
  }

  const vao = createQuadVAO(gl);
  if (!vao) {
    gl.deleteProgram(program);
    return { state: null, error: "Failed to create vertex array" };
  }

  const uniforms = locateUniforms(gl, program);

  return {
    state: {
      program,
      vao,
      uniforms,
      startTime: performance.now() / 1000,
      animationId: null,
      mouseX: 0,
      mouseY: 0,
    },
    error: null,
  };
}

export function renderFrame(
  gl: WebGL2RenderingContext,
  state: RendererState,
  targetCanvas: HTMLCanvasElement | null
) {
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;

  gl.viewport(0, 0, width, height);
  gl.useProgram(state.program);

  const elapsed = performance.now() / 1000 - state.startTime;
  setUniforms(
    gl,
    state.uniforms,
    elapsed,
    width,
    height,
    state.mouseX,
    state.mouseY
  );

  drawQuad(gl, state.vao);

  if (targetCanvas) {
    const ctx = targetCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(
        gl.canvas as OffscreenCanvas,
        0, 0,
        targetCanvas.width,
        targetCanvas.height
      );
    }
  }
}

export function startRenderLoop(
  gl: WebGL2RenderingContext,
  state: RendererState,
  targetCanvas: HTMLCanvasElement | null
): RendererState {
  function loop() {
    renderFrame(gl, state, targetCanvas);
    state.animationId = requestAnimationFrame(loop);
  }
  state.animationId = requestAnimationFrame(loop);
  return state;
}

export function stopRenderLoop(state: RendererState) {
  if (state.animationId !== null) {
    cancelAnimationFrame(state.animationId);
    state.animationId = null;
  }
}

export function destroyRenderer(
  gl: WebGL2RenderingContext,
  state: RendererState
) {
  stopRenderLoop(state);
  gl.deleteProgram(state.program);
  gl.deleteVertexArray(state.vao);
}
