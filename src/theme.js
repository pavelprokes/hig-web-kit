// Accent themes at runtime.
//
//   import { setTheme, applyBrandColor } from 'hig-web-kit/theme';
//   setTheme('vzb');                 // a built-in theme from tokens.json (hig.css already contains its CSS)
//   applyBrandColor('#01497c');      // any brand color: derives AA-safe variants for all 8 sets and injects them
//   setTheme(null);                  // back to Apple's system blue
//
// Built-in themes: see tokens.themes (dist/tokens.js). Every theme keeps the brand's hue and moves only its
// lightness as needed, so the AA mode stays WCAG 2.2 AA with any brand.
import { tokens } from './tokens.js';
import { deriveTheme, themeCss } from './theme-derive.js';

const ATTR = 'data-hig-theme';
const STORE_KEY = 'hig-web-kit:theme';
const STYLE_ID = 'hig-theme-custom';
const html = () => document.documentElement;
const kebab = s => s.replace(/[A-Z]/g, c => '-' + c.toLowerCase()).replace(/([a-z])(\d)/g, '$1-$2');

/** Base color sets keyed like tokens.json ("aa.dark-hc"), values keyed like CSS ("accent-fill"). */
export function baseSets() {
  const out = {};
  for (const [mode, variants] of Object.entries(tokens.color)) for (const [v, set] of Object.entries(variants)) {
    out[`${mode}.${kebab(v)}`] = Object.fromEntries(Object.entries(set).map(([k, val]) => [kebab(k), val]));
  }
  return out;
}

/** Names and labels of the built-in themes. */
export function listThemes() {
  return Object.entries(tokens.themes || {}).map(([name, t]) => ({ name, label: t.label, brand: t.brand }));
}

/** Current theme name, or null for the default (Apple system blue). */
export function getTheme() { return html().getAttribute(ATTR); }

/** Switch to a built-in theme (or a name registered with applyBrandColor); null resets. */
export function setTheme(name, { persist = true } = {}) {
  if (name) html().setAttribute(ATTR, name); else html().removeAttribute(ATTR);
  if (persist) { try { name ? localStorage.setItem(STORE_KEY, name) : localStorage.removeItem(STORE_KEY); } catch { /* storage unavailable */ } }
}

/** Re-apply the saved theme, or a URL flag such as #theme=vzb (combinable: #aa-dark-theme=vzb). */
export function restoreTheme({ hash = true } = {}) {
  let name = null;
  try { name = localStorage.getItem(STORE_KEY); } catch { /* storage unavailable */ }
  if (hash && typeof location !== 'undefined') {
    const flag = location.hash.slice(1).toLowerCase().split(/[,+&._~-]/).find(f => f.startsWith('theme='));
    if (flag) name = flag.slice(6) || null;
  }
  if (name && (tokens.themes?.[name] || document.getElementById(`${STYLE_ID}-${name}`))) setTheme(name, { persist: false });
  return getTheme();
}

/**
 * Accent tokens for any brand color, for every set: { "apple.light": {accent, "accent-fill", …}, … }.
 * @param {string | {light: string, dark: string}} brand
 */
export function deriveBrandTheme(brand, overrides) { return deriveTheme(brand, baseSets(), overrides); }

/**
 * Derive a theme from a brand color, inject its CSS and activate it.
 * @returns the derived sets (useful for framework adapters such as getAntdTheme({ accent })).
 */
export function applyBrandColor(brand, { name = 'custom', activate = true, persist = false } = {}) {
  const sets = deriveBrandTheme(brand);
  const id = `${STYLE_ID}-${name}`;
  let style = document.getElementById(id);
  if (!style) { style = document.createElement('style'); style.id = id; document.head.append(style); }
  style.textContent = themeCss(name, sets);
  if (activate) setTheme(name, { persist });
  return sets;
}
