import gl from '../../gl';
import createBuffer from '../../gl/createBuffer';

export default function createInstancePositionBuffer(size: number) {
  const instancePositionBuffer = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instancePositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array( createPositions(size) ),
    gl.STATIC_DRAW,
  );
  return instancePositionBuffer;
}

// create grid of size x size x size voxels centered at origin (0,0,0)
function createPositions(size: number) {
  const offset = size - 1;
  const stride = 2;
  const res = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k < size; k++) {
        const x = stride * i - offset;
        const y = stride * j - offset;
        const z = stride * k - offset;
        res.push(x, y, z);
      }
    }
  }

  return res;
}
