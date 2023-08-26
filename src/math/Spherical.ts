import clamp from './clamp';

export default class Spherical {

  radius: number;
  phi: number;   // polar/vertical angle
  theta: number; // azimuth/horizontal angle

  constructor( radius=1, phi=0, theta=0 ) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
  }

  toVec3(): [number, number, number] {
    const x = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.radius * Math.cos(this.phi);
    const z = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    return [x, y, z];
  }

  // NOTE: assume radius is never 0, ie (0,0,0) is invalid
  static fromVec3(v: [number, number, number]) {
    const x = v[0];
    const y = v[1];
    const z = v[2];

    const r = Math.sqrt(x*x + y*y + z*z);
    const t = Math.atan2(x, z);
    const p = Math.acos( clamp(y/r, -1, 1) );

    return new Spherical(r, p, t);
  }
}
