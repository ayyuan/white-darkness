export default /*glsl*/ `
// https://www.shadertoy.com/view/4djSRW
vec2 hash23(vec3 p3) {
  p3 = fract(p3 * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx+33.33);
  return fract((p3.xx+p3.yz)*p3.zy);
}

// needed to prevent color banding issues
float dither() {
  return (dot(hash23(vec3(gl_FragCoord.xy, uTime)), vec2(1.)) - 0.5) / 255.;
}
`;
