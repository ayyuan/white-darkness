import './style.css';
import render from './render';

let lastTime: number | undefined;
function update(now: number) {
  // NOTE: delta for 1st tick will be 0
  if (!lastTime) lastTime = now;
  const delta = now - lastTime;
  lastTime = now;

  render(delta);
  requestAnimationFrame(update);
}

requestAnimationFrame(update)
