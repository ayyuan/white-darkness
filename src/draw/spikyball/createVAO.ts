import gl from '../../gl';
import createVertexArray from '../../gl/createVertexArray';
import boxPositionBuffer from '../boxPositionBuffer';
import createInstancePositionBuffer from './createInstancePositionBuffer';

export default function createVAO(program: WebGLProgram, positions: number[]) {
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

  const instancePositionBuffer = createInstancePositionBuffer(positions);
  const aInstancePosLoc = gl.getAttribLocation(program, 'aInstancePosition');
  gl.bindBuffer( gl.ARRAY_BUFFER, instancePositionBuffer );
  gl.enableVertexAttribArray( aInstancePosLoc );
  gl.vertexAttribPointer(
    aInstancePosLoc,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );
  gl.vertexAttribDivisor(aInstancePosLoc, 1);

  gl.bindVertexArray(null);
  return vao;
}
