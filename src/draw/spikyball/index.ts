import OrbitCamera from '../../OrbitCamera';
import gl from '../../gl';
import { createMat4 } from '../../math/mat4';
import createSpikyBallProgram from './createSpikyBallProgram';

// bounding volume size
const SIZE = 20;
const program = createSpikyBallProgram(SIZE);
const modelMatrix = createMat4();

// uniform locations
const projMatLoc = gl.getUniformLocation(program, 'uProjectionMatrix')!;
const modelMatLoc = gl.getUniformLocation(program, 'uModelMatrix')!;
const viewMatLoc = gl.getUniformLocation(program, 'uViewMatrix')!;

export default function drawSpikyBall(camera: OrbitCamera) {
  gl.useProgram(program);

  // uniforms
  gl.uniformMatrix4fv(projMatLoc, false, camera.projectionMatrix);
  gl.uniformMatrix4fv(modelMatLoc, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatLoc, false, camera.viewMatrix);

  // render
  gl.cullFace(gl.BACK);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, SIZE * SIZE * SIZE);
}
