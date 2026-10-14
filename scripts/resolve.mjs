// Loads tokens/tokens.json and resolves the $extends chains into flat, normalized color sets.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseColor, toHex } from '../src/color.js';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const SETS = ['apple.light', 'apple.dark', 'apple.light-hc', 'apple.dark-hc', 'aa.light', 'aa.dark', 'aa.light-hc', 'aa.dark-hc'];

export function loadTokens() {
  return JSON.parse(readFileSync(new URL('../tokens/tokens.json', import.meta.url), 'utf8'));
}

export function resolveSets(tokens = loadTokens()) {
  const raw = tokens.color;
  const out = {};
  const resolve = name => {
    if (out[name]) return out[name];
    const def = raw[name];
    if (!def) throw new Error(`Unknown color set ${name}`);
    const { $extends, ...own } = def;
    const base = $extends ? resolve($extends) : {};
    const merged = { ...base };
    for (const [k, v] of Object.entries(own)) merged[k] = toHex(parseColor(v));
    out[name] = merged;
    return merged;
  };
  SETS.forEach(resolve);
  // every set must define every key of the base set
  const keys = Object.keys(out['apple.light']);
  for (const s of SETS) {
    const missing = keys.filter(k => !(k in out[s]));
    if (missing.length) throw new Error(`${s} is missing ${missing.join(', ')}`);
  }
  return out;
}
