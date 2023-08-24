import gl from '../gl';
import createBuffer from './createBuffer';
import createProgram from './createProgram';
import createShader from './createShader';

const vertex =
/* glsl */ `#version 300 es

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

in vec4 aPosition;

out vec3 vPosition;

void main() {
  vec4 mvPos = uModelViewMatrix * aPosition;
  vPosition = mvPos.xyz;
  gl_Position = uProjectionMatrix * mvPos;
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
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -0.5, -0.5, -0.5, // v0
    +0.5, -0.5, -0.5, // v1
    -0.5, +0.5, -0.5, // v2
    +0.5, +0.5, -0.5, // v3
    -0.5, -0.5, +0.5, // v4
    +0.5, -0.5, +0.5, // v5
    -0.5, +0.5, +0.5, // v6
    +0.5, +0.5, +0.5, // v7
  ]),
  gl.STATIC_DRAW
);

const indexBuffer = createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint8Array([
      1, 0, 2, 1, 2, 3, // back
      4, 5, 7, 4, 7, 6, // front
      6, 7, 3, 6, 3, 2, // top
      0, 1, 5, 0, 5, 4, // bottom
      5, 1, 3, 5, 3, 7, // right
      0, 4, 6, 0, 6, 2  // left
  ]),
  gl.STATIC_DRAW
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
