// Nodes visitors can drag from the palette onto the canvas. Each type's panel
// content is chosen in Canvas.js (see `actionContent`).
const nodeTypes = {
  pdf: {
    kind: 'action',
    title: 'Download PDF',
    subtitle: 'Export this canvas as a PDF',
  },
};

export default nodeTypes;
