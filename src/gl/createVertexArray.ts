import gl from '.';

export default function createVertexArray() {
  const vao = gl.createVertexArray();
  if (vao === null) {
    throw new Error('failed to gl.createVertexArray()');
  }
  return vao;
}
