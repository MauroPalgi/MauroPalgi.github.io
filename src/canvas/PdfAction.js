import { useState } from 'react';
import { downloadCanvasPdf } from './pdf';

export default function PdfAction({ blocks, onRemove }) {
  const [state, setState] = useState('idle'); // idle | busy | error

  const download = async () => {
    setState('busy');
    try {
      await downloadCanvasPdf(blocks);
      setState('idle');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  return (
    <>
      <p>
        Exports the {blocks.length} blocks currently on the canvas, with
        everything you see when you open them, as a PDF.
      </p>
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={download} disabled={state === 'busy'}>
          {state === 'busy' ? 'Preparing…' : 'Download PDF'}
        </button>
        <button type="button" className="btn" onClick={onRemove}>
          Remove from canvas
        </button>
      </div>
      {state === 'error' && <p className="muted">Something went wrong creating the PDF. Please try again.</p>}
    </>
  );
}
