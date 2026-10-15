/*! hig-web-kit v0.3.0 | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */
// Color utilities shared by the build, the contrast checker and the runtime (dist/a11y.js).
// Dependency-free. Colors are [r, g, b, a] with r/g/b in 0..255 and a in 0..1.

/** Parse #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba() in comma or space syntax. */
export function parseColor(input) {
  const s = String(input).trim().toLowerCase();
  if (s.startsWith('#')) {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new Error(`Bad hex color: ${input}`);
    const n = [0, 2, 4, 6].map(i => (i < h.length ? parseInt(h.slice(i, i + 2), 16) : 255));
    return [n[0], n[1], n[2], n[3] / 255];
  }
  const m = s.match(/^rgba?\((.*)\)$/);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    const [r, g, b] = parts.slice(0, 3).map(Number);
    let a = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : Number(parts[3]);
    return [r, g, b, a];
  }
  if (s === 'transparent') return [0, 0, 0, 0];
  throw new Error(`Unsupported color: ${input}`);
}

const h2 = n => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');

/** #rrggbb when opaque, #rrggbbaa otherwise (parseable by CSS, antd/tinycolor, MUI, Sass). */
export function toHex(c) {
  const [r, g, b, a = 1] = Array.isArray(c) ? c : parseColor(c);
  return `#${h2(r)}${h2(g)}${h2(b)}${a >= 0.999 ? '' : h2(a * 255)}`;
}

/** rgba(r, g, b, a) — legacy syntax for libraries that dislike hex8. */
export function toRgba(c) {
  const [r, g, b, a = 1] = Array.isArray(c) ? c : parseColor(c);
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(3)})`;
}

/** Composite fg over bg (source-over). */
export function over(fg, bg) {
  const f = Array.isArray(fg) ? fg : parseColor(fg);
  const b = Array.isArray(bg) ? bg : parseColor(bg);
  const a = f[3] + b[3] * (1 - f[3]);
  if (a === 0) return [0, 0, 0, 0];
  return [0, 1, 2].map(i => (f[i] * f[3] + b[i] * b[3] * (1 - f[3])) / a).concat(a);
}

/** Flatten a stack of layers, topmost first: flatten(text, glass, backdrop). */
export function flatten(...layers) {
  return layers.reduceRight((bg, fg) => over(fg, bg));
}

/** WCAG 2.x relative luminance. */
export function luminance(c) {
  const [r, g, b] = (Array.isArray(c) ? c : parseColor(c)).slice(0, 3).map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio of two opaque colors (translucent ones should be flattened first). */
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
