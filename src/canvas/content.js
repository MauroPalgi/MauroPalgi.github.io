// Helpers for turning node config (raw form input) into rendered content.

export const clean = (items = []) => items.map((s) => s.trim()).filter(Boolean);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only http(s) and email links are rendered as links; anything else is text.
export function linkFor(raw) {
  if (EMAIL.test(raw)) return { href: `mailto:${raw}`, label: raw };
  if (raw.startsWith('mailto:') && EMAIL.test(raw.slice(7))) return { href: raw, label: raw.slice(7) };
  if (/^https?:\/\//.test(raw)) return { href: raw, label: raw.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') };
  return null;
}
