import AudioData from '../../AudioData';
import OrbitCamera from '../../OrbitCamera';
import gl from '../../gl';
import createQuadProgram from './createQuadProgram';
import createVAO from './createVAO';

const program = createQuadProgram();
const vao = createVAO(program);

const colorLoc = gl.getUniformLocation(program, 'uColor')!;
const shakeLoc = gl.getUniformLocation(program, 'uShake')!;
const tLoc = gl.getUniformLocation(program, 'uTransition')!;

export default function drawPostProcessing(tex: WebGLTexture, audio: AudioData, camera: OrbitCamera) {
  gl.useProgram(program);

  // vao
  gl.bindVertexArray(vao);

  // uniforms
  gl.uniform1f(shakeLoc, audio.shake);
  gl.uniform1f(tLoc, camera.transitionT);

  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniform1i(colorLoc, 0);

  // render
  gl.cullFace(gl.BACK);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindVertexArray(null);
}
