import gl from './gl';
import { createMat4, perspective, rotateX, rotateY, rotateZ, translate } from './math/mat4';
import { createRaymarchProgram } from './programs/createRaymarchProgram';

const raymarchProgram = createRaymarchProgram();
const fovy = 60 * Math.PI / 180;
const projectionMatrix = perspective(createMat4(), fovy, window.innerWidth/window.innerHeight, 0.1, 100);
let modelViewMatrix = createMat4();

addEventListener('resize', () => perspective(projectionMatrix, fovy, window.innerWidth/window.innerHeight, 0.1, 100));

export default function render() {
  // -- render to screen --
  gl.useProgram(raymarchProgram);

  // uniforms
  gl.uniformMatrix4fv(
    gl.getUniformLocation(raymarchProgram, 'uProjectionMatrix'),
    false,
    projectionMatrix,
  );

  const r = 0.001*performance.now();
  modelViewMatrix = translate(createMat4(), [0,0,-6]);
  rotateX(modelViewMatrix, r);
  rotateY(modelViewMatrix, r);
  rotateZ(modelViewMatrix, r);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(raymarchProgram, 'uModelViewMatrix'),
    false,
    modelViewMatrix,
  );

  // render
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
}
