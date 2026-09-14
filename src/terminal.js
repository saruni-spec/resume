import { state, on, setView, setMode, toggleXray, replayDeploy, sleep, t, esc, coarsePointer } from './state.js';
import { PROFILE, COPY, WORK, PROJECTS, CAREER, contactLinks, findItem } from './data.js';

const PROMPT = 'saruni@portfolio:~$';
const NAMES = [...WORK, ...PROJECTS].map((p) => p.id);
const COMMAND_NAMES = [
  'help', 'whoami', 'ls', 'cat', 'open', 'git', 'contact', 'gui', 'fool', 'wise',
  'xray', 'clear', 'deploy', 'sudo', 'find', 'date', 'pwd', 'echo', 'exit',
];

let out, input, form;
const history = [];
let historyIndex = 0;
let busy = false;

/* ---------- output helpers ---------- */

function print(html = '', cls = '') {
  const p = document.createElement('p');
  p.className = `line ${cls}`.trim();
  p.innerHTML = html || '&nbsp;';
  out.appendChild(p);
  return p;
}

/** A command name inside output that runs when clicked. */
const run = (cmd, label = cmd) => `<button type="button" class="cmd-link" data-run="${esc(cmd)}">${esc(label)}</button>`;
const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));

function keepInView() {
  if (state.view === 'term') form.scrollIntoView({ block: 'nearest' });
}

/* ---------- commands ---------- */

const commands = {
  help() {
    const rows = [
      ['whoami', 'who this is'],
      ['ls work', 'things I build at my job'],
      ['ls projects', 'things I build for myself'],
      ['cat <name>', 'read about one of them'],
      ['open <name>', 'open a live project'],
      ['git log', 'my career as a branch graph'],
      ['contact', 'send me a message'],
      ['gui', 'switch to the plain page'],
      [state.mode === 'wise' ? 'fool' : 'wise', 'change the narrator'],
      ['xray', 'show how this page is built'],
      ['clear', 'clean the screen'],
    ];
    rows.forEach(([cmd, what]) => {
      const clickable = cmd.includes('<') ? `<span class="acc">${esc(cmd)}</span>` : run(cmd);
      print(`${clickable}${' '.repeat(Math.max(1, 16 - cmd.length))}<span class="dim">${what}</span>`);
    });
  },

  whoami() {
    print(`<span class="acc big">${PROFILE.name}</span>`);
    print(`<span class="dim">${PROFILE.location}. Software engineer.</span>`);
    print();
    print(esc(t(COPY.whoami)));
    print(esc(t(COPY.before)));
    print();
    print(`Try ${run('ls work')}, ${run('git log')} or ${run('contact')}. Not a terminal person? ${run('gui')}.`);
  },

  ls(args) {
    const what = args[0]?.replace(/\/$/, '');
    if (!what) {
      print(`${run('ls work', 'work/')}  ${run('ls projects', 'projects/')}`);
      return;
    }
    const list = what === 'work' ? WORK : what === 'projects' ? PROJECTS : null;
    if (!list) {
      print(`ls: cannot access '${esc(what)}': No such directory. Try ${run('ls work')} or ${run('ls projects')}.`, 'err');
      return;
    }
    list.forEach((p) => print(`${run(`cat ${p.id}`, pad(p.id, 20))}<span>${esc(p.title)}</span>  <span class="dim">${esc(p.role)}</span>`));
  },

  cat(args) {
    const name = args[0];
    if (!name) {
      print(`cat: which one? Try ${run('ls work')}.`, 'err');
      return;
    }
    const p = findItem(name.replace(/\.md$/, ''));
    if (!p) {
      print(`cat: ${esc(name)}: No such file. Try ${run('ls work')} or ${run('ls projects')}.`, 'err');
      return;
    }
    print(`<span class="acc">${esc(p.title)}</span>  <span class="dim">${esc(p.role)}</span>`);
    print(esc(t(p.summary)));
    (p.points || []).forEach((pt) => print(`<span class="acc">-</span> ${esc(pt)}`, 'indent'));
    print(`<span class="dim">stack: ${esc(p.stack.join(', '))}</span>`);
    if (p.url) print(`live: ${run(`open ${p.id}`)}`);
  },

  open(args) {
    const p = args[0] && findItem(args[0]);
    if (!p) {
      print(`open: nothing called '${esc(args[0] || '')}'. Try ${run('ls projects')}.`, 'err');
      return;
    }
    if (!p.url) {
      print(`open: ${esc(p.id)} isn't public. ${run(`cat ${p.id}`)} tells you about it instead.`, 'err');
      return;
    }
    print(`opening <a href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(p.url)}</a>`);
    window.open(p.url, '_blank', 'noopener');
  },

  git(args) {
    if (args[0] !== 'log') {
      print(`git: try ${run('git log')}.`, 'err');
      return;
    }
    [...CAREER].reverse().forEach((b, i) => {
      const ref = b.head ? `<span class="acc">(HEAD -&gt; ${b.label})</span>` : `<span class="dim">(${b.label}, merged)</span>`;
      print(`<span class="acc">*</span> ${ref} ${esc(b.name)}, ${esc(b.role)}`);
      [...b.nodes].reverse().forEach((n) => print(`<span class="dim">|</span>   o ${esc(n.title)}`));
      if (i < CAREER.length - 1) print('<span class="dim">|</span>');
    });
    print();
    print(`The drawn version, with a commit heatmap: ${run('graph', 'open the graph')}`);
  },

  graph() {
    setView('gui', { target: 'log' });
  },

  contact() {
    print('Opening the chat. Your message goes through a pipeline first.');
    setView('gui', { target: 'contact' });
  },

  gui() {
    setView('gui');
  },

  fool() {
    if (state.mode === 'fool') {
      print('You are already the fool. Welcome back.', 'dim');
      return;
    }
    setMode('fool');
    print('The jester has the microphone now. Everything is still true, just funnier.', 'acc');
  },

  wise() {
    if (state.mode === 'wise') {
      print('Already wise. Suspiciously so.', 'dim');
      return;
    }
    setMode('wise');
    print('Back to the serious narrator.', 'acc');
  },

  xray() {
    toggleXray();
    print(state.xray ? 'X-ray on. Dashed boxes show which file draws each part. Press x or Esc to turn it off.' : 'X-ray off.', 'dim');
  },

  clear() {
    out.innerHTML = '';
  },

  deploy() {
    replayDeploy();
  },

  sudo(args) {
    if (args.join(' ') === 'hire saruni') {
      print('[sudo] password for recruiter: ********');
      print('recruiter is not in the sudoers file. This incident will be reported to Saruni.', 'err');
      print(`He would genuinely love to hear about it: ${run('contact')}`);
      return;
    }
    print(`sudo: nice try. The only sudo command here is ${run('sudo hire saruni')}.`, 'err');
  },

  find(args) {
    if (!args.join(' ').includes('saruni')) {
      print(`find: looking for someone? Try ${run('find / -name saruni')}.`, 'err');
      return;
    }
    contactLinks().forEach((l) =>
      print(`<a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${l.path}</a>  <span class="dim">${esc(l.note)}</span>`),
    );
  },

  date() {
    print(new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'short' }) + ' in Nairobi');
  },

  pwd() {
    print('/home/saruni/portfolio');
  },

  echo(args) {
    print(esc(args.join(' ')));
  },

  cd() {
    print(`cd: this is a one-room house. Try ${run('ls')}.`, 'dim');
  },

  rm() {
    print('rm: refusing. This took a while to build.', 'err');
  },

  exit() {
    print(`There is no exit, only ${run('gui')}.`, 'dim');
  },
};

commands.chat = commands.contact;
commands.term = () => print('You are already in the terminal.', 'dim');

/* ---------- running ---------- */

function execute(raw) {
  const line = raw.trim();
  print(`<span class="prompt">${PROMPT}</span> ${esc(line)}`, 'echo');
  if (!line) return keepInView();

  history.push(line);
  historyIndex = history.length;

  const [name, ...args] = line.split(/\s+/);
  const fn = commands[name.toLowerCase()];
  if (fn) fn(args);
  else print(`${esc(name)}: command not found. Type ${run('help')}, or use the buttons below.`, 'err');
  keepInView();
}

async function typeAndRun(cmd) {
  if (busy) return;
  busy = true;
  input.value = '';
  for (const ch of cmd) {
    input.value += ch;
    await sleep(45);
  }
  await sleep(160);
  input.value = '';
  execute(cmd);
  busy = false;
}

function complete() {
  const value = input.value;
  const parts = value.split(/\s+/);
  const pool = parts.length === 1 ? COMMAND_NAMES : ['cat', 'open'].includes(parts[0]) ? NAMES : parts[0] === 'ls' ? ['work', 'projects'] : [];
  const current = parts[parts.length - 1];
  const matches = pool.filter((n) => n.startsWith(current));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    input.value = parts.join(' ') + ' ';
  } else if (matches.length > 1) {
    print(`<span class="prompt">${PROMPT}</span> ${esc(value)}`, 'echo');
    print(matches.map((m) => esc(m)).join('  '), 'dim');
    keepInView();
  }
}

/* ---------- command buttons under the terminal ---------- */

function renderChips() {
  const chips = document.getElementById('term-chips');
  const list = ['whoami', 'ls work', 'ls projects', 'git log', 'contact', state.mode === 'wise' ? 'fool' : 'wise'];
  chips.innerHTML =
    list.map((c) => `<button type="button" class="chip" data-run="${c}">${c}</button>`).join('') +
    `<button type="button" class="chip chip-gui" data-run="gui">Not a terminal person? Open the plain page</button>`;
}

export function focusTerminal() {
  if (!coarsePointer && input) input.focus({ preventScroll: true });
}

export function initTerminal() {
  out = document.getElementById('term-out');
  input = document.getElementById('term-in');
  form = document.getElementById('term-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    const value = input.value;
    input.value = '';
    execute(value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || '';
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    }
  });

  const term = document.getElementById('term');
  term.addEventListener('click', (e) => {
    const target = e.target.closest('[data-run]');
    if (target) {
      typeAndRun(target.dataset.run);
      return;
    }
    if (!e.target.closest('a') && !window.getSelection()?.toString()) focusTerminal();
  });

  renderChips();
  on('mode', renderChips);

  on('ready', async () => {
    if (state.view === 'term') {
      focusTerminal();
      await sleep(250);
      await typeAndRun('whoami');
      print();
      print(`Type ${run('help')}, press Tab to complete, or use the buttons below.`, 'dim');
      keepInView();
    } else {
      execute('whoami');
    }
  });
}
