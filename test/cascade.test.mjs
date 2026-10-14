// Verifies the selector logic of dist/hig.css without a browser: for every combination of
// mode / scheme attribute / contrast attribute / OS media preferences, the last matching rule
// (all color rules share the same specificity) must resolve to the expected token set.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveSets } from '../scripts/resolve.mjs';

const css = readFileSync(new URL('../dist/hig.css', import.meta.url), 'utf8');
const sets = resolveSets();

// Parse "@media q { sel { decls } }" and "sel { decls }" blocks that declare --hig-label.
const rules = [];
const re = /(?:@media ([^{]+)\{\s*)?(:root[^{]*)\{([^}]*--hig-label:[^}]*)\}/g;
for (const m of css.matchAll(re)) {
  const decls = Object.fromEntries([...m[3].matchAll(/--hig-([\w-]+):\s*([^;]+);/g)].map(d => [d[1], d[2].trim()]));
  rules.push({ media: m[1]?.trim() || null, selector: m[2].trim(), decls });
}

function matches(rule, env) {
  if (rule.media) {
    for (const q of rule.media.split(' and ')) {
      if (q.includes('prefers-color-scheme: dark') && !env.osDark) return false;
      if (q.includes('prefers-contrast: more') && !env.osMore) return false;
    }
  }
  const attrs = { 'data-hig-mode': env.mode, 'data-hig-scheme': env.scheme, 'data-hig-contrast': env.contrast };
  const parts = rule.selector.replace(/^:root/, '').match(/:not\(\[[^\]]+\]\)|\[[^\]]+\]/g) || [];
  return parts.every(p => {
    const neg = p.startsWith(':not');
    const [, name, value] = p.match(/\[([\w-]+)="([^"]+)"\]/);
    const hit = attrs[name] === value;
    return neg ? !hit : hit;
  });
}

function resolve(env) {
  let out = null;
  for (const r of rules) if (matches(r, env)) out = r.decls;
  return out;
}

const modes = [undefined, 'aa'];
const schemes = [undefined, 'light', 'dark'];
const contrasts = [undefined, 'more', 'standard'];
const bools = [false, true];

test('hig.css has 8 color sets', () => {
  assert.ok(rules.length >= 8, `found ${rules.length} rules`);
});

for (const mode of modes) for (const scheme of schemes) for (const contrast of contrasts) for (const osDark of bools) for (const osMore of bools) {
  const env = { mode, scheme, contrast, osDark, osMore };
  const dark = scheme === 'dark' || (scheme !== 'light' && osDark);
  const hc = contrast === 'more' || (contrast !== 'standard' && osMore);
  const expected = `${mode === 'aa' ? 'aa' : 'apple'}.${dark ? 'dark' : 'light'}${hc ? '-hc' : ''}`;
  test(`mode=${mode ?? '-'} scheme=${scheme ?? '-'} contrast=${contrast ?? '-'} osDark=${osDark} osMore=${osMore} → ${expected}`, () => {
    const got = resolve(env);
    assert.ok(got, 'no rule matched');
    for (const [k, v] of Object.entries(sets[expected])) assert.equal(got[k], v, `--hig-${k}`);
  });
}
