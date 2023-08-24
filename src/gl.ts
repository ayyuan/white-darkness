const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('webgl2');
const gl = ctx!;

gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

// set canvas size
const dpr = window.devicePixelRatio;
gl.canvas.width = Math.floor( window.innerWidth * dpr );
gl.canvas.height = Math.floor( window.innerHeight * dpr );

// update canvas size on resize event
window.addEventListener('resize', () => {
  gl.canvas.width = Math.floor( window.innerWidth * dpr );
  gl.canvas.height = Math.floor( window.innerHeight * dpr );
});

export default gl;
