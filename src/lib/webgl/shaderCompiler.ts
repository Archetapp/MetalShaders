export interface CompileResult {
  program: WebGLProgram | null;
  error: string | null;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | string {
  const shader = gl.createShader(type);
  if (!shader) return "Failed to create shader";

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || "Unknown compilation error";
    gl.deleteShader(shader);
    return log;
  }

  return shader;
}

export function compileProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): CompileResult {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  if (typeof vertexShader === "string") {
    return { program: null, error: `Vertex shader: ${vertexShader}` };
  }

  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (typeof fragmentShader === "string") {
    gl.deleteShader(vertexShader);
    return { program: null, error: `Fragment shader: ${fragmentShader}` };
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return { program: null, error: "Failed to create program" };
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || "Unknown link error";
    gl.deleteProgram(program);
    return { program: null, error: `Link: ${log}` };
  }

  return { program, error: null };
}
