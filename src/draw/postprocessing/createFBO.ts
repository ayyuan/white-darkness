import gl from '../../gl';

export type FBO = ReturnType<typeof createFBO>;
export default function createFBO() {
  const fbo = gl.createFramebuffer();
  if (fbo === null) {
    throw new Error('failed to gl.createFramebuffer()');
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

  // color attachment
  const texture = createTexture();
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );

  // depth attachment
  const depth = createRBO();
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depth,
  );

  return {
    fbo,
    texture,
    depth,
  };
}

function createTexture() {
  const tex = gl.createTexture();
  if (tex === null) {
    throw new Error('failed to gl.createTexture()');
  }

  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    gl.canvas.width,
    gl.canvas.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  return tex;
}

function createRBO() {
  const rbo = gl.createRenderbuffer();
  if (rbo === null) {
    throw new Error('failed to gl.createRenderbuffer()');
  }
  gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
  gl.renderbufferStorage(
    gl.RENDERBUFFER,
    gl.DEPTH_COMPONENT24,
    gl.canvas.width,
    gl.canvas.height,
  );
  return rbo;
}
