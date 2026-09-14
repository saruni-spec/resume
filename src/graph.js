import { esc } from './state.js';
import { CAREER } from './data.js';
import { COMMITS } from './commits.js';

const SVG = 'http://www.w3.org/2000/svg';

/* ---------- career as a git branch graph ---------- */

// Branches are laid out in order rather than to scale: 2024 alone held three of
// them, and a true time axis tangled them into a knot. Ticks mark real years.
const SPANS = {
  university: [0, 0.24],
  mutall: [0.27, 0.41],
  statspeak: [0.44, 0.69],
  chatnation: [0.73, 0.92],
};
const TICKS = [
  [0, '2019'],
  [0.27, '2024'],
  [0.73, '2025'],
  [0.92, 'now'],
];

export function renderGraph(mount, tip) {
  const W = 880;
  const left = 12;
  const right = 60;
  const inner = W - left - right;
  const laneGap = 40;
  const top = 36;
  const H = top + laneGap * CAREER.length + 44;

  const x = (fraction) => left + fraction * inner;
  const mainY = top;

  let body = '';

  // main: the line everything branches from and merges back into
  body += `<path class="lane" d="M${x(0)} ${mainY} H${x(1)}" style="stroke:var(--ink-dim)" />`;
  body += `<text x="${x(0)}" y="${mainY - 12}">main</text>`;

  CAREER.forEach((b, i) => {
    const y = top + laneGap * (i + 1);
    const [from, to] = SPANS[b.id];
    const xs = x(from);
    const xe = x(to);
    const bend = 16;
    let d = `M${xs} ${mainY} C${xs + bend} ${mainY} ${xs} ${y} ${xs + bend} ${y} H${b.head ? xe : xe - bend}`;
    if (!b.head) d += ` C${xe} ${y} ${xe - bend} ${mainY} ${xe} ${mainY}`;
    body += `<g style="color:${b.color}">`;
    body += `<path class="lane" d="${d}" style="stroke:currentColor" />`;
    body += `<text class="lane-label" x="${xs + bend + 4}" y="${y - 10}">${b.label}</text>`;

    const span = xe - xs - bend * 2 - 12;
    b.nodes.forEach((n, j) => {
      const nx = xs + bend + 12 + (b.nodes.length === 1 ? span / 2 : (span * j) / (b.nodes.length - 1));
      body += `<g class="node" tabindex="0" role="button" data-i="${i}" data-j="${j}" aria-label="${esc(n.title)}, ${esc(b.name)}">
        <circle cx="${nx}" cy="${y}" r="6" /></g>`;
    });

    if (b.head) {
      body += `<g class="head"><rect x="${xe + 8}" y="${y - 10}" width="44" height="20" rx="3" />
        <text x="${xe + 30}" y="${y + 4}" text-anchor="middle">HEAD</text></g>`;
    }
    body += `</g>`;
  });

  TICKS.forEach(([fraction, label]) => {
    body += `<text class="axis" x="${x(fraction)}" y="${H - 10}">${label}</text>`;
  });

  mount.innerHTML = `<svg class="graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Career drawn as a git branch graph">${body}</svg>`;

  const show = (el) => {
    const b = CAREER[el.dataset.i];
    const n = b.nodes[el.dataset.j];
    const [start, end] = [Math.floor(b.from), Math.floor(b.to)];
    const years = b.head ? `${start} to now` : start === end ? `${start}` : `${start} to ${end}`;
    tip.innerHTML = `<strong>${esc(n.title)}</strong><br /><span class="dim">${esc(b.name)}, ${esc(b.role)}, ${years}</span>${
      n.ref ? ` <a href="#p-${n.ref}" data-open="${n.ref}">Read more</a>` : ''
    }`;
  };

  mount.addEventListener('pointerover', (e) => {
    const node = e.target.closest('.node');
    if (node) show(node);
  });
  mount.addEventListener('focusin', (e) => {
    const node = e.target.closest('.node');
    if (node) show(node);
  });
  mount.addEventListener('keydown', (e) => {
    const node = e.target.closest('.node');
    if (node && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      show(node);
      tip.querySelector('a')?.focus();
    }
  });

  tip.addEventListener('click', (e) => {
    const link = e.target.closest('[data-open]');
    if (!link) return;
    e.preventDefault();
    const details = document.getElementById(`p-${link.dataset.open}`);
    details.open = true;
    details.scrollIntoView({ behavior: 'smooth', block: 'center' });
    details.querySelector('summary').focus({ preventScroll: true });
  });
}

/* ---------- commit heatmap from real git history ---------- */

const DAY = 86400000;
const iso = (d) => d.toISOString().slice(0, 10);

export function renderHeatmap(mount, stats) {
  const dates = Object.keys(COMMITS).sort();
  if (!dates.length) return;

  const start = new Date(`${dates[0]}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7)); // back to Monday
  const end = new Date(`${dates[dates.length - 1]}T00:00:00Z`);

  const cell = 12;
  const gap = 3;
  const leftPad = 30;
  const topPad = 18;
  const weeks = Math.ceil((end - start) / DAY / 7) + 1;
  const W = leftPad + weeks * (cell + gap);
  const H = topPad + 7 * (cell + gap);

  const level = (n) => (n === 0 ? 0 : n < 4 ? 1 : n < 10 ? 2 : n < 20 ? 3 : 4);
  let rects = '';
  let lastMonth = -1;
  let total = 0;
  let active = 0;
  let best = { n: 0, date: '' };

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const day = new Date(start.getTime() + (w * 7 + d) * DAY);
      if (day > end) break;
      const key = iso(day);
      const n = COMMITS[key] || 0;
      total += n;
      if (n) active++;
      if (n > best.n) best = { n, date: key };
      if (d === 0 && day.getUTCMonth() !== lastMonth) {
        lastMonth = day.getUTCMonth();
        rects += `<text x="${leftPad + w * (cell + gap)}" y="11">${day.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })}</text>`;
      }
      rects += `<rect class="h${level(n)}" x="${leftPad + w * (cell + gap)}" y="${topPad + d * (cell + gap)}" width="${cell}" height="${cell}" rx="2"><title>${n} commit${n === 1 ? '' : 's'} on ${key}</title></rect>`;
    }
  }
  ['Mon', 'Wed', 'Fri'].forEach((label, i) => {
    rects += `<text x="0" y="${topPad + (i * 2) * (cell + gap) + 10}">${label}</text>`;
  });

  mount.innerHTML = `<svg class="heat" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${total} commits over ${active} active days">${rects}</svg>`;

  const bestDate = new Date(`${best.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  stats.textContent = `${total.toLocaleString('en-GB')} commits over ${active} days. Busiest day: ${best.n} commits on ${bestDate}.`;
}
