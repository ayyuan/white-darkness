import AudioData from './AudioData';
import OrbitCamera from './OrbitCamera';
import drawPostProcessing from './draw/postprocessing';
import createFBO from './draw/postprocessing/createFBO';
import resizeFBO from './draw/postprocessing/resizeFBO';
import drawSkybox from './draw/skybox';
import drawSpikyBall from './draw/spikyball';
import gl from './gl';
import Settings from './Settings';

const camera = new OrbitCamera({
  position: [0.01,0,50],
  target: [0,5,0],
  maxPolar: 2*Math.PI / 3,
  minPolar: Math.PI / 3,
  dampingFactor: 0.1,
});

const fbo = createFBO();
const settings = new Settings(fbo);

// update canvas size on resize event
window.addEventListener('resize', () => {
  const dpr = settings.dpr;
  const w = Math.floor( window.innerWidth * dpr );
  const h = Math.floor( window.innerHeight * dpr );
  gl.canvas.width = w;
  gl.canvas.height = h;
  resizeFBO(fbo, w, h);
  gl.viewport(0, 0, w, h);
});

const audioElem = document.querySelector('audio')!;
const audio = new AudioData(audioElem, camera);

export default function render(delta: number) {
  const time = 1e-3 * performance.now();
  audio.update(1e-3 * delta);
  camera.update(time, audio);

  // -- render scene to texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawSpikyBall(camera, audio, time);
  drawSkybox(camera, audio, time);

  // -- post-processing
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawPostProcessing(fbo.texture, audio);
}
