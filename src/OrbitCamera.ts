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
  private readonly rotationSense;
  private readonly maxPolar;
  private readonly minPolar;
  private readonly dampingFactor;

  private static readonly MAX_POLAR = Math.PI - 1e-6;
  private static readonly MIN_POLAR = 1e-6;

  constructor({
    position,
    target,
    up,
    rotationSense = 1,
    maxPolar = OrbitCamera.MAX_POLAR, // max vertical angle
    minPolar = OrbitCamera.MIN_POLAR, // min vertical angle
    dampingFactor = 0.05,
  } : {
    position: [number, number, number],
    target: [number, number, number],
    up: [number, number, number],
    rotationSense?: number,
    maxPolar?: number,
    minPolar?: number,
    dampingFactor?: number,
  }) {
    this.position = position;
    this.target = target;
    this.up = up;
    this.viewMatrix = lookAt(createMat4(), position, target, up);

    this.rotationSense = rotationSense;
    this.maxPolar = clamp(maxPolar, OrbitCamera.MIN_POLAR, OrbitCamera.MAX_POLAR);
    this.minPolar = clamp(minPolar, OrbitCamera.MIN_POLAR, OrbitCamera.MAX_POLAR);
    this.dampingFactor = dampingFactor;

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    canvas.classList.add('cursor-grab');

    addEventListener('pointerdown', (ev) => {
      this.start = [ev.clientX, ev.clientY];
      this.isRotating = true;
      canvas.classList.add('cursor-grabbing');
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
      canvas.classList.remove('cursor-grabbing');
    });
  }

  update() {
    if ( Math.abs(this.delta[0]) < 1e-3 && Math.abs(this.delta[1]) < 1e-3 ) {
      this.delta[0] = this.delta[1] = 0;
      return;
    }

    const spherical = Spherical.fromVec3(this.position);
    spherical.theta -= this.delta[0] * this.rotationSense * this.dampingFactor;
    spherical.phi   -= this.delta[1] * this.rotationSense * this.dampingFactor;
    spherical.phi = clamp(spherical.phi, this.minPolar, this.maxPolar);

    this.delta[0] *= 1 - this.dampingFactor;
    this.delta[1] *= 1 - this.dampingFactor;

    const pos = spherical.toVec3();
    this.position[0] = pos[0];
    this.position[1] = pos[1];
    this.position[2] = pos[2];

    // update viewMatrix
    lookAt(this.viewMatrix, this.position, this.target, this.up);
  }
}
