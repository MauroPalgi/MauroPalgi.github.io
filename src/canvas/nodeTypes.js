import CaseStudy from '../projects/CaseStudy';
import { clean, linkFor } from './content';

// Every node on the canvas has a `type` from this registry. A type defines:
// - `label`: shown on the block and in the palette
// - `palette`: whether visitors can add it from the Nodes panel
// - `defaults`: config for a freshly dropped node
// - `fields`: what the edit form shows (besides title, subtitle and parent)
// - `render(node)`: the panel content; the PDF export reuses it
//
// Field inputs: 'text' (string), 'textarea' (string), 'lines' (array, one
// item per line), 'csv' (array, comma separated), 'select' (string).
// Arrays keep raw input while editing; use `clean()` when rendering.

const paragraphs = (body = '') =>
  body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p, i) => <p key={i}>{p}</p>);

function Links({ items }) {
  return (
    <ul className="links">
      {clean(items).map((raw) => {
        const link = linkFor(raw);
        return (
          <li key={raw}>
            {link ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a> : raw}
          </li>
        );
      })}
    </ul>
  );
}

const nodeTypes = {
  profile: {
    label: 'profile',
    palette: false,
    defaults: { body: '' },
    fields: [{ name: 'body', label: 'Introduction', input: 'textarea' }],
    render: (node) => paragraphs(node.body),
  },

  text: {
    label: 'text',
    palette: true,
    defaults: { title: 'Text', subtitle: 'A paragraph or two', body: '' },
    fields: [{ name: 'body', label: 'Text', input: 'textarea', hint: 'Leave a blank line between paragraphs.' }],
    render: (node) => paragraphs(node.body),
  },

  list: {
    label: 'list',
    palette: true,
    defaults: { title: 'List', subtitle: 'Bullet points or tags', items: [], style: 'bullets' },
    fields: [
      { name: 'items', label: 'Items', input: 'lines', hint: 'One item per line.' },
      { name: 'style', label: 'Style', input: 'select', options: [['bullets', 'Bullet points'], ['tags', 'Tags']] },
    ],
    render: (node) => (
      <ul className={node.style === 'tags' ? 'tags' : undefined}>
        {clean(node.items).map((item) => <li key={item}>{item}</li>)}
      </ul>
    ),
  },

  link: {
    label: 'link',
    palette: true,
    defaults: { title: 'Links', subtitle: 'Email or web links', links: [] },
    fields: [{ name: 'links', label: 'Links', input: 'lines', hint: 'One email address or https:// URL per line.' }],
    render: (node) => <Links items={node.links} />,
  },

  project: {
    label: 'project',
    palette: true,
    defaults: { title: 'Project', subtitle: 'What it is in one line', status: 'draft', problem: '', tools: [], code: [], demo: '', media: [], snippet: null },
    fields: [
      { name: 'status', label: 'Status', input: 'select', options: [['draft', 'Draft'], ['published', 'Published']] },
      { name: 'problem', label: 'Problem', input: 'textarea', hint: 'What problem does it solve, and for whom?' },
      { name: 'tools', label: 'Tools', input: 'csv', hint: 'Comma separated.' },
      { name: 'code', label: 'Code links', input: 'lines', hint: 'One public repo URL per line.' },
      { name: 'demo', label: 'Demo URL', input: 'text' },
    ],
    render: (node) => <CaseStudy project={node} />,
  },

  pdf: {
    label: 'action',
    palette: true,
    defaults: { title: 'Download PDF', subtitle: 'Export this canvas as a PDF' },
    fields: null, // not editable; its panel is PdfAction (see NodePanel.js)
    render: () => null,
  },
};

export default nodeTypes;
