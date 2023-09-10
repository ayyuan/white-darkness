export default /*glsl*/ `
vec3 vignette( vec3 c ) {
  vec2 q = gl_FragCoord.xy / uResolution;
  // vignetting from iq https://www.shadertoy.com/view/MsXGWr
  c *= 0.1 + 0.9*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.6 );
  q.x = 2.*q.x - 1.; // remap from [0,1] to [-1,1]
  // making the left and right sides darker
  c *= vec3( pow( 1.1-q.x*q.x, .5 ) );
  return c;
}
`;
