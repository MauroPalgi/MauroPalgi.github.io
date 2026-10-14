// Every block on the canvas. To ship a new project, add a block here and
// connect it with an entry in `edges`.
//
// `pos` is the block's top-left corner on wide screens, `mobilePos` on narrow
// ones. Units are canvas pixels; see BLOCK_W / BLOCK_H in src/canvas/layout.js.

export const blocks = [
  {
    id: 'me',
    kind: 'profile',
    title: 'Mauro Palgi',
    subtitle: 'Full Stack Developer · Montevideo, Uruguay',
    pos: { x: 440, y: 240 },
    mobilePos: { x: 130, y: 0 },
    content: (
      <>
        <p>
          Full stack developer working on web apps, integrations and CI/CD
          pipelines. This portfolio is a canvas: each block is a part of my
          work you can open.
        </p>
        <p>Drag to move around, pinch or scroll to zoom, tap a block to open it.</p>
      </>
    ),
  },
  {
    id: 'about',
    kind: 'text',
    title: 'About',
    subtitle: 'Objective and education',
    pos: { x: 0, y: 80 },
    mobilePos: { x: 0, y: 180 },
    content: (
      <>
        <p>
          My objective is to deliver high-quality software by developing robust
          applications, improving existing systems, and implementing solutions
          that enhance performance and user experience.
        </p>
        <h3>Education</h3>
        <ul>
          <li><strong>ORT University</strong>, Analyst Programmer (2019 – present)</li>
          <li><strong>BIOS</strong>, Administrative Accounting Assistant (2017)</li>
          <li><strong>UTU Maldonado</strong>, High School Degree in Computer Science (2004 – 2006)</li>
        </ul>
      </>
    ),
  },
  {
    id: 'experience',
    kind: 'list',
    title: 'Experience',
    subtitle: 'Baufest · Libre Coop · ST Consultores',
    pos: { x: 880, y: 80 },
    mobilePos: { x: 260, y: 180 },
    content: (
      <>
        <h3>Baufest · Full Stack Developer</h3>
        <p className="muted">December 2021 – present</p>
        <ul>
          <li>Worked on replacing the Supply Chain Manager for an American logistics client.</li>
          <li>Solved critical iOS pipeline issues (Fastlane, GitHub Actions, TestFlight), unblocking updates to an app unmaintained for two years.</li>
          <li>Partially led replacing an iOS app with a Progressive Web App built on Next.js.</li>
          <li>Built an error-handling system in Boomi, adopted across the SCM solution.</li>
        </ul>
        <h3>Libre Coop · Junior Analyst / Full Stack Developer</h3>
        <p className="muted">February 2020 – present</p>
        <ul>
          <li>Built a complete CRUD system for an association on the MERN stack.</li>
          <li>Led the project end to end, from design to implementation and client requirements.</li>
        </ul>
        <h3>ST Consultores · Web Developer</h3>
        <p className="muted">December 2020 – February 2021</p>
        <ul>
          <li>Worked on a low-code tool that turned XML files into interactive forms, and helped migrate it from Flash to vanilla JavaScript.</li>
          <li>Implemented a virtual list in vanilla JavaScript without external libraries.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'skills',
    kind: 'list',
    title: 'Skills',
    subtitle: 'Full stack, CI/CD, leadership',
    pos: { x: 0, y: 400 },
    mobilePos: { x: 0, y: 360 },
    content: (
      <>
        <h3>Technologies</h3>
        <ul className="tags">
          {['JavaScript', 'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PWA', 'Boomi', 'GitHub Actions', 'Fastlane', 'TestFlight'].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h3>Strengths</h3>
        <ul className="tags">
          {['Full stack development', 'CI/CD', 'Project management', 'Problem-solving', 'Communication', 'Leadership', 'Marketing'].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'contact',
    kind: 'link',
    title: 'Contact',
    subtitle: 'Email and GitHub',
    pos: { x: 880, y: 400 },
    mobilePos: { x: 260, y: 360 },
    content: (
      <ul className="links">
        <li><a href="mailto:mauro.palgi@gmail.com">mauro.palgi@gmail.com</a></li>
        <li><a href="https://github.com/MauroPalgi" target="_blank" rel="noopener noreferrer">github.com/MauroPalgi</a></li>
      </ul>
    ),
  },
  {
    id: 'projects',
    kind: 'collection',
    title: 'Projects',
    subtitle: 'Case studies coming soon',
    placeholder: true,
    pos: { x: 440, y: 480 },
    mobilePos: { x: 130, y: 540 },
    content: (
      <p>
        Finished projects will appear here as their own blocks, each with the
        problem, the tools, screenshots, code and a live demo.
      </p>
    ),
  },
];

export const edges = [
  ['me', 'about'],
  ['me', 'experience'],
  ['about', 'skills'],
  ['experience', 'contact'],
  ['me', 'projects'],
];
