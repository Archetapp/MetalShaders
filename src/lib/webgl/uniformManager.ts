export interface Uniforms {
  iTime: WebGLUniformLocation | null;
  iResolution: WebGLUniformLocation | null;
  iMouse: WebGLUniformLocation | null;
}

export function locateUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
): Uniforms {
  return {
    iTime: gl.getUniformLocation(program, "iTime"),
    iResolution: gl.getUniformLocation(program, "iResolution"),
    iMouse: gl.getUniformLocation(program, "iMouse"),
  };
}

export function setUniforms(
  gl: WebGL2RenderingContext,
  uniforms: Uniforms,
  time: number,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number
) {
  if (uniforms.iTime !== null) {
    gl.uniform1f(uniforms.iTime, time);
  }
  if (uniforms.iResolution !== null) {
    gl.uniform2f(uniforms.iResolution, width, height);
  }
  if (uniforms.iMouse !== null) {
    gl.uniform2f(uniforms.iMouse, mouseX, mouseY);
  }
}
