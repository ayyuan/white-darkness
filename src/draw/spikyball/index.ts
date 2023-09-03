import OrbitCamera from '../../OrbitCamera';
import gl from '../../gl';
import { createMat4 } from '../../math/mat4';
import createSpikyBallProgram from './createSpikyBallProgram';

const program = createSpikyBallProgram();
const modelMatrix = createMat4();

export default function drawSpikyBall(camera: OrbitCamera) {
  gl.useProgram(program);

  // uniforms
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'uProjectionMatrix'),
    false,
    camera.projectionMatrix,
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'uModelMatrix'),
    false,
    modelMatrix,
  );
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, 'uViewMatrix'),
    false,
    camera.viewMatrix,
  );

  // render
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, 20*20*20);
}
