import gl from '../../gl';
import textureSrc from '../../assets/bluenoise.png';

export default function createBluenoiseTexture() {
  const tex = gl.createTexture();
  if (tex === null) {
    throw new Error('failed to gl.createTexture()');
  }

  const textureFont = tex;
  // load image into texture
  const image = new Image();
  image.crossOrigin = '';
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, textureFont);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texStorage2D(
      gl.TEXTURE_2D,
      1,
      gl.RGBA8,
      image.width,
      image.height,
    );
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      image.width,
      image.height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image,
    );
  };
  image.src = textureSrc;

  return tex;
}
