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
  mousePressed: boolean;
  mouseTime: number;
  _mousePrevPressed: boolean;
  _mousePressStart: number;
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
      mousePressed: false,
      mouseTime: 0,
      _mousePrevPressed: false,
      _mousePressStart: 0,
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

  const now = performance.now() / 1000;
  const elapsed = now - state.startTime;

  if (state.mousePressed && !state._mousePrevPressed) {
    state._mousePressStart = now;
    state.mouseTime = 0;
  }
  if (state.mousePressed) {
    state.mouseTime = now - state._mousePressStart;
  }
  state._mousePrevPressed = state.mousePressed;

  setUniforms(
    gl,
    state.uniforms,
    elapsed,
    width,
    height,
    state.mouseX,
    state.mouseY,
    state.mouseTime
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
