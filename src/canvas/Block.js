import { BLOCK_W, BLOCK_H } from './layout';

export default function Block({ block, onOpen }) {
  return (
    <button
      type="button"
      className={`block block--${block.kind}${block.placeholder ? ' block--placeholder' : ''}`}
      style={{ left: block.x, top: block.y, width: BLOCK_W, height: BLOCK_H }}
      onClick={() => onOpen(block)}
    >
      <span className="block__kind">{block.kind}</span>
      <span className="block__title">{block.title}</span>
      <span className="block__subtitle">{block.subtitle}</span>
    </button>
  );
}
