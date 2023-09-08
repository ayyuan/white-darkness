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
  vec2 p = 0.5*vPosition + 0.5;
  vec4 c = texture(uColor, p);
  outColor = c;
}
`;

export default function createQuadProgram() {
  const vs = createShader(gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl.FRAGMENT_SHADER, fragment);
  return createProgram(vs, fs);
}
