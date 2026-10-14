// Copy this folder to src/projects/<project-id>/, fill it in, and register it
// in src/projects/index.js. It becomes a `project` node on the canvas (see
// src/canvas/nodeTypes.js). Put screenshots and GIFs next to this file and
// import them, e.g. `import demoGif from './demo.gif';`.
//
// Sections left empty are hidden. While `status` is 'draft' the panel shows a
// "case study in progress" note.

const project = {
  id: 'project-id',
  title: 'Project title',
  subtitle: 'One line shown on the canvas block',
  status: 'draft', // 'draft' | 'published'

  // Repos the case study is based on. For your reference only, never shown.
  sourceRepos: [],

  // What problem does it solve, and for whom? Blank line between paragraphs.
  problem: '',

  // Languages, frameworks, services.
  tools: [],

  // Screenshots / GIFs: { src, alt, caption? }
  media: [],

  // Public repo URLs. Only add public repos.
  code: [],

  // Optional short snippet worth showing off: { language, text }
  snippet: null,

  // Live demo URL.
  demo: '',
};

export default project;
