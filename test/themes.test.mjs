// Accent themes: selector logic in hig.css, AA safety of derived colors, adapters and the runtime helper.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveSets, resolveThemes } from '../scripts/resolve.mjs';
import { deriveTheme } from '../src/theme-derive.js';
import { flatten, contrast } from '../src/color.js';
import { PAIRS, BACKDROPS, resolveLayers } from '../src/contrast-pairs.js';

const css = readFileSync(new URL('../dist/hig.css', import.meta.url), 'utf8');
const sets = resolveSets();
const themes = await resolveThemes(undefined, sets);

const rules = [];
for (const m of css.matchAll(/(?:@media ([^{]+)\{\s*)?(:root\[data-hig-theme[^{]*)\{([^}]*)\}/g)) {
  rules.push({ media: m[1]?.trim() || null, selector: m[2].trim(), decls: Object.fromEntries([...m[3].matchAll(/--hig-([\w-]+):\s*([^;]+);/g)].map(d => [d[1], d[2].trim()])) });
}
const matches = (rule, env) => {
  if (rule.media) for (const q of rule.media.split(' and ')) {
    if (q.includes('prefers-color-scheme: dark') && !env.osDark) return false;
    if (q.includes('prefers-contrast: more') && !env.osMore) return false;
  }
  const attrs = { 'data-hig-mode': env.mode, 'data-hig-scheme': env.scheme, 'data-hig-contrast': env.contrast, 'data-hig-theme': env.theme };
  return (rule.selector.replace(/^:root/, '').match(/:not\(\[[^\]]+\]\)|\[[^\]]+\]/g) || []).every(p => {
    const [, n, v] = p.match(/\[([\w-]+)="([^"]+)"\]/); const hit = attrs[n] === v; return p.startsWith(':not') ? !hit : hit;
  });
};

test('every built-in theme is in hig.css', () => {
  for (const name of Object.keys(themes)) assert.ok(css.includes(`[data-hig-theme="${name}"]`), name);
});

for (const theme of ['vzb', 'orange']) for (const mode of [undefined, 'aa']) for (const scheme of [undefined, 'dark']) for (const osMore of [false, true]) {
  const expected = `${mode === 'aa' ? 'aa' : 'apple'}.${scheme === 'dark' ? 'dark' : 'light'}${osMore ? '-hc' : ''}`;
  test(`theme=${theme} mode=${mode ?? '-'} scheme=${scheme ?? '-'} osMore=${osMore} → ${expected}`, () => {
    let got = null;
    for (const r of rules) if (matches(r, { theme, mode, scheme, osMore, osDark: false })) got = r.decls;
    assert.deepEqual(got, themes[theme].sets[expected]);
  });
}

test('theme rules outrank base rules (one more attribute selector)', () => {
  const count = s => (s.match(/\[[^\]]+\]/g) || []).length;
  const base = css.match(/(:root:not\(\[data-hig-mode="aa"\]\)[^{]*)\{/)[1];
  assert.equal(count(rules[0].selector), count(base) + 1);
});

test('any brand color yields AA-safe accents in every aa set', () => {
  for (const brand of ['#01497c', '#ffd600', '#c8102e', '#24c55e', '#9b51e0', '#ffffff', '#000000', '#7fd1ff']) {
    const th = deriveTheme(brand, sets);
    for (const name of ['aa.light', 'aa.dark', 'aa.light-hc', 'aa.dark-hc']) {
      const set = { ...sets[name], ...th[name] };
      for (const [label, fg, bg, min] of PAIRS) {
        const r = Math.min(...BACKDROPS.map(bd => { const b = flatten(...resolveLayers(bg, set, bd), '#ffffff'); return contrast(flatten(...resolveLayers(fg, set, bd), b), b); }));
        assert.ok(r >= min, `${brand} ${name}: ${label} ${r.toFixed(2)} < ${min}`);
      }
    }
  }
});

test('VZB theme keeps the brand navy in light mode', () => {
  assert.equal(themes.vzb.sets['apple.light']['accent-fill'], '#01497c');
  assert.equal(themes.vzb.sets['aa.light']['accent-fill'], '#01497c');
});

test('adapters accept a theme name or a brand color', async () => {
  const { getAntdTheme } = await import('../dist/antd.js');
  const { higMui } = await import('../dist/mui.js');
  assert.equal(getAntdTheme({ accent: 'vzb' }).token.colorPrimary, '#01497c');
  assert.equal(getAntdTheme({ accent: 'vzb', mode: 'aa', scheme: 'dark' }).token.colorPrimary, themes.vzb.sets['aa.dark']['accent-fill']);
  const custom = getAntdTheme({ accent: '#c8102e', mode: 'aa' }).token;
  assert.ok(contrast(custom.colorTextLightSolid, custom.colorPrimary) >= 4.5);
  assert.equal(higMui({ accent: 'vzb' }).palette.primary.main, '#01497c');
});

test('dist/tokens.js exposes themes', async () => {
  const { tokens } = await import('../dist/tokens.js');
  assert.equal(tokens.themes.vzb.label, 'Vzdělání budoucnosti');
  assert.ok(tokens.themes.vzb.color.aa.darkHc.accentText);
});
