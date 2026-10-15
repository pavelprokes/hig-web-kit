/*! hig-web-kit v0.2.0 | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */
// Runtime switches for hig-web-kit: mode (apple | aa), color scheme, contrast, transparency and motion.
// All state lives in data-hig-* attributes on <html>, so any CSS (or framework theme) can react to it.
//
//   import { restorePreferences, setMode, watchPreferences } from 'hig-web-kit/a11y';
//   restorePreferences();               // reads #aa in the URL and the saved choice
//   setMode('aa');                      // WCAG 2.2 AA palette + visible control borders
//   watchPreferences(p => render(p));   // e.g. rebuild an Ant Design / MUI theme
import { flatten, contrast } from './color.js';
import { PAIRS, BACKDROPS, resolveLayers } from './contrast-pairs.js';

const STORE_KEY = 'hig-web-kit:preferences';
const html = () => document.documentElement;
const mq = q => (typeof matchMedia === 'function' ? matchMedia(q) : { matches: false, addEventListener() {}, removeEventListener() {} });
const media = {
  dark: () => mq('(prefers-color-scheme: dark)'),
  more: () => mq('(prefers-contrast: more)'),
  transparency: () => mq('(prefers-reduced-transparency: reduce)'),
  motion: () => mq('(prefers-reduced-motion: reduce)'),
};

function setAttr(name, value, persist) {
  if (value === 'system' || value == null) html().removeAttribute(name);
  else html().setAttribute(name, value);
  if (persist) savePreferences();
}

/** 'apple' (default, Apple's values) or 'aa' (WCAG 2.2 AA). */
export function setMode(mode, { persist = true } = {}) { setAttr('data-hig-mode', mode === 'aa' ? 'aa' : null, persist); }
/** 'system' | 'light' | 'dark' */
export function setScheme(scheme, { persist = true } = {}) { setAttr('data-hig-scheme', scheme, persist); }
/** 'system' | 'more' | 'standard' */
export function setContrast(value, { persist = true } = {}) { setAttr('data-hig-contrast', value, persist); }
/** 'system' | 'reduce' | 'standard' — Reduce Transparency for glass. */
export function setTransparency(value, { persist = true } = {}) { setAttr('data-hig-transparency', value, persist); }
/** 'system' | 'reduce' | 'standard' — Reduce Motion. */
export function setMotion(value, { persist = true } = {}) { setAttr('data-hig-motion', value, persist); }

/** Effective preferences after combining attributes and OS media queries. */
export function getPreferences() {
  const a = n => html().getAttribute(n);
  return {
    mode: a('data-hig-mode') === 'aa' ? 'aa' : 'apple',
    scheme: a('data-hig-scheme') || (media.dark().matches ? 'dark' : 'light'),
    contrast: a('data-hig-contrast') || (media.more().matches ? 'more' : 'standard'),
    transparency: a('data-hig-transparency') || (media.transparency().matches ? 'reduce' : 'standard'),
    motion: a('data-hig-motion') || (media.motion().matches ? 'reduce' : 'standard'),
  };
}

/** Name of the active token set, e.g. "aa.dark-hc" — matches the keys of tokens.json / tokens.color. */
export function currentSet(p = getPreferences()) {
  return `${p.mode}.${p.scheme}${p.contrast === 'more' ? '-hc' : ''}`;
}

export function savePreferences() {
  const a = n => html().getAttribute(n);
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      mode: a('data-hig-mode'), scheme: a('data-hig-scheme'), contrast: a('data-hig-contrast'),
      transparency: a('data-hig-transparency'), motion: a('data-hig-motion'),
    }));
  } catch { /* storage unavailable: preferences stay for this page view */ }
}

/**
 * Apply saved choices, then URL hash flags: #aa, #dark, #light, #hc — combinable as #aa-dark-hc.
 * Call once, as early as possible (ideally inline in <head> to avoid a flash).
 */
export function restorePreferences({ hash = true } = {}) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch { saved = {}; }
  const map = { mode: 'data-hig-mode', scheme: 'data-hig-scheme', contrast: 'data-hig-contrast', transparency: 'data-hig-transparency', motion: 'data-hig-motion' };
  for (const [k, attr] of Object.entries(map)) if (saved[k]) html().setAttribute(attr, saved[k]);
  if (hash && typeof location !== 'undefined') {
    const flags = location.hash.slice(1).toLowerCase().split(/[,+&._~-]/);
    if (flags.includes('aa')) html().setAttribute('data-hig-mode', 'aa');
    if (flags.includes('dark')) html().setAttribute('data-hig-scheme', 'dark');
    if (flags.includes('light')) html().setAttribute('data-hig-scheme', 'light');
    if (flags.includes('hc')) html().setAttribute('data-hig-contrast', 'more');
  }
  return getPreferences();
}

/** Calls cb(preferences) now and whenever an attribute or OS preference changes. Returns an unsubscribe fn. */
export function watchPreferences(cb, { immediate = true } = {}) {
  let last = '';
  const fire = () => { const p = getPreferences(); const k = JSON.stringify(p); if (k !== last) { last = k; cb(p); } };
  const queries = Object.values(media).map(f => f());
  queries.forEach(q => q.addEventListener?.('change', fire));
  const mo = typeof MutationObserver === 'function' ? new MutationObserver(fire) : null;
  mo?.observe(html(), { attributes: true, attributeFilter: ['data-hig-mode', 'data-hig-scheme', 'data-hig-contrast', 'data-hig-transparency', 'data-hig-motion'] });
  if (immediate) fire();
  return () => { queries.forEach(q => q.removeEventListener?.('change', fire)); mo?.disconnect(); };
}

/** Read a --hig-* color as rendered right now (handles color(srgb …) and rgb() serializations). */
export function readColor(name, el = html()) {
  const probe = document.createElement('i');
  probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  probe.style.color = name.startsWith('#') ? name : `var(--hig-${name})`;
  el.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  const n = (c.match(/[\d.]+/g) || []).map(Number);
  if (c.startsWith('color(')) return [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1];
  return [n[0], n[1], n[2], n[3] ?? 1];
}

/**
 * Measure the live --hig-* tokens against WCAG 2.2 AA (text 4.5:1, UI & focus 3:1).
 * @returns {{label:string, ratio:number, min:number, pass:boolean}[]}
 */
export function checkContrast(el = html()) {
  const cache = {};
  const set = new Proxy({}, { get: (_, k) => (cache[k] ??= readColor(String(k), el)) });
  return PAIRS.map(([label, fg, bg, min]) => {
    const needsBackdrop = [...fg, ...bg].includes('@backdrop');
    const ratio = Math.min(...(needsBackdrop ? BACKDROPS : ['#ffffff']).map(bd => {
      const res = layers => resolveLayers(layers, set, bd).map(v => (typeof v === 'string' ? readColor(v, el) : v));
      const b = flatten(...res(bg), [255, 255, 255, 1]);
      const f = flatten(...res(fg), b);
      return contrast(f, b);
    }));
    return { label, ratio: +ratio.toFixed(2), min, pass: ratio >= min };
  });
}

export { contrast, flatten } from './color.js';
