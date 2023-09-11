const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('webgl2' , {antialias: false});
if (ctx === null) {
  const error = document.getElementById('error')!;
  canvas.classList.add('hidden');
  error.classList.remove('hidden');
  throw new Error('webgl2 not available');
}

const gl = ctx;

gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

export default gl;
