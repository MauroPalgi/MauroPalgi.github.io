export const BLOCK_W = 220;
export const BLOCK_H = 104;

// Below this viewport width the canvas uses the mobile layout.
export const MOBILE_BREAKPOINT = 700;

// Space around the nodes inside the world, per layout.
export const padding = (isMobile) => (isMobile ? 16 : 40);

const COL_W = 280; // desktop: distance between section columns
const SECTION_Y = 200; // desktop: y of the root's children
const ROW_H = 150; // desktop: vertical step inside a column
const MOBILE_ROW_H = 140; // mobile: vertical step of the outline
const INDENT = 30; // horizontal step per tree level under a section

// Nodes in depth-first order with their depth. Roots are nodes whose parent
// is missing; siblings keep their array order.
export function treeOrder(nodes) {
  const ids = new Set(nodes.map((n) => n.id));
  const children = {};
  const roots = [];
  for (const n of nodes) {
    if (n.parent && ids.has(n.parent)) (children[n.parent] = children[n.parent] || []).push(n);
    else roots.push(n);
  }
  const out = [];
  const visit = (node, depth) => {
    out.push({ node, depth });
    (children[node.id] || []).forEach((c) => visit(c, depth + 1));
  };
  roots.forEach((r) => visit(r, 0));
  return out;
}

// Gives every node a desktop `pos` and a mobile `mobilePos` from the tree.
// Desktop: the first root on top, its children in columns, and each column's
// descendants stacked and indented below. Mobile: an indented outline.
export function autoLayout(nodes) {
  const order = treeOrder(nodes);
  const pos = {};
  const mobilePos = {};

  order.forEach(({ node, depth }, i) => {
    mobilePos[node.id] = { x: depth * INDENT, y: i * MOBILE_ROW_H };
  });

  const [root, ...rest] = order;
  const sections = rest.filter((o) => o.depth === 1);
  let col = -1;
  let row = 0;
  for (const { node, depth } of rest) {
    if (depth === 0) {
      // Extra roots go in their own columns on the right.
      col = Math.max(col + 1, sections.length);
      row = 0;
      pos[node.id] = { x: col * COL_W, y: SECTION_Y };
    } else if (depth === 1) {
      col += 1;
      row = 0;
      pos[node.id] = { x: col * COL_W, y: SECTION_Y };
    } else {
      row += 1;
      pos[node.id] = { x: col * COL_W + (depth - 1) * INDENT, y: SECTION_Y + row * ROW_H };
    }
  }
  if (root) pos[root.node.id] = { x: ((sections.length - 1) * COL_W) / 2, y: 0 };

  return nodes.map((n) => ({ ...n, pos: pos[n.id], mobilePos: mobilePos[n.id] }));
}

// Size of the world div needed to contain the nodes in the given layout.
export function worldSize(nodes, isMobile) {
  const pad = padding(isMobile);
  const key = isMobile ? 'mobilePos' : 'pos';
  const width = Math.max(0, ...nodes.map((n) => n[key].x + BLOCK_W)) + pad * 2;
  const height = Math.max(0, ...nodes.map((n) => n[key].y + BLOCK_H)) + pad * 2;
  return { width, height };
}

// Connection line from parent `a` to child `b` (both with rendered x/y):
// - child just below and slightly indented: an elbow from the parent's
//   bottom-left down and into the child's left side (outline style)
// - room between them vertically: a bezier from bottom to top
// - otherwise: a bezier between the facing left/right sides
export function edgePath(a, b) {
  const indent = b.x - a.x;
  if (b.y >= a.y + BLOCK_H && indent > 0 && indent < BLOCK_W / 2) {
    const start = { x: a.x + INDENT / 2, y: a.y + BLOCK_H };
    const end = { x: b.x, y: b.y + BLOCK_H / 2 };
    const r = Math.min(8, end.x - start.x, end.y - start.y);
    return {
      d: `M ${start.x} ${start.y} L ${start.x} ${end.y - r} Q ${start.x} ${end.y} ${start.x + r} ${end.y} L ${end.x} ${end.y}`,
      start,
      end,
    };
  }

  let start, end, c1, c2;
  const gapBelow = b.y - (a.y + BLOCK_H);
  const gapAbove = a.y - (b.y + BLOCK_H);
  if (gapBelow > 24 || gapAbove > 24) {
    const down = gapBelow > 24;
    start = { x: a.x + BLOCK_W / 2, y: down ? a.y + BLOCK_H : a.y };
    end = { x: b.x + BLOCK_W / 2, y: down ? b.y : b.y + BLOCK_H };
    const k = (end.y - start.y) / 2;
    c1 = { x: start.x, y: start.y + k };
    c2 = { x: end.x, y: end.y - k };
  } else {
    const right = b.x > a.x;
    start = { x: right ? a.x + BLOCK_W : a.x, y: a.y + BLOCK_H / 2 };
    end = { x: right ? b.x : b.x + BLOCK_W, y: b.y + BLOCK_H / 2 };
    const k = (end.x - start.x) / 2;
    c1 = { x: start.x + k, y: start.y };
    c2 = { x: end.x - k, y: end.y };
  }

  return {
    d: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`,
    start,
    end,
  };
}
