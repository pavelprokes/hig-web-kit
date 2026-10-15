import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const dist = f => new URL(`../dist/${f}`, import.meta.url);

test('every package export points to an existing file', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  for (const [key, target] of Object.entries(pkg.exports)) {
    const files = typeof target === 'string' ? [target] : Object.values(target);
    for (const f of files) assert.ok(existsSync(new URL(`../${f}`, import.meta.url)), `${key} → ${f}`);
  }
});

test('ESM and CJS token builds agree', async () => {
  const esm = (await import(dist('tokens.js'))).tokens;
  const cjs = require('../dist/tokens.cjs');
  assert.deepEqual(cjs.tokens, esm);
  assert.deepEqual(cjs.color, esm.color);
  assert.equal(esm.color.aa.light.accentFill, '#0071e3');
});

test('WCAG AA contrast check passes for all aa sets', () => {
  execFileSync(process.execPath, ['scripts/check-contrast.mjs'], { cwd: ROOT, stdio: 'pipe' });
});

test('runtime contrast helper matches known WCAG values', async () => {
  const { contrast } = await import(dist('color.js'));
  assert.equal(+contrast('#000000', '#ffffff').toFixed(2), 21);
  assert.equal(+contrast('#767676', '#ffffff').toFixed(2), 4.54);
});

test('Ant Design theme: real antd resolves our tokens', async () => {
  const { theme } = await import('antd');
  const { getAntdTheme, higAntd } = await import(dist('antd.js'));
  for (const mode of ['apple', 'aa']) for (const scheme of ['light', 'dark']) {
    const cfg = getAntdTheme({ mode, scheme });
    const t = theme.getDesignToken(cfg);
    const { tokens } = await import(dist('tokens.js'));
    const c = tokens.color[mode][scheme];
    assert.equal(t.colorPrimary.toLowerCase(), c.accentFill, `${mode}/${scheme} colorPrimary`);
    assert.equal(t.colorTextPlaceholder.toLowerCase(), c.placeholder, `${mode}/${scheme} placeholder`);
    assert.equal(t.controlHeight, 44);
  }
  assert.equal(higAntd({ mode: 'aa' }).input.variant, 'outlined');
  assert.equal(higAntd().button.shape, 'round');
  assert.equal(theme.getDesignToken(getAntdTheme({ density: 'desktop' })).fontSize, 13);
});

test('MUI: createTheme accepts the options', async () => {
  const { createTheme } = await import('@mui/material/styles');
  const { higMui } = await import(dist('mui.js'));
  const t = createTheme(higMui({ mode: 'aa', scheme: 'dark' }));
  assert.equal(t.palette.mode, 'dark');
  assert.equal(t.palette.primary.main, '#0066cc');
});

test('Tailwind v4 compiles utilities from tailwind.css', () => {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL('../node_modules/@tailwindcss/cli/dist/index.mjs', import.meta.url)), '-i', 'test/fixtures/tailwind-input.css', '--cwd', ROOT], { cwd: ROOT, encoding: 'utf8' });
  for (const needle of ['var(--hig-bg)', 'var(--hig-label)', 'var(--hig-radius-card)', 'var(--hig-accent-fill)']) assert.ok(out.includes(needle), needle);
});

test('Sass: hig.scss and the Bootstrap bridge compile with Bootstrap 5', async () => {
  const sass = await import('sass');
  const r = sass.compile('test/fixtures/bootstrap-test.scss', { loadPaths: ['dist', 'node_modules'], quietDeps: true, silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'legacy-js-api', 'if-function'] });
  assert.ok(r.css.includes('--bs-primary: #0071e3'), 'AA primary applied to Bootstrap');
  assert.ok(r.css.includes('border-radius: 999px') || r.css.includes('--bs-btn-border-radius: 999px'));
});

test('standalone demo has no external dist references', () => {
  const html = readFileSync(dist('demo.html'), 'utf8');
  assert.ok(!html.includes('../dist/'));
  assert.ok(html.includes('--hig-label'));
});

test('Ant Design in AA mode: resolved antd tokens meet WCAG 2.2 AA', async () => {
  const { theme } = await import('antd');
  const { getAntdTheme } = await import(dist('antd.js'));
  const { contrast, flatten } = await import(dist('color.js'));
  for (const scheme of ['light', 'dark']) for (const contrastPref of ['standard', 'more']) {
    const t = theme.getDesignToken(getAntdTheme({ mode: 'aa', scheme, contrast: contrastPref }));
    const on = (fg, bg) => { const b = flatten(bg, '#ffffff'); return contrast(flatten(fg, b), b); };
    const checks = [
      ['label on primary button', t.colorTextLightSolid, t.colorPrimary, 4.5],
      ['label on primary hover', t.colorTextLightSolid, t.colorPrimaryHover, 4.5],
      ['label on primary active', t.colorTextLightSolid, t.colorPrimaryActive, 4.5],
      ['label on danger button', t.colorTextLightSolid, t.colorError, 4.5],
      ['text on container', t.colorText, t.colorBgContainer, 4.5],
      ['secondary text on container', t.colorTextSecondary, t.colorBgContainer, 4.5],
      ['secondary text on layout', t.colorTextSecondary, t.colorBgLayout, 4.5],
      ['tertiary text on container', t.colorTextTertiary, t.colorBgContainer, 4.5],
      ['placeholder on container', t.colorTextPlaceholder, t.colorBgContainer, 4.5],
      ['link on container', t.colorLink, t.colorBgContainer, 4.5],
      ['primary text on container', t.colorPrimaryText, t.colorBgContainer, 4.5],
      ['error text on container', t.colorErrorText, t.colorBgContainer, 4.5],
      ['success text on container', t.colorSuccessText, t.colorBgContainer, 4.5],
      ['warning text on container', t.colorWarningText, t.colorBgContainer, 4.5],
      ['input border on container', t.colorBorder, t.colorBgContainer, 3],
      ['focus outline on container', t.controlOutline, t.colorBgContainer, 3],
    ];
    const comp = getAntdTheme({ mode: 'aa', scheme, contrast: contrastPref }).components;
    checks.push(
      ['avatar initials', '#ffffff', comp.Avatar.colorTextPlaceholder, 4.5],
      ['badge count', comp.Badge.colorTextLightSolid, comp.Badge.colorError, 4.5],
      ['tooltip text', comp.Tooltip.colorTextLightSolid, comp.Tooltip.colorBgSpotlight, 4.5],
      ['breadcrumb link', comp.Breadcrumb.linkColor, t.colorBgContainer, 4.5],
      ['breadcrumb separator', comp.Breadcrumb.separatorColor, t.colorBgContainer, 3],
      ['checkbox outline', comp.Checkbox.colorBorder, t.colorBgContainer, 3],
      ['radio outline', comp.Radio.colorBorder, t.colorBgContainer, 3],
      ['tag text', comp.Tag.defaultColor, flatten(comp.Tag.defaultBg, t.colorBgContainer), 4.5],
      ['solid radio button label', comp.Radio.buttonSolidCheckedColor, comp.Radio.buttonSolidCheckedBg, 4.5],
    );
    for (const [label, fg, bg, min] of checks) {
      const r = on(fg, bg);
      assert.ok(r >= min, `${scheme}/${contrastPref}: ${label} ${r.toFixed(2)} < ${min} (${fg} on ${bg})`);
    }
  }
});

test('extended components: fixed colors used by components.css meet AA where the AA mode relies on them', async () => {
  const { contrast } = await import(dist('color.js'));
  assert.ok(contrast('#ffffff', '#6e737d') >= 4.5, 'AA avatar initials (gradient top)');
  assert.ok(contrast('#ffffff', '#555960') >= 4.5, 'AA avatar initials (gradient bottom)');
  assert.ok(contrast('#ffffff', '#636366') >= 4.5, 'swipe action label');
});

test('components.css ships the extended components', () => {
  const css = readFileSync(dist('components.css'), 'utf8');
  for (const cls of ['.hig-checkbox', '.hig-radio', '.hig-popup', '.hig-select', '.hig-date', '.hig-tokens', '.hig-sidebar', '.hig-split', '.hig-page-control',
    '.hig-disclosure', '.hig-chip', '.hig-path', '.hig-activity', '.hig-progress-ring', '.hig-gauge', '.hig-rating', '.hig-popover', '.hig-tooltip',
    '.hig-empty', '.hig-skeleton', '.hig-banner', '.hig-toast', '.hig-table', '.hig-swipe', '.hig-menu--context', '.hig-avatar', '.hig-card', '.hig-widget', '.hig-grid']) {
    assert.ok(css.includes(cls), `missing ${cls}`);
  }
  assert.ok(!/:is\([^)]*::/.test(css), 'pseudo-elements inside :is() invalidate the whole rule');
});
