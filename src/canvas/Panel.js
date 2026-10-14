import { useEffect, useRef } from 'react';

// Drawer shell for an opened node: a side drawer on desktop, full screen on
// phones (see .panel in canvas.css). Escape or the backdrop closes it.
export default function Panel({ kind, title, subtitle, onClose, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="panel-backdrop" onClick={onClose} />
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
        <header className="panel__header">
          <div>
            <span className="block__kind">{kind}</span>
            <h2 id="panel-title">{title || 'Untitled'}</h2>
            {subtitle && <p className="panel__subtitle">{subtitle}</p>}
          </div>
          <button ref={closeRef} type="button" className="panel__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="panel__body">{children}</div>
      </aside>
    </>
  );
}
