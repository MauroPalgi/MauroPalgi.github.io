import { useState } from 'react';
import nodeTypes from './nodeTypes';

const COMMON_FIELDS = [
  { name: 'title', label: 'Title', input: 'text' },
  { name: 'subtitle', label: 'Subtitle', input: 'text' },
];

// True if `id` is `ancestorId` or sits somewhere below it.
function isWithin(nodes, id, ancestorId) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const seen = new Set();
  for (let cur = byId[id]; cur && !seen.has(cur.id); cur = byId[cur.parent]) {
    if (cur.id === ancestorId) return true;
    seen.add(cur.id);
  }
  return false;
}

// List inputs keep their own text while typing and report the parsed array,
// so separators and spaces aren't eaten mid-word.
function ListInput({ value, onChange, separator, multiline, id }) {
  const join = multiline ? '\n' : ', ';
  const [text, setText] = useState(() => (value || []).join(join));
  const update = (t) => {
    setText(t);
    onChange(t.split(separator).map((s) => s.trim()).filter(Boolean));
  };
  return multiline
    ? <textarea id={id} rows={6} value={text} onChange={(e) => update(e.target.value)} />
    : <input id={id} type="text" value={text} onChange={(e) => update(e.target.value)} />;
}

function Field({ field, value, onChange, id }) {
  switch (field.input) {
    case 'textarea':
      return <textarea id={id} rows={6} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
    case 'lines':
      return <ListInput id={id} value={value} onChange={onChange} separator={'\n'} multiline />;
    case 'csv':
      return <ListInput id={id} value={value} onChange={onChange} separator="," />;
    case 'select':
      return (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {field.options.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      );
    default:
      return <input id={id} type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  }
}

// Edit form for a node. Every change is applied immediately.
export default function NodeForm({ node, nodes, onChange }) {
  const fields = [...COMMON_FIELDS, ...nodeTypes[node.type].fields];
  const parents = nodes.filter((n) => n.type !== 'pdf' && !isWithin(nodes, n.id, node.id));

  return (
    <form className="node-form" onSubmit={(e) => e.preventDefault()}>
      {fields.map((f) => {
        const id = `field-${f.name}`;
        return (
          <div className="node-form__field" key={f.name}>
            <label htmlFor={id}>{f.label}</label>
            <Field id={id} field={f} value={node[f.name]} onChange={(v) => onChange({ [f.name]: v })} />
            {f.hint && <small>{f.hint}</small>}
          </div>
        );
      })}
      <div className="node-form__field">
        <label htmlFor="field-parent">Connected to</label>
        <select id="field-parent" value={node.parent || ''} onChange={(e) => onChange({ parent: e.target.value || null })}>
          <option value="">Nothing</option>
          {parents.map((n) => <option key={n.id} value={n.id}>{n.title || 'Untitled'}</option>)}
        </select>
      </div>
    </form>
  );
}
