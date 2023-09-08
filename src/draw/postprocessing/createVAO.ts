import gl from '../../gl';
import createVertexArray from '../../gl/createVertexArray';
import createPositionBuffer from './createPositionBuffer';

const positionBuffer = createPositionBuffer();

export default function createVAO(program: WebGLProgram) {
  const vao = createVertexArray();
  gl.bindVertexArray(vao);

  const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
  gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
  gl.enableVertexAttribArray( aPositionLoc );
  gl.vertexAttribPointer(
    aPositionLoc,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindVertexArray(null);
  return vao;
}
