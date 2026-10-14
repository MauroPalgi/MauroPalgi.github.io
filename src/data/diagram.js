import projects from '../projects';

// The canvas visitors see on load. Every node uses a generic type from
// src/canvas/nodeTypes.js, and `parent` is the node it's connected to: lines
// and positions are generated from that tree (see src/canvas/layout.js).
// List nodes in tree order: a node's children right after it.

export const initialNodes = [
  {
    id: 'me',
    type: 'profile',
    parent: null,
    title: 'Mauro Palgi',
    subtitle: 'Full Stack Developer · Montevideo, Uruguay',
    body: 'Full stack developer working on web apps, integrations and CI/CD pipelines. This portfolio is a canvas: each block is a part of my work you can open, edit or rearrange.',
  },

  {
    id: 'about',
    type: 'text',
    parent: 'me',
    title: 'About',
    subtitle: 'What I aim for',
    body: 'My objective is to deliver high-quality software by developing robust applications, improving existing systems, and implementing solutions that enhance performance and user experience.',
  },
  {
    id: 'education',
    type: 'list',
    parent: 'about',
    title: 'Education',
    subtitle: 'ORT · BIOS · UTU Maldonado',
    style: 'bullets',
    items: [
      'ORT University, Analyst Programmer (2019 – present)',
      'BIOS, Administrative Accounting Assistant (2017)',
      'UTU Maldonado, High School Degree in Computer Science (2004 – 2006)',
    ],
  },

  {
    id: 'experience',
    type: 'text',
    parent: 'me',
    title: 'Experience',
    subtitle: 'Baufest · ST Consultores · Libre Coop',
    body: 'Full stack work since 2020, from a low-code form builder to supply chain integrations and mobile CI/CD. Open each role for details.',
  },
  {
    id: 'baufest',
    type: 'list',
    parent: 'experience',
    title: 'Baufest',
    subtitle: 'Full Stack Developer · Dec 2021 – present',
    style: 'bullets',
    items: [
      'Worked on replacing the Supply Chain Manager for an American logistics client.',
      'Solved critical iOS pipeline issues (Fastlane, GitHub Actions, TestFlight), unblocking updates to an app unmaintained for two years.',
      'Partially led replacing an iOS app with a Progressive Web App built on Next.js.',
      'Built an error-handling system in Boomi, adopted across the SCM solution.',
    ],
  },
  {
    id: 'st-consultores',
    type: 'list',
    parent: 'experience',
    title: 'ST Consultores',
    subtitle: 'Web Developer · Dec 2020 – Feb 2021',
    style: 'bullets',
    items: [
      'Worked on a low-code tool that turned XML files into interactive forms, and helped migrate it from Flash to vanilla JavaScript.',
      'Implemented a virtual list in vanilla JavaScript without external libraries.',
    ],
  },
  {
    id: 'libre-coop',
    type: 'list',
    parent: 'experience',
    title: 'Libre Coop',
    subtitle: 'Junior Analyst / Full Stack Developer · Feb 2020 – present',
    style: 'bullets',
    items: [
      'Built a complete CRUD system for an association on the MERN stack.',
      'Led the project end to end, from design to implementation and client requirements.',
    ],
  },

  {
    id: 'skills',
    type: 'list',
    parent: 'me',
    title: 'Skills',
    subtitle: 'Technologies I work with',
    style: 'tags',
    items: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PWA', 'Boomi', 'GitHub Actions', 'Fastlane', 'TestFlight'],
  },
  {
    id: 'strengths',
    type: 'list',
    parent: 'skills',
    title: 'Strengths',
    subtitle: 'Beyond the code',
    style: 'tags',
    items: ['Full stack development', 'CI/CD', 'Project management', 'Problem-solving', 'Communication', 'Leadership', 'Marketing'],
  },

  {
    id: 'contact',
    type: 'link',
    parent: 'me',
    title: 'Contact',
    subtitle: 'Email and GitHub',
    links: ['mauro.palgi@gmail.com', 'https://github.com/MauroPalgi'],
  },

  {
    id: 'projects',
    type: 'text',
    parent: 'me',
    title: 'Projects',
    subtitle: `${projects.length} case studies`,
    body: 'Each project is its own block, with the problem, the tools, screenshots, code and a live demo.',
  },
  ...projects.map((project) => ({ ...project, type: 'project', parent: 'projects' })),
];
