import gl from '../../gl';
import createBuffer from '../../gl/createBuffer';

export default function createPositionBuffer() {
  const buf = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      +3, -1,
      -1, +3,
    ]),
    gl.STATIC_DRAW
  );
  return buf;
}
