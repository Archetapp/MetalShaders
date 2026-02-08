export interface Uniforms {
  iTime: WebGLUniformLocation | null;
  iResolution: WebGLUniformLocation | null;
  iMouse: WebGLUniformLocation | null;
  iMouseTime: WebGLUniformLocation | null;
  iMouseDown: WebGLUniformLocation | null;
}

export function locateUniforms(
  gl: WebGL2RenderingContext,
  program: WebGLProgram
): Uniforms {
  return {
    iTime: gl.getUniformLocation(program, "iTime"),
    iResolution: gl.getUniformLocation(program, "iResolution"),
    iMouse: gl.getUniformLocation(program, "iMouse"),
    iMouseTime: gl.getUniformLocation(program, "iMouseTime"),
    iMouseDown: gl.getUniformLocation(program, "iMouseDown"),
  };
}

export function setUniforms(
  gl: WebGL2RenderingContext,
  uniforms: Uniforms,
  time: number,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  mouseTime: number,
  mouseDown: number
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
  if (uniforms.iMouseTime !== null) {
    gl.uniform1f(uniforms.iMouseTime, mouseTime);
  }
  if (uniforms.iMouseDown !== null) {
    gl.uniform1f(uniforms.iMouseDown, mouseDown);
  }
}
