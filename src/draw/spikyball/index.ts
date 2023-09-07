import OrbitCamera from '../../OrbitCamera';
import gl from '../../gl';
import { createMat4 } from '../../math/mat4';
import createSpikyBallProgram from './createSpikyBallProgram';
import createVAO from './createVAO';

// bounding volume size
const SIZE = 20;
const program = createSpikyBallProgram();
const vao = createVAO(program, SIZE);
const modelMatrix = createMat4();

// uniform locations
const projMatLoc = gl.getUniformLocation(program, 'uProjectionMatrix')!;
const modelMatLoc = gl.getUniformLocation(program, 'uModelMatrix')!;
const viewMatLoc = gl.getUniformLocation(program, 'uViewMatrix')!;

export default function drawSpikyBall(camera: OrbitCamera) {
  gl.useProgram(program);

  // vao
  gl.bindVertexArray(vao);

  // uniforms
  gl.uniformMatrix4fv(projMatLoc, false, camera.projectionMatrix);
  gl.uniformMatrix4fv(modelMatLoc, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatLoc, false, camera.viewMatrix);

  // render
  gl.cullFace(gl.BACK);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, SIZE * SIZE * SIZE);
  gl.bindVertexArray(null);
}
