import { t, sleep, esc, on } from './state.js';
import { COPY, contactLinks } from './data.js';

// A pipeline that runs entirely in the browser: it really dedupes and
// classifies what the visitor typed, then fails at the one step a static
// site can't do, which is handing the message to a human.

const INTENTS = {
  hiring: ['hire', 'hiring', 'job', 'role', 'position', 'recruit', 'recruiter', 'interview', 'salary', 'cv', 'resume', 'opportunity', 'vacancy', 'offer', 'team', 'company', 'engineer', 'developer'],
  freelance: ['project', 'build', 'website', 'site', 'app', 'quote', 'budget', 'price', 'cost', 'client', 'freelance', 'contract', 'bot', 'chatbot', 'whatsapp', 'system', 'need'],
  collab: ['collab', 'collaborate', 'together', 'idea', 'startup', 'partner', 'cofounder', 'co-founder', 'open source', 'side project'],
  hello: ['hi', 'hello', 'hey', 'sup', 'habari', 'niaje', 'yo', 'morning', 'evening', 'mambo'],
  feedback: ['love', 'cool', 'nice', 'great', 'awesome', 'portfolio', 'design', 'bug', 'broken', 'wow', 'amazing'],
  testing: ['test', 'testing', 'asdf', 'lol', '123', 'qwerty', 'hmm'],
};

const JESTER_LINES = {
  hiring: 'Good news: the pipeline understood you want to hire him. Bad news: the human part of the stack does not run on webhooks.',
  freelance: 'Your project was classified perfectly. The engineer who would build it is, sadly, not an API.',
  collab: 'Collaboration detected. Collaborator not detected.',
  hello: 'Hello received, logged, deduped and routed. The human it was routed to is somewhere in Nairobi, not in this browser.',
  feedback: 'Your kind words reached every service except the one with feelings.',
  testing: 'Test passed. The human failed.',
  small_talk: 'The robots enjoyed that. The human was not available to enjoy it with them.',
};

function classify(text) {
  const lower = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ')} `;
  const scores = Object.entries(INTENTS)
    .map(([intent, words]) => [intent, words.filter((w) => lower.includes(` ${w} `)).length])
    .sort((a, b) => b[1] - a[1]);
  const [[top, topScore], [second, secondScore]] = scores;
  if (!topScore) return { intent: 'small_talk', confidence: 0.41 };
  const confidence = Math.min(0.97, 0.62 + topScore * 0.11 - secondScore * 0.07);
  return { intent: top, confidence, runnerUp: secondScore ? second : null };
}

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

const JESTER = `<svg class="jester" viewBox="0 0 48 44" aria-hidden="true">
  <path d="M6 36 L11 10 L24 28 L37 10 L42 36 Z" fill="var(--err)" />
  <path d="M24 28 L18 6 L30 6 Z" fill="var(--accent)" />
  <rect x="5" y="35" width="38" height="6" rx="2" fill="var(--accent)" />
  <circle cx="11" cy="9" r="3.5" fill="var(--tick)" /><circle cx="24" cy="5" r="3.5" fill="var(--tick)" /><circle cx="37" cy="9" r="3.5" fill="var(--tick)" />
</svg>`;

export function initChat(mount) {
  mount.className = 'chat';
  mount.setAttribute('data-xray', 'Contact pipeline · src/chat.js');
  mount.innerHTML = `
    <div class="chat-thread">
      <div class="chat-head"><span>Saruni's pipeline</span><span class="dim">online (the bots are)</span></div>
      <div class="msgs" id="msgs" aria-live="polite"></div>
      <form class="chat-form" id="chat-form" autocomplete="off">
        <label class="sr-only" for="chat-in">Your message</label>
        <input id="chat-in" maxlength="500" placeholder="Type a message" />
        <button type="submit">Send</button>
      </form>
    </div>
    <div class="trace" data-xray="Pipeline log · src/chat.js">
      <div class="chat-head"><span>Pipeline log</span><span class="dim">what happens to your message</span></div>
      <div class="trace-out" id="trace"><p class="dim">Waiting for a message.</p></div>
    </div>`;

  const msgs = mount.querySelector('#msgs');
  const trace = mount.querySelector('#trace');
  const form = mount.querySelector('#chat-form');
  const field = mount.querySelector('#chat-in');
  const seen = new Set();
  let busy = false;

  const time = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });

  function bubble(dir, html, meta = '') {
    const b = document.createElement('div');
    b.className = `bubble ${dir}`;
    b.innerHTML = `<div class="bubble-text">${html}</div>${meta ? `<span class="meta">${meta}</span>` : ''}`;
    msgs.appendChild(b);
    msgs.scrollTop = msgs.scrollHeight;
    return b;
  }

  function log(step, text, cls = '') {
    if (trace.querySelector('.dim:only-child')) trace.innerHTML = '';
    const row = document.createElement('p');
    row.className = `t ${cls}`.trim();
    row.innerHTML = `<span class="t-step">${esc(step)}</span><span class="t-text">${text}</span>`;
    trace.appendChild(row);
    trace.scrollTop = trace.scrollHeight;
    return row.querySelector('.t-text');
  }

  const welcome = bubble('in', esc(t(COPY.chatWelcome)), time());
  on('mode', () => (welcome.querySelector('.bubble-text').textContent = t(COPY.chatWelcome)));

  async function handle(text) {
    busy = true;
    form.querySelector('button').disabled = true;

    const out = bubble('out', esc(text), `${time()} <span class="ticks" aria-label="sent">✓</span>`);
    const ticks = out.querySelector('.ticks');

    log('webhook', 'POST /webhook 200, tenant: visitor');
    await sleep(380);

    const hash = fnv1a(text.trim().toLowerCase());
    if (seen.has(hash)) {
      log('dedupe', `${hash} seen before, skipped`, 'err');
      log('note', 'Same message twice. Like the real platform, this pipeline only answers once.', 'dim');
      busy = false;
      form.querySelector('button').disabled = false;
      return;
    }
    seen.add(hash);
    log('dedupe', `${hash} new`);
    ticks.textContent = '✓✓';
    ticks.setAttribute('aria-label', 'delivered, not read');
    await sleep(420);

    const { intent, confidence, runnerUp } = classify(text);
    log('intent', `<span class="acc">${intent}</span> ${confidence.toFixed(2)}${runnerUp ? ` <span class="dim">(runner-up: ${runnerUp})</span>` : ''}`);
    await sleep(420);

    log('route', 'flow: portfolio, next step: hand over to a human');
    await sleep(300);

    const typing = bubble('in typing-bubble', '<span class="dots" aria-label="Saruni is typing"><i></i><i></i><i></i></span>');
    const handover = log('handover', 'looking for a human');
    for (let i = 0; i < 4; i++) {
      await sleep(360);
      handover.textContent = `looking for a human${'.'.repeat(i + 1)}`;
    }
    typing.remove();
    handover.innerHTML = '<span class="err">404 human not found</span>';
    log('error', 'Saruni is a human, not a microservice.', 'err');
    await sleep(350);

    bubble(
      'in jester-bubble',
      `${JESTER}<div><strong>Oops. Saruni is a human, not a microservice.</strong><br />${esc(JESTER_LINES[intent])} You'll have to go and find him.</div>`,
      time(),
    );
    await sleep(700);

    const finder = bubble('in finder', '<code class="find-cmd"></code><div class="found"></div>');
    const cmd = finder.querySelector('.find-cmd');
    for (const ch of '$ find / -name saruni') {
      cmd.textContent += ch;
      await sleep(38);
    }
    await sleep(350);
    const found = finder.querySelector('.found');
    contactLinks(text, intent).forEach((l) => {
      const row = document.createElement('p');
      row.innerHTML = `<a href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${l.path}</a><span class="dim">${esc(l.note)}</span>`;
      found.appendChild(row);
    });
    msgs.scrollTop = msgs.scrollHeight;
    log('done', 'Your message is waiting in the links on the left. Nothing you typed was lost.', 'ok');

    busy = false;
    form.querySelector('button').disabled = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = field.value.trim();
    if (!text || busy) return;
    field.value = '';
    handle(text);
  });
}
