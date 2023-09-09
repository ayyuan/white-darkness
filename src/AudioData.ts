export default class AudioData {

  private readonly context: AudioContext;
  private readonly element: HTMLAudioElement;
  private readonly analyser: AnalyserNode;
  private readonly freqArray: Uint8Array;
  readonly dataArray: Float32Array;
  private isPlaying: boolean;
  time: number;
  shake: number;

  private static readonly SIZE = 512;

  constructor(audioElem: HTMLAudioElement) {
    this.element = audioElem;
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = AudioData.SIZE * 2;
    this.freqArray = new Uint8Array(AudioData.SIZE);
    this.dataArray = new Float32Array(3);
    this.isPlaying = false;
    this.time = 0;
    this.shake = 0;

    const track = this.context.createMediaElementSource(this.element);
    track.connect(this.analyser).connect(this.context.destination);

    this.element.addEventListener('play', () => {
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      this.isPlaying = true;
    });
    this.element.addEventListener('pause', () => {
      this.isPlaying = false;
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
    this.shake = Math.min( 1, Math.exp( 50*this.dataArray[0] - 48 ) );
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
