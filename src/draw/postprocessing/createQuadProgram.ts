import gl from '../../gl';
import createProgram from '../../gl/createProgram';
import createShader from '../../gl/createShader';

const vertex =
/* glsl */ `#version 300 es

in vec2 aPosition;

out vec2 vPosition;

void main() {
  vPosition = aPosition;
  gl_Position = vec4( aPosition, 0., 1. );
}
`;

const fragment =
/* glsl */ `#version 300 es

precision highp float;

uniform sampler2D uColor;

in vec2 vPosition;

out vec4 outColor;

void main() {
  vec2 uv = 0.5*vPosition + 0.5;

  // radial chromatic abberation from: https://www.shadertoy.com/view/Mtf3zl
  float distFromCenter = length( uv - vec2( 0.5, 0.5 ) );
  //TODO:
  float shift = 0.0; //0.05 * shake(iChannel1);

  vec2 uvR, uvG, uvB;
  vec4 color;

  // outer edges have more aberration
  shift *= min(distFromCenter, 0.3);

  // vector from center to px
  vec2 colorVec = normalize(uv - vec2(0.5,0.5));

  // color shift in the dir of colorVec
  uvR = vec2(uv.x-(colorVec.x*shift), uv.y-(colorVec.y*shift));
  uvG = vec2(uv.x                   , uv.y);
  uvB = vec2(uv.x+(colorVec.x*shift), uv.y+(colorVec.y*shift));

  color.r = texture( uColor, uvR ).r;
  color.g = texture( uColor, uvG ).g;
  color.b = texture( uColor, uvB ).b;
  color.a = 1.0;

  outColor = color;
}
`;

export default function createQuadProgram() {
  const vs = createShader(gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl.FRAGMENT_SHADER, fragment);
  return createProgram(vs, fs);
}
