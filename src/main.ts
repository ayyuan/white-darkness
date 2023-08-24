import './style.css';
import render from './render';

function update() {
  render();
  requestAnimationFrame(update);
}

requestAnimationFrame(update)
