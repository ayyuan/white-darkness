import AudioData from './AudioData';
import OrbitCamera from './OrbitCamera';
import drawPostProcessing from './draw/postprocessing';
import createFBO from './draw/postprocessing/createFBO';
import resizeFBO from './draw/postprocessing/resizeFBO';
import drawSkybox from './draw/skybox';
import drawSpikyBall from './draw/spikyball';
import gl from './gl';

const camera = new OrbitCamera({
  position: [0.01,0,70],
  target: [0,0,0],
  up: [0,1,0],
  maxPolar: 3*Math.PI / 4,
  minPolar: Math.PI / 4
});

const fbo = createFBO();
const dpr = window.devicePixelRatio;
resizeFBO(fbo, Math.floor(innerWidth * dpr), Math.floor(innerHeight * dpr));

// update canvas size on resize event
window.addEventListener('resize', () => {
  const w = Math.floor( window.innerWidth * dpr );
  const h = Math.floor( window.innerHeight * dpr );
  gl.canvas.width = w;
  gl.canvas.height = h;
  resizeFBO(fbo, w, h);
});

const audioElem = document.querySelector('audio')!;
const audio = new AudioData(audioElem);

export default function render(delta: number) {
  const time = 1e-3 * performance.now();
  audio.update(1e-3 * delta);
  camera.update();

  // -- render scene to texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawSpikyBall(camera, audio, time);
  drawSkybox(camera, audio, time);

  // -- post-processing
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawPostProcessing(fbo.texture, audio);
}
