# Accessibility and the WCAG 2.2 AA mode

## Two modes, chosen per project or per user

| | `apple` (default) | `aa` |
|---|---|---|
| Goal | Look exactly like Apple's platforms | Meet WCAG 2.2 AA contrast while keeping the look |
| Secondary text | 60 % label (3.4:1) | 78 % label (≥ 4.5:1) |
| Placeholder | 30 % label (1.7:1) | Same as secondary text |
| Primary button | `#0088FF` + white (3.5:1) | `#0071E3` + white (4.7:1); dark `#0066CC` (5.6:1) |
| Link / accent text | `#0088FF` | `#0062CC` light · `#5CB8FF` dark |
| Destructive | `#FF383C` | Fill `#D70015`, text `#C4001A` light · `#FF8A8C` dark |
| Control boundaries | none (filled shapes) | `#767680` light · `#8E8E93` dark, ≥ 3:1 |
| Switch "on" | `#34C759` (2.2:1) | `#008932` (4.5:1) |
| Focus ring | 50 % accent (1.9:1) | Solid accent, ≥ 3:1 |
| Glass under text | 42 % white | 72 % (regular) / 86 % (large); text ≥ 4.5:1 over **any** backdrop |
| Clear glass on media | 8 % white | 55 % black under white text |

Choose the mode with `data-hig-mode="aa"` on `<html>`, `setMode('aa')`, or the `mode` option of the framework adapters. A visible switch (as in the demo) lets people choose for themselves. Public-sector sites in the EU (EN 301 549 / European Accessibility Act) should default to `aa`.

## How it is verified

- `scripts/check-contrast.mjs` flattens every translucent token over its real background (glass over both black and white) and measures 27 text/UI pairs per set. CI fails if any `aa.*` set drops below 4.5:1 (text) or 3:1 (non-text).
- `test/outputs.test.mjs` builds a real Ant Design theme in AA mode and measures the tokens antd actually resolves, including hover and active states.
- `test/cascade.test.mjs` proves that every combination of mode, scheme, contrast and OS preference resolves to the intended set (72 combinations).
- `checkContrast()` from `hig-web-kit/a11y` runs the same checks in the browser against the live CSS (the demo's Settings tab shows the result).

## What else the kit covers

| WCAG 2.2 | How |
|---|---|
| 1.4.3 / 1.4.6 Contrast | `aa` sets; increased-contrast sets under `prefers-contrast: more` |
| 1.4.11 Non-text contrast | `--hig-control-border`, switch "on", slider fill, focus ring ≥ 3:1 in `aa` |
| 1.4.4 Resize text / 1.4.10 Reflow | `rem` type scale, wrapping rows, no fixed text heights; `-apple-system-body` follows iOS Dynamic Type |
| 1.4.12 Text spacing | No clipped text containers in components |
| 2.1.1 Keyboard | Segmented control and tabs: arrow keys; menus: arrows, Home/End, Esc; dialogs: native `<dialog>` |
| 2.4.7 / 2.4.13 Focus visible / appearance | 3 px `:focus-visible` outline in the focus-ring color |
| 2.4.11 Focus not obscured | `scroll-padding-block` in `base.css` keeps focus clear of floating bars |
| 2.5.8 Target size | 44 px default targets (24 px is the AA minimum) |
| 2.3.3 / motion | `prefers-reduced-motion` and `data-hig-motion="reduce"` remove springs, gel scaling and slides |
| Transparency | `prefers-reduced-transparency` and `data-hig-transparency="reduce"` make glass near-opaque |
| 4.1.2 Name, role, value | `role="switch"`, `radiogroup`, `tablist`, `menu`, `alertdialog`; `aria-checked/selected/expanded` kept in sync |

## What you still own

The kit can't know your content. Check these yourself:

- **Labels:** every icon-only button has a label (`aria-label`), and every field has a visible label rather than only a placeholder.
- **Errors:** they say how to fix the problem and are announced (`aria-live` or `aria-describedby`).
- **Images:** they have alt text.
- **Media:** video has captions.
- **Language:** the page language is set (`<html lang>`).
- **Text over images:** any text you place over your own images is measured. The kit can only guarantee text that sits on its own surfaces.
- **Custom colors:** run `checkContrast()` or add your pairs to `src/contrast-pairs.js`.
