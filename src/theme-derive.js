// Derive a brand (accent) theme for every color set. Pure functions, shared by the build, the contrast
// checker and the runtime (dist/theme.js).
//
// HIG: an app has one accent color. It tints primary buttons, links, selection and the focus ring;
// everything else (labels, fills, system colors, the green switch) stays system. This module keeps the
// brand's hue and saturation and moves only its lightness, as little as possible, until every accent pair
// meets the rules of the target set:
//   apple sets: accent ≥ 3:1 against the page (legible in dark mode), on-accent picked for the fill;
//   aa and increased-contrast sets: accent text ≥ 4.5:1 on page, grouped card, secondary background and the
//   gray button; fill + label ≥ 4.5:1; fill, indicator and focus ring ≥ 3:1 against page and card.
import { parseColor, toHex, flatten, contrast } from './color.js';

export const THEME_KEYS = ['accent', 'accent-fill', 'accent-text', 'on-accent', 'link', 'focus-ring'];

const rgbToHsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
};
const hslToRgb = ([h, s, l]) => {
  if (!s) return [l * 255, l * 255, l * 255, 1];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255, 1];
};

/** The color with the same hue/saturation whose lightness is closest to the original and passes every test. */
export function nearestPassing(color, tests) {
  const [h, s, l] = rgbToHsl(parseColor(color));
  const ok = L => { const c = hslToRgb([h, s, L]); return tests.every(t => t(c)) ? c : null; };
  for (let d = 0; d <= 1; d += 0.0025) {
    const c = (l - d >= 0 && ok(l - d)) || (l + d <= 1 && ok(l + d));
    if (c) return toHex(c);
  }
  return null;
}

const solid = (c, under) => flatten(parseColor(c), ...under.map(u => parseColor(u)), [255, 255, 255, 1]);
// a small margin keeps ratios above the threshold after rounding to 8-bit hex
const M = 0.06;
const vs = (min, ...under) => c => contrast(c, solid(under[0], under.slice(1))) >= min + M;
const label = (min, text) => c => contrast(parseColor(text), c) >= min + M;

/**
 * Accent tokens for one resolved color set.
 * @param {string | {light?: string, dark?: string}} brand
 * @param {Record<string,string>} set   resolved base set (e.g. tokens for "aa.dark")
 * @param {{strict: boolean, dark: boolean}} kind  strict = aa or increased contrast
 */
export function deriveAccent(brand, set, { strict, dark }) {
  const base = typeof brand === 'string' ? brand : (dark ? brand.dark ?? brand.light : brand.light ?? brand.dark);
  const page = [set.bg], card = [set['grouped-bg-2']], bg2 = [set['bg-2']], gray = [set['fill-2'], set.bg];
  if (!strict) {
    const accent = nearestPassing(base, [vs(3, ...page)]);
    // Apple puts white labels on every system-color button; black only on very light brands (yellow-like)
    const onAccent = contrast([255, 255, 255, 1], parseColor(accent)) >= 1.9 ? '#ffffff' : '#000000';
    return { accent, 'accent-fill': accent, 'accent-text': accent, 'on-accent': onAccent, link: accent, 'focus-ring': toHex([...parseColor(accent).slice(0, 3), dark ? 0.6 : 0.5]) };
  }
  const text = nearestPassing(base, [vs(4.5, ...page), vs(4.5, ...card), vs(4.5, ...bg2), vs(4.5, ...gray)]);
  const indicator = nearestPassing(base, [vs(3, ...page), vs(3, ...card), vs(3, ...bg2)]);
  // filled button: white label unless black needs a much smaller change (e.g. yellow); HIG buttons use white
  const fills = ['#ffffff', '#000000'].map(t => [t, nearestPassing(base, [label(4.5, t), vs(3, ...page), vs(3, ...card)])]).filter(([, f]) => f);
  const dist = f => Math.abs(rgbToHsl(parseColor(f))[2] - rgbToHsl(parseColor(base))[2]);
  const penalty = ([t, f]) => dist(f) + (t === '#000000' ? 0.2 : 0);
  const [onAccent, fill] = fills.sort((a, b) => penalty(a) - penalty(b))[0] ?? ['#ffffff', text];
  return { accent: indicator, 'accent-fill': fill, 'accent-text': text, 'on-accent': onAccent, link: text, 'focus-ring': text };
}

/**
 * Theme overrides for every set: { "apple.light": {accent, …}, "aa.dark": {…}, … }.
 * `overrides` (per set) win over derived values — use them to pin exact brand shades.
 */
export function deriveTheme(brand, sets, overrides = {}) {
  const out = {};
  for (const [name, set] of Object.entries(sets)) {
    const [mode, variant] = name.split('.');
    const derived = deriveAccent(brand, set, { strict: mode === 'aa' || variant.endsWith('-hc'), dark: variant.startsWith('dark') });
    out[name] = { ...derived, ...Object.fromEntries(Object.entries(overrides[name] || {}).map(([k, v]) => [k, toHex(parseColor(v))])) };
  }
  return out;
}

/** Selectors used by hig.css for a set (theme rules add [data-hig-theme] so they win over the base set). */
export function setSelectors(setName, prefix = '') {
  const [mode, variant] = setName.split('.');
  const dark = variant.startsWith('dark'), hc = variant.endsWith('-hc');
  const m = mode === 'aa' ? '[data-hig-mode="aa"]' : ':not([data-hig-mode="aa"])';
  const schemes = dark
    ? [[null, '[data-hig-scheme="dark"]'], ['(prefers-color-scheme: dark)', ':not([data-hig-scheme="light"])']]
    : [[null, ':not([data-hig-scheme="dark"])']];
  const contrasts = hc
    ? [[null, '[data-hig-contrast="more"]'], ['(prefers-contrast: more)', ':not([data-hig-contrast="standard"])']]
    : [[null, ':not([data-hig-contrast="more"])']];
  const rules = [];
  for (const [sq, ss] of schemes) for (const [cq, cs] of contrasts) rules.push([[sq, cq].filter(Boolean).join(' and ') || null, `:root${prefix}${m}${ss}${cs}`]);
  return rules;
}

/** CSS text for a derived theme. */
export function themeCss(name, theme) {
  const sel = `[data-hig-theme="${name}"]`;
  let css = '';
  for (const [setName, vars] of Object.entries(theme)) {
    const body = Object.entries(vars).map(([k, v]) => `--hig-${k}: ${v};`).join(' ');
    for (const [mq, s] of setSelectors(setName, sel)) css += mq ? `@media ${mq} { ${s} { ${body} } }\n` : `${s} { ${body} }\n`;
  }
  return css;
}
