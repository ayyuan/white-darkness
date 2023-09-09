export default /*glsl*/ `
void vignette( inout vec3 c ) {
  vec2 q = gl_FragCoord.xy / uResolution;
  c *= 0.4 + 0.6*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.2 );
  q.x = 2.*q.x - 1.;
  c *= vec3( pow( 1.-q.x*q.x, .5 ) );
}
`;
