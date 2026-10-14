import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Block from './Block';
import NodePanel from './NodePanel';
import Palette from './Palette';
import nodeTypes from './nodeTypes';
import { autoLayout, edgePath, padding, worldSize, BLOCK_W, BLOCK_H, MOBILE_BREAKPOINT } from './layout';
import './canvas.css';

// A click that ends more than this many pixels from where the pointer went
// down was a pan, not a tap, so it shouldn't open a node.
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

// Initial view of the starting diagram. Desktop fits all of it and centers;
// phones fit the width and start at the top, since the outline is tall.
function initialView(nodes, isMobile, sidebar) {
  const { width, height } = worldSize(nodes, isMobile);
  const availW = window.innerWidth - sidebar;
  if (isMobile) {
    const scale = Math.min(1, (availW - 16) / width);
    return { scale, x: (availW - width * scale) / 2, y: 64 };
  }
  const scale = Math.min(1, (availW - 32) / width, (window.innerHeight - 96) / height);
  return { scale, x: (availW - width * scale) / 2, y: (window.innerHeight - height * scale) / 2 };
}

export default function Canvas({ initialNodes }) {
  const isMobile = useIsMobile();
  const sidebar = isMobile ? 0 : SIDEBAR_W;
  const pad = padding(isMobile);
  const posKey = isMobile ? 'mobilePos' : 'pos';

  const startNodes = useMemo(() => autoLayout(initialNodes), [initialNodes]);
  const [nodes, setNodes] = useState(startNodes);
  const view = initialView(startNodes, isMobile, sidebar);

  // Nodes with their rendered position in the current layout.
  const placed = useMemo(
    () => nodes.map((n) => ({ ...n, x: n[posKey].x + pad, y: n[posKey].y + pad })),
    [nodes, posKey, pad],
  );
  const byId = useMemo(() => Object.fromEntries(placed.map((n) => [n.id, n])), [placed]);
  const { width, height } = worldSize(nodes, isMobile);

  const [open, setOpen] = useState(null); // { id, editing }
  const close = useCallback(() => setOpen(null), []);
  const openNode = nodes.find((n) => n.id === open?.id);

  const transform = useRef(null);
  const nextId = useRef(1);

  const updateNode = (id, patch) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, ...patch } : n)));

  const addNode = (type, contentPoint) => {
    const id = `${type}-${nextId.current++}`;
    const p = { x: contentPoint.x - pad - BLOCK_W / 2, y: contentPoint.y - pad - BLOCK_H / 2 };
    setNodes((ns) => [...ns, { ...nodeTypes[type].defaults, id, type, parent: null, pos: p, mobilePos: p }]);
    setOpen({ id, editing: Boolean(nodeTypes[type].fields) });
  };

  // Deleting a node disconnects its children; they stay on the canvas.
  const deleteNode = (id) => {
    setNodes((ns) => ns.filter((n) => n.id !== id).map((n) => (n.parent === id ? { ...n, parent: null } : n)));
    close();
  };

  const reset = () => {
    setNodes(startNodes);
    close();
  };

  const toContent = (clientX, clientY) => transform.current.clientToContent(clientX, clientY);

  // Moving a node by its ⠿ handle. Deltas are divided by the zoom level.
  const move = useRef(null);
  const grip = {
    down: (e, node) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const scale = transform.current?.instance.state.scale || 1;
      move.current = { id: node.id, startX: e.clientX, startY: e.clientY, orig: node[posKey], scale };
    },
    move: (e) => {
      const m = move.current;
      if (!m) return;
      const p = { x: m.orig.x + (e.clientX - m.startX) / m.scale, y: m.orig.y + (e.clientY - m.startY) / m.scale };
      updateNode(m.id, { [posKey]: p });
    },
    up: () => {
      move.current = null;
    },
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

  const edges = placed.filter((n) => n.parent && byId[n.parent]).map((n) => [byId[n.parent], n]);

  return (
    <div className="canvas" style={{ left: sidebar }} onPointerDownCapture={onPointerDown} onClickCapture={onClickCapture}>
      <TransformWrapper
        key={isMobile ? 'mobile' : 'desktop'}
        ref={transform}
        initialScale={view.scale}
        initialPositionX={view.x}
        initialPositionY={view.y}
        minScale={view.scale * 0.4}
        maxScale={2}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        wheel={{ step: WHEEL_STEP }}
        panning={{ excluded: ['block__grip'] }}
      >
        {({ zoomIn, zoomOut, setTransform }) => (
          <>
            <TransformComponent wrapperClass="canvas__viewport">
              <div className="canvas__world" style={{ width, height }}>
                <svg className="canvas__edges" width={width} height={height} aria-hidden="true">
                  {edges.map(([a, b]) => {
                    const { d, start, end } = edgePath(a, b);
                    return (
                      <g key={b.id}>
                        <path d={d} />
                        <circle cx={start.x} cy={start.y} r="4" />
                        <circle cx={end.x} cy={end.y} r="4" />
                      </g>
                    );
                  })}
                </svg>
                {placed.map((n) => (
                  <Block key={n.id} node={n} grip={grip} onOpen={(id) => setOpen({ id, editing: false })} />
                ))}
              </div>
            </TransformComponent>

            <div className="controls" aria-label="Canvas controls">
              <button type="button" onClick={() => zoomIn()} aria-label="Zoom in">+</button>
              <button type="button" onClick={() => zoomOut()} aria-label="Zoom out">−</button>
              <button type="button" onClick={() => setTransform(view.x, view.y, view.scale)} aria-label="Fit to screen">⤢</button>
            </div>
          </>
        )}
      </TransformWrapper>

      <Palette
        key={isMobile ? 'palette-mobile' : 'palette-desktop'}
        collapsible={isMobile}
        onDrop={(type, cx, cy) => addNode(type, toContent(cx, cy))}
        onAdd={(type) => addNode(type, toContent(sidebar + (window.innerWidth - sidebar) / 2, window.innerHeight / 2))}
        onReset={reset}
      />

      <p className="hint">Drag to pan · pinch or scroll to zoom · tap a node · ⠿ moves it</p>

      {openNode && (
        <NodePanel
          key={openNode.id}
          node={openNode}
          nodes={nodes}
          editing={open.editing}
          onEdit={() => setOpen({ ...open, editing: true })}
          onDone={() => setOpen({ ...open, editing: false })}
          onChange={(patch) => updateNode(openNode.id, patch)}
          onDelete={() => deleteNode(openNode.id)}
          onClose={close}
        />
      )}
    </div>
  );
}
