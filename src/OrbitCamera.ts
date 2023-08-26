import Spherical from './math/Spherical';
import clamp from './math/clamp';
import { createMat4, lookAt } from './math/mat4';

export default class OrbitCamera {

  private readonly position: [number, number, number];
  private readonly target: [number, number, number];
  private readonly up: [number, number, number];
  readonly viewMatrix: Float32Array;

  private isRotating = false;
  private start = [0, 0];
  private delta = [0, 0];

  // settings
  private readonly rotationSpeed;
  private readonly maxPolar;
  private readonly minPolar;

  private static readonly MAX_POLAR = Math.PI - 1e-6;
  private static readonly MIN_POLAR = 1e-6;

  constructor({
    position,
    target,
    up,
    rotationSpeed = 1,
    maxPolar = OrbitCamera.MAX_POLAR, // max vertical angle
    minPolar = OrbitCamera.MIN_POLAR, // min vertical angle
  } : {
    position: [number, number, number],
    target: [number, number, number],
    up: [number, number, number],
    rotationSpeed?: number,
    maxPolar?: number,
    minPolar?: number,
  }) {
    this.position = position;
    this.target = target;
    this.up = up;
    this.viewMatrix = lookAt(createMat4(), position, target, up);

    this.rotationSpeed = rotationSpeed;
    this.maxPolar = clamp(maxPolar, OrbitCamera.MIN_POLAR, OrbitCamera.MAX_POLAR);
    this.minPolar = clamp(minPolar, OrbitCamera.MIN_POLAR, OrbitCamera.MAX_POLAR);

    addEventListener('pointerdown', (ev) => {
      this.start = [ev.clientX, ev.clientY];
      this.isRotating = true;
    });
    addEventListener('pointermove', (ev) => {
      if (!this.isRotating) return;

      const delta = [ev.clientX - this.start[0], ev.clientY - this.start[1]];
      const theta = 2 * Math.PI * delta[0] / window.innerWidth;
      const phi   = 2 * Math.PI * delta[1] / window.innerHeight;
      this.delta[0] += theta;
      this.delta[1] += phi;
      this.start = [ev.clientX, ev.clientY];
    });
    addEventListener('pointerup', () => {
      this.isRotating = false;
    });
  }

  update() {
    if (!this.isRotating) return;

    const spherical = Spherical.fromVec3(this.position);
    spherical.theta -= this.delta[0] * this.rotationSpeed;
    spherical.phi   -= this.delta[1] * this.rotationSpeed;
    spherical.phi = clamp(spherical.phi, this.minPolar, this.maxPolar);

    const pos = spherical.toVec3();
    this.position[0] = pos[0];
    this.position[1] = pos[1];
    this.position[2] = pos[2];

    // update viewMatrix
    lookAt(this.viewMatrix, this.position, this.target, this.up);

    this.delta = [0, 0];
  }
}
