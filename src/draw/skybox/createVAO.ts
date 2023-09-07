import gl from '../../gl';
import createVertexArray from '../../gl/createVertexArray';
import boxPositionBuffer from '../boxPositionBuffer';

export default function createVAO(program: WebGLProgram) {
  const vao = createVertexArray();
  gl.bindVertexArray(vao);

  const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
  gl.bindBuffer( gl.ARRAY_BUFFER, boxPositionBuffer );
  gl.enableVertexAttribArray( aPositionLoc );
  gl.vertexAttribPointer(
    aPositionLoc,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindVertexArray(null);
  return vao;
}
