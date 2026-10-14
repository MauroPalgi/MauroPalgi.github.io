export const BLOCK_W = 220;
export const BLOCK_H = 104;

// Below this viewport width the canvas switches to the compact two-column
// layout (`mobilePos`).
export const MOBILE_BREAKPOINT = 700;

// Resolves each block's position for the current layout, shifted by `padding`,
// and returns the world size needed to contain them.
export function computeLayout(blocks, isMobile) {
  const padding = isMobile ? 16 : 40;
  const placed = blocks.map((b) => {
    const p = isMobile ? b.mobilePos : b.pos;
    return { ...b, x: p.x + padding, y: p.y + padding };
  });
  const width = Math.max(...placed.map((b) => b.x + BLOCK_W)) + padding;
  const height = Math.max(...placed.map((b) => b.y + BLOCK_H)) + padding;
  return { placed, width, height };
}

// Connection from `a` to `b`: leaves from the side facing `b` along the
// dominant axis and enters on the opposite side, drawn as a cubic bezier.
export function edgePath(a, b) {
  const ac = { x: a.x + BLOCK_W / 2, y: a.y + BLOCK_H / 2 };
  const bc = { x: b.x + BLOCK_W / 2, y: b.y + BLOCK_H / 2 };
  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;

  let start, end, c1, c2;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const dir = Math.sign(dx);
    start = { x: ac.x + (dir * BLOCK_W) / 2, y: ac.y };
    end = { x: bc.x - (dir * BLOCK_W) / 2, y: bc.y };
    const k = (end.x - start.x) / 2;
    c1 = { x: start.x + k, y: start.y };
    c2 = { x: end.x - k, y: end.y };
  } else {
    const dir = Math.sign(dy);
    start = { x: ac.x, y: ac.y + (dir * BLOCK_H) / 2 };
    end = { x: bc.x, y: bc.y - (dir * BLOCK_H) / 2 };
    const k = (end.y - start.y) / 2;
    c1 = { x: start.x, y: start.y + k };
    c2 = { x: end.x, y: end.y - k };
  }

  return {
    d: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`,
    start,
    end,
  };
}
