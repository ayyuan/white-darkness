import gl from '../gl';

// https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html
export default function createShader(type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader === null) {
    throw new Error('failed to gl.createShader()');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  const error = new Error( gl.getShaderInfoLog(shader) ?? undefined );
  gl.deleteShader(shader);
  throw error;
}
