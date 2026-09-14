// Shared state and a tiny event bus. Every module talks through here so
// none of them import each other in a circle.

const KEY = 'saruni.prefs';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ view: state.view, mode: state.mode }));
  } catch {
    /* private window or blocked storage: preferences just won't stick */
  }
}

const saved = load();
const narrow = matchMedia('(max-width: 700px)').matches;

// ?view=gui and ?mode=fool win over saved preferences, so a link can open
// straight onto the plain page (handy to send a recruiter) or the fool.
const params = new URLSearchParams(location.search);
const pick = (value, options) => (options.includes(value) ? value : null);

export const state = {
  // Phones start on the plain page; typing commands on a phone keyboard is a chore.
  view: pick(params.get('view'), ['gui', 'term']) || pick(saved.view, ['gui', 'term']) || (narrow ? 'gui' : 'term'),
  mode: pick(params.get('mode'), ['wise', 'fool']) || (saved.mode === 'fool' ? 'fool' : 'wise'),
  xray: false,
};

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarsePointer = matchMedia('(pointer: coarse)').matches;

export function emit(type, detail = {}) {
  document.dispatchEvent(new CustomEvent('site', { detail: { type, ...detail } }));
}

export function on(type, fn) {
  document.addEventListener('site', (e) => {
    if (e.detail.type === type) fn(e.detail);
  });
}

export function onAny(fn) {
  document.addEventListener('site', (e) => fn(e.detail));
}

/** Switch view. `target` is a section id to scroll to in the plain page. */
export function setView(view, opts = {}) {
  if (view !== state.view) {
    state.view = view;
    save();
  }
  emit('view', { view, ...opts });
}

export function setMode(mode) {
  if (mode === state.mode) return;
  state.mode = mode;
  save();
  emit('mode', { mode });
}

export function toggleXray(force) {
  state.xray = typeof force === 'boolean' ? force : !state.xray;
  emit('xray', { on: state.xray });
}

export function replayDeploy() {
  emit('deploy');
}

/** Pick the right narrator's copy. Plain strings are the same in both modes. */
export const t = (copy) => (typeof copy === 'string' ? copy : copy[state.mode]);

export const sleep = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? Math.min(ms, 20) : ms));

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
