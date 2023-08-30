import gl from '../gl';
import createBuffer from './createBuffer';
import createProgram from './createProgram';
import createShader from './createShader';

const vertex =
/* glsl */ `#version 300 es

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;

in vec4 aPosition;

out vec3 vPosition;

void main() {
  vec4 worldPos = uModelMatrix * aPosition;
  vPosition = worldPos.xyz;
  gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
`;

const fragment =
/* glsl */ `#version 300 es

precision highp float;

out vec4 outColor;

in vec3 vPosition;

void main() {
  vec3 n = normalize( cross(dFdx(vPosition), dFdy(vPosition)) );
  n = 0.5*n + 0.5;
  outColor = vec4(n,1.);
}
`;

const positionBuffer = createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const v0 = [-1, -1, -1];
const v1 = [+1, -1, -1];
const v2 = [-1, +1, -1];
const v3 = [+1, +1, -1];
const v4 = [-1, -1, +1];
const v5 = [+1, -1, +1];
const v6 = [-1, +1, +1];
const v7 = [+1, +1, +1];
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    ...v1, ...v0, ...v2, ...v1, ...v2, ...v3, // back
    ...v4, ...v5, ...v7, ...v4, ...v7, ...v6, // front
    ...v6, ...v7, ...v3, ...v6, ...v3, ...v2, // top
    ...v0, ...v1, ...v5, ...v0, ...v5, ...v4, // bottom
    ...v5, ...v1, ...v3, ...v5, ...v3, ...v7, // right
    ...v0, ...v4, ...v6, ...v0, ...v6, ...v2  // left
  ]),
  gl.STATIC_DRAW,
);

export function createRaymarchProgram() {
  const vs = createShader(gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl.FRAGMENT_SHADER, fragment);

  const program = createProgram(vs, fs);

  const attribLocation = gl.getAttribLocation(program, 'aPosition');
  gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
  gl.enableVertexAttribArray( attribLocation );
  gl.vertexAttribPointer(
    attribLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );
  return program;
}
