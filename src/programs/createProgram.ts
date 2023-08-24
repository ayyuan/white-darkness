import gl from '../gl';

// https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html
export default function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  if (program === null) {
    throw new Error('failed to gl.createProgram()');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  const error = new Error( gl.getProgramInfoLog(program) ?? undefined);
  gl.deleteProgram(program);
  throw error;
}
