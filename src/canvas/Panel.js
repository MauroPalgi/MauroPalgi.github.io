import { useEffect, useRef } from 'react';

// Detail view for an opened block: a side drawer on desktop, full screen on
// phones (see .panel in canvas.css).
export default function Panel({ block, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [block, onClose]);

  return (
    <>
      <div className="panel-backdrop" onClick={onClose} />
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <header className="panel__header">
          <div>
            <span className="block__kind">{block.kind}</span>
            <h2 id="panel-title">{block.title}</h2>
          </div>
          <button ref={closeRef} type="button" className="panel__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="panel__body">{block.content}</div>
      </aside>
    </>
  );
}
