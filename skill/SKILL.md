---
name: apple-hig-web
description: Use when designing, building or reviewing web UI (HTML/CSS/JS, React, Ant Design, Tailwind, MUI, shadcn, Bootstrap, any framework) that should follow Apple's Human Interface Guidelines and the Liquid Glass design language, optionally in a WCAG 2.2 AA mode.
---

# Apple HIG for the web (Liquid Glass era) — with an optional WCAG 2.2 AA mode

Distilled from developer.apple.com/design: Human Interface Guidelines (Getting started, Foundations, Patterns, Components, Inputs), "Adopting Liquid Glass", and WWDC25 sessions 219, 356, 359, 208 and 220. Current as of October 2026 (iOS/iPadOS/macOS 27). The code in this skill matches the open-source package **hig-web-kit** (`npm i hig-web-kit`, MIT, github.com/pavelprokes/hig-web-kit), which is tested in real browsers and frameworks. Use the package when the project can install dependencies; paste the code below when it can't.

Apple publishes almost no pixel values for Liquid Glass (blur, opacity). Numbers marked **≈** are tuned web values, not Apple specs; numbers without ≈ come from the HIG. 1 pt (Apple) = 1 CSS px.

## When to use

Use this for any page, app, dashboard, landing page or component that should look and behave like Apple's platforms, in any stack. Also use it as a review checklist (§13).

Precedence: the user's explicit wishes, then the project's existing design system, then this skill.

## Step 0 — choose the mode (ask if it isn't clear)

The kit has two color modes. They share the same components, layout and motion.

| Mode | What it is | Choose when |
|---|---|---|
| **apple** (default) | Apple's exact values. Several pairs fall below WCAG: secondary text 3.4:1, placeholder 1.7:1, white on blue buttons 3.5:1, no control borders | The goal is fidelity to iOS/macOS (prototypes, Apple-centric products) |
| **aa** | WCAG 2.2 AA everywhere: text ≥ 4.5:1, control boundaries, switch "on" and focus ring ≥ 3:1, glass opaque enough for text over any backdrop | Public or regulated sites (EU EAA / EN 301 549, public sector, education), audiences with low vision, or whenever the user mentions accessibility, WCAG, a11y or "přístupnost" |

Decision rule:

1. **The request names the mode** ("WCAG", "AA", "accessible", "exactly like iOS"). Use it without asking.
2. **It doesn't, and the user is present.** Ask one short question before building, for example: *"Should this use Apple's exact colors, or the WCAG 2.2 AA mode (same look, contrast-safe colors and visible control borders)? I can also add a switch so visitors choose."* Offer three answers: Apple / WCAG AA / both with a switch.
3. **Nobody can answer** (unattended run). Use **apple**, say so in one line at the top of the result, and mention that `data-hig-mode="aa"` switches the whole UI to AA.

Both modes respond to OS settings (dark mode, Increase Contrast, Reduce Transparency, Reduce Motion). The mode is one attribute: `<html data-hig-mode="aa">`. With "both", add a visible switch that calls `setMode()` (see §6.7). A brand color is a separate, orthogonal choice (§3.5).

## Workflow

1. **Pick the idiom** by available width and input, not by device:
   - touch/mobile → iOS scale: 17 px body, 44 px targets, floating tab bar;
   - pointer/desktop → macOS scale: 13 px body, 28 px targets, sidebar plus toolbar.

   Compact width is ≈ < 700 px; regular is above.
2. **Split into two layers.** The content layer holds data, media, brand color and standard materials. The floating functional layer (toolbar, tab bar, sidebar, menus, sheets, popovers, alerts) is made of Liquid Glass.
3. **Load the tokens** (§3). Use `hig-web-kit/hig.css`, or paste the block. Build from tokens only (`var(--hig-…)`). If the product has a brand color, set it as the accent theme (§3.5).
4. **Use a framework adapter** if the project has a framework (§3.4). Use the component specs (§7) and patterns (§8) rather than inventing new ones.
5. **Write the copy** per §10.
6. **Add the accessibility mapping** (§6.7) and check §12.
7. **Review** against §13. In AA mode, run `checkContrast()` (§6.7) or `npm run check:contrast` and fix every failure.

---

## 1. Design principles (HIG, reintroduced 2026)

1. **Purpose.** Every screen does something meaningful.
2. **Agency.** Get people straight to content; no locked flows; easy recovery (undo).
3. **Responsibility.** Be transparent about data and permissions; collect only what's needed.
4. **Familiarity.** Use known conventions and standard components; stay consistent.
5. **Flexibility.** Design for everyone and every input; preserve context.
6. **Simplicity.** Not minimalism: every element earns its place. Every screen answers *Where am I? What can I do? Where can I go?*
7. **Craft.** Care about details: alignment, motion, wording.
8. **Delight.** Human moments, never decoration that blocks the task.

Branding defers to content: no logo repeated on every screen, and no splash screen (use skeletons). Brand color lives in the content layer and in the single app accent. A custom font is fine for headlines while the body uses the system font.

---

## 2. Layers and Liquid Glass — the rules

- **Two layers.** Content runs edge to edge, with images flowing *under* bars and sidebars. Controls float above it in glass.
- **Never put glass on content** (cards, rows, tables). **No glass on glass.** Elements on glass use fills (`--hig-fill-*`).
- **Use glass sparingly**: bars, floating buttons, menus, popovers, sheets and alerts. Sliders and switches turn glassy *only while pressed*.
- **No solid or semi-opaque bar backgrounds.** Separate bars from content with a **scroll edge effect** (§6.5), and only where content scrolls underneath.
- **Variants.**
  - **Regular** (default) adapts to what's behind it; use it for text-heavy chrome.
  - **Clear** is only for photos and video, when all of these hold: dimming the media is acceptable, a 35 % dimming layer sits behind the glass, and the content on it is bold and bright.
  - Never mix Regular and Clear in one context.
- **Lensing, not scattering.** Glass bends light at its rim and keeps the centre clear. Larger glass acts thicker. It appears by ramping blur and refraction up, not by fading.
- **Adaptivity.** Small glass flips light/dark with the content underneath. Large surfaces (menus, sidebars) don't flip and are more opaque.
- **Color on glass.** Tint **only the primary action** (one per view), and tint its background, not its glyph. Bar labels are monochrome; the selected tab uses the accent.
- **Shape.** Three kinds:
  - **capsule**: radius = height / 2;
  - **concentric**: inner radius = outer radius − padding;
  - **fixed**: the fallback.

  Pinched or flared nested corners are errors.
- **Interaction.** On press, glass lights up from the touch point, neighbours in the same group light up softly, and the element **scales up**. Menus grow out of their trigger. The tab bar shrinks while scrolling down.

---

## 3. Tokens

### 3.1 Attributes (no attribute = follow the OS)

| On `<html>` | Values | Default |
|---|---|---|
| `data-hig-mode` | `aa` | Apple values |
| `data-hig-scheme` | `light` · `dark` | `prefers-color-scheme` |
| `data-hig-contrast` | `more` · `standard` | `prefers-contrast` |
| `data-hig-transparency` | `reduce` · `standard` | `prefers-reduced-transparency` |
| `data-hig-motion` | `reduce` · `standard` | `prefers-reduced-motion` |
| `data-hig-theme` | `vzb` · `indigo` · `purple` · `pink` · `orange` · `green` · `teal` · `graphite` | Apple system blue (§3.5) |

### 3.2 Color tokens (generated from hig-web-kit; light/dark for both modes)

`hig.css` also contains increased-contrast sets (`apple.*-hc`, `aa.*-hc`), the accent themes and the selector logic for every combination. When pasting by hand, the block below covers light and dark for both modes.

```css
/* hig-web-kit v0.3.0 — Apple mode (default) */
:root {
  --hig-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --hig-font-rounded: ui-rounded, "SF Pro Rounded", system-ui, sans-serif;
  --hig-font-serif: ui-serif, "New York", Georgia, serif;
  --hig-font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
  --hig-radius-xs: 6px;
  --hig-radius-sm: 8px;
  --hig-radius-md: 12px;
  --hig-radius-field: 14px;
  --hig-radius-lg: 20px;
  --hig-radius-card: 26px;
  --hig-radius-menu: 26px;
  --hig-radius-alert: 32px;
  --hig-radius-window: 34px;
  --hig-radius-capsule: 999px;
  --hig-size-tap: 44px;
  --hig-size-gutter: 16px;
  --hig-ease-spring: linear(0, .009, .035 2.1%, .141 4.4%, .723 12.9%, .938 16.7%, 1.017 19.4%, 1.067, 1.087 24.2%, 1.085 26.5%, 1.067 29.5%, .987 41.8%, .971 45.8%, .996 62.7%, 1);
  --hig-ease-out: cubic-bezier(.22, 1, .36, 1);
  --hig-duration: 450ms;
  --hig-text-large-title: 700 2.125rem/1.206 var(--hig-font-sans);
  --hig-text-title-1: 700 1.75rem/1.214 var(--hig-font-sans);
  --hig-text-title-2: 700 1.375rem/1.273 var(--hig-font-sans);
  --hig-text-title-3: 600 1.25rem/1.250 var(--hig-font-sans);
  --hig-text-headline: 600 1.0625rem/1.294 var(--hig-font-sans);
  --hig-text-body: 400 1.0625rem/1.294 var(--hig-font-sans);
  --hig-text-callout: 400 1rem/1.313 var(--hig-font-sans);
  --hig-text-subhead: 400 0.9375rem/1.333 var(--hig-font-sans);
  --hig-text-footnote: 400 0.8125rem/1.385 var(--hig-font-sans);
  --hig-text-caption-1: 400 0.75rem/1.333 var(--hig-font-sans);
  --hig-text-caption-2: 400 0.6875rem/1.182 var(--hig-font-sans);
  --hig-glass-shadow: 0 8px 28px var(--hig-glass-shadow-color), 0 1px 3px var(--hig-glass-shadow-color);
}
:root {
  --hig-bg: #ffffff; --hig-bg-2: #f2f2f7; --hig-bg-3: #ffffff; --hig-grouped-bg: #f2f2f7;
  --hig-grouped-bg-2: #ffffff; --hig-grouped-bg-3: #f2f2f7; --hig-bg-elevated: #ffffff; --hig-bg-elevated-2: #f2f2f7;
  --hig-label: #000000; --hig-label-2: #3c3c4399; --hig-label-3: #3c3c434d; --hig-label-4: #3c3c432e;
  --hig-placeholder: #3c3c434d; --hig-link: #0088ff; --hig-sep: #3c3c434a; --hig-sep-opaque: #c6c6c8;
  --hig-fill: #78788033; --hig-fill-2: #78788029; --hig-fill-3: #7676801f; --hig-fill-4: #74748014;
  --hig-red: #ff383c; --hig-orange: #ff8d28; --hig-yellow: #ffcc00; --hig-green: #34c759;
  --hig-mint: #00c8b3; --hig-teal: #00c3d0; --hig-cyan: #00c0e8; --hig-blue: #0088ff;
  --hig-indigo: #6155f5; --hig-purple: #cb30e0; --hig-pink: #ff2d55; --hig-brown: #ac7f5e;
  --hig-gray: #8e8e93; --hig-gray-2: #aeaeb2; --hig-gray-3: #c7c7cc; --hig-gray-4: #d1d1d6;
  --hig-gray-5: #e5e5ea; --hig-gray-6: #f2f2f7; --hig-accent: #0088ff; --hig-accent-fill: #0088ff;
  --hig-accent-text: #0088ff; --hig-on-accent: #ffffff; --hig-destructive-fill: #ff383c; --hig-destructive-text: #ff383c;
  --hig-on-destructive: #ffffff; --hig-success-text: #34c759; --hig-warning-text: #ff8d28; --hig-switch-on: #34c759;
  --hig-control-border: #00000000; --hig-focus-ring: #0088ff80; --hig-glass-tint: #ffffff6b; --hig-glass-tint-large: #fafafc9e;
  --hig-glass-tint-clear: #ffffff14; --hig-glass-rim: #ffffffbf; --hig-glass-rim-dim: #ffffff2e; --hig-glass-label: #000000db;
  --hig-glass-shadow-color: #0000001a; --hig-scrim: #00000038; color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-hig-scheme="light"]) {
    --hig-bg: #000000; --hig-bg-2: #1c1c1e; --hig-bg-3: #2c2c2e; --hig-grouped-bg: #000000;
    --hig-grouped-bg-2: #1c1c1e; --hig-grouped-bg-3: #2c2c2e; --hig-bg-elevated: #1c1c1e; --hig-bg-elevated-2: #2c2c2e;
    --hig-label: #ffffff; --hig-label-2: #ebebf599; --hig-label-3: #ebebf54d; --hig-label-4: #ebebf529;
    --hig-placeholder: #ebebf54d; --hig-link: #0091ff; --hig-sep: #54545899; --hig-sep-opaque: #38383a;
    --hig-fill: #7878805c; --hig-fill-2: #78788052; --hig-fill-3: #7676803d; --hig-fill-4: #7676802e;
    --hig-red: #ff4245; --hig-orange: #ff9230; --hig-yellow: #ffd600; --hig-green: #30d158;
    --hig-mint: #00dac3; --hig-teal: #00d2e0; --hig-cyan: #3cd3fe; --hig-blue: #0091ff;
    --hig-indigo: #6d7cff; --hig-purple: #db34f2; --hig-pink: #ff375f; --hig-brown: #b78a66;
    --hig-gray: #8e8e93; --hig-gray-2: #636366; --hig-gray-3: #48484a; --hig-gray-4: #3a3a3c;
    --hig-gray-5: #2c2c2e; --hig-gray-6: #1c1c1e; --hig-accent: #0091ff; --hig-accent-fill: #0091ff;
    --hig-accent-text: #0091ff; --hig-on-accent: #ffffff; --hig-destructive-fill: #ff4245; --hig-destructive-text: #ff4245;
    --hig-on-destructive: #ffffff; --hig-success-text: #30d158; --hig-warning-text: #ff9230; --hig-switch-on: #30d158;
    --hig-control-border: #00000000; --hig-focus-ring: #0091ff99; --hig-glass-tint: #28282c66; --hig-glass-tint-large: #1e1e229e;
    --hig-glass-tint-clear: #ffffff14; --hig-glass-rim: #ffffff4d; --hig-glass-rim-dim: #ffffff14; --hig-glass-label: #ffffffeb;
    --hig-glass-shadow-color: #00000073; --hig-scrim: #00000073; color-scheme: dark;
  }
}
:root[data-hig-scheme="dark"] {
  --hig-bg: #000000; --hig-bg-2: #1c1c1e; --hig-bg-3: #2c2c2e; --hig-grouped-bg: #000000;
  --hig-grouped-bg-2: #1c1c1e; --hig-grouped-bg-3: #2c2c2e; --hig-bg-elevated: #1c1c1e; --hig-bg-elevated-2: #2c2c2e;
  --hig-label: #ffffff; --hig-label-2: #ebebf599; --hig-label-3: #ebebf54d; --hig-label-4: #ebebf529;
  --hig-placeholder: #ebebf54d; --hig-link: #0091ff; --hig-sep: #54545899; --hig-sep-opaque: #38383a;
  --hig-fill: #7878805c; --hig-fill-2: #78788052; --hig-fill-3: #7676803d; --hig-fill-4: #7676802e;
  --hig-red: #ff4245; --hig-orange: #ff9230; --hig-yellow: #ffd600; --hig-green: #30d158;
  --hig-mint: #00dac3; --hig-teal: #00d2e0; --hig-cyan: #3cd3fe; --hig-blue: #0091ff;
  --hig-indigo: #6d7cff; --hig-purple: #db34f2; --hig-pink: #ff375f; --hig-brown: #b78a66;
  --hig-gray: #8e8e93; --hig-gray-2: #636366; --hig-gray-3: #48484a; --hig-gray-4: #3a3a3c;
  --hig-gray-5: #2c2c2e; --hig-gray-6: #1c1c1e; --hig-accent: #0091ff; --hig-accent-fill: #0091ff;
  --hig-accent-text: #0091ff; --hig-on-accent: #ffffff; --hig-destructive-fill: #ff4245; --hig-destructive-text: #ff4245;
  --hig-on-destructive: #ffffff; --hig-success-text: #30d158; --hig-warning-text: #ff9230; --hig-switch-on: #30d158;
  --hig-control-border: #00000000; --hig-focus-ring: #0091ff99; --hig-glass-tint: #28282c66; --hig-glass-tint-large: #1e1e229e;
  --hig-glass-tint-clear: #ffffff14; --hig-glass-rim: #ffffff4d; --hig-glass-rim-dim: #ffffff14; --hig-glass-label: #ffffffeb;
  --hig-glass-shadow-color: #00000073; --hig-scrim: #00000073; color-scheme: dark;
}
/* WCAG 2.2 AA mode: <html data-hig-mode="aa"> */
:root[data-hig-mode="aa"] {
  --hig-bg: #ffffff; --hig-bg-2: #f2f2f7; --hig-bg-3: #ffffff; --hig-grouped-bg: #f2f2f7;
  --hig-grouped-bg-2: #ffffff; --hig-grouped-bg-3: #f2f2f7; --hig-bg-elevated: #ffffff; --hig-bg-elevated-2: #f2f2f7;
  --hig-label: #000000; --hig-label-2: #3c3c43c7; --hig-label-3: #3c3c434d; --hig-label-4: #3c3c432e;
  --hig-placeholder: #3c3c43c7; --hig-link: #0062cc; --hig-sep: #3c3c434a; --hig-sep-opaque: #c6c6c8;
  --hig-fill: #78788033; --hig-fill-2: #78788029; --hig-fill-3: #7676801f; --hig-fill-4: #74748014;
  --hig-red: #ff383c; --hig-orange: #ff8d28; --hig-yellow: #ffcc00; --hig-green: #34c759;
  --hig-mint: #00c8b3; --hig-teal: #00c3d0; --hig-cyan: #00c0e8; --hig-blue: #0088ff;
  --hig-indigo: #6155f5; --hig-purple: #cb30e0; --hig-pink: #ff2d55; --hig-brown: #ac7f5e;
  --hig-gray: #8e8e93; --hig-gray-2: #aeaeb2; --hig-gray-3: #c7c7cc; --hig-gray-4: #d1d1d6;
  --hig-gray-5: #e5e5ea; --hig-gray-6: #f2f2f7; --hig-accent: #0071e3; --hig-accent-fill: #0071e3;
  --hig-accent-text: #0062cc; --hig-on-accent: #ffffff; --hig-destructive-fill: #d70015; --hig-destructive-text: #c4001a;
  --hig-on-destructive: #ffffff; --hig-success-text: #007a2e; --hig-warning-text: #a34f00; --hig-switch-on: #008932;
  --hig-control-border: #767680; --hig-focus-ring: #0062cc; --hig-glass-tint: #ffffffb8; --hig-glass-tint-large: #fafafcdb;
  --hig-glass-tint-clear: #0000008c; --hig-glass-rim: #ffffffbf; --hig-glass-rim-dim: #ffffff2e; --hig-glass-label: #000000e6;
  --hig-glass-shadow-color: #0000001a; --hig-scrim: #00000038; color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root[data-hig-mode="aa"]:not([data-hig-scheme="light"]) {
    --hig-bg: #000000; --hig-bg-2: #1c1c1e; --hig-bg-3: #2c2c2e; --hig-grouped-bg: #000000;
    --hig-grouped-bg-2: #1c1c1e; --hig-grouped-bg-3: #2c2c2e; --hig-bg-elevated: #1c1c1e; --hig-bg-elevated-2: #2c2c2e;
    --hig-label: #ffffff; --hig-label-2: #ebebf59e; --hig-label-3: #ebebf54d; --hig-label-4: #ebebf529;
    --hig-placeholder: #ebebf59e; --hig-link: #5cb8ff; --hig-sep: #54545899; --hig-sep-opaque: #38383a;
    --hig-fill: #7878805c; --hig-fill-2: #78788052; --hig-fill-3: #7676803d; --hig-fill-4: #7676802e;
    --hig-red: #ff4245; --hig-orange: #ff9230; --hig-yellow: #ffd600; --hig-green: #30d158;
    --hig-mint: #00dac3; --hig-teal: #00d2e0; --hig-cyan: #3cd3fe; --hig-blue: #0091ff;
    --hig-indigo: #6d7cff; --hig-purple: #db34f2; --hig-pink: #ff375f; --hig-brown: #b78a66;
    --hig-gray: #8e8e93; --hig-gray-2: #636366; --hig-gray-3: #48484a; --hig-gray-4: #3a3a3c;
    --hig-gray-5: #2c2c2e; --hig-gray-6: #1c1c1e; --hig-accent: #3a9fff; --hig-accent-fill: #0066cc;
    --hig-accent-text: #5cb8ff; --hig-on-accent: #ffffff; --hig-destructive-fill: #d70015; --hig-destructive-text: #ff8a8c;
    --hig-on-destructive: #ffffff; --hig-success-text: #30d158; --hig-warning-text: #ff9f43; --hig-switch-on: #30d158;
    --hig-control-border: #8e8e93; --hig-focus-ring: #5cb8ff; --hig-glass-tint: #28282cb8; --hig-glass-tint-large: #1e1e22db;
    --hig-glass-tint-clear: #0000008c; --hig-glass-rim: #ffffff4d; --hig-glass-rim-dim: #ffffff14; --hig-glass-label: #ffffff;
    --hig-glass-shadow-color: #00000073; --hig-scrim: #00000073; color-scheme: dark;
  }
}
:root[data-hig-mode="aa"][data-hig-scheme="dark"] {
  --hig-bg: #000000; --hig-bg-2: #1c1c1e; --hig-bg-3: #2c2c2e; --hig-grouped-bg: #000000;
  --hig-grouped-bg-2: #1c1c1e; --hig-grouped-bg-3: #2c2c2e; --hig-bg-elevated: #1c1c1e; --hig-bg-elevated-2: #2c2c2e;
  --hig-label: #ffffff; --hig-label-2: #ebebf59e; --hig-label-3: #ebebf54d; --hig-label-4: #ebebf529;
  --hig-placeholder: #ebebf59e; --hig-link: #5cb8ff; --hig-sep: #54545899; --hig-sep-opaque: #38383a;
  --hig-fill: #7878805c; --hig-fill-2: #78788052; --hig-fill-3: #7676803d; --hig-fill-4: #7676802e;
  --hig-red: #ff4245; --hig-orange: #ff9230; --hig-yellow: #ffd600; --hig-green: #30d158;
  --hig-mint: #00dac3; --hig-teal: #00d2e0; --hig-cyan: #3cd3fe; --hig-blue: #0091ff;
  --hig-indigo: #6d7cff; --hig-purple: #db34f2; --hig-pink: #ff375f; --hig-brown: #b78a66;
  --hig-gray: #8e8e93; --hig-gray-2: #636366; --hig-gray-3: #48484a; --hig-gray-4: #3a3a3c;
  --hig-gray-5: #2c2c2e; --hig-gray-6: #1c1c1e; --hig-accent: #3a9fff; --hig-accent-fill: #0066cc;
  --hig-accent-text: #5cb8ff; --hig-on-accent: #ffffff; --hig-destructive-fill: #d70015; --hig-destructive-text: #ff8a8c;
  --hig-on-destructive: #ffffff; --hig-success-text: #30d158; --hig-warning-text: #ff9f43; --hig-switch-on: #30d158;
  --hig-control-border: #8e8e93; --hig-focus-ring: #5cb8ff; --hig-glass-tint: #28282cb8; --hig-glass-tint-large: #1e1e22db;
  --hig-glass-tint-clear: #0000008c; --hig-glass-rim: #ffffff4d; --hig-glass-rim-dim: #ffffff14; --hig-glass-label: #ffffff;
  --hig-glass-shadow-color: #00000073; --hig-scrim: #00000073; color-scheme: dark;
}
```

Semantic usage:

- **Backgrounds.**
  - `bg` is the plain page; `bg-2` and `bg-3` are nested groupings.
  - `grouped-bg` is a settings or form page, and `grouped-bg-2` is the card on it.
  - `bg-elevated` is for popovers and sheets (brighter in dark mode).
- **Labels.** `label` is primary, `label-2` secondary, `label-3` disabled/placeholder in Apple mode, `label-4` watermark.
- **Fills.** `fill` for thin shapes (slider track), `fill-2` for medium ones (gray button), `fill-3` for large ones (field, segmented control), `fill-4` for big areas.
- **Accent.**
  - `accent` for UI indicators (slider fill, selection);
  - `accent-fill` as the background of a primary button, with `on-accent` text;
  - `accent-text` for links and tinted text.
- **Status.** `destructive-fill` / `destructive-text`, `success-text`, `warning-text`, and `switch-on` for the switch track.
- **Boundaries and focus.** `control-border` is transparent in Apple mode and a 3:1 gray in AA; apply it with `box-shadow: inset 0 0 0 1px var(--hig-control-border)`. `focus-ring` is the focus outline.
- **Glass.** `glass-tint` and `glass-tint-large` are the surfaces, `glass-tint-clear` is for media, and `glass-label` is the text on them.

**Increased contrast** (apply under `prefers-contrast: more`). Apple light/dark: Red #E9152D/#FF6165, Orange #C55300/#FFA056, Yellow #A16A00/#FEDF43, Green #008932/#4AD968, Mint #008575/#54DFCB, Teal #008198/#3BDDEC, Cyan #007EAE/#6DD9FF, Blue #1E6EF4/#5CB8FF, Indigo #564ADE/#A7AAFF, Purple #B02FC2/#EA8DFF, Pink #E7124D/#FF8AC4, Brown #956D51/#DBA679.

### 3.3 Type ramp

| Style | iOS size/line (px) | weight | macOS size/line |
|---|---|---|---|
| Large Title | 34/41 | 700 for screen titles | 26/32 |
| Title 1 | 28/34 | 700 | 22/26 |
| Title 2 | 22/28 | 700 | 17/22 |
| Title 3 | 20/25 | 600 | 15/20 |
| Headline | 17/22 | 600 | 13/16 bold |
| Body | 17/22 | 400 | 13/16 |
| Callout | 16/21 | 400 | 12/15 |
| Subhead | 15/20 | 400 | 11/14 |
| Footnote | 13/18 | 400 | 10/13 |
| Caption 1 | 12/16 | 400 | 10/13 |
| Caption 2 | 11/13 | 400 | 10/13 medium |

In CSS: `font: var(--hig-text-body)` or `var(--hig-text-mac-body)`.

- **Sizes.** Use `rem` everywhere and support 200 % zoom. Body grows to 28/33/40/47/53 px at AX1–AX5. The minimum is 11 px on iOS and 10 px on macOS.
- **Weights.** Avoid Ultralight, Thin and Light.
- **Tracking.** Automatic with the system stack on Apple devices. With Inter or other fallbacks, use slight negative letter-spacing at 15–24 px (≈ −0.01 to −0.02 em) and slight positive at 11–12 px. Avoid tight leading for 3+ lines.
- **Fonts.** Never self-host SF Pro; the system stack (`system-ui, -apple-system, …`) renders SF on Apple devices. The cross-platform look-alike is Inter.
- **Style of the Liquid Glass era.** Typography is bolder and left-aligned (alerts, onboarding). Section headers are Title Case, not ALL CAPS.
- **iOS Dynamic Type.** `@supports (font: -apple-system-body) { html { font: -apple-system-body; } }` follows it in Safari.

### 3.4 Framework adapters (hig-web-kit)

| Stack | Use |
|---|---|
| **Ant Design 5/6** | `<ConfigProvider {...higAntd({ mode, scheme, contrast, density, accent })}>` from `hig-web-kit/antd`, plus `antd-glass.css` for glass popups. It pins antd's derived brand colors so AA holds in dark mode and on hover/active. Re-render on `watchPreferences()`. |
| Tailwind 4 | `@import "hig-web-kit/hig.css"; @import "hig-web-kit/tailwind.css";` gives `bg-hig-grouped-bg-2 text-hig-label-2 rounded-hig-card text-hig-body`. Tailwind 3: `presets: [require('hig-web-kit/tailwind-preset')]`. |
| shadcn/ui | `@import "hig-web-kit/shadcn.css"` maps `--background`, `--primary`, `--ring`… onto `--hig-*`; delete the generated `.dark {}` block. |
| MUI | `createTheme(higMui({ mode, scheme, accent }))` |
| Bootstrap 5 | `$hig-set: "aa.light"; @import "hig-bootstrap"; @import "bootstrap/scss/bootstrap";`, plus `bootstrap-runtime.css` |
| Anything else | CSS variables, or `import { tokens } from 'hig-web-kit'` → `tokens.color.aa.dark.accentFill` (themes: `tokens.themes.vzb.color.aa.dark.accentFill`) for Vuetify, Chakra, Mantine, PrimeVue and the like |

### 3.5 Accent themes (brand color)

HIG: one app accent tints primary buttons, links, selection, the slider fill and the focus ring. Labels, fills, system colors and the green switch don't change. Never use a second "primary" color on controls; secondary brand colors live in content (illustrations, cards, tags).

- **Built-in:** `<html data-hig-theme="vzb">` (Vzdělání budoucnosti navy `#01497c`, dark scheme from `#1768ac`), `indigo`, `purple`, `pink`, `orange`, `green`, `teal`, `graphite`. No attribute = Apple system blue.
- **Runtime:** `import { setTheme, restoreTheme, applyBrandColor } from 'hig-web-kit/theme'`. `restoreTheme()` reads the saved choice and `#theme=vzb` (combinable: `#aa-dark-theme=vzb`); `applyBrandColor('#c8102e')` derives and injects a theme for any color; `deriveBrandTheme()` returns the values only.
- **Derivation:** keep hue and saturation, move only lightness, minimally:
  - Apple mode: accent ≥ 3:1 on the page; white `on-accent` (black only for yellow-like brands).
  - AA mode and Increase Contrast: accent text and link ≥ 4.5:1 on page, card, secondary background and gray button; filled button label ≥ 4.5:1 (white preferred); fill, indicator and focus ring ≥ 3:1 on page and card.
- **Settings UI:** an accent picker (`.hig-swatches[role="radiogroup"] > button.hig-swatch[style="--swatch:…"]`), 28 px dots in 44 px targets, the selected one ringed with a check; a "custom" swatch wraps `<input type="color">`.
- **Without the kit:** override only `--hig-accent`, `--hig-accent-fill`, `--hig-accent-text`, `--hig-on-accent`, `--hig-link`, `--hig-focus-ring` per mode/scheme, and verify the AA pairs (§12).

Ant Design specifics:

- Capsule buttons: `button: { shape: 'round' }`.
- Inputs: `variant: 'filled'` in Apple mode, `'outlined'` in AA mode.
- Controls are 44 px (touch) or 28 px (desktop).
- Keep only one `type="primary"` button per view.
- In `Modal.confirm`, give the destructive button `okButtonProps={{ danger: true }}` and set `autoFocusButton="cancel"`.
- Already themed by `higAntd()`: Checkbox/Radio (22/16 px, visible outline), Breadcrumb (path control colors), Collapse (ghost disclosure rows), Avatar (Contacts-style monogram, AA-safe gray), Badge (`on-destructive` text in AA), Tag (`fill-2` capsule), Tooltip (light help tag), Skeleton, Carousel dots (8 px; wider current dot in AA), Table sort states, Progress, Notification and Message.
- `antd-glass.css` also turns notifications and messages into glass (banner and HUD capsule); add `className="hig-striped"` to a `Table` for alternating rows.
- Brand color: `accent: 'vzb'` (built-in theme) or `accent: '#c8102e'`; keep it in sync with `data-hig-theme` via `getTheme()`.
- Mapping: pop-up button → `Select`; pull-down → `Dropdown`; context menu → `Dropdown trigger={['contextMenu']}`; popover → `Popover`; disclosure → `Collapse ghost expandIconPlacement="end"`; scope bar → `Segmented` or `Radio.Group optionType="button"`; path control → `Breadcrumb separator="›"`; HUD toast → `message`; sidebar → `Layout.Sider` + `Menu`; page control → `Carousel`; empty state → `Empty`.

---

## 4. Layout, spacing, targets

- **Hit targets.** 44×44 px on touch (28 minimum); 28×28 px on desktop (20 minimum). WCAG 2.5.8 requires at least 24 px. Pad icon buttons to 44 px even when the glyph is 20–22 px.
- **Spacing.** ≈ 12 px around bezeled controls and ≈ 24 px around borderless ones. Leave no gaps between buttons in a group.
- **Margins.** 16 px in compact width, 20 px+ in regular. Readable text width is ≈ 672 px or 65 ch. Use an 8 px grid.
- **Hierarchy.** Most important at the top and leading edge. Aligned means related; indented means subordinate. Use progressive disclosure ("Show All" next to a section title).
- **Functionality stays the same across sizes.** Only the amount shown changes (tab bar ↔ sidebar).
- **Reachability.** On phones, frequent controls go in the middle or at the bottom.
- **Safe areas.** Use `viewport-fit=cover` and `env(safe-area-inset-*)`. Floating bars sit ≈ 8–12 px above the bottom inset and 16 px from the sides.
- **Focus not obscured** (WCAG 2.4.11): `html { scroll-padding-block: 72px 96px }` when bars float.
- **Desktop.** No critical controls at the bottom of windows. Split view dividers are 1 px with ≈ 8 px hit areas.
- **Steady state.** At rest (top of the page), content and glass shouldn't overlap awkwardly; make sure what sits under the bars is legible.
- **Background extension.** Under a floating sidebar, mirror and blur a copy of the hero image (`transform: scaleX(-1); filter: blur(30px)`).

---

## 5. Color rules

- **One meaning per color.** Never rely on color alone; pair it with text, shape or position.
- **Accent sparingly**: primary actions, selection, status. Brand color goes into the content layer and the one accent (§3.5).
- **Destructive** uses red. The switch "on" color is green.
- **Behind glass,** avoid label colors similar to busy content; use monochrome bars.
- **Respect the system color scheme.** An in-app theme switch must default to "System".
- **Contrast.** AA requires ≥ 4.5:1 for text up to 17 px (≥ 3:1 at 18 px+ or bold) and ≥ 3:1 for UI boundaries and focus. In Apple mode these are not guaranteed; that is what AA mode is for.
- **Dark mode.** Soften images with white backgrounds (`filter: brightness(.9)`).
- **Wide color.** Use `@media (color-gamut: p3)` with `color(display-p3 …)` overrides if needed.

---

## 6. Liquid Glass on the web — tested recipes

### 6.1 Browser reality (Oct 2026)

| Technique | Chromium | Safari | Firefox |
|---|---|---|---|
| `backdrop-filter: blur() saturate()` | ✓ | ✓ (also ship `-webkit-`) | ✓ |
| `backdrop-filter: url(#svg)` refraction | ✓ | renders nothing, yet `@supports` reports support | — |
| `prefers-reduced-transparency` | ✓ | ✓ | flag |

Base glass works everywhere and gives ≈ 80 % of the look. Add SVG edge refraction **only in Chromium**, detected by engine. Keep backdrop-filtered elements to a handful (bars, FAB, menus, sheet). An ancestor with `overflow: hidden` or `clip-path` can stop the backdrop from sampling anything.

### 6.2 Base glass

```css
.hig-glass {
  --hig-mx: 50%; --hig-my: 50%;
  position: relative; isolation: isolate; border-radius: 999px;
  background: var(--hig-glass-tint); color: var(--hig-glass-label);
  -webkit-backdrop-filter: blur(6px) saturate(190%) brightness(1.04);
          backdrop-filter: blur(6px) saturate(190%) brightness(1.04);
  box-shadow: var(--hig-glass-shadow),
    inset 0 1px 0 0 var(--hig-glass-rim), inset 0 -1px 0 0 var(--hig-glass-rim-dim), inset 0 0 0 .5px var(--hig-glass-rim-dim);
  transition: scale var(--hig-duration) var(--hig-ease-spring), background-color .25s var(--hig-ease-out);
}
.hig-glass::before { /* angled specular rim */
  content: ""; position: absolute; inset: 0; z-index: 1; border-radius: inherit; padding: 1px; pointer-events: none;
  background: linear-gradient(135deg, var(--hig-glass-rim), transparent 38%, transparent 62%, var(--hig-glass-rim-dim));
  -webkit-mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
.hig-glass::after { /* light from the touch point */
  content: ""; position: absolute; inset: 0; z-index: 1; border-radius: inherit; pointer-events: none;
  background: radial-gradient(90px circle at var(--hig-mx) var(--hig-my), rgb(255 255 255 / .5), transparent 65%);
  opacity: 0; transition: opacity .45s var(--hig-ease-out);
}
.hig-glass > * { position: relative; z-index: 2; }
.hig-glass.is-pressed::after { opacity: 1; transition-duration: .06s; }
.hig-glass.is-lit::after { opacity: .3; }
.hig-glass.hig-press-scale.is-pressed { scale: 1.08; }
.hig-glass--large { background: var(--hig-glass-tint-large);
  -webkit-backdrop-filter: blur(22px) saturate(180%); backdrop-filter: blur(22px) saturate(180%); }
.hig-glass--clear { background: var(--hig-glass-tint-clear); color: #fff; font-weight: 600;
  -webkit-backdrop-filter: blur(2px) saturate(150%) brightness(1.05); backdrop-filter: blur(2px) saturate(150%) brightness(1.05); }
.hig-glass--tint { background: color-mix(in oklab, var(--hig-accent-fill) 85%, transparent); color: var(--hig-on-accent); }
.hig-glass--on-dark { --hig-glass-tint: rgb(28 28 32 / .38); --hig-glass-label: #fff; --hig-glass-rim: rgb(255 255 255 / .32); }
[data-hig-mode="aa"] .hig-glass--on-dark { --hig-glass-tint: rgb(28 28 32 / .72); }
[data-hig-mode="aa"] .hig-glass--tint { background: var(--hig-accent-fill); }
.hig-media-dim::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgb(0 0 0 / .35), transparent 45%); }
```

```js
// press light + spread to sibling glass in the same group
document.addEventListener('pointerdown', e => {
  const g = e.target.closest('.hig-glass'); if (!g || g.matches('dialog')) return;
  const r = g.getBoundingClientRect();
  g.style.setProperty('--hig-mx', `${e.clientX - r.left}px`); g.style.setProperty('--hig-my', `${e.clientY - r.top}px`);
  g.classList.add('is-pressed');
  const sibs = g.parentElement ? [...g.parentElement.children].filter(n => n !== g && n.classList.contains('hig-glass')) : [];
  sibs.forEach(n => n.classList.add('is-lit'));
  const up = () => { g.classList.remove('is-pressed'); sibs.forEach(n => n.classList.remove('is-lit'));
    removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
});
```

### 6.3 Real edge refraction (Chromium only)

Tested values:

- bezel = clamp(8 px, 0.32 × height, 22 px);
- displacement `scale` = 1.1 × bezel (1.6× mirrors text at the rim);
- blur after refraction ≤ 0.6 px.

With the package: `initGlass()` from `hig-web-kit/glass` handles everything for `[data-hig-refract]`. Standalone:

```js
const isChromium = !!(navigator.userAgentData?.brands || []).find(b => /Chromium/.test(b.brand));
document.documentElement.classList.toggle('hig-refract', isChromium);
function lensMap(w, h, r, bezel) {
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
  const sdf = (x, y) => { const qx = Math.abs(x - w / 2) - (w / 2 - r), qy = Math.abs(y - h / 2) - (h / 2 - r);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dist = -sdf(x + .5, y + .5); let dx = 0, dy = 0;
    if (dist > 0 && dist < bezel) {
      const nx = sdf(x + 1, y) - sdf(x - 1, y), ny = sdf(x, y + 1) - sdf(x, y - 1), len = Math.hypot(nx, ny) || 1;
      const mag = Math.pow(1 - dist / bezel, 2.2); dx = -nx / len * mag; dy = -ny / len * mag;
    }
    const i = (y * w + x) * 4; d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0); return c.toDataURL();
}
let fid = 0; const NS = 'http://www.w3.org/2000/svg';
const host = document.body.appendChild(document.createElementNS(NS, 'svg'));
host.setAttribute('width', 0); host.setAttribute('height', 0); host.style.position = 'absolute';
function attachRefraction(el) {
  const id = 'lg' + (++fid), f = document.createElementNS(NS, 'filter');
  f.id = id; f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
  const im = document.createElementNS(NS, 'feImage'); im.setAttribute('result', 'map'); im.setAttribute('preserveAspectRatio', 'none');
  const dm = document.createElementNS(NS, 'feDisplacementMap');
  dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'map'); dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
  f.append(im, dm); host.append(f);
  const build = () => {
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight); if (!w || !h) return;
    const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2, w / 2);
    const bezel = Math.max(8, Math.min(h * .32, 22));
    for (const [k, v] of [['x', 0], ['y', 0], ['width', w], ['height', h]]) { f.setAttribute(k, v); im.setAttribute(k, v); }
    im.setAttribute('href', lensMap(w, h, r, bezel)); dm.setAttribute('scale', Math.round(bezel * 1.1));
  };
  build(); new ResizeObserver(build).observe(el);
  el.style.setProperty('--hig-refract', `url(#${id})`);
}
if (isChromium) document.querySelectorAll('[data-hig-refract]').forEach(attachRefraction);
```
```css
html.hig-refract .hig-glass[data-hig-refract] {
  -webkit-backdrop-filter: var(--hig-refract) blur(.6px) saturate(185%) brightness(1.05);
          backdrop-filter: var(--hig-refract) blur(.6px) saturate(185%) brightness(1.05);
}
```
Use refraction on 2–4 hero elements (tab bar, media player capsule, a FAB), not on every button. Cross-browser fake when the background is known (a wallpaper image): put a copy of the background inside the glass with `background-attachment: fixed` and apply a normal `filter: url(#…)` to that copy.

### 6.4 Adaptivity (light/dark flip of small glass)

CSS can't read the pixels behind an element. Mark dark content sections with `data-hig-tone="dark"`, then on scroll (throttled with rAF) test what lies under each `[data-hig-adapt]` element:

```js
function adapt() {
  document.querySelectorAll('[data-hig-adapt]').forEach(el => {
    const r = el.getBoundingClientRect();
    const dark = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .some(n => n !== el && !el.contains(n) && n.closest?.('[data-hig-tone="dark"]'));
    el.classList.toggle('hig-glass--on-dark', dark);
  });
}
```

### 6.5 Scroll edge effect

```css
.hig-scroll-edge--top { position: fixed; inset: 0 0 auto 0; height: calc(env(safe-area-inset-top, 0px) + 84px);
  z-index: 20; pointer-events: none; opacity: 0; transition: opacity .3s;
  background: linear-gradient(to bottom, color-mix(in srgb, var(--hig-bg) 78%, transparent), transparent);
  -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  -webkit-mask-image: linear-gradient(to bottom, #000 45%, transparent); mask-image: linear-gradient(to bottom, #000 45%, transparent); }
[data-hig-scrolled] .hig-scroll-edge--top { opacity: 1; }
.hig-scroll-edge--hard { background: color-mix(in srgb, var(--hig-bg) 92%, transparent); -webkit-mask-image: none; mask-image: none;
  -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%); border-bottom: .5px solid var(--hig-sep); }
```

Toggle `data-hig-scrolled` on `<html>` with an IntersectionObserver on the large title (rootMargin = −bar height). The same attribute drives the large-title → inline-title collapse. Use one effect per edge, and never stack soft and hard.

### 6.6 Appear, morph, gel

```css
@keyframes hig-glass-in { from { scale: .3 .15; border-radius: 999px; -webkit-backdrop-filter: blur(0); backdrop-filter: blur(0); } }
.hig-glass-enter { animation: hig-glass-in .5s var(--hig-ease-spring) both; } /* set transform-origin at the trigger */
.hig-switch.is-pressed .hig-switch__thumb { scale: 1.35 1.45; background: rgb(255 255 255 / .25);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .8), inset 0 0 0 .5px rgb(255 255 255 / .5), 0 4px 14px rgb(0 0 0 / .18); }
```
For button → menu and tab bar ↔ sidebar, use the View Transitions API with a shared `view-transition-name` (spring timing), falling back to FLIP. Never fade glass in with opacity alone.

### 6.7 Accessibility runtime and AA switch

```js
import { restorePreferences, setMode, watchPreferences, checkContrast } from 'hig-web-kit/a11y';
import { restoreTheme } from 'hig-web-kit/theme';
restorePreferences();                 // saved choice + URL flags #aa #dark #hc (combinable: #aa-dark-hc)
restoreTheme();                       // saved accent theme or #theme=vzb
setMode('aa');                        // AA mode on (or 'apple')
watchPreferences(p => rebuildFrameworkTheme(p)); // { mode, scheme, contrast, transparency, motion }
console.table(checkContrast());       // live WCAG check of the rendered tokens (themes included)
```
Without the package: `document.documentElement.setAttribute('data-hig-mode', 'aa')`, and for the other attributes listen to `matchMedia('(prefers-contrast: more)')` and the like.

```css
/* Reduce Transparency → frosted, near-opaque */
@media (prefers-reduced-transparency: reduce) { :root:not([data-hig-transparency="standard"]) .hig-glass {
  background: color-mix(in srgb, var(--hig-bg-elevated) 94%, transparent); color: var(--hig-label);
  -webkit-backdrop-filter: blur(30px); backdrop-filter: blur(30px); } }
/* Increase Contrast → solid + border (palette swap comes from the -hc token sets) */
@media (prefers-contrast: more) { :root:not([data-hig-contrast="standard"]) .hig-glass {
  -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: 0 0 0 1.5px var(--hig-label); } }
/* Reduce Motion → no gel, scale or slides */
@media (prefers-reduced-motion: reduce) { :root:not([data-hig-motion="standard"]) .hig-glass { transition-duration: .01ms; }
  :root:not([data-hig-motion="standard"]) .hig-glass.is-pressed { scale: 1; } }
@media (forced-colors: active) { .hig-glass { border: 1px solid ButtonText; backdrop-filter: none; } }
```

---

## 7. Components

Defaults marked ≈ are web values tuned to match iOS 26/27; the rules come from the HIG. Class names match `hig-web-kit/components.css`.

### Buttons
- Style hierarchy, chosen by importance rather than size:
  1. **Prominent** (`.hig-btn--prominent`): `accent-fill` with `on-accent` text. At most 1–2 per view.
  2. **Glass** (`.hig-glass` on bars).
  3. **Gray** (`.hig-btn`): `fill-2` with `accent-text`.
  4. **Plain** (`.hig-btn--plain`).

  **Destructive** uses red text, or a red fill when confirmed. It is never the default button.
- Capsule shape by default; rounded-rect (≈ 12 px) for stacked full-width buttons.
- Heights 28 / 32 / 44 / 52 / 64 px with padding 12 / 14 / 20 / 26 / 32 px; labels 600 weight.
- Labels are verbs in Title Case ("Add to Cart"). Add "…" when more input follows.
- Icon-only buttons need `aria-label` and standard glyphs (share, ellipsis, checkmark, xmark, chevron, plus, trash).
- Every button needs a pressed state. For async actions, put a spinner inside the button, change the label ("Sending…"), set `aria-busy`, and lock the width.

### Toggles
- Use a **switch** only in list rows: ≈ 64×28 px track and 38×24 px thumb, green when on, `role="switch"`. In AA mode it gets a border when off.
- Outside lists, use a **toggle button** (`aria-pressed`).
- **Checkbox and radio** (`input.hig-checkbox` / `input.hig-radio` inside `label.hig-check`, grouped in `fieldset.hig-choices`) are desktop controls; radio groups hold 2–5 options, more → pop-up button.
  - Label on the trailing side; the box always has a visible outline (`label-3`; `control-border` in AA mode); checked = `accent-fill` with an `on-accent` mark.
  - A parent checkbox shows **mixed** (dash) when its children differ: `aria-controls="child ids"` wires this up. Indent dependents (`.hig-choices--nested`).
  - Touch 22 px boxes with 44 px rows; pointer 18 px with 28 px rows.

### Segmented control
- 2–5 segments on phones (≤ 7 when wide), equal widths, all text or all icons, noun labels.
- Never mix selection and actions. Don't use it for app sections (use the tab bar).
- ≈ 36 px capsule track and a sliding thumb, `role="radiogroup"`, arrow keys.

### Slider, stepper, pickers, progress
- **Slider:** min on the leading side; live feedback; label ending with a colon; 6 px track; the thumb turns to glass while dragged; `aria-valuetext`.
- **Stepper:** −/+ in one capsule, with the value shown next to it.
- **Pickers:** for medium and long lists; short lists use a pull-down or pop-up button.
  - **Pop-up button** (`.hig-btn.hig-popup` + `data-hig-popup`): a mutually exclusive choice; the label shows the current value with ⌃⌄; its menu uses `menuitemradio` with a checkmark. Pick a sensible default. In list rows it's plain, trailing, `label-2` (accent in AA mode).
  - **Native select** styled as a field: `<div class="hig-select"><select>`.
  - **Compact date/time** (`input.hig-date`, type date/time): a capsule showing the value; the system calendar opens from it. Minute steps divide 60 (`step="900"`).
- **Progress:** prefer determinate; never switch between a bar and a circle; report evenly; show progress after ≈ 1–2 s; use skeletons instead of blank screens. Patterns in "Progress, gauges, ratings" below.

### Text fields and search
- Always show a visible label; the placeholder is only a format hint. Never prefill passwords or block paste.
- Fields are 44 px, `fill-3`, radius 14 px, with `control-border` in AA mode and a 2 px focus ring.
- Validate digits as they're typed, email on blur, and passwords before the person leaves the field. Errors appear inline and say how to fix the problem.
- Set `inputmode` / `type` and `enterkeyhint`.
- **Multiline** (`.hig-input--multiline` + `textarea`): grows with content (3–12 lines); show a live count (`.hig-field__count`, `aria-live="polite"`) when there's a limit.
- **Token field** (`.hig-input.hig-tokens[data-hig-tokens]`): comma or Return turns text into a token; Backspace on an empty input removes the last; every token has a labelled remove button ("Remove Robotics").
- Search:
  - a magnifier, a placeholder naming what can be searched, and a clear button shown only when there's text;
  - search as people type, with recents before typing;
  - on mobile, a search button at the trailing end of the tab bar; on desktop, the trailing end of the toolbar.

### Menus
- Items are Title Case verbs. Dim unavailable items in menus; hide them in context menus. Add "…" when more input follows.
- Group items with separators, most frequent first, destructive last in red. Icons are all-or-nothing within a group.
- Submenus are one level deep.
- Pull-down buttons hold actions (≥ 3 items). Pop-up buttons hold a mutually exclusive choice.
- Context menus open on right-click or long press (≈ 500 ms); every item must also be reachable elsewhere.
- Look: large glass, radius ≈ 26 px (touch) or 10–12 px (pointer), rows 44 px (touch) or ≈ 28 px (pointer). The menu grows out of its trigger.
- Accessibility: `aria-haspopup`, `aria-expanded`; arrow keys, Home/End and Esc, with focus returning to the trigger.
- **Context menu** (`data-hig-contextmenu="menu-id"` on the item; the menu is a normal `.hig-menu`): right-click, long press (≈ 500 ms) or **Shift+F10 / Menu key**. The item lifts (scale 1.02 + shadow), the page dims and blurs, the menu opens at the pointer and flips above when there's no room. Keep ≤ 3 groups, destructive last, no keyboard shortcuts shown, hide (don't dim) unavailable items.

### Sheets
- A sheet is for a scoped task, one at a time. Swipe down to dismiss, and confirm first if there are unsaved changes.
- Top bar: **Cancel on the leading side** (xmark), **Done on the trailing side** (tinted checkmark). Never show Done alone, or Cancel, Done and Back together.
- Detents: medium (≈ ½ height, inset ≈ 8 px, radius ≈ 34 px, regular glass) and large (edge to edge, more opaque). The grabber is 36×5 px.
- Implement with `<dialog>` and `showModal()`. Animate the close. A backdrop tap closes only when it lands outside the sheet. Keep the `<dialog>` UA reset at class specificity (`:where(dialog).hig-sheet`), or it overrides the component's padding and max-width.

### Popovers and tooltips
- Anchored to their source with an arrow, one at a time. Dismissing by tapping outside **saves** the work. Never use a popover for warnings. In compact width, use a sheet instead.
- Implementation: Popover API — `<button popovertarget="p">` + `<div class="hig-glass hig-glass--large hig-popover" id="p" popover><span class="hig-popover__arrow"></span>…`. components.js places it below (or above) the source and aims the arrow; under 600 px it becomes a bottom sheet with a scrim.
- **Tooltips / help tags** (`data-hig-tooltip="…"`): pointer only, after ≈ 500 ms hover or immediately on keyboard focus; short, solid surface, wired with `aria-describedby`. Hoverable, dismissible with Esc, persistent while hovered (WCAG 1.4.13). Never put essential information only in a tooltip; iOS has none.

### Alerts
- Use alerts rarely, never on launch, and not for actions that can be undone.
- The title is specific and at most 2 lines (never "Error"). At most 3 buttons.
- Button labels are 1–2 word verbs; **never Yes/No**. Cancel is always "Cancel" and never the default.
- With 2 buttons, Cancel goes on the leading side. With 3, stack them with Cancel at the bottom.
- Look: ≈ 300 px wide, radius ≈ 32 px, padding ≈ 22/18/16 px, left-aligned bold title, capsule buttons. Use `role="alertdialog"`.

### Action sheets
- For choices about an action the person started. Destructive options come first in red, and Cancel is a separate block at the bottom. On wide screens, show it as a popover from the trigger.

### Tab bar
- Tabs navigate between sections; they are never actions. Keep the bar visible, with ≤ 5 tabs and always-visible labels. Never disable or hide a tab.
- Use filled icons for the selected tab. Badges are red, for critical information only.
- Look: a floating capsule ≈ 62 px tall, ≈ 12 px above the safe area; items ≈ 84×54 px (shrinking to ≈ 64 px on narrow phones). The selected tab is accent-colored with a `fill-3` lens behind it; in AA mode the label is `label` and the lens gets a border.
- Search is a separate circular glass button. The bar minimizes while scrolling down.

### Toolbar / navigation bar
- The bar itself is transparent; its controls sit in **glass capsule groups**: leading (back chevron, **no "Back" text**), centre/title, trailing.
- At most ≈ 3 groups. Never mix text and symbol buttons in one group.
- **One prominent action**, tinted, alone, on the trailing side.
- Glyphs are borderless inside a group, with 44 px targets and monochrome labels. No custom bar background; use a scroll edge effect.
- The title is specific, < 15 characters, and never the app name. The large title collapses into the inline title on scroll.

### Sidebar and split view
- The sidebar sits on the leading side, with ≤ 2 levels. People can hide it, but it isn't hidden by default. Icons use the accent color. No critical items at the bottom.
- Look: floating glass inset ≈ 8 px, with a radius concentric with the window. Content and hero images extend under it.
- Markup: `nav.hig-glass.hig-glass--large.hig-sidebar` with `.hig-sidebar__heading`, `a.hig-sidebar__item[aria-current="page"]` (selected = `fill-2` pill + semibold; AA adds a border), optional `.hig-sidebar__count`, collapsible groups as `details.hig-sidebar__group > summary`. Rows 44 px touch / 32 px pointer; item radius = sidebar radius − padding (concentric).
- Split view: `.hig-split > .hig-split__layout > (sidebar, .hig-split__detail)` — a container query puts panes side by side from 560 px and stacks them below; `.hig-split--three` adds a `.hig-split__list` column (1 px divider) from 860 px. The selection stays highlighted in each pane.

### Disclosure, scope bars, path controls
- **Disclosure** (`details.hig-disclosure > summary`): the chevron points to the trailing side when closed and down when open; give it a descriptive label ("Advanced Options"). Keep the most-used controls visible. Inside `.hig-list` it renders as a row; height animates where supported.
- **Scope bar / filter chips** (`.hig-scope[role="radiogroup"] > button.hig-chip[role="radio"]`): narrow results under a search field or list; one selected, arrow keys move. Independent filters are `button.hig-chip[aria-pressed]`. Selected = inverted (`label` fill, `bg` text) — not colour alone.
- **Path control / breadcrumbs** (`nav.hig-path > ol > li`, last `aria-current="page"`): in the window body, never in a toolbar; middle items truncate first.

### Lists (inset grouped)
- Cards are `grouped-bg-2` on a `grouped-bg` page, radius ≈ 26 px.
- Rows are ≥ 44 px (≈ 52 px in the Liquid Glass era), with a 16 px inset. 0.5 px separators are inset to the text (58 px when there's a 30 px icon square).
- Title with an optional `.hig-row__subtitle` (footnote, `label-2`); values use `label-2`. Chevrons use `label-3` (`label-2` in AA mode).
- Settings icon squares: 30 px, radius 8 px, white 18 px glyph.
- Section headers are Title Case footnotes. Footers say what a setting does when it's **on**.
- Accessories: a chevron drills down, ⓘ shows details, a checkmark marks the chosen option.
- **Swipe actions** (`li.hig-swipe > .hig-swipe__actions + .hig-row.hig-swipe__content`): drag left to reveal; ≤ 3 actions, destructive last (trailing edge) in `destructive-fill`. Every swipe action must also exist elsewhere (context menu or edit mode); in the kit, Tab-focusing an action reveals the row.

### Labels, badges, page controls
- Use the label hierarchy (`label` → `label-4`); make useful text selectable.
- Badges are 18 px tall and red, for things that need attention; position with `.hig-badge-anchor` (icon buttons, avatars), `.hig-badge--dot` for a dot. Put the count in the control's `aria-label` ("Notifications, 3 new").
- Plain counts in lists and sidebars are neutral, not red: `.hig-count` (gray capsule) or `label-2` text.
- **Page control** (`.hig-page-control[data-hig-pager="pager-id"]` + `.hig-pager > .hig-pager__page`): ≈ 8 px dots (24 px targets) for ≤ 10 flat pages, centred below; current dot `label`, others `label-3` (`control-border` and a wider current capsule in AA mode). Arrow keys page; dots get "Page n / N" labels. Never colour the dots.

### Progress, gauges, ratings
- **Activity indicator** (`span.hig-activity[role="progressbar"]`, `--lg`): CSS-only 8 spokes in `label-2`; for unknown durations only, no label on macOS. Put it trailing in the row that describes the work.
- **Circular progress** (`.hig-progress-ring`, `--value: 40%`; `--label` shows the number inside, `--stop` a stop square) fills clockwise; never switch between bar and ring for one task. In lists, title + subtitle ("Uploading · 40 %") on the leading side, ring trailing.
- **Bar in a row:** `.hig-row > .hig-row__body > .hig-row__line (title + value "8 of 12") + .hig-progress`.
- **Gauge** (`.hig-gauge[role="meter"]`, `--value: 0–100`, `--color`, sizes `--sm`/`--lg`): a 270° capacity ring, value centred (unit in `<small>`), endpoint labels under the two ends of the arc. Wrap in `figure.hig-gauge-item` with a `figcaption` (bold name + context) and lay several out in `.hig-meters`. `.hig-gauge-bar` is linear with an indicator (`--heat` gradient when color carries meaning) and `.hig-gauge-scale` for its end labels. Always `aria-valuetext`.
- **Rating** (`.hig-rating[role="img"]`, `--value`): whole stars only, `aria-label="4 of 5 stars"`; show the number next to it.

### Empty states, loading, notifications
- **Empty state** (`.hig-empty`: icon, title, one-line explanation, optional button) — say what will appear and how to get it ("No Homework · Assignments from your teachers appear here."). Never a blank screen.
- **Skeletons** (`.hig-skeleton`, `--text`, `--title`, `--circle`) mirror the real layout; the container gets `aria-busy="true"`; the shimmer stops with Reduce Motion.
- **Notification banner** (`.hig-banner`): icon square, bold title, time, text. Solid when shown inside content; add `.hig-glass .hig-glass--large` only when it floats.
- **HUD toast** (`showToast('Added to Library', { icon })`): a glass capsule at the top for brief confirmation of something the person just did — `role="status"`, ≥ 4 s, pauses while hovered, never the only way to learn about an error (use inline messages or an alert).

### Tables and collections
- **Table** (`.hig-table-wrap > table.hig-table`): column headings are Title Case nouns; `th > button.hig-table__sort` sorts (click again to reverse, `aria-sort`); numbers right-aligned (`.is-num`, tabular figures); alternating rows for wide tables; sticky header. Tables are for desktop/regular width — on phones prefer a list.
- **Collection** (`ul.hig-grid > li > button.hig-grid__item`): photos edge to edge with 2 px gaps; `.hig-grid--cards` for captioned tiles. Selection shows an accent check badge (`aria-pressed`). Animate insert/remove.
- **Avatar** (`.hig-avatar`, `--sm/--lg/--xl`): photo or monogram initials on a gray gradient (darker in AA mode so white initials reach 4.5:1); `.hig-avatar-stack` overlaps with a ring. Decorative avatars get `aria-hidden`; a stack gets one `role="img"` label listing the people.
- **Card / widget** (`.hig-card`, `.hig-widget`, `--medium`, `--tinted`): content layer, so solid `grouped-bg-2`, never glass. Widgets lead with one glanceable value (rounded bold, tabular), a label and a caption; radius ≈ 24 px with concentric content.

---

## 8. Patterns

- **Modality:** only when it clearly helps; one at a time; a title that names the task; confirm before discarding data.
- **Onboarding:** optional and short; teach by doing; ask for permissions in context.
- **Launching and loading:** restore state; skeletons; progress after ≈ 1–2 s; never a blank screen.
- **Feedback:** match how intrusive it is to how important it is (inline < toast < alert). Errors appear near the problem, with the fix.
- **Entering data:** minimize typing; use pickers and defaults; validate each field as it's completed.
- **Settings:** good defaults; don't duplicate OS settings (theme defaults to "System"); an accent picker is fine (§3.5).
- **Accounts:** sign in as late as possible; guest use; passkeys; account deletion easy to find.
- **Permissions:** explain the benefit first; a pre-prompt has a single "Continue" button (never "Allow"); stay usable after denial.
- **Notifications:** marketing only after an explicit opt-in; "urgent" only for events happening now or within the hour.
- **Undo:** prefer undo to confirmation; label it ("Undo Typing").
- **Drag and drop:** start after ≈ 3 px; highlight only valid targets; always offer a keyboard or menu alternative.
- **Help:** tooltips ≤ 60–75 characters, never essential information. **Ratings:** ask after a positive moment, ≥ 1–2 weeks apart.
- **Charts:** a headline takeaway, a text alternative, consistent colors across charts, accessible contrast.

## 9. Inputs

- **Pointer:** hover highlight; the pointing-hand cursor is for links only.
- **Keyboard:** everything reachable; Tab between groups, arrow keys within a group; a visible focus ring (3 px, focus-ring color, offset 2 px); restore focus after dialogs and menus; never hijack ⌘F/⌘S/⌘Z/⌘C/⌘V. Show modifiers in the order ⌃ ⌥ ⇧ ⌘.
- **Gestures:** every gesture has a visible alternative; don't conflict with the browser's back swipe.

## 10. Writing (UX copy)

- **Buttons and links are verbs;** specific beats clever. Never "Click here".
- **Capitalization.** Pick one style per element type:
  - Title Case for buttons, menu items, tabs, segments and column headings;
  - sentence case for body text, footers, tooltips and alert messages.

  Languages without title case (Czech, for example) use sentence case everywhere.
- **No "we", no "oops", no blame.** "Unable to load content." Errors say how to fix the problem. Empty states give a next step.
- **Verbs per input:** "tap" on touch, "click" with a pointer. Address people as "you".
- **Flow buttons:** Get Started → Continue/Next → Done.
- **Localization:** allow 30–40 % longer text; mirror layouts for RTL (`margin-inline`).

## 11. Motion

- Purposeful, brief and interruptible; follow the gesture; exit the way you entered.
- Springs with slight overshoot, 300–500 ms; micro feedback 100–200 ms. Never block input while an animation runs.
- Reduce Motion: fades instead of slides; no bounce, blur animation or gel scaling.

## 12. Accessibility checklist (WCAG 2.2 AA)

- **Contrast.** In AA mode: text ≥ 4.5:1 (≥ 3:1 at 18 px+ or bold); control boundaries, switch "on", slider fill and focus ≥ 3:1. Measure text on glass over the worst backdrop. Check custom and brand colors with `checkContrast()`.
- **Targets.** ≥ 44 px on touch (24 px minimum), 28 px on desktop.
- **Text size and reflow** (1.4.4 / 1.4.10). Use `rem`, support 200 %, and stack horizontal items at large sizes.
- **Focus.** Visible (2.4.7) and not hidden under floating bars (2.4.11, `scroll-padding`).
- **Keyboard** (2.1.1). Segmented control and tabs use arrow keys; menus use arrows, Home/End and Esc; dialogs use `<dialog>`.
- **Name, role, value** (4.1.2).
  - Every icon-only control has `aria-label`.
  - Roles: `switch`, `radiogroup`, `tablist`, `menu`, `alertdialog`, `progressbar`, `meter`.
  - `aria-checked`, `selected`, `expanded` and `busy` stay in sync.
- **Errors** are announced (`aria-describedby` / `aria-live`) and say how to fix the problem.
- **Preferences.** Reduce Transparency, Increase Contrast, Reduce Motion and forced colors are handled.
- **Media and timing.** No important information auto-dismisses. People control media playback; no autoplay with sound.

## 13. Review checklist (anti-patterns)

- [ ] Mode not decided, or not stated (Step 0); AA was requested but `data-hig-mode="aa"` / `mode: 'aa'` is missing.
- [ ] Glass on content (cards, rows), or glass on glass.
- [ ] Solid or semi-opaque bar background instead of a scroll edge effect.
- [ ] More than one tinted or prominent action per view; a tinted glyph instead of a tinted background.
- [ ] Clear glass without a dimming layer, or over non-media content.
- [ ] Nested corners that aren't concentric; edge-to-edge bars on phones instead of floating capsules.
- [ ] Tab bar used for actions; hidden or disabled tabs; > 5 tabs; missing labels.
- [ ] Text and symbol buttons in one toolbar group; a "Back" text label; the app name as the screen title.
- [ ] Destructive button as the default; "Yes/No" alert buttons; an alert on launch; "Error" as a title.
- [ ] Placeholder as the only label; validation only on submit; prefilled password; paste blocked.
- [ ] Modal on page load; nested modals; a backdrop click that silently discards typed data.
- [ ] Self-hosted SF Pro or SF Symbols; Ultralight/Thin body text; text < 11 px.
- [ ] Colors for one scheme only; a theme toggle without a "System" default.
- [ ] `outline: none` with no replacement; hover-only controls; drag-only reordering.
- [ ] Refraction via `backdrop-filter: url()` without engine detection; dozens of backdrop-filtered elements.
- [ ] Ant Design: antd's derived `colorPrimary` used in AA dark mode (pin it, as `higAntd` does); more than one `type="primary"`.
- [ ] A brand color pasted into `--hig-accent` unchanged in AA or dark mode (derive it, §3.5); a second "primary" brand color on controls.
- [ ] Glass on cards, widgets, tables or an inline banner (content layer); a popover in compact width instead of a sheet.
- [ ] Checkboxes on iPhone-style settings rows (use switches); a pop-up button with actions, or a pull-down with < 3 items.
- [ ] Actions available only by swipe, long press or right-click; information only in a tooltip.
- [ ] Coloured page dots, > 10 dots, or a page control without paging by keyboard.
- [ ] Gauges without endpoint labels or `aria-valuetext`; red badges for plain counts.
- [ ] A blank screen while loading or when empty (use skeletons and an empty state); a toast for errors.
- [ ] Table on a phone where a list would do; headings that aren't Title Case nouns; numbers left-aligned.

## 14. Icons

Use an open outline icon set (Lucide or Phosphor style); SF Symbols may not be shipped as web assets. Stroke weight ≈ text weight (2 px at 20–24 px, round caps). Use outlines in toolbars and lists and **filled** icons for the selected tab. Keep size and stroke consistent, and give every icon-only control a label. Favicons are full-bleed squares with no baked-in rounded corners.

---

Not affiliated with Apple Inc. Apple, Liquid Glass, SF Pro and SF Symbols are trademarks of Apple Inc.
