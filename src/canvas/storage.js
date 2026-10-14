import nodeTypes from './nodeTypes';

// Saves the visitor's canvas in localStorage. A saved canvas is tied to the
// starting diagram it was made from (`base`): when the site's content changes
// (src/data/diagram.js, src/projects), older saves are ignored so visitors see
// the new content. Storage can be blocked or full, so every access is guarded.

const KEY = 'portfolio-canvas';
const VERSION = 1;

// Short, stable fingerprint of the starting diagram (djb2 over its JSON).
function signature(initialNodes) {
  const text = JSON.stringify(initialNodes);
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  return String(hash >>> 0);
}

const isPoint = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y);
const isValidNode = (n) => n && typeof n.id === 'string' && nodeTypes[n.type] && isPoint(n.pos) && isPoint(n.mobilePos);

// The saved nodes for this starting diagram, or null.
export function loadSaved(initialNodes) {
  try {
    const data = JSON.parse(window.localStorage.getItem(KEY));
    if (!data || data.version !== VERSION || data.base !== signature(initialNodes) || !Array.isArray(data.nodes)) return null;
    const nodes = data.nodes.filter(isValidNode);
    return nodes.length ? nodes : null;
  } catch {
    return null;
  }
}

// Returns false if the browser refused to store it.
export function saveCanvas(initialNodes, nodes) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ version: VERSION, base: signature(initialNodes), nodes }));
    return true;
  } catch {
    return false;
  }
}

export function clearSaved() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
