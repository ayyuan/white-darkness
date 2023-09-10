import gl from '../../gl';
import createProgram from '../../gl/createProgram';
import createShader from '../../gl/createShader';
import backgroundGlsl from '../../shaders/background.glsl';
import ditherGlsl from '../../shaders/dither.glsl';
import linearTosRGBGlsl from '../../shaders/linearTosRGB.glsl';
import sdfGlsl from '../../shaders/sdf.glsl';
import vignetteGlsl from '../../shaders/vignette.glsl';

// #defines
const SHOW_BOUNDING_VOLUME = 0;
const SHOW_FULL_BOUNDING_VOLUME = 0;
const ROTATE = 1;

const vertex =
/* glsl */ `#version 300 es

#define SHOW_FULL_BOUNDING_VOLUME ${SHOW_FULL_BOUNDING_VOLUME}
#define ROTATE ${ROTATE}

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform float[3] uAudio;
uniform float uSize;
uniform vec3 uCameraPos;

in vec3 aPosition;
in vec3 aInstancePosition;

out vec3 vPosition;
out vec3 vP;
out vec3 vOrigin;
out vec3 vDirection;

${sdfGlsl}

void main() {
  vP = aPosition;

  const float scale = 2.31;

  // world pos of current vertex
  vec3 wp = aPosition + aInstancePosition;
  vPosition = wp;
  // ray direction
  vDirection = normalize(wp - uCameraPos);
  // ray origin but scaled to [-scale,scale]
  vOrigin = scale * (wp / uSize);

  // world pos of current voxel but scaled to [-scale,scale]
  vec3 p = scale * (aInstancePosition / uSize);

#if !SHOW_FULL_BOUNDING_VOLUME
  if ( map(p) > 0.26 ) {
    // cull/discard voxel if too far from sdf=0 isosurface
    gl_Position = vec4(0.);
  } else {
#endif
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(wp, 1.);
#if !SHOW_FULL_BOUNDING_VOLUME
  }
#endif
}
`;

const fragment =
/* glsl */ `#version 300 es

#define SHOW_BOUNDING_VOLUME ${SHOW_BOUNDING_VOLUME}
#define SHOW_FULL_BOUNDING_VOLUME ${SHOW_FULL_BOUNDING_VOLUME}
#define ROTATE ${ROTATE}

precision highp float;

uniform mat4 uModelMatrix;
uniform float[3] uAudio;
uniform float uTime;
uniform float uBgTime;
uniform sampler2D uBluenoise;
uniform vec2 uResolution;

out vec4 outColor;

in vec3 vPosition;
in vec3 vP;
in vec3 vOrigin;
in vec3 vDirection;

${sdfGlsl}
${backgroundGlsl}
${linearTosRGBGlsl}
${vignetteGlsl}
${ditherGlsl}

// iteration based shading
float shade(float i) {
  return i * 0.0015;
}

float glow(float g) {
  return 0.3 * pow(g, 1.5);
}

void main() {
#if SHOW_FULL_BOUNDING_VOLUME
  vec3 n = normalize( cross(dFdx(vPosition), dFdy(vPosition)) );
  n = 0.5*n + 0.5;
  float pMin = min(vP.x, min(vP.y, vP.z));
  float pMax = max(vP.x, max(vP.y, vP.z));
  n *= smoothstep(-1., -0.9, pMin) + smoothstep(1., 0.9, pMax);
  outColor = vec4(n, 1.);
  return;
#endif

  vec3 col = vec3(0.);
  vec3 rd = normalize(vDirection); // ray direction
  float g = 0.; // accumulate glow

  const float maxT = 4.;

  // dither with bluenoise to prevent banding since we are doing iteration based shading
  ivec2 size = textureSize(uBluenoise, 0) - 1;
  vec4 bn = texelFetch( uBluenoise, ivec2(gl_FragCoord.xy-0.5)&size, 0 );

  // closest point on ray to origin
  float distToOrigin = length( cross(rd, vec3(0.) - vOrigin) );

  float tOffset = distToOrigin > 0.4 ? 0.01*bn.x : 0.3*bn.x;
  float t = tOffset;
  float i = 0.;
  for (; i<60.; i+=1.) {
    float d = map(vOrigin + rd*t);

    t += log(0.7*d + 1.);
    g += 0.0001 / (0.0001 + d*d);

    if ( abs(d) < 0.01 || t > maxT ) break;
    if (shade(i) > 0.99 || glow(g) > 0.99) break;
  }

  if (t > maxT) {
    // missed
#if SHOW_BOUNDING_VOLUME
    vec3 n = normalize( cross(dFdx(vPosition), dFdy(vPosition)) );
    n = 0.5*n + 0.5;
    float pMin = min(vP.x, min(vP.y, vP.z));
    float pMax = max(vP.x, max(vP.y, vP.z));
    n *= smoothstep(-1., -0.9, pMin) + smoothstep(1., 0.9, pMax);
    col = n;
#else
    float gg = glow(g);
    col = background(rd) + gg;
#endif
  } else {
    // hit
    col = vec3( shade(i) );
  }

  col = vignette(col);
  outColor = vec4(col, 1.);
  // dithering to smooth out bands from glow curve
  outColor = linearTosRGB(outColor) + dither();
}
`;

export default function createSpikyBallProgram() {
  const vs = createShader(gl.VERTEX_SHADER, vertex);
  const fs = createShader(gl.FRAGMENT_SHADER, fragment);
  return createProgram(vs, fs);
}
