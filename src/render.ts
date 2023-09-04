import OrbitCamera from './OrbitCamera';
import drawSkybox from './draw/skybox';
import drawSpikyBall from './draw/spikyball';
import gl from './gl';

const camera = new OrbitCamera({
  position: [0.01,0,100],
  target: [0,0,0],
  up: [0,1,0],
  maxPolar: 3*Math.PI / 4,
  minPolar: Math.PI / 4
});

export default function render() {
  camera.update();

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawSpikyBall(camera);
  drawSkybox(camera);
}
