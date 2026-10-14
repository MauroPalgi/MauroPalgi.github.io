import { useState } from 'react';
import { downloadCanvasPdf } from './pdf';
import { treeOrder } from './layout';

// Panel content of the "Download PDF" node: exports every content node on the
// canvas, in tree order, including the visitor's own edits.
export default function PdfAction({ nodes }) {
  const [state, setState] = useState('idle'); // idle | busy | error
  const content = treeOrder(nodes).map((o) => o.node).filter((n) => n.type !== 'pdf');

  const download = async () => {
    setState('busy');
    try {
      await downloadCanvasPdf(content);
      setState('idle');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  return (
    <>
      <p>
        Exports the {content.length} nodes currently on the canvas, with
        everything you see when you open them, as a PDF.
      </p>
      <button type="button" className="btn btn--primary" onClick={download} disabled={state === 'busy'}>
        {state === 'busy' ? 'Preparing…' : 'Download PDF'}
      </button>
      {state === 'error' && <p className="muted">Something went wrong creating the PDF. Please try again.</p>}
    </>
  );
}
