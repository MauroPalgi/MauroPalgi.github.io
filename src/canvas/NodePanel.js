import Panel from './Panel';
import NodeForm from './NodeForm';
import PdfAction from './PdfAction';
import nodeTypes from './nodeTypes';

// Panel for one node: its rendered content, or its edit form, plus actions.
export default function NodePanel({ node, nodes, editing, onEdit, onDone, onChange, onDelete, onClose }) {
  const type = nodeTypes[node.type];

  let body;
  if (node.type === 'pdf') body = <PdfAction nodes={nodes} />;
  else if (editing) body = <NodeForm node={node} nodes={nodes} onChange={onChange} />;
  else body = type.render(node);

  return (
    <Panel kind={type.label} title={node.title} subtitle={node.subtitle} onClose={onClose}>
      {body}
      <div className="actions panel__actions">
        {type.fields && (editing
          ? <button type="button" className="btn btn--primary" onClick={onDone}>Done</button>
          : <button type="button" className="btn" onClick={onEdit}>Edit</button>)}
        <button type="button" className="btn btn--danger" onClick={onDelete}>Delete node</button>
      </div>
    </Panel>
  );
}
