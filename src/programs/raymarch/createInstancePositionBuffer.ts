import gl from '../../gl';
import createBuffer from '../createBuffer';

export default function createInstancePositionBuffer() {
  const instancePositionBuffer = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instancePositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 0, 0,
      2.1, 0, 0,
    ]),
    gl.STATIC_DRAW,
  );
  return instancePositionBuffer;
}
