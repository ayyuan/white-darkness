import gl from './gl';
import { createMat4, lookAt, perspective, rotateX, rotateY, rotateZ, translate } from './math/mat4';
import { createRaymarchProgram } from './programs/createRaymarchProgram';

const raymarchProgram = createRaymarchProgram();
const fovy = 60 * Math.PI / 180;
const projectionMatrix = perspective(createMat4(), fovy, window.innerWidth/window.innerHeight, 0.1, 100);
let modelMatrix = createMat4();

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
  // modelMatrix = translate(createMat4(), [0,0,-6]);
  // rotateX(modelMatrix, r);
  // rotateY(modelMatrix, r);
  // rotateZ(modelMatrix, r);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(raymarchProgram, 'uModelMatrix'),
    false,
    modelMatrix,
  );

  const eye = [6*Math.sin(r), 3, 6*Math.cos(r)];
  const viewMatrix = lookAt(createMat4(), eye, [0,0,0], [0,1,0]);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(raymarchProgram, 'uViewMatrix'),
    false,
    viewMatrix,
  );

  // render
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
}
