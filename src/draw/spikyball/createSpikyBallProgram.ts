import gl from '../../gl';
import createProgram from '../../gl/createProgram';
import createShader from '../../gl/createShader';

const vertex =
/* glsl */ `#version 300 es

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;

in vec3 aPosition;
in vec3 aInstancePosition;

out vec3 vPosition;
out vec3 vP;

void main() {
  vP = aPosition;

  vec4 p = vec4( aPosition + aInstancePosition, 1. );
  vec4 worldPos = uModelMatrix * p;
  vPosition = worldPos.xyz;
  gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
`;

const fragment =
/* glsl */ `#version 300 es

#define SHOW_GRID 1

precision highp float;

out vec4 outColor;

in vec3 vPosition;
in vec3 vP;

void main() {
  vec3 n = normalize( cross(dFdx(vPosition), dFdy(vPosition)) );
  n = 0.5*n + 0.5;

#if SHOW_GRID
  float pMin = min(vP.x, min(vP.y, vP.z));
  float pMax = max(vP.x, max(vP.y, vP.z));
  n *= smoothstep(-1., -0.9, pMin) + smoothstep(1., 0.9, pMax);
#endif

  outColor = vec4(n,1.);
}
`;

export default function createSpikyBallProgram() {
  const vs = createShader(gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl.FRAGMENT_SHADER, fragment);
  return createProgram(vs, fs);
}