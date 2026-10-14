# Changelog

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
