import gl from '../../gl';
import createProgram from '../../gl/createProgram';
import createShader from '../../gl/createShader';
import linearTosRGB from '../../shaders/linearTosRGB.glsl';
import boxPositionBuffer from '../boxPositionBuffer';

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
  vDirection = worldPos.xyz - uCameraPos;
  gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}
`;

const fragment =
/* glsl */ `#version 300 es

precision highp float;

in vec3 vDirection;

out vec4 outColor;


// from https://www.shadertoy.com/view/Ml2XDV
vec2 warp(vec2 p) {
  p *= 3.;
  //TODO:
  float t = 0.;

  // planar sine distortion.
  for (int i=0; i<3; i++) {
    p += cos(p.yx*3. + vec2(t, 1.57))/3.;
    p += cos(p.yx + vec2(0, -1.57) + t)/2.;
    p *= 0.8;
  }

  // domain repetition
  float rep = 2.;
  return mod(p, rep) - 0.5*rep;
}

// generating 2d background to project it onto skydome
vec3 bgTex(vec2 p) {
  // animate to make texture flow down
  //TODO:
  float time = 0.;//texelFetch(iChannel1, ivec2(1,0), 0).y;
  p.y += time;

  // produces the smooth transitions/gradients
  float c = length(warp(p)); // range [0, sqrt(2)]
  c *= sqrt(c);

  // produces the highlights
  // when bass drops make highlights brighter
  //TODO:
  float highlight = 1.; //max( 6.*pow( freqs[0], 3. ), 1. );
  // lighting via directional derivative approximation
  float d = max( c - length( warp(p + vec2(0.01)) ), 0. )*highlight;
  d *= d*d*0.1; // ramp up to accentuate contrast

  c *= 0.01*c*c; // also ramp up
  return vec3(c + d);
}

// projecting 2d background onto skydome via triplanar mapping
vec3 background(vec3 rd) {
  // TRIPLANAR MAPPING
  // except no projections along y-axis since we wont ever see them

  vec3 x = vec3(0);
  // vec3 y = vec3(0);
  vec3 z = vec3(0);

  // weighting/blending factor
  vec3 w = pow( abs(rd), vec3(8.) );
  // conditionally project and fetch texture only when weights are non-zero or positive
  if (w.x > 1e-3) x = bgTex(rd.zy);
  // if (w.y > 1e-3) y = bgTex(rd.zx);
  if (w.z > 1e-3) z = bgTex(rd.xy);

  // blend projections
  return w.x*x /*+ w.y*y*/ + w.z*z;
}

${linearTosRGB}

void main() {
  vec3 rd = normalize(vDirection);
  vec3 c = background(rd);
  outColor = vec4(c, 1.);
  outColor = linearTosRGB(outColor);
}
`;

export default function createSkyboxProgram() {
  const vs = createShader(gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl.FRAGMENT_SHADER, fragment);

  const program = createProgram(vs, fs);

  const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
  gl.bindBuffer( gl.ARRAY_BUFFER, boxPositionBuffer );
  gl.enableVertexAttribArray( aPositionLoc );
  gl.vertexAttribPointer(
    aPositionLoc,
    3,
    gl.FLOAT,
    false,
    0,
    0,
  );

  return program;
}
