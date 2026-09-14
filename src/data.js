// Everything the site says lives here. Copy with { wise, fool } changes with the narrator.

export const PROFILE = {
  name: 'Moses Saruni',
  location: 'Nairobi, Kenya',
  email: 'sarunimaina@gmail.com',
  phone: '254745050238',
  github: 'https://github.com/saruni-spec',
  linkedin: 'https://www.linkedin.com/in/moses-saruni-ba6653234',
};

export const COPY = {
  whoami: {
    wise: "I design and build conversation systems: WhatsApp platforms, AI agents, and the web apps around them. I work at ChatNation in Nairobi, where the platform I designed runs the Kenya Revenue Authority's WhatsApp service.",
    fool: "I teach telephones to hold conversations, then teach the conversations to find the right person. Kenya's taxman now chats with people on WhatsApp, and somewhere in that chat is my handwriting.",
  },
  before: {
    wise: 'Before that, at Statspeak, I shipped WhatsApp apps for a bank, a fish trader, farmers and county health officials. I also write, with some irony, at The Wise Fool.',
    fool: 'Before that I built chatbots for a bank, a fish market, some satellites and a county health office. Not all at once, although the fish would have liked that.',
  },
  workTitle: { wise: 'Work at ChatNation', fool: 'Things I do for money' },
  projectsTitle: { wise: 'Things I build for myself', fool: 'Things I do instead of sleeping' },
  logTitle: { wise: 'Career', fool: 'How I got here, roughly' },
  contactTitle: { wise: 'Send a message', fool: 'Say something to the robots' },
  contactIntro: {
    wise: 'Your message goes through the same kind of pipeline I build for a living. Watch the log on the right.',
    fool: 'My robots are very excited to help you. Mostly. Watch them try.',
  },
  chatWelcome: {
    wise: 'Hi. Type anything. A pipeline reads it before any human does.',
    fool: 'Welcome, traveller. Speak, and the machines shall listen. The human is optional.',
  },
  heatCaption: {
    wise: 'Commits across the ChatNation and side-project repos, one square per day.',
    fool: 'Proof that I do, in fact, go to work.',
  },
  footer: {
    wise: 'Built with plain JavaScript and Vite. Press x to see how.',
    fool: 'Held together with plain JavaScript and optimism. Press x to look inside.',
  },
};

export const WORK = [
  {
    id: 'whatsapp-platform',
    title: 'WhatsApp Business Platform',
    role: 'Designed and built',
    stack: ['NestJS', 'Fastify', 'Next.js', 'PostgreSQL', 'Redis', 'BullMQ', 'Kubernetes'],
    summary: {
      wise: 'A multi-tenant platform where organisations run customer conversations, campaigns and AI agents on WhatsApp. It powers the KRA WhatsApp service.',
      fool: "A switchboard for a whole country's worth of \"hello?\". Bots answer first. Humans take over when the bots start sweating.",
    },
    points: [
      'AI agent that answers from a knowledge base, learns from resolved conversations, and understands images and voice notes.',
      'Agent inbox and handover from bots to people, with assignment, escalation and AI reply suggestions.',
      'Visual Flow Builder for WhatsApp journeys, plus templates and scheduled campaigns.',
      'Conversation QA that scores finished chats with an LLM, and PII masking for data sent to AI models.',
      'Architecture: an API and background workers on PostgreSQL, Redis and BullMQ for queues and locks, every message processed once, tenants isolated with row-level security.',
    ],
  },
  {
    id: 'kra-tax',
    title: 'KRA WhatsApp Tax Services',
    role: 'Built',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind'],
    summary: {
      wise: 'Web views that open inside WhatsApp, so taxpayers can file returns, register PINs, pay, and issue eTIMS invoices without leaving the chat.',
      fool: 'Filing your taxes, in the same app where your aunt sends good-morning roses.',
    },
    points: [
      'Tax returns: NIL, Turnover Tax, rental income and individual income tax.',
      'PIN registration, tax compliance certificates, and payments (PRN, eSlip, NITA, Housing Levy).',
      'eTIMS invoicing for non-VAT taxpayers, including credit notes and buyer-initiated invoices.',
      'Checkers for PINs, TCCs, invoices, import certificates, KRA staff and tax stations.',
    ],
  },
  {
    id: 'esg',
    title: 'ESG Intelligence and Reporting Platform',
    role: 'Architecture and design',
    stack: ['PostgreSQL + pgvector', 'NestJS', 'Next.js', 'BullMQ'],
    summary: {
      wise: 'The architecture for an AI platform where organisations keep ESG data and documents, ask questions of it, and generate reports.',
      fool: "Drew the blueprints for a machine that reads a company's conscience and writes it up as a report. Someone else is holding the hammer.",
    },
    points: [
      'A data model and module plan that lets the MVP grow into the full product without rewrites.',
      'An AI layer that works with any model provider and searches documents by meaning.',
    ],
  },
  {
    id: 'gra-poc',
    title: 'Ghana Revenue Authority proof of concept',
    role: 'Built',
    stack: ['Express', 'Prisma', 'PostgreSQL', 'Gemini', 'Puppeteer', 'Next.js'],
    summary: {
      wise: 'WhatsApp bookkeeping for informal businesses. Send a text or voice note, confirm what the AI understood, and turnover tax is worked out for you.',
      fool: "A tailor in Madina says \"sold three shirts\" into his phone. Accounting happens. Nobody opens a spreadsheet.",
    },
    points: [
      'Voice notes transcribed and sorted into income and expenses, confirmed by the user before saving.',
      'Turnover tax calculation, a scraper that finds businesses in public map listings, and an admin dashboard.',
    ],
  },
];

export const PROJECTS = [
  {
    id: 'ai-gateway',
    title: 'AI Gateway Platform',
    role: 'In progress',
    stack: ['NestJS', 'Nx'],
    summary: {
      wise: 'One gateway in front of many AI model providers, handling routing, tool calls, PII protection and cost tracking.',
      fool: 'A bouncer for language models. Checks IDs, confiscates personal data, sends the bill.',
    },
  },
  {
    id: 'media-platform',
    title: 'Media Platform',
    role: 'In progress',
    stack: ['NestJS', 'BullMQ', 'MinIO', 'Kubernetes'],
    summary: {
      wise: "A shared service that uploads, stores and processes files, so other apps don't each build their own.",
      fool: 'Every app wanted its own attic. I built one big attic with a very strict librarian.',
    },
  },
  {
    id: 'nuria',
    title: 'Nuria',
    role: 'Live',
    url: 'https://nuria.web.app/',
    img: 'nuria.png',
    stack: ['React', 'Firebase'],
    summary: {
      wise: 'An online store for second-hand school uniforms.',
      fool: 'Uniforms that already survived one child, looking for another.',
    },
  },
  {
    id: 'wise-fool',
    title: 'The Wise Fool',
    role: 'Live',
    url: 'https://wisefool.xyz',
    img: 'fool.png',
    stack: ['Python', 'Flask', 'SQLite'],
    summary: {
      wise: 'My blog on philosophy, psychology and science, written with some humour and irony.',
      fool: 'Where I say serious things in a silly hat. You are currently wearing the hat.',
    },
  },
  {
    id: 'kickoff',
    title: 'Kick Off Challenge',
    role: 'Live',
    url: 'https://kickoff-challenge-football.web.app/',
    img: 'kickoff.png',
    stack: ['Next.js'],
    summary: {
      wise: 'Head-to-head football fixture stats, with each team’s form over time.',
      fool: 'Settles pub arguments with charts.',
    },
  },
  {
    id: 'brian-tech',
    title: 'Brian Technologies',
    role: 'Live',
    url: 'https://briantech.web.app/',
    img: 'brian.png',
    stack: ['HTML', 'CSS', 'JavaScript'],
    summary: {
      wise: 'A product catalogue site for Brian Technologies.',
      fool: 'A shop window that never needs dusting.',
    },
  },
];

// Branches for the career graph. Years are decimal so they can be placed on an axis;
// only whole years are ever shown as labels.
export const NOW = 2026.72;
export const CAREER = [
  {
    id: 'university',
    label: 'university',
    name: 'Kenyatta University',
    role: 'BSc Computer Science',
    from: 2019.1,
    to: 2024.3,
    color: 'var(--tick)',
    nodes: [
      { title: 'Started a BSc in Computer Science' },
      { title: 'Graduated' },
    ],
  },
  {
    id: 'mutall',
    label: 'mutall',
    name: 'Mutall Data Management',
    role: 'Web developer intern',
    from: 2024.36,
    to: 2024.8,
    color: 'var(--err)',
    nodes: [
      { title: 'Form and grid layout libraries' },
      { title: 'Server data browser for developers' },
      { title: 'Dairy management system with M-Pesa payments' },
    ],
  },
  {
    id: 'statspeak',
    label: 'statspeak',
    name: 'Statspeak',
    role: 'Software developer',
    from: 2024.5,
    to: 2025.8,
    color: 'var(--ink)',
    nodes: [
      { title: 'Salary advance on WhatsApp, connected to KCB Bank' },
      { title: 'AI B2B fish trading platform' },
      { title: 'Farm mapping with satellite imagery' },
      { title: 'WhatsApp AI data analyst for primary health care' },
      { title: 'Chronic care assistant on WhatsApp' },
    ],
  },
  {
    id: 'chatnation',
    label: 'chatnation',
    name: 'ChatNation',
    role: 'Software developer',
    from: 2025.85,
    to: NOW,
    head: true,
    color: 'var(--accent)',
    nodes: [
      { title: 'KRA WhatsApp tax services', ref: 'kra-tax' },
      { title: 'Ghana Revenue Authority proof of concept', ref: 'gra-poc' },
      { title: 'WhatsApp Business Platform', ref: 'whatsapp-platform' },
      { title: 'ESG platform architecture', ref: 'esg' },
    ],
  },
];

const SUBJECTS = {
  hiring: 'A role you might like',
  freelance: 'A project for you',
  collab: "Let's build something",
  feedback: 'About your portfolio',
};

/** Contact links with the visitor's message carried along, so nothing they typed is lost. */
export function contactLinks(message = '', intent = '') {
  const text = message.trim() || 'Hi Saruni, I found you through your portfolio.';
  const subject = SUBJECTS[intent] || 'Hello from your portfolio';
  return [
    {
      path: '/whatsapp/saruni',
      note: 'opens WhatsApp with your message already typed',
      href: `https://wa.me/${PROFILE.phone}?text=${encodeURIComponent(text)}`,
    },
    {
      path: '/mail/saruni',
      note: 'opens an email draft with your message',
      href: `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
    },
    { path: '/linkedin/saruni', note: 'LinkedIn', href: PROFILE.linkedin },
    { path: '/github/saruni', note: 'GitHub', href: PROFILE.github },
  ];
}

export const findItem = (id) => [...WORK, ...PROJECTS].find((p) => p.id === id);
