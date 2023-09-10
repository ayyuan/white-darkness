export default /*glsl*/ `
// taken from iq's https://www.shadertoy.com/view/lllXz4
// p - normal vector
// returns vec2(x, y)
// x - unique id of cell
// y - distance to center of cell
vec2 inverseSF( vec3 p ) {
  const float kTau = 6.28318530718;
  const float kPhi = (1.0+sqrt(5.0))/2.0;
  const float kNum = 35.0; // controls spike count

  float k  = max(2.0, floor(log2(kNum*kTau*0.5*sqrt(5.0)*(1.0-p.z*p.z))/log2(kPhi+1.0)));
  float Fk = pow(kPhi, k)/sqrt(5.0);
  vec2  F  = vec2(round(Fk), round(Fk*kPhi)); // |Fk|, |Fk+1|

  vec2  ka = 2.0*F/kNum;
  vec2  kb = kTau*(fract((F+1.0)*kPhi)-(kPhi-1.0));

  mat2 iB = mat2( ka.y, -ka.x, kb.y, -kb.x ) / (ka.y*kb.x - ka.x*kb.y);
  vec2 c = floor(iB*vec2(atan(p.y,p.x),p.z-1.0+1.0/kNum));

  float d = 8.0;
  float j = 0.0;
  for( int s=0; s<4; s++ )
  {
    vec2  uv = vec2(s&1,s>>1);
    float id = clamp(dot(F, uv+c),0.0,kNum-1.0); // all quantities are integers

    float phi      = kTau*fract(id*kPhi);
    float cosTheta = 1.0 - (2.0*id+1.0)/kNum;
    float sinTheta = sqrt(1.0-cosTheta*cosTheta);

    vec3 q = vec3( cos(phi)*sinTheta, sin(phi)*sinTheta, cosTheta );
    float tmp = dot(q-p, q-p);
    if( tmp<d )
    {
      d = tmp;
      j = id;
    }
  }
  return vec2( j, sqrt(d) );
}

// https://iquilezles.org/articles/smin/
float smin( float a, float b, float k ) {
  float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
  return mix( b, a, h ) - k*h*(1.0-h);
}

float smax(float a,float b,float k) {
  return -smin(-a,-b,k);
}

// https://www.shadertoy.com/view/4djSRW
float hash11(float p) {
  p = fract(p * .1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

// SDF of our scene centered at (0,0,0)
float map(vec3 p) {
  vec2 sf = inverseSF( normalize(p) );
  // frequency contribution depending on id
  float f = 0.;
  float id = hash11( sf.x );
  f += uAudio[0] * clamp( 1.0 - abs(id-0.25)/0.30, 0.0, 1.0 ) * 1.;
  f += uAudio[1] * clamp( 1.0 - abs(id-0.50)/0.25, 0.0, 1.0 ) * (1.0 - f);
  f += uAudio[2] * clamp( 1.0 - abs(id-0.75)/0.25, 0.0, 1.0 ) * (1.0 - f);
  // ramp up
  f = pow( clamp( f, 0.0, 1.0 ), 2.0 );

  // ball
  const float r = 0.8;
  float ball = length(p) - r;

  // spikes
  // more negative -> shorter length & thinner
  float spikeLength = -10. + 9.*f;
  float spikes = sf.y - 0.4 * exp( spikeLength*dot(p,p) ) + 0.4*exp(-999.*f);

  // mask, gives extrusion effect
  float mask = length(p) - max(2.31*f, r+0.02);

  float res = smin(ball, spikes, 0.5);
  res = smax(res, mask, 0.2);

  return res;
}`;
