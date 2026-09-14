import { state, setView, t, sleep, reducedMotion, esc } from './state.js';
import { PROFILE, COPY, WORK, PROJECTS } from './data.js';
import { renderGraph, renderHeatmap } from './graph.js';
import { initChat } from './chat.js';

// Every piece of copy that changes with the narrator is registered here,
// so switching modes can retype exactly those elements.
const registry = [];
const reg = (copy) => registry.push(copy) - 1;

const entry = (p) => `
  <details class="entry" id="p-${p.id}">
    <summary>
      <h3>${esc(p.title)}</h3>
      <span class="role">${esc(p.role)}<span class="sign" aria-hidden="true"></span></span>
      <p class="sum prose" data-copy="${reg(p.summary)}"></p>
    </summary>
    <div class="entry-body">
      ${p.points ? `<ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      <p class="stack">${esc(p.stack.join(', '))}</p>
      ${p.url ? `<p class="visit"><a href="${p.url}" target="_blank" rel="noopener noreferrer">Visit ${esc(p.title)}</a></p>` : ''}
      ${p.img ? `<img class="thumb" src="/${p.img}" alt="Screenshot of ${esc(p.title)}" loading="lazy" />` : ''}
    </div>
  </details>`;

const section = (id, cmd, title, body) => `
  <section class="sec" id="${id}" aria-labelledby="h-${id}">
    <p class="sec-cmd" aria-hidden="true">${cmd}</p>
    <div class="sec-body">
      ${title}
      ${body}
    </div>
  </section>`;

export function renderGui() {
  const gui = document.getElementById('gui');

  gui.innerHTML = [
    section(
      'whoami',
      'whoami',
      `<h1 class="hero-name" id="h-whoami">Moses<br />Saruni</h1>`,
      `<p class="lede prose" data-copy="${reg(COPY.whoami)}"></p>
       <p class="prose" data-copy="${reg(COPY.before)}"></p>
       <p class="links">
         <a href="#contact" data-goto="contact">Send a message</a>
         <a href="${PROFILE.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
         <a href="${PROFILE.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
       </p>`,
    ),
    section(
      'work',
      'ls work',
      `<h2 class="sec-title" id="h-work" data-copy="${reg(COPY.workTitle)}"></h2>`,
      `<div class="entries" data-xray="Work list · src/gui.js">${WORK.map(entry).join('')}</div>`,
    ),
    section(
      'projects',
      'ls projects',
      `<h2 class="sec-title" id="h-projects" data-copy="${reg(COPY.projectsTitle)}"></h2>`,
      `<div class="entries">${PROJECTS.map(entry).join('')}</div>`,
    ),
    section(
      'log',
      'git log --graph',
      `<h2 class="sec-title" id="h-log" data-copy="${reg(COPY.logTitle)}"></h2>`,
      `<div class="graph-wrap" data-xray="Branch graph · src/graph.js">
         <div class="scroll-x"><div id="graph"></div></div>
         <p class="graph-tip" id="graph-tip" aria-live="polite">Hover or tab through the commits.</p>
       </div>
       <div class="heat-wrap" data-xray="Commit heatmap · src/graph.js">
         <p class="prose heat-caption" data-copy="${reg(COPY.heatCaption)}"></p>
         <div class="scroll-x"><div id="heatmap"></div></div>
         <p class="heat-stats" id="heat-stats"></p>
       </div>`,
    ),
    section(
      'contact',
      'contact',
      `<h2 class="sec-title" id="h-contact" data-copy="${reg(COPY.contactTitle)}"></h2>`,
      `<p class="prose" data-copy="${reg(COPY.contactIntro)}"></p>
       <div id="chat"></div>`,
    ),
    `<footer class="foot">
       <p data-copy="${reg(COPY.footer)}"></p>
       <p class="dim">${PROFILE.name}, ${new Date().getFullYear()}. <a href="https://github.com/saruni-spec/resume" target="_blank" rel="noopener noreferrer">Source</a></p>
     </footer>`,
  ].join('');

  gui.querySelectorAll('[data-copy]').forEach((el) => (el.textContent = t(registry[el.dataset.copy])));

  gui.addEventListener('click', (e) => {
    const link = e.target.closest('[data-goto]');
    if (!link) return;
    e.preventDefault();
    setView('gui', { target: link.dataset.goto });
  });

  renderGraph(document.getElementById('graph'), document.getElementById('graph-tip'));
  renderHeatmap(document.getElementById('heatmap'), document.getElementById('heat-stats'));
  initChat(document.getElementById('chat'));
}

/* ---------- narrator switch: visible copy deletes and retypes itself ---------- */

async function retype(el) {
  const next = t(registry[el.dataset.copy]);
  const token = (el._retype = (el._retype || 0) + 1);
  el.classList.add('typing');

  let current = el.textContent;
  const cut = Math.max(1, Math.ceil(current.length / 22));
  while (current.length) {
    if (el._retype !== token) return;
    current = current.slice(0, -cut);
    el.textContent = current;
    await sleep(14);
  }

  const step = Math.max(1, Math.ceil(next.length / 40));
  for (let i = step; i < next.length; i += step) {
    if (el._retype !== token) return;
    el.textContent = next.slice(0, i);
    await sleep(16);
  }
  el.textContent = next;
  el.classList.remove('typing');
}

export function retypeCopy() {
  const all = document.querySelectorAll('[data-copy]');
  all.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const visible = state.view === 'gui' && rect.bottom > 0 && rect.top < window.innerHeight && el.offsetParent !== null;
    if (visible && !reducedMotion) retype(el);
    else {
      el._retype = (el._retype || 0) + 1;
      el.classList.remove('typing');
      el.textContent = t(registry[el.dataset.copy]);
    }
  });
}
