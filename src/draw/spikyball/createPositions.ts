// create voxel sphere of radius size+1 centered at origin (0,0,0)
export default function createPositions(size: number) {
  const offset = size - 1;
  const stride = 2;
  const res = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k < size; k++) {
        const x = stride * i - offset;
        const y = stride * j - offset;
        const z = stride * k - offset;
        const r = Math.sqrt( x*x + y*y + z*z );
        if (r > size + 1) continue;
        res.push(x, y, z);
      }
    }
  }

  return res;
}
