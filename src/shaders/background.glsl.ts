export default /*glsl*/ `
// from https://www.shadertoy.com/view/Ml2XDV
vec2 warp(vec2 p) {
  p *= 3.;
  float t = 0.5*uTime;

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
  float time = uBgTime;
  p.y += time;

  // produces the smooth transitions/gradients
  float c = length(warp(p)); // range [0, sqrt(2)]
  c *= sqrt(c);

  // produces the highlights
  // when bass drops make highlights brighter
  float highlight = max( 6.*pow( uAudio[0], 3. ), 1. );
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

  vec3 x = vec3(0.);
  // vec3 y = vec3(0.);
  vec3 z = vec3(0.);

  // weighting/blending factor
  vec3 w = pow( abs(rd), vec3(8.) );
  // conditionally project and fetch texture only when weights are non-zero or positive
  if (w.x > 1e-3) x = bgTex(rd.zy);
  // if (w.y > 1e-3) y = bgTex(rd.zx);
  if (w.z > 1e-3) z = bgTex(rd.xy);

  // blend projections
  return w.x*x /*+ w.y*y*/ + w.z*z;
}`;
