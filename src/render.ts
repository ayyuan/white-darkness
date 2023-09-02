import OrbitCamera from './OrbitCamera';
import gl from './gl';
import { createMat4, perspective, } from './math/mat4';
import createRaymarchProgram from './programs/raymarch/createRaymarchProgram';

const raymarchProgram = createRaymarchProgram();
const fovy = Math.PI / 3; // 60deg
const projectionMatrix = perspective(createMat4(), fovy, window.innerWidth/window.innerHeight, 0.1, 1000);
const modelMatrix = createMat4();

const controls = new OrbitCamera({
  position: [0.01,0,100],
  target: [0,0,0],
  up: [0,1,0],
  maxPolar: 3*Math.PI / 4,
  minPolar: Math.PI / 4
});

addEventListener('resize', () => perspective(projectionMatrix, fovy, window.innerWidth/window.innerHeight, 0.1, 1000));

export default function render() {
  // -- render to screen --
  gl.useProgram(raymarchProgram);

  // uniforms
  gl.uniformMatrix4fv(
    gl.getUniformLocation(raymarchProgram, 'uProjectionMatrix'),
    false,
    projectionMatrix,
  );

  gl.uniformMatrix4fv(
    gl.getUniformLocation(raymarchProgram, 'uModelMatrix'),
    false,
    modelMatrix,
  );

  controls.update();
  gl.uniformMatrix4fv(
    gl.getUniformLocation(raymarchProgram, 'uViewMatrix'),
    false,
    controls.viewMatrix,
  );

  // render
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 20*20*20);
}
