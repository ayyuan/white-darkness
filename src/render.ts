import OrbitCamera from './OrbitCamera';
import drawSpikyBall from './draw/spikyball';

const camera = new OrbitCamera({
  position: [0.01,0,100],
  target: [0,0,0],
  up: [0,1,0],
  maxPolar: 3*Math.PI / 4,
  minPolar: Math.PI / 4
});

export default function render() {
  camera.update();

  drawSpikyBall(camera);
}
