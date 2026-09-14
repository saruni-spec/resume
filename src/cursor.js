import { reducedMotion } from './state.js';

// The cursor leaves little messages behind. Over something clickable they
// fly into it and get "delivered"; anywhere else they float off unread.

const TARGETS = 'a, button, summary, .node, input';
const MAX_LIVE = 12;

export function initCursor() {
  if (reducedMotion || !matchMedia('(pointer: fine)').matches) return;

  let last = 0;
  let live = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const now = performance.now();
      if (now - last < 110 || live >= MAX_LIVE) return;
      last = now;
      spawn(e);
    },
    { passive: true },
  );

  function spawn(e) {
    const el = document.createElement('span');
    el.className = 'cb';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    live++;

    const x = e.clientX + 12;
    const y = e.clientY + 14;
    const target = e.target.closest?.(TARGETS);
    let frames;
    let duration;

    if (target) {
      const r = target.getBoundingClientRect();
      el.textContent = '✓✓';
      frames = [
        { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 0.95 },
        { transform: `translate(${r.left + r.width / 2}px, ${r.top + r.height / 2}px) scale(0.3)`, opacity: 0 },
      ];
      duration = 520;
      setTimeout(() => el.classList.add('delivered'), 180);
    } else {
      el.textContent = '✓';
      const drift = Math.random() * 18 - 9;
      frames = [
        { transform: `translate(${x}px, ${y}px)`, opacity: 0.7 },
        { transform: `translate(${x + drift}px, ${y - 38}px)`, opacity: 0 },
      ];
      duration = 900;
    }

    const anim = el.animate(frames, { duration, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    anim.onfinish = () => {
      el.remove();
      live--;
    };
  }
}
