import gl from '../../gl';
import { FBO } from './createFBO';

export default function resizeFBO(fbo: FBO, width: number, height: number) {
  // resize texture
  gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );

  // resize depth
  gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.depth);
  gl.renderbufferStorage(
    gl.RENDERBUFFER,
    gl.DEPTH_COMPONENT24,
    width,
    height,
  );
}
