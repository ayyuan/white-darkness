import gl from '../gl';

export default function createBuffer() {
  const buf = gl.createBuffer();
  if (buf === null) {
    throw new Error('failed to gl.createBuffer()');
  }
  return buf;
}
