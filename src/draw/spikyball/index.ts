import AudioData from '../../AudioData';
import OrbitCamera from '../../OrbitCamera';
import gl from '../../gl';
import { createMat4, rotateX, rotateY } from '../../math/mat4';
import createBluenoiseTexture from './createBluenoiseTexture';
import createSpikyBallProgram from './createSpikyBallProgram';
import createVAO from './createVAO';

const tmp1 = createMat4();
const tmp2 = createMat4();

// bounding volume size
const SIZE = 20;
const program = createSpikyBallProgram();
const vao = createVAO(program, SIZE);

// uniform locations
const projMatLoc = gl.getUniformLocation(program, 'uProjectionMatrix')!;
const modelMatLoc = gl.getUniformLocation(program, 'uModelMatrix')!;
const viewMatLoc = gl.getUniformLocation(program, 'uViewMatrix')!;
const audioLoc = gl.getUniformLocation(program, 'uAudio')!;
const sizeLoc = gl.getUniformLocation(program, 'uSize')!;
const cameraLoc = gl.getUniformLocation(program, 'uCameraPos')!;
const bluenoiseLoc = gl.getUniformLocation(program, 'uBluenoise')!;
const timeLoc = gl.getUniformLocation(program, 'uTime')!;
const resLoc = gl.getUniformLocation(program, 'uResolution')!;
const bgTimeLoc = gl.getUniformLocation(program, 'uBgTime')!;

const bluenoiseTex = createBluenoiseTexture();

export default function drawSpikyBall(camera: OrbitCamera, audio: AudioData, time: number) {
  gl.useProgram(program);

  // update modelMatrix
  const modelMatrix = rotateX(tmp1, tmp2, time);
  rotateY(modelMatrix, modelMatrix, time);

  // vao
  gl.bindVertexArray(vao);

  // uniforms
  gl.uniformMatrix4fv(projMatLoc, false, camera.projectionMatrix);
  gl.uniformMatrix4fv(modelMatLoc, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatLoc, false, camera.viewMatrix);
  gl.uniform1fv(audioLoc, audio.dataArray);
  gl.uniform1f(sizeLoc, SIZE);
  gl.uniform3fv(cameraLoc, camera.position);
  gl.uniform1f(timeLoc, time);
  gl.uniform1f(bgTimeLoc, audio.time);
  gl.uniform2f(resLoc, gl.canvas.width, gl.canvas.height);

  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, bluenoiseTex);
  gl.uniform1i(bluenoiseLoc, 0);

  // render
  gl.cullFace(gl.BACK);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 36, SIZE * SIZE * SIZE);
  gl.bindVertexArray(null);
}
