import { useRef, useState } from 'react';
import nodeTypes from './nodeTypes';

// Panel of nodes that can be added to the canvas: a sidebar on desktop, a
// collapsible menu on phones. Drag an item onto the canvas to drop it there
// (pointer events, so it works with touch too), or click/tap it to add it at
// the center of the view.
const SAVE_STATUS = {
  clean: 'Changes last until you reload. Save to keep them.',
  unsaved: 'Unsaved changes',
  saved: 'Saved in this browser',
  failed: "Couldn't save: this browser is blocking storage.",
};

export default function Palette({ onDrop, onAdd, onReset, onSave, saveState, collapsible }) {
  const [open, setOpen] = useState(!collapsible);
  // Drag bookkeeping lives in a ref so pointer handlers always see the latest
  // values; `ghost` only drives rendering of the preview under the pointer.
  const drag = useRef(null);
  const [ghost, setGhost] = useState(null);

  const onPointerDown = (e, type) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { type, startX: e.clientX, startY: e.clientY, moved: false };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6) d.moved = true;
    if (d.moved) setGhost({ type: d.type, x: e.clientX, y: e.clientY });
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    setGhost(null);
    if (!d?.moved) return;
    const overPalette = document.elementFromPoint(e.clientX, e.clientY)?.closest('.palette');
    if (!overPalette) {
      onDrop(d.type, e.clientX, e.clientY);
      if (collapsible) setOpen(false);
    }
  };

  const onPointerCancel = () => {
    drag.current = null;
    setGhost(null);
  };

  const add = (type) => {
    onAdd(type);
    if (collapsible) setOpen(false);
  };

  return (
    <>
      <aside className={`palette${collapsible ? ' palette--floating' : ' palette--sidebar'}${open ? ' palette--open' : ''}`} aria-label="Nodes">
        {collapsible ? (
          <button type="button" className="palette__toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? 'Nodes ▴' : '+ Nodes'}
            {!open && saveState === 'unsaved' && <span className="palette__dot" title="Unsaved changes" />}
          </button>
        ) : (
          <h2 className="palette__heading">Nodes</h2>
        )}
        {open && (
          <>
            <p className="palette__hint">Drag onto the canvas, or tap to add</p>
            <ul className="palette__list">
              {Object.entries(nodeTypes).filter(([, t]) => t.palette).map(([type, t]) => (
                <li key={type}>
                  <button
                    type="button"
                    className={`palette__item block--${type}`}
                    onPointerDown={(e) => onPointerDown(e, type)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                    onClick={() => add(type)}
                  >
                    <span className="block__kind">{t.label}</span>
                    <span className="palette__title">{t.defaults.title}</span>
                    <span className="palette__subtitle">{t.defaults.subtitle}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="palette__save">
              <button
                type="button"
                className="btn btn--primary"
                onClick={onSave}
                disabled={saveState === 'clean' || saveState === 'saved'}
              >
                Save to this browser
              </button>
              <p className={`palette__status palette__status--${saveState}`} role="status">
                {SAVE_STATUS[saveState]}
              </p>
            </div>
            <button type="button" className="btn palette__reset" onClick={onReset}>
              Reset canvas
            </button>
          </>
        )}
      </aside>

      {ghost && (
        <div className={`palette__ghost block--${ghost.type}`} style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
          <span className="block__kind">{nodeTypes[ghost.type].label}</span>
          <span className="palette__title">{nodeTypes[ghost.type].defaults.title}</span>
        </div>
      )}
    </>
  );
}
