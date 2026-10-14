// The token block pasted into skill/SKILL.md (light/dark × apple/aa, no -hc sets) must resolve correctly too.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveSets } from '../scripts/resolve.mjs';

const md = readFileSync(new URL('../skill/SKILL.md', import.meta.url), 'utf8');
const css = md.match(/```css\n(\/\* hig-web-kit[\s\S]*?)```/)[1];
const sets = resolveSets();
const rules = [];
for (const m of css.matchAll(/(?:@media ([^{]+)\{\s*)?(:root[^{]*)\{([^}]*--hig-label:[^}]*)\}/g)) {
  rules.push({ media: m[1]?.trim() || null, selector: m[2].trim(), decls: Object.fromEntries([...m[3].matchAll(/--hig-([\w-]+):\s*([^;]+);/g)].map(d => [d[1], d[2].trim()])) });
}
const specificity = sel => (sel.match(/\[[^\]]+\]/g) || []).length;
function resolve(env) {
  const hits = rules.filter(r => {
    if (r.media?.includes('dark') && !env.osDark) return false;
    const attrs = { 'data-hig-mode': env.mode, 'data-hig-scheme': env.scheme };
    return (r.selector.replace(/^:root/, '').match(/:not\(\[[^\]]+\]\)|\[[^\]]+\]/g) || []).every(p => {
      const [, n, v] = p.match(/\[([\w-]+)="([^"]+)"\]/); const hit = attrs[n] === v; return p.startsWith(':not') ? !hit : hit;
    });
  });
  // CSS cascade: highest specificity wins, then source order
  return hits.reduce((best, r, i) => (!best || specificity(r.selector) >= specificity(best.selector) ? r : best), null)?.decls;
}
for (const mode of [undefined, 'aa']) for (const scheme of [undefined, 'light', 'dark']) for (const osDark of [false, true]) {
  const dark = scheme === 'dark' || (scheme !== 'light' && osDark);
  const expected = `${mode === 'aa' ? 'aa' : 'apple'}.${dark ? 'dark' : 'light'}`;
  test(`skill block: mode=${mode ?? '-'} scheme=${scheme ?? '-'} osDark=${osDark} → ${expected}`, () => {
    const got = resolve({ mode, scheme, osDark });
    for (const [k, v] of Object.entries(sets[expected])) assert.equal(got?.[k], v, `--hig-${k}`);
  });
}
