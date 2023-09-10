import gl from '../../gl';
import createBuffer from '../../gl/createBuffer';

export default function createInstancePositionBuffer(positions: number[]) {
  const instancePositionBuffer = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instancePositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW,
  );
  return instancePositionBuffer;
}
