import AudioData from './AudioData';
import Spherical from './math/Spherical';
import clamp from './math/clamp';
import { createMat4, lookAt, perspective } from './math/mat4';

export default class OrbitCamera {

  readonly position: [number, number, number];
  private readonly target: [number, number, number];
  readonly projectionMatrix: Float32Array;
  readonly viewMatrix: Float32Array;

  private isRotating = false;
  private start = [0, 0];
  private delta = [0, 0];

  // settings
  private readonly rotationSense;
  private readonly maxPolar;
  private readonly minPolar;
  private readonly dampingFactor;
  private readonly maxShake;

  private static readonly MAX_POLAR = Math.PI - 1e-6;
  private static readonly MIN_POLAR = 1e-6;

  constructor({
    position,
    target,
    near = 0.1,
    far = 1000,
    fovy = Math.PI / 3, // 60 deg
    rotationSense = 1,
    maxPolar = OrbitCamera.MAX_POLAR, // max vertical angle
    minPolar = OrbitCamera.MIN_POLAR, // min vertical angle
    dampingFactor = 0.05,
    maxShake = 0.7,
  } : {
    position: [number, number, number],
    target: [number, number, number],
    near?: number,
    far?: number,
    fovy?: number,
    rotationSense?: number,
    maxPolar?: number,
    minPolar?: number,
    dampingFactor?: number,
    maxShake?: number,
  }) {
    this.position = position;
    this.target = target;
    this.projectionMatrix = perspective(createMat4(), fovy, window.innerWidth / window.innerHeight, near, far);
    this.viewMatrix = lookAt(createMat4(), position, target, [0,1,0]);

    this.rotationSense = rotationSense;
    this.maxPolar = clamp(maxPolar, OrbitCamera.MIN_POLAR, OrbitCamera.MAX_POLAR);
    this.minPolar = clamp(minPolar, OrbitCamera.MIN_POLAR, OrbitCamera.MAX_POLAR);
    this.dampingFactor = dampingFactor;
    this.maxShake = maxShake;

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    canvas.classList.add('cursor-grab');

    addEventListener('resize', () => {
      perspective(this.projectionMatrix, fovy, window.innerWidth / window.innerHeight, near, far);
    });
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

  update(time: number, audio: AudioData) {
    if ( Math.abs(this.delta[0]) < 1e-3 && Math.abs(this.delta[1]) < 1e-3 ) {
      this.delta[0] = this.delta[1] = 0;
      if (audio.shake < 1e-6) return;
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

    // changing up vector to simulate camera roll
    const an = audio.shake * 0.05 * Math.cos(23 * time);
    const up = [Math.sin(an), Math.cos(an), 0];
    // changing target to simulate camera shake/tilt
    const target = [
      this.target[0] + audio.shake * this.maxShake * Math.sin(17 * time),
      this.target[1] + audio.shake * this.maxShake * Math.sin(31 * time),
      this.target[2] + audio.shake * this.maxShake * Math.sin(37 * time),
    ];
    // update viewMatrix
    lookAt(this.viewMatrix, this.position, target, up);
  }
}
