import { FBO } from './draw/postprocessing/createFBO';
import resizeFBO from './draw/postprocessing/resizeFBO';
import gl from './gl';

export default class Settings {

  dpr = 1;
  private readonly fbo: FBO;

  constructor(fbo: FBO) {
    this.fbo = fbo;
    this.resize();

    const low = document.getElementById('low')!;
    const med = document.getElementById('medium')!;
    const hig = document.getElementById('high')!;

    med.classList.add('selected');

    low.addEventListener('click', () => {
      med.classList.remove('selected');
      hig.classList.remove('selected');
      low.classList.add('selected');
      this.dpr = 0.8;
      this.resize();
    });
    med.addEventListener('click', () => {
      low.classList.remove('selected');
      hig.classList.remove('selected');
      med.classList.add('selected');
      this.dpr = 1;
      this.resize();
    });
    hig.addEventListener('click', () => {
      low.classList.remove('selected');
      med.classList.remove('selected');
      hig.classList.add('selected');
      this.dpr = window.devicePixelRatio;
      this.resize();
    });
  }

  private resize() {
    // set canvas & fbo size
    const w = Math.floor( window.innerWidth * this.dpr );
    const h = Math.floor( window.innerHeight * this.dpr );
    gl.canvas.width = w;
    gl.canvas.height = h;
    resizeFBO(this.fbo, w, h);
    gl.viewport(0, 0, w, h);
  }
}
