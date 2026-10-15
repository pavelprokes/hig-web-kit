# Changelog

## 0.3.0 — 2026-10-15

- **Accent themes.** `data-hig-theme` with built-in themes `vzb` (Vzdělání budoucnosti), `indigo`, `purple`, `pink`, `orange`, `green`, `teal` and `graphite`; `hig-web-kit/theme` with `setTheme()`, `restoreTheme()` (`#theme=vzb`), `applyBrandColor()` and `deriveBrandTheme()`. Derived colors keep the brand hue and only move lightness, so AA holds for any brand; the contrast gate checks every theme on every set.
- **Adapters:** `accent` option for Ant Design and MUI.
- **Progress, gauges and badges:** progress rows with subtitles and stacked bars, a labelled progress ring, gauges with endpoint labels, captions and sizes (`.hig-gauge-item`, `.hig-meters`, `--sm`, `--lg`), a scale under linear gauges, neutral counts (`.hig-count`), badges on avatars.
- **Accent color picker** component (`.hig-swatches`).
- **Demo:** accent picker in Settings; reworked Progress, Gauges and Badges sections.

## 0.2.0 — 2026-10-15

- **New components** (CSS + behaviour in `components.js`):
  - Forms: checkbox and radio (with mixed parent state), pop-up button, styled select, multiline field with counter, compact date/time picker, token field.
  - Navigation and layout: floating glass sidebar, split view (container queries), page control with a scroll-snap pager, disclosure, scope bar and filter chips, path control.
  - Status and feedback: CSS-only activity indicator, circular progress, gauges, rating, badge positioning, popover (Popover API; a sheet under 600 px), tooltip, empty state, skeleton, notification banner, `showToast()`.
  - Content and data: sortable table, swipe actions, context menu (right-click, long press, Shift+F10), avatar and avatar stack, card, widget, photo grid.
- **Ant Design:** tokens for Checkbox, Radio, Breadcrumb, Collapse, Avatar, Badge, Tag, Tooltip, Skeleton, Carousel, Table, Progress, Notification and Message; glass notifications and messages; `hig-striped` tables.
- **AA:** new contrast pairs (chips, tokens, tooltips, checkbox outline, page dots, table stripes); AA badges use `on-destructive` text.
- **Fixes:** dialog padding and sheet max-width were overridden by the `<dialog>` reset; tab bar items shrink to fit four tabs on small phones.
- **Demo:** a Library tab and new form sections.

## 0.1.0 — 2026-10-14

- **Tokens.** Apple (HIG iOS 26/27) and WCAG 2.2 AA modes, each in light, dark and increased-contrast variants. The single source is `tokens/tokens.json`.
- **Outputs.**
  - CSS variables, Sass, ESM/CJS/TypeScript and JSON.
  - Tailwind v4 theme and v3 preset.
  - Bridges for shadcn/ui and Bootstrap 5.
  - Ant Design 5/6 and MUI adapters.
- **Liquid Glass.** CSS material, Chromium edge refraction, touch light, adaptivity, scroll edge effects.
- **Components.** Framework-free components with keyboard support and ARIA.
- **Accessibility runtime.** Mode, scheme, contrast, transparency and motion switches, plus a live `checkContrast()`.
- **CI.** Contrast gate, CSS cascade tests for all 72 preference combinations, antd/MUI/Tailwind/Sass integration tests, and a typecheck.
