import gl from '../gl';
import createBuffer from '../gl/createBuffer';

const v0 = [-1, -1, -1];
const v1 = [+1, -1, -1];
const v2 = [-1, +1, -1];
const v3 = [+1, +1, -1];
const v4 = [-1, -1, +1];
const v5 = [+1, -1, +1];
const v6 = [-1, +1, +1];
const v7 = [+1, +1, +1];
const vertices = [
  ...v1, ...v0, ...v2, ...v1, ...v2, ...v3, // back
  ...v4, ...v5, ...v7, ...v4, ...v7, ...v6, // front
  ...v6, ...v7, ...v3, ...v6, ...v3, ...v2, // top
  ...v0, ...v1, ...v5, ...v0, ...v5, ...v4, // bottom
  ...v5, ...v1, ...v3, ...v5, ...v3, ...v7, // right
  ...v0, ...v4, ...v6, ...v0, ...v6, ...v2  // left
];

function createPositionBuffer() {
  const positionBuffer = createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW,
  );

  return positionBuffer;
}

export default createPositionBuffer();
