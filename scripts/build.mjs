#!/usr/bin/env node
// Generates every distributable from tokens/tokens.json + src/.
//   dist/hig.css              CSS custom properties (all modes / schemes / contrast) + type & base helpers
//   dist/glass.css            Liquid Glass material classes
//   dist/components.css       Framework-free components (.hig-btn, .hig-switch, …)
//   dist/tokens.{js,cjs,d.ts,json}  Resolved values for JS (antd, MUI, charts, …)
//   dist/hig.scss             Sass variables + maps
//   dist/tailwind.css         Tailwind v4 theme (@theme inline)
//   dist/tailwind-preset.cjs  Tailwind v3 preset
//   dist/shadcn.css           shadcn/ui variable bridge
//   dist/hig-bootstrap.scss   Bootstrap 5 variable overrides
//   dist/antd.{js,d.ts}       Ant Design ThemeConfig factory
//   dist/mui.{js,d.ts}        MUI theme options factory
//   dist/a11y.{js,d.ts}       Mode / scheme / contrast switching + contrast helpers
//   dist/glass.{js,d.ts}      Liquid Glass behaviours (refraction, press light, adaptivity)
//   dist/demo.html            Self-contained demo (built from demo/index.html)
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, SETS, loadTokens, resolveSets, resolveThemes } from './resolve.mjs';
import { themeCss } from '../src/theme-derive.js';

const tokens = loadTokens();
const sets = resolveSets(tokens);
const themes = await resolveThemes(tokens, sets);
const DIST = join(ROOT, 'dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
const write = (f, s) => writeFileSync(join(DIST, f), s.trimStart());
const src = f => readFileSync(join(ROOT, 'src', f), 'utf8');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const banner = `/*! hig-web-kit v${pkg.version} | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */\n`;
const camel = s => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const px = n => `${n / 16}rem`;

/* ───────────── hig.css ───────────── */
// Mutually exclusive, equal-specificity selectors; later rules win when several match.
// Mode:     [data-hig-mode="aa"] vs default (apple)
// Scheme:   [data-hig-scheme="light|dark"] overrides prefers-color-scheme
// Contrast: [data-hig-contrast="more|standard"] overrides prefers-contrast
function selectorsFor(mode, scheme, hc) {
  const m = mode === 'aa' ? '[data-hig-mode="aa"]' : ':not([data-hig-mode="aa"])';
  const rules = []; // [mediaQuery|null, selector]
  const schemeOpts = scheme === 'dark'
    ? [[null, '[data-hig-scheme="dark"]'], ['(prefers-color-scheme: dark)', ':not([data-hig-scheme="light"])']]
    : [[null, ':not([data-hig-scheme="dark"])']];
  const contrastOpts = hc
    ? [[null, '[data-hig-contrast="more"]'], ['(prefers-contrast: more)', ':not([data-hig-contrast="standard"])']]
    : [[null, ':not([data-hig-contrast="more"])']];
  for (const [sq, ss] of schemeOpts) for (const [cq, cs] of contrastOpts) {
    const mq = [sq, cq].filter(Boolean).join(' and ');
    rules.push([mq || null, `:root${m}${ss}${cs}`]);
  }
  return rules;
}
const decl = (set, dark) => Object.entries(set).map(([k, v]) => `  --hig-${k}: ${v};`).join('\n') + `\n  color-scheme: ${dark ? 'dark' : 'light'};`;

let css = banner + `/* Usage: <html> (optional) data-hig-mode="aa" · data-hig-scheme="light|dark" · data-hig-contrast="more|standard" */\n\n`;
css += ':root {\n';
for (const [k, v] of Object.entries(tokens.font.family)) css += `  --hig-font-${k}: ${v};\n`;
for (const [k, v] of Object.entries(tokens.radius)) css += `  --hig-radius-${k}: ${v}px;\n`;
for (const [k, v] of Object.entries(tokens.space)) css += `  --hig-space-${k}: ${px(v)};\n`;
for (const [k, v] of Object.entries(tokens.size)) css += `  --hig-size-${k}: ${v}px;\n`;
for (const [k, v] of Object.entries(tokens.motion)) css += `  --hig-${k.startsWith('duration') ? k : 'ease-' + k.replace('ease-', '')}: ${v};\n`;
for (const [k, v] of Object.entries(tokens.glass)) css += `  --hig-glass-${k}: ${v};\n`;
for (const [style, t] of Object.entries(tokens.font.ios)) {
  css += `  --hig-text-${style}: ${t.weight} ${px(t.size)}/${(t.line / t.size).toFixed(3)} var(--hig-font-sans);\n`;
}
for (const [style, t] of Object.entries(tokens.font.macos)) {
  css += `  --hig-text-mac-${style}: ${t.weight} ${px(t.size)}/${(t.line / t.size).toFixed(3)} var(--hig-font-sans);\n`;
}
css += '}\n\n';
for (const mode of ['apple', 'aa']) {
  css += `/* ── ${mode === 'aa' ? 'WCAG 2.2 AA mode' : 'Apple mode (default)'} ── */\n`;
  for (const [variant, scheme, hc] of [['light', 'light', false], ['dark', 'dark', false], ['light-hc', 'light', true], ['dark-hc', 'dark', true]]) {
    const body = decl(sets[`${mode}.${variant}`], scheme === 'dark');
    for (const [mq, sel] of selectorsFor(mode, scheme, hc)) {
      css += mq ? `@media ${mq} {\n${sel} {\n${body.replace(/^/gm, '  ')}\n  }\n}\n` : `${sel} {\n${body}\n}\n`;
    }
  }
  css += '\n';
}
css += `/* ── Accent themes: <html data-hig-theme="${Object.keys(themes).join(' | ')}"> (setTheme() in hig-web-kit/theme) ── */\n`;
for (const [name, th] of Object.entries(themes)) css += `/* ${th.label} */\n` + themeCss(name, th.sets);
css += '\n';
css += `/* Glass shadow composed from the scheme-aware color */
:root { --hig-glass-shadow: 0 8px 28px var(--hig-glass-shadow-color), 0 1px 3px var(--hig-glass-shadow-color); }

/* Type helpers (iOS Dynamic Type "Large"; .hig-mac-* for desktop density) */
${Object.keys(tokens.font.ios).map(s => `.hig-text-${s} { font: var(--hig-text-${s}); }`).join('\n')}
${Object.keys(tokens.font.macos).map(s => `.hig-text-mac-${s} { font: var(--hig-text-mac-${s}); }`).join('\n')}
`;
write('hig.css', css);
write('base.css', banner + src('base.css'));
write('glass.css', banner + src('glass.css'));
write('components.css', banner + src('components.css'));

/* ───────────── tokens.js / cjs / d.ts / json ───────────── */
const nested = {};
for (const s of SETS) {
  const [mode, variant] = s.split('.');
  (nested[mode] ??= {})[camel(variant)] = Object.fromEntries(Object.entries(sets[s]).map(([k, v]) => [camel(k), v]));
}
const data = {
  color: nested,
  font: { family: tokens.font.family, ios: tokens.font.ios, macos: tokens.font.macos },
  radius: tokens.radius, space: tokens.space, size: tokens.size, motion: tokens.motion, glass: tokens.glass,
  themes: Object.fromEntries(Object.entries(themes).map(([n, th]) => [n, {
    label: th.label, brand: th.brand,
    color: Object.fromEntries(['apple', 'aa'].map(m => [m, Object.fromEntries(['light', 'dark', 'light-hc', 'dark-hc'].map(v => [camel(v),
      Object.fromEntries(Object.entries(th.sets[`${m}.${v}`]).map(([k, val]) => [camel(k), val]))]))])),
  }])),
};
const json = JSON.stringify(data, null, 2);
write('tokens.json', json + '\n');
write('tokens.js', `${banner}export const tokens = ${json};\nexport default tokens;\n`);
write('tokens.cjs', `${banner}'use strict';\nconst tokens = ${json};\nmodule.exports = { ...tokens, tokens, default: tokens };\n`);
const colorKeys = Object.keys(nested.apple.light);
write('tokens.d.ts', `${banner}
export type HigColorName = ${colorKeys.map(k => `'${k}'`).join(' | ')};
export type HigColorSet = Record<HigColorName, string>;
export interface HigModeColors { light: HigColorSet; dark: HigColorSet; lightHc: HigColorSet; darkHc: HigColorSet; }
export interface HigTextStyle { size: number; line: number; weight: number; }
export type HigTextStyleName = ${Object.keys(tokens.font.ios).map(k => `'${k}'`).join(' | ')};
export interface HigTokens {
  color: { apple: HigModeColors; aa: HigModeColors };
  font: { family: Record<'sans' | 'rounded' | 'serif' | 'mono', string>; ios: Record<HigTextStyleName, HigTextStyle>; macos: Record<HigTextStyleName, HigTextStyle> };
  radius: Record<${Object.keys(tokens.radius).map(k => `'${k}'`).join(' | ')}, number>;
  space: Record<${Object.keys(tokens.space).map(k => `'${k}'`).join(' | ')}, number>;
  size: Record<${Object.keys(tokens.size).map(k => `'${k}'`).join(' | ')}, number>;
  motion: Record<${Object.keys(tokens.motion).map(k => `'${k}'`).join(' | ')}, string>;
  glass: Record<${Object.keys(tokens.glass).map(k => `'${k}'`).join(' | ')}, string>;
  themes: Record<HigThemeName, HigTheme>;
}
export type HigThemeName = ${Object.keys(themes).map(k => `'${k}'`).join(' | ')};
export type HigAccentName = 'accent' | 'accentFill' | 'accentText' | 'onAccent' | 'link' | 'focusRing';
export interface HigTheme {
  label: string;
  brand: string | { light: string; dark: string };
  color: Record<'apple' | 'aa', Record<'light' | 'dark' | 'lightHc' | 'darkHc', Record<HigAccentName, string>>>;
}
export declare const tokens: HigTokens;
export default tokens;
`);

/* ───────────── hig.scss ───────────── */
let scss = banner.replace('/*!', '//').replace(' */', '') + `// CSS-variable-backed Sass variables: they follow mode, scheme and contrast at runtime.\n`;
for (const k of Object.keys(sets['apple.light'])) scss += `$hig-${k}: var(--hig-${k});\n`;
scss += `\n// Static values per set (for build-time use, e.g. Bootstrap variable overrides)\n$hig-colors: (\n`;
for (const s of SETS) {
  scss += `  "${s}": (\n${Object.entries(sets[s]).map(([k, v]) => `    "${k}": ${v}`).join(',\n')}\n  ),\n`;
}
scss += `);\n\n@function hig-color($name, $set: "apple.light") { @return map-get(map-get($hig-colors, $set), $name); }\n\n`;
for (const [k, v] of Object.entries(tokens.radius)) scss += `$hig-radius-${k}: ${v}px;\n`;
for (const [k, v] of Object.entries(tokens.size)) scss += `$hig-size-${k}: ${v}px;\n`;
for (const [k, v] of Object.entries(tokens.font.family)) scss += `$hig-font-${k}: ${v};\n`;
write('hig.scss', scss);

/* ───────────── Tailwind v4 / v3, shadcn, Bootstrap ───────────── */
const colorNames = Object.keys(sets['apple.light']).filter(k => !k.startsWith('glass-') && k !== 'scrim');
write('tailwind.css', `${banner}/* Tailwind CSS v4: @import "tailwindcss"; @import "hig-web-kit/hig.css"; @import "hig-web-kit/tailwind.css"; */
@theme inline {
${colorNames.map(k => `  --color-hig-${k}: var(--hig-${k});`).join('\n')}
  --color-hig-glass: var(--hig-glass-tint);
  --color-hig-glass-label: var(--hig-glass-label);
${Object.keys(tokens.font.family).map(k => `  --font-hig-${k}: var(--hig-font-${k});`).join('\n')}
${Object.entries(tokens.radius).map(([k]) => `  --radius-hig-${k}: var(--hig-radius-${k});`).join('\n')}
${Object.entries(tokens.font.ios).map(([k, t]) => `  --text-hig-${k}: ${px(t.size)};\n  --text-hig-${k}--line-height: ${(t.line / t.size).toFixed(3)};\n  --text-hig-${k}--font-weight: ${t.weight};`).join('\n')}
  --ease-hig-spring: var(--hig-ease-spring);
  --ease-hig-out: var(--hig-ease-out);
}
`);
write('tailwind-preset.cjs', `${banner}// Tailwind CSS v3 preset: module.exports = { presets: [require('hig-web-kit/tailwind-preset')], … }
// Requires dist/hig.css to be loaded (it defines the --hig-* variables).
module.exports = {
  theme: {
    extend: {
      colors: { hig: {
${colorNames.map(k => `        '${k}': 'var(--hig-${k})',`).join('\n')}
        glass: 'var(--hig-glass-tint)',
        'glass-label': 'var(--hig-glass-label)',
      } },
      fontFamily: { ${Object.keys(tokens.font.family).map(k => `'hig-${k}': ['var(--hig-font-${k})']`).join(', ')} },
      borderRadius: { ${Object.keys(tokens.radius).map(k => `'hig-${k}': 'var(--hig-radius-${k})'`).join(', ')} },
      fontSize: {
${Object.entries(tokens.font.ios).map(([k, t]) => `        'hig-${k}': ['${px(t.size)}', { lineHeight: '${(t.line / t.size).toFixed(3)}', fontWeight: '${t.weight}' }],`).join('\n')}
      },
      transitionTimingFunction: { 'hig-spring': 'var(--hig-ease-spring)', 'hig-out': 'var(--hig-ease-out)' },
      minHeight: { tap: '44px' }, minWidth: { tap: '44px' },
    },
  },
};
`);
write('shadcn.css', `${banner}/* shadcn/ui bridge: load after hig.css, before your components. Maps shadcn's variables onto --hig-* so
   light/dark, increased contrast and AA mode switch automatically. */
:root {
  --background: var(--hig-bg);
  --foreground: var(--hig-label);
  --card: var(--hig-bg-elevated);
  --card-foreground: var(--hig-label);
  --popover: var(--hig-bg-elevated);
  --popover-foreground: var(--hig-label);
  --primary: var(--hig-accent-fill);
  --primary-foreground: var(--hig-on-accent);
  --secondary: var(--hig-fill-2);
  --secondary-foreground: var(--hig-accent-text);
  --muted: var(--hig-bg-2);
  --muted-foreground: var(--hig-label-2);
  --accent: var(--hig-fill-3);
  --accent-foreground: var(--hig-label);
  --destructive: var(--hig-destructive-fill);
  --destructive-foreground: var(--hig-on-destructive);
  --border: var(--hig-sep);
  --input: var(--hig-control-border);
  --ring: var(--hig-focus-ring);
  --radius: var(--hig-radius-md);
  --chart-1: var(--hig-blue); --chart-2: var(--hig-green); --chart-3: var(--hig-orange); --chart-4: var(--hig-purple); --chart-5: var(--hig-teal);
  --sidebar: var(--hig-bg-2);
  --sidebar-foreground: var(--hig-label);
  --sidebar-primary: var(--hig-accent-fill);
  --sidebar-primary-foreground: var(--hig-on-accent);
  --sidebar-accent: var(--hig-fill-3);
  --sidebar-accent-foreground: var(--hig-label);
  --sidebar-border: var(--hig-sep);
  --sidebar-ring: var(--hig-focus-ring);
}
`);
const bs = (set) => sets[set];
write('hig-bootstrap.scss', `${banner.replace('/*!', '//').replace(' */', '')}// Bootstrap 5.3: @import "hig-web-kit/dist/hig-bootstrap"; then @import "bootstrap/scss/bootstrap";
// Static values are required by Bootstrap's Sass color math; runtime theming uses the CSS variables below.
// Set $hig-set: "aa.light" before importing for the WCAG AA palette.
$hig-set: "apple.light" !default;
@import "hig";
$primary: hig-color("accent-fill", $hig-set) !default;
$danger: hig-color("destructive-fill", $hig-set) !default;
$success: hig-color("switch-on", $hig-set) !default;
$warning: hig-color("orange", $hig-set) !default;
$info: hig-color("cyan", $hig-set) !default;
$body-bg: hig-color("bg", $hig-set) !default;
$body-color: hig-color("label", $hig-set) !default;
$link-color: hig-color("link", $hig-set) !default;
$font-family-sans-serif: $hig-font-sans !default;
$font-family-monospace: $hig-font-mono !default;
$font-size-base: 1.0625rem !default;
$line-height-base: 1.294 !default;
$border-radius: $hig-radius-md !default;
$border-radius-lg: $hig-radius-lg !default;
$border-radius-pill: 999px !default;
$btn-border-radius: 999px !default;
$btn-padding-y: .625rem !default;
$btn-padding-x: 1.25rem !default;
$btn-font-weight: 600 !default;
$input-border-radius: $hig-radius-field !default;
$input-padding-y: .625rem !default;
$focus-ring-width: 3px !default;
$focus-ring-opacity: 1 !default;
$enable-shadows: false !default;
$enable-gradients: false !default;
`);
// keep Bootstrap's own color vars in sync at runtime (light/dark/AA)
writeFileSync(join(DIST, 'bootstrap-runtime.css'), `${banner}[data-bs-theme], :root {
  --bs-body-bg: var(--hig-bg); --bs-body-color: var(--hig-label); --bs-secondary-color: var(--hig-label-2);
  --bs-border-color: var(--hig-sep); --bs-link-color: var(--hig-link); --bs-link-hover-color: var(--hig-link);
  --bs-primary: var(--hig-accent-fill); --bs-danger: var(--hig-destructive-fill); --bs-focus-ring-color: var(--hig-focus-ring);
}
`);

/* ───────────── JS modules ───────────── */
const jsFiles = {
  'color.js': 'color.js', 'color.d.ts': 'color.d.ts', 'contrast-pairs.js': 'contrast-pairs.js',
  'a11y.js': 'a11y.js', 'a11y.d.ts': 'a11y.d.ts', 'glass.js': 'glass.js', 'glass.d.ts': 'glass.d.ts',
  'components.js': 'components.js', 'components.d.ts': 'components.d.ts',
  'theme-derive.js': 'theme-derive.js', 'theme.js': 'theme.js', 'theme.d.ts': 'theme.d.ts',
  'antd.js': 'adapters/antd.js', 'antd.d.ts': 'adapters/antd.d.ts', 'mui.js': 'adapters/mui.js', 'mui.d.ts': 'adapters/mui.d.ts',
};
for (const [out, from] of Object.entries(jsFiles)) writeFileSync(join(DIST, out), (out.endsWith('.js') ? banner : '') + src(from));
write('contrast-pairs.d.ts', `export declare const BACKDROPS: string[];
export declare const PAIRS: [label: string, fg: string[], bg: string[], min: number][];
export declare function resolveLayers(layers: string[], set: Record<string, any>, backdrop: string): any[];
`);
write('antd-glass.css', banner + src('adapters/antd-glass.css'));

/* ───────────── standalone demo (all CSS/JS inlined; modules wrapped in IIFEs) ───────────── */
function inlineModule(file) {
  let code = readFileSync(join(DIST, file), 'utf8');
  const names = [];
  code = code
    .replace(/^import [^;]+;\s*$/gm, '')
    .replace(/^export \{[^}]*\} from [^;]+;\s*$/gm, '')
    .replace(/^export default [^;]+;\s*$/gm, '')
    .replace(/^export (async function|function|const|let|class) ([A-Za-z_$][\w$]*)/gm, (_, kind, name) => { names.push(name); return `${kind} ${name}`; });
  return `const { ${names.join(', ')} } = (() => {\n${code}\nreturn { ${names.join(', ')} };\n})();\n`;
}
const demoSrc = readFileSync(join(ROOT, 'demo/index.html'), 'utf8');
const runtime = ['color.js', 'contrast-pairs.js', 'tokens.js', 'theme-derive.js', 'glass.js', 'a11y.js', 'theme.js', 'components.js'].map(inlineModule).join('\n');
const demo = demoSrc
  .replace(/<link rel="stylesheet" href="\.\.\/dist\/([\w.-]+\.css)">/g, (_, f) => `<style>\n${readFileSync(join(DIST, f), 'utf8')}\n</style>`)
  .replace(/(<script type="module">\n)((?:import [^\n]+ from '\.\.\/dist\/[\w.-]+';\n)+)/, (_, open) => `${open}${runtime}\n`);
if (/from '\.\.\/dist\//.test(demo)) throw new Error('demo: unresolved dist import');
write('demo.html', demo);

console.log(`Built ${SETS.length} color sets and ${Object.keys(themes).length} themes → dist/`);

/* ───────────── docs/tokens.md (reference table, regenerated on every build) ───────────── */
{
  const keys = Object.keys(sets['apple.light']);
  let md = `# Token reference\n\nGenerated from \`tokens/tokens.json\` by \`npm run build\` — do not edit by hand.\n\n` +
    `CSS: \`var(--hig-<name>)\` · JS: \`tokens.color.<mode>.<variant>.<camelName>\` (variants: \`light\`, \`dark\`, \`lightHc\`, \`darkHc\`).\n\n## Colors\n\n` +
    `| Token | ${SETS.map(s => `\`${s}\``).join(' | ')} |\n|---|${SETS.map(() => '---').join('|')}|\n`;
  for (const k of keys) md += `| \`${k}\` | ${SETS.map(s => `\`${sets[s][k]}\``).join(' | ')} |\n`;
  md += `\n## Type (iOS / macOS)\n\n| Style | iOS size/line/weight | macOS size/line/weight | CSS |\n|---|---|---|---|\n`;
  for (const [k, t] of Object.entries(tokens.font.ios)) { const m = tokens.font.macos[k]; md += `| ${k} | ${t.size}/${t.line}/${t.weight} | ${m.size}/${m.line}/${m.weight} | \`font: var(--hig-text-${k})\` / \`var(--hig-text-mac-${k})\` |\n`; }
  md += `\n## Radius, space, size\n\n` +
    `- Radius (px): ${Object.entries(tokens.radius).map(([k, v]) => `\`${k}\` ${v}`).join(' · ')}\n` +
    `- Space (px): ${Object.entries(tokens.space).map(([k, v]) => `\`${k}\` ${v}`).join(' · ')}\n` +
    `- Size (px): ${Object.entries(tokens.size).map(([k, v]) => `\`${k}\` ${v}`).join(' · ')}\n` +
    `- Motion: ${Object.entries(tokens.motion).map(([k, v]) => `\`${k}\` ${v.length > 40 ? 'spring (linear())' : v}`).join(' · ')}\n`;
  writeFileSync(join(ROOT, 'docs', 'tokens.md'), md);
}

/* ───────────── skill/SKILL.md (token block generated so the skill never drifts from the kit) ───────────── */
{
  const block = (sel, set, dark) => {
    const decls = Object.entries(sets[set]).map(([k, v]) => `--hig-${k}: ${v};`).concat(`color-scheme: ${dark ? 'dark' : 'light'};`);
    const lines = []; for (let i = 0; i < decls.length; i += 4) lines.push('  ' + decls.slice(i, i + 4).join(' '));
    return `${sel} {\n${lines.join('\n')}\n}`;
  };
  const scale = [
    ...Object.entries(tokens.font.family).map(([k, v]) => `  --hig-font-${k}: ${v};`),
    ...Object.entries(tokens.radius).map(([k, v]) => `  --hig-radius-${k}: ${v}px;`),
    ...Object.entries(tokens.size).filter(([k]) => ['tap', 'gutter'].includes(k)).map(([k, v]) => `  --hig-size-${k}: ${v}px;`),
    `  --hig-ease-spring: ${tokens.motion.spring};`, `  --hig-ease-out: ${tokens.motion['ease-out']};`, `  --hig-duration: ${tokens.motion.duration};`,
    ...Object.entries(tokens.font.ios).map(([k, t]) => `  --hig-text-${k}: ${t.weight} ${t.size / 16}rem/${(t.line / t.size).toFixed(3)} var(--hig-font-sans);`),
    '  --hig-glass-shadow: 0 8px 28px var(--hig-glass-shadow-color), 0 1px 3px var(--hig-glass-shadow-color);',
  ].join('\n');
  const css = [
    `/* hig-web-kit v${pkg.version} — Apple mode (default) */`,
    `:root {\n${scale}\n}`,
    block(':root', 'apple.light', false),
    `@media (prefers-color-scheme: dark) {\n${block(':root:not([data-hig-scheme="light"])', 'apple.dark', true).replace(/^/gm, '  ')}\n}`,
    block(':root[data-hig-scheme="dark"]', 'apple.dark', true),
    `/* WCAG 2.2 AA mode: <html data-hig-mode="aa"> */`,
    block(':root[data-hig-mode="aa"]', 'aa.light', false),
    `@media (prefers-color-scheme: dark) {\n${block(':root[data-hig-mode="aa"]:not([data-hig-scheme="light"])', 'aa.dark', true).replace(/^/gm, '  ')}\n}`,
    block(':root[data-hig-mode="aa"][data-hig-scheme="dark"]', 'aa.dark', true),
  ].join('\n');
  const tpl = readFileSync(join(ROOT, 'skill', 'SKILL.template.md'), 'utf8');
  writeFileSync(join(ROOT, 'skill', 'SKILL.md'), tpl.replace('{{TOKENS_CSS}}', css));
}
