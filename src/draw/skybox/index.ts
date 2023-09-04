import OrbitCamera from '../../OrbitCamera';
import gl from '../../gl';
import { createMat4, scale } from '../../math/mat4';
import createSkyboxProgram from './createSkyboxProgram';

const program = createSkyboxProgram();
const modelMatrix = scale(createMat4(), [100, 100, 100]);

// uniform locations
const projMatLoc = gl.getUniformLocation(program, 'uProjectionMatrix')!;
const modelMatLoc = gl.getUniformLocation(program, 'uModelMatrix')!;
const viewMatLoc = gl.getUniformLocation(program, 'uViewMatrix')!;
const camPosLoc = gl.getUniformLocation(program, 'uCameraPos')!;

export default function drawSkybox(camera: OrbitCamera) {
  gl.useProgram(program);

  // uniforms
  gl.uniformMatrix4fv(projMatLoc, false, camera.projectionMatrix);
  gl.uniformMatrix4fv(modelMatLoc, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatLoc, false, camera.viewMatrix);
  gl.uniform3fv(camPosLoc, camera.position);

  // render
  gl.cullFace(gl.FRONT);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
}
