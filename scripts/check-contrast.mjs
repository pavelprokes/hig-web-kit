#!/usr/bin/env node
// Verifies WCAG 2.2 AA contrast for every color set. Sets listed in STRICT must pass (CI fails otherwise);
// the "apple" sets mirror Apple's own values and are reported for information only.
//   node scripts/check-contrast.mjs            → table + exit code
//   node scripts/check-contrast.mjs --json     → machine-readable report
import { resolveSets, SETS } from './resolve.mjs';
import { flatten, contrast } from '../src/color.js';
import { PAIRS, BACKDROPS, resolveLayers } from '../src/contrast-pairs.js';

const STRICT = ['aa.light', 'aa.dark', 'aa.light-hc', 'aa.dark-hc'];
const sets = resolveSets();
const report = {};
let failures = 0;

for (const name of SETS) {
  const set = sets[name];
  report[name] = PAIRS.map(([label, fg, bg, min]) => {
    const needsBackdrop = [...fg, ...bg].includes('@backdrop');
    const ratios = (needsBackdrop ? BACKDROPS : ['#ffffff']).map(bd => {
      const b = flatten(...resolveLayers(bg, set, bd), '#ffffff');
      const f = flatten(...resolveLayers(fg, set, bd), b);
      return contrast(f, b);
    });
    const ratio = Math.min(...ratios);
    const pass = ratio >= min;
    if (!pass && STRICT.includes(name)) failures++;
    return { label, ratio: +ratio.toFixed(2), min, pass };
  });
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const name of SETS) {
    const strict = STRICT.includes(name);
    const bad = report[name].filter(r => !r.pass);
    console.log(`\n${name}${strict ? '' : '  (informational: Apple default values)'} — ${bad.length ? `${bad.length} below AA` : 'all pass'}`);
    for (const r of report[name]) {
      if (r.pass && !process.argv.includes('--all')) continue;
      console.log(`  ${r.pass ? '✓' : '✗'} ${r.ratio.toFixed(2).padStart(5)} / ${r.min}  ${r.label}`);
    }
  }
  console.log(failures ? `\n${failures} AA failure(s) in strict sets.` : '\nAll strict sets meet WCAG 2.2 AA contrast.');
}
process.exit(failures ? 1 : 0);
