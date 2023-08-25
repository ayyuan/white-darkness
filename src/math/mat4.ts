// internally stored as Float32Array in column-major order
// create identity matrix
export function createMat4() {
  const m = new Float32Array(16);
  m[0] = 1; m[4] = 0; m[8 ] = 0; m[12] = 0;
  m[1] = 0; m[5] = 1; m[9 ] = 0; m[13] = 0;
  m[2] = 0; m[6] = 0; m[10] = 1; m[14] = 0;
  m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
  return m;
}

export function perspective(m: Float32Array, fovy: number, aspect: number, near: number, far: number) {
  const f = 1. / Math.tan(fovy / 2.);
  const nf = 1 / (near - far);
  const m10 = (far + near) * nf;
  const m14 = 2 * far * near * nf;
  m[0] = f / aspect; m[4] = 0; m[8 ] = 0;   m[12] = 0;
  m[1] = 0;          m[5] = f; m[9 ] = 0;   m[13] = 0;
  m[2] = 0;          m[6] = 0; m[10] = m10; m[14] = m14;
  m[3] = 0;          m[7] = 0; m[11] = -1;  m[15] = 0;
  return m;
}

// create view matrix
// NOTE: make sure eye and at are not the same value
// NOTE: assume up is normalized
export function lookAt(m: Float32Array, eye: number[], at: number[], up: number[]) {
  // z = normalize( eye - at ), camera looking in -z-axis
  let z0 = eye[0] - at[0];
  let z1 = eye[1] - at[1];
  let z2 = eye[2] - at[2];
  let len = 1 / Math.sqrt(z0*z0 + z1*z1 + z2*z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  // x = cross(up, z)
  let x0 = up[1]*z2 - up[2]*z1;
  let x1 = up[2]*z0 - up[0]*z2;
  let x2 = up[0]*z1 - up[1]*z0;
  // assume up is normalized so no need to normalize it

  // y = cross(z, x)
  let y0 = z1*x2 - z2*x1;
  let y1 = z2*x0 - z0*x2;
  let y2 = z0*x1 - z1*x0;

  // translation component
  let t0 = -(x0*eye[0] + x1*eye[1] + x2*eye[2]);
  let t1 = -(y0*eye[0] + y1*eye[1] + y2*eye[2]);
  let t2 = -(z0*eye[0] + z1*eye[1] + z2*eye[2]);

  m[0] = x0; m[4] = x1; m[8 ] = x2; m[12] = t0;
  m[1] = y0; m[5] = y1; m[9 ] = y2; m[13] = t1;
  m[2] = z0; m[6] = z1; m[10] = z2; m[14] = t2;
  m[3] = 0 ; m[7] = 0 ; m[11] = 0;  m[15] = 1;

  return m;
}

export function rotateX(m: Float32Array, rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  const m12 = m[4]; const m13 = m[8];
  const m22 = m[5]; const m23 = m[9];
  const m32 = m[6]; const m33 = m[10];
  const m42 = m[7]; const m43 = m[11];

  m[4] = m12*c + m13*s; m[8 ] = m13*c - m12*s;
  m[5] = m22*c + m23*s; m[9 ] = m23*c - m22*s;
  m[6] = m32*c + m33*s; m[10] = m33*c - m32*s;
  m[7] = m42*c + m43*s; m[11] = m43*c - m42*s;

  return m;
}

export function rotateY(m: Float32Array, rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  const m11 = m[0]; const m13 = m[8];
  const m21 = m[1]; const m23 = m[9];
  const m31 = m[2]; const m33 = m[10];
  const m41 = m[3]; const m43 = m[11];

  m[0] = m11*c - m13*s; m[8 ] = m11*s + m13*c;
  m[1] = m21*c - m23*s; m[9 ] = m21*s + m23*c;
  m[2] = m31*c - m33*s; m[10] = m31*s + m33*c;
  m[3] = m41*c - m43*s; m[11] = m41*s + m43*c;

  return m;
}

export function rotateZ(m: Float32Array, rad: number) {
  const c = Math.cos(rad);
  const s = Math.sin(rad);

  const m11 = m[0]; const m12 = m[4];
  const m21 = m[1]; const m22 = m[5];
  const m31 = m[2]; const m32 = m[6];
  const m41 = m[3]; const m42 = m[7];

  m[0] = m11*c + m12*s; m[4] = m12*c - m11*s;
  m[1] = m21*c + m22*s; m[5] = m22*c - m21*s;
  m[2] = m31*c + m32*s; m[6] = m32*c - m31*s;
  m[3] = m41*c + m42*s; m[7] = m42*c - m41*s;

  return m;
}

export function translate(m: Float32Array, t: number[]) {
  m[12] = m[0]*t[0] + m[4]*t[1] + m[8 ]*t[2] + m[12];
  m[13] = m[1]*t[0] + m[5]*t[1] + m[9 ]*t[2] + m[13];
  m[14] = m[2]*t[0] + m[6]*t[1] + m[10]*t[2] + m[14];
  m[15] = m[3]*t[0] + m[7]*t[1] + m[11]*t[2] + m[15];
  return m;
}
