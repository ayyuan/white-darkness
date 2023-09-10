import gl from '../../gl';
import createProgram from '../../gl/createProgram';
import createShader from '../../gl/createShader';
import backgroundGlsl from '../../shaders/background.glsl';
import ditherGlsl from '../../shaders/dither.glsl';
import linearTosRGBGlsl from '../../shaders/linearTosRGB.glsl';
import vignetteGlsl from '../../shaders/vignette.glsl';

const vertex =
/* glsl */ `#version 300 es

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform vec3 uCameraPos;

in vec4 aPosition;

out vec3 vDirection;

void main() {
  vec4 worldPos = uModelMatrix * aPosition;
  // ray direction
  vDirection = worldPos.xyz - uCameraPos;
  gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
`;

const fragment =
/* glsl */ `#version 300 es

precision highp float;

uniform float uTime;
uniform float uBgTime;
uniform vec2 uResolution;
uniform float[3] uAudio;

in vec3 vDirection;

out vec4 outColor;

${backgroundGlsl}
${ditherGlsl}
${linearTosRGBGlsl}
${vignetteGlsl}

void main() {
  // ray direction
  vec3 rd = normalize(vDirection);
  // like sampling from a cubemap
  vec3 c = background(rd);
  vignette(c);
  outColor = vec4(c, 1.);
  outColor = linearTosRGB(outColor) + dither();
}
`;

export default function createSkyboxProgram() {
  const vs = createShader(gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl.FRAGMENT_SHADER, fragment);
  return createProgram(vs, fs);
}
