import OrbitCamera from './OrbitCamera';

export default class AudioData {

  private readonly context: AudioContext;
  private readonly analyser: AnalyserNode;
  private readonly freqArray: Uint8Array;
  readonly dataArray: Float32Array;
  private isPlaying: boolean;
  time: number;
  shake: number;

  private static readonly SIZE = 512;

  constructor(audioElem: HTMLAudioElement, camera: OrbitCamera) {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = AudioData.SIZE * 2;
    this.freqArray = new Uint8Array(AudioData.SIZE);
    this.dataArray = new Float32Array(3);
    this.isPlaying = false;
    this.time = 0;
    this.shake = 0;

    const track = this.context.createMediaElementSource(audioElem);
    track.connect(this.analyser).connect(this.context.destination);

    const ui = document.getElementById('ui')!;
    const controls = document.getElementById('controls')!;
    controls.addEventListener('click', () => {
      const time = 1e-3 * performance.now();
      const dur = 0.5;

      if (!this.isPlaying) {
        // play song
        if (this.context.state === 'suspended') {
          this.context.resume();
        }
        audioElem.play();
        // transitions/animations
        ui.classList.remove('play');
        camera.transition(time, dur, {
          start: 5,
          end: 0,
        }, {
          start: 50,
          end: 40,
        });
      } else {
        // pause song
        audioElem.pause();
        // transitions/animations
        ui.classList.add('play');
        camera.transition(time, dur, {
          start: 0,
          end: 5,
        }, {
          start: 40,
          end: 50,
        });
      }
      this.isPlaying = !this.isPlaying;
    });
  }

  update(delta: number) {
    if (!this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.freqArray);

    // bass
    this.dataArray[0] = this.getAvgAmpBet(20, 400) / 255;
    // mid
    this.dataArray[1] = this.getAvgAmpBet(400, 2600) / 255;
    // treble
    this.dataArray[2] = this.getAvgAmpBet(5200, 14000) / 255;

    this.time += delta * Math.max( Math.pow(this.dataArray[0], 10.), 0.1 );
    this.shake = Math.min( 1, Math.exp( 50*this.dataArray[0] - 47.5 ) );
  }

  private getAvgAmpBet(f1: number, f2: number) {
    const nyquist = this.context.sampleRate / 2;
    const delta = nyquist / this.analyser.frequencyBinCount;

    const bin1 = Math.floor(f1 / delta);
    const bin2 = Math.floor(f2 / delta);

    let total = 0;
    for (let i = bin1; i <= bin2; i++) {
      total += this.freqArray[i];
    }

    const numFrequencies = bin2 - bin1 + 1;
    return total / numFrequencies;
  }
}
