import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Block from './Block';
import Panel from './Panel';
import Palette from './Palette';
import PdfAction from './PdfAction';
import nodeTypes from './nodeTypes';
import { computeLayout, edgePath, BLOCK_W, BLOCK_H, MOBILE_BREAKPOINT } from './layout';
import './canvas.css';

// A click that ends more than this many pixels from where the pointer went
// down was a pan, not a tap, so it shouldn't open a block.
const DRAG_THRESHOLD = 6;

// Zoom change per pixel of wheel delta: about 10% per mouse wheel notch.
const WHEEL_STEP = 0.001;

// Width of the node palette sidebar on desktop (matches .palette--sidebar).
const SIDEBAR_W = 220;

function useIsMobile() {
  const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return isMobile;
}

// Scale that fits the whole world in the canvas area, never zooming in past 1.
function fitScale(width, height, sidebar) {
  const sx = (window.innerWidth - sidebar - 32) / width;
  const sy = (window.innerHeight - 96) / height;
  return Math.min(1, sx, sy);
}

export default function Canvas({ blocks, edges }) {
  const isMobile = useIsMobile();
  const { placed, width, height } = useMemo(() => computeLayout(blocks, isMobile), [blocks, isMobile]);
  const byId = useMemo(() => Object.fromEntries(placed.map((b) => [b.id, b])), [placed]);
  const sidebar = isMobile ? 0 : SIDEBAR_W;
  const scale = fitScale(width, height, sidebar);

  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  // Nodes dropped from the palette, positioned in world coordinates.
  const [added, setAdded] = useState([]);
  const nextId = useRef(1);
  const addNode = (type, point) => {
    const id = `${type}-${nextId.current++}`;
    setAdded((a) => [...a, { ...nodeTypes[type], id, type, x: point.x - BLOCK_W / 2, y: point.y - BLOCK_H / 2 }]);
  };
  const removeNode = (id) => {
    setAdded((a) => a.filter((b) => b.id !== id));
    close();
  };

  // Panel content for palette nodes; content blocks bring their own.
  const actionContent = (node) => {
    if (node.type === 'pdf') return <PdfAction blocks={placed} onRemove={() => removeNode(node.id)} />;
    return null;
  };

  const down = useRef(null);
  const onPointerDown = (e) => {
    down.current = { x: e.clientX, y: e.clientY };
  };
  const onClickCapture = (e) => {
    if (!down.current) return;
    const moved = Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y);
    if (moved > DRAG_THRESHOLD) e.stopPropagation();
  };

  return (
    <div className="canvas" style={{ left: sidebar }} onPointerDownCapture={onPointerDown} onClickCapture={onClickCapture}>
      <TransformWrapper
        key={isMobile ? 'mobile' : 'desktop'}
        initialScale={scale}
        minScale={scale * 0.5}
        maxScale={2}
        centerOnInit
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        wheel={{ step: WHEEL_STEP }}
      >
        {({ zoomIn, zoomOut, centerView, clientToContent }) => (
          <>
            <TransformComponent wrapperClass="canvas__viewport">
              <div className="canvas__world" style={{ width, height }}>
                <svg className="canvas__edges" width={width} height={height} aria-hidden="true">
                  {edges.map(([from, to]) => {
                    const { d, start, end } = edgePath(byId[from], byId[to]);
                    return (
                      <g key={`${from}-${to}`}>
                        <path d={d} />
                        <circle cx={start.x} cy={start.y} r="4" />
                        <circle cx={end.x} cy={end.y} r="4" />
                      </g>
                    );
                  })}
                </svg>
                {[...placed, ...added].map((b) => (
                  <Block key={b.id} block={b} onOpen={setOpen} />
                ))}
              </div>
            </TransformComponent>

            <div className="controls" aria-label="Canvas controls">
              <button type="button" onClick={() => zoomIn()} aria-label="Zoom in">+</button>
              <button type="button" onClick={() => zoomOut()} aria-label="Zoom out">−</button>
              <button type="button" onClick={() => centerView(scale)} aria-label="Fit to screen">⤢</button>
            </div>

            <Palette
              key={isMobile ? 'mobile' : 'desktop'}
              collapsible={isMobile}
              onDrop={(type, cx, cy) => addNode(type, clientToContent(cx, cy))}
              onAdd={(type) => addNode(type, clientToContent(sidebar + (window.innerWidth - sidebar) / 2, window.innerHeight / 2))}
            />
          </>
        )}
      </TransformWrapper>

      <p className="hint">Drag to move · pinch or scroll to zoom · tap a block</p>

      {open && (
        <Panel block={open} onClose={close}>
          {open.type ? actionContent(open) : open.content}
        </Panel>
      )}
    </div>
  );
}
