import { state, on, onAny, setView, setMode, toggleXray, reducedMotion, sleep, emit, esc } from './state.js';
import { initTerminal, focusTerminal } from './terminal.js';
import { renderGui, retypeCopy } from './gui.js';
import { initCursor } from './cursor.js';

const root = document.documentElement;
const status = document.getElementById('status');

/* ---------- status bar: the site's real navigation ---------- */

function buildStatus() {
  status.innerHTML = `
    <span class="sess">[saruni]</span>
    <button type="button" data-act="term">0:term</button>
    <button type="button" data-act="gui">1:gui</button>
    <span class="spacer"></span>
    <button type="button" data-act="mode" title="Change the narrator (f)"></button>
    <button type="button" data-act="xray" title="Show how this page is built (x)">x-ray</button>
    <span class="clock" aria-label="Time in Nairobi"></span>`;

  status.addEventListener('click', (e) => {
    const act = e.target.closest('button')?.dataset.act;
    if (act === 'term' || act === 'gui') setView(act);
    if (act === 'mode') setMode(state.mode === 'wise' ? 'fool' : 'wise');
    if (act === 'xray') toggleXray();
  });

  const clock = status.querySelector('.clock');
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
  const tick = () => (clock.textContent = `${fmt.format(new Date())} EAT`);
  tick();
  setInterval(tick, 15000);
  syncStatus();
}

function syncStatus() {
  const pressed = { term: state.view === 'term', gui: state.view === 'gui', mode: state.mode === 'fool', xray: state.xray };
  status.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(pressed[b.dataset.act])));
  status.querySelector('[data-act="mode"]').textContent = `${state.mode} mode`;
}

/* ---------- views ---------- */

function applyView({ view, target }) {
  root.dataset.view = view;
  syncStatus();
  const pane = document.getElementById(view === 'term' ? 'term' : 'gui');
  if (!reducedMotion) {
    pane.classList.remove('view-enter');
    void pane.offsetWidth;
    pane.classList.add('view-enter');
  }
  requestAnimationFrame(() => {
    if (view === 'term') {
      window.scrollTo(0, document.body.scrollHeight);
      focusTerminal();
      return;
    }
    const section = target && document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      const field = target === 'contact' && section.querySelector('input');
      if (field) field.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      pane.focus({ preventScroll: true });
    }
  });
}

/* ---------- deploy intro ---------- */

const DEPLOY = [
  ['$ vite build', 260],
  ['  ✓ 7 modules transformed, 0 frameworks harmed', 220],
  ['$ docker build -t saruni/portfolio:2026 .', 260],
  ['  => [2/5] COPY experience/ ./                      1.9s', 160],
  ['  => [3/5] RUN npm install curiosity               0.7s', 160],
  ['  => [4/5] RUN make coffee                          3.1s', 240],
  ['$ kubectl apply -f saruni.yaml', 240],
  ['  deployment.apps/saruni configured', 120],
  ['  service/saruni-contact configured', 200],
  ['$ kubectl rollout status deploy/saruni', 260],
  ['  waiting for 1 of 1 replicas... the human replica is making tea', 520],
  ['  deployment "saruni" successfully rolled out', 220],
  ['health  /whoami 200   /work 200   /contact 200*', 300],
  ['live at saruni-portfolio.netlify.app', 200],
  ['* mostly', 400],
];

let deploying = false;
async function runDeploy() {
  if (deploying) return;
  deploying = true;
  const box = document.getElementById('deploy');
  const pre = box.querySelector('pre');
  pre.textContent = '';
  box.hidden = false;
  box.classList.remove('done');

  let skipped = false;
  const skip = () => (skipped = true);
  window.addEventListener('keydown', skip, { once: true });
  box.addEventListener('pointerdown', skip, { once: true });

  for (const [text, ms] of DEPLOY) {
    if (skipped) break;
    pre.textContent += text + '\n';
    await sleep(ms);
  }
  if (skipped) pre.textContent = DEPLOY.map(([text]) => text).join('\n');

  window.removeEventListener('keydown', skip);
  await sleep(skipped ? 120 : 350);
  box.classList.add('done');
  await sleep(400);
  box.hidden = true;
  deploying = false;
  if (state.view === 'term') focusTerminal();
}

/* ---------- x-ray ---------- */

const xrayLog = document.getElementById('xray-log');
const events = [];

function xlog(text) {
  if (!state.xray) return;
  const time = new Date().toLocaleTimeString('en-GB');
  events.unshift(`${time}  ${text}`);
  events.length = Math.min(events.length, 9);
  renderXrayLog();
}

function renderXrayLog() {
  xrayLog.innerHTML =
    `<p class="xl-head">Live events</p>` +
    `<p class="xl-sub">Modules: main, state, terminal, gui, graph, chat, cursor. Dashed boxes show which file draws what.</p>` +
    (events.length ? events.map((e) => `<p>${esc(e)}</p>`).join('') : '<p class="xl-sub">Click, type or scroll.</p>');
}

function describe(el) {
  if (!el || el === document) return 'document';
  const id = el.id ? `#${el.id}` : '';
  const cls = typeof el.className === 'string' && el.className ? `.${el.className.split(' ')[0]}` : '';
  return `${el.tagName.toLowerCase()}${id}${cls}`;
}

function initXray() {
  document.addEventListener('keydown', (e) => {
    const typing = e.target.matches?.('input, textarea');
    xlog(`keydown ${typing ? '(in a text field)' : e.key}`);
  });
  document.addEventListener('click', (e) => xlog(`click ${describe(e.target)}`));
  let last = 0;
  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      if (now - last > 400) {
        last = now;
        xlog(`scroll y=${Math.round(window.scrollY)}`);
      }
    },
    { passive: true },
  );
  onAny((d) => xlog(`site:${d.type}${d.view ? ` ${d.view}` : ''}${d.mode ? ` ${d.mode}` : ''}`));
}

/* ---------- keyboard shortcuts ---------- */

function initKeys() {
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.matches?.('input, textarea')) return;
    if (e.key === 'x') toggleXray();
    else if (e.key === 'f') setMode(state.mode === 'wise' ? 'fool' : 'wise');
    else if (e.key === 'Escape' && state.xray) toggleXray(false);
  });
}

/* ---------- boot ---------- */

async function boot() {
  root.dataset.mode = state.mode;
  root.dataset.view = state.view;

  renderGui();
  buildStatus();
  initTerminal();
  initCursor();
  initXray();
  initKeys();

  on('view', applyView);
  on('mode', ({ mode }) => {
    root.dataset.mode = mode;
    syncStatus();
    retypeCopy();
  });
  on('xray', ({ on: isOn }) => {
    root.classList.toggle('xray', isOn);
    xrayLog.hidden = !isOn;
    syncStatus();
    if (isOn) renderXrayLog();
  });
  on('deploy', runDeploy);

  document.getElementById('skip').addEventListener('click', (e) => {
    e.preventDefault();
    setView('gui');
  });

  let firstVisit = true;
  try {
    firstVisit = !sessionStorage.getItem('saruni.deployed');
    sessionStorage.setItem('saruni.deployed', '1');
  } catch {
    /* storage blocked: show the intro every time, which is harmless */
  }
  if (firstVisit && !reducedMotion) await runDeploy();

  emit('ready');
}

boot();
