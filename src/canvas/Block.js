import nodeTypes from './nodeTypes';
import { BLOCK_W, BLOCK_H } from './layout';

// A node on the canvas. Tapping it opens its panel; the ⠿ handle moves it
// (excluded from canvas panning in Canvas.js, see `panning.excluded`).
export default function Block({ node, onOpen, grip }) {
  return (
    <div
      className={`block block--${node.type}`}
      style={{ left: node.x, top: node.y, width: BLOCK_W, height: BLOCK_H }}
    >
      <button type="button" className="block__open" onClick={() => onOpen(node.id)}>
        <span className="block__kind">{nodeTypes[node.type].label}</span>
        <span className="block__title">{node.title}</span>
        <span className="block__subtitle">{node.subtitle}</span>
      </button>
      <span
        className="block__grip"
        title="Drag to move"
        aria-hidden="true"
        onPointerDown={(e) => grip.down(e, node)}
        onPointerMove={grip.move}
        onPointerUp={grip.up}
        onPointerCancel={grip.up}
      >
        ⠿
      </span>
    </div>
  );
}
