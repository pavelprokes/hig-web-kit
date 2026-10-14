# Liquid Glass (Apple, WWDC25 →) — notes for a faithful WEB recreation

Researched 2026-10-13. Sources: WWDC25 sessions 219, 356, 359, 208, 220 (transcripts); "Adopting Liquid Glass" doc (JSON endpoint); developer.apple.com/design/{whats-new,get-started,resources}; developer.apple.com/fonts; web technique articles (dev.to/devyatov, LogRocket, kube.io, WebKit bug 313914).
All text is paraphrased. Apple gives almost NO numeric values (blur radius, opacity, etc.), so every number below in the web section is an empirical choice, not an Apple spec.

---

## 0. Timeline / current state (as of Oct 2026)
- Jun 2025 (WWDC25): Liquid Glass ships in iOS/iPadOS/macOS/watchOS/tvOS 26. Icon Composer, SF Symbols 7, new UI kits.
- Jul–Dec 2025: HIG updates to Tab bars, Scroll views (scroll edge effects), Menus (icons), Materials, Motion (new page), Color, Buttons, Toolbars. Typography gained "emphasized weights" in Dynamic Type tables.
- Jun 2026 (WWDC26): iOS/iPadOS/macOS **27**, Icon Composer 2 beta, SF Symbols 8 (resources page lists "SF Symbols 27", 7,000+ symbols), Design principles page reintroduced, updated scroll-edge, menu-icon, sidebar guidance.
- Sep 2026: iOS/iPadOS 27 + macOS 27 UI Kits for Figma; "Designing for iPhone Duo" (folding iPhone) guidance; Layout and Branding (brand color use) updated.
- Design Resources currently has UI kits: iOS/iPadOS 27, macOS 27 (Figma + Sketch), watchOS 26, visionOS 26. Use the iOS 27 Figma kit as the reference for pixel values (radii, sizes, colors), because the transcripts do not give them.

## 1. What the material is
- A "digital meta-material". It does not try to simulate real glass faithfully.
- **Lensing, not scattering.** Older materials (blur) scattered light. Liquid Glass bends and concentrates the light behind it, and the refraction at the edges is what defines the shape. So the edge carries most of the visual signal. The center stays relatively clear, with less blur than old frosted materials.
- **Appear/disappear without fading.** Elements materialize and dematerialize by ramping the amount of lensing/refraction up or down rather than ramping opacity. Web: animate the displacement `scale` and blur from 0 rather than `opacity`.
- **Thickness scales with size.** Larger glass behaves as if it were thicker. It gets deeper, richer shadows, stronger lensing/refraction and softer light scattering. Small controls are thin and crisp.
- **Light spill.** On large surfaces (iPad/Mac sidebars), colour from nearby content spills onto the glass and into its shadows.
- Layer recipe (from the icon session, applies generally): edge highlights + frostiness + translucency + specular highlights + per-layer shadow. On iOS the specular edge light moves with the gyroscope.

## 2. Adaptivity
- Glass has no fixed light/dark look. It continuously adapts to the content behind it.
- **Small elements** (nav bars, tab bars, glyphs, symbols) **flip** between light and dark styles to stay legible over what is underneath. Glyphs on Regular glass flip automatically to maximise contrast.
- **Large elements** (menus, sidebars) adapt but **do not flip**, because a big surface flipping is distracting.
- When text scrolls under glass, the glass shadow gets stronger. Over plain light backgrounds the shadow gets weaker.
- Tint amount and dynamic range shift to keep tinted buttons readable.
- Window focus: on Mac and iPad, glass in an unfocused window recedes and becomes visually quieter.

## 3. Variants
- **Regular** (default). It has full adaptivity, works at any size and over any content, and can carry any content.
- **Clear.** It has no adaptive behaviours and is permanently more transparent. It **needs a dimming layer** behind it (or localized dimming for small elements) so glyphs stay legible. Use it only when **all three** hold:
  1. The glass sits over media-rich content (photo or video).
  2. Dimming the content won't hurt it.
  3. The content on the glass is bold and bright.
- **Never mix Regular and Clear** in the same context.
- UIKit button configs expose the matrix: glass / prominentGlass / clearGlass / prominentClearGlass. SwiftUI: `.glass`, `.glassProminent`.

## 4. Tinting and colour
- Tinting means generating a **range of tones mapped to the luminance of the content behind**, like coloured glass. It does not lay a flat colour on top, and a solid-filled button breaks the material.
- **Tint only primary elements and actions** (for example the Done checkmark, blue on iOS). If everything is tinted, nothing stands out.
- To bring brand colour into the app more broadly, put it in the **content layer**, not on the glass controls.
- Use colour sparingly in controls and navigation. Prefer system colours. Custom colours need light, dark and increased-contrast variants.
- System colours were retuned in 26 for Light, Dark and Increased Contrast, with better hue separation. Take the exact hex values from the iOS 27 Figma kit (not given in the transcripts). Use semantic names (label, secondaryLabel, systemBackground, secondarySystemBackground…) as CSS custom properties.
- Elements placed on glass use **fills, transparency and vibrancy**, not more glass. Vibrancy pulls colour forward from behind. Use vibrant label levels on materials and avoid quaternary labels on thin materials.

## 5. Layering and hierarchy
- Two layers. The **content layer** is at the bottom. The **functional/navigation layer** of glass floats above it (tab bars, toolbars, sidebars, sheets, menus, floating controls).
- **Never put glass on content** (lists, tables, cards). It muddies the hierarchy.
- **Avoid glass on glass.** Inner elements use fills or vibrancy.
- In steady states (for example at launch), don't let content and glass overlap. Inset or scale the content so they are clearly separate. Overlap happens during scroll.
- Controls sit on a system material, not directly on content.
- For custom controls, put the material on the control container, not on its inner subviews.
- **Remove custom backgrounds and borders** from bars. Hierarchy comes from grouping and layout, not decoration.

## 6. Shape and concentricity
Three shape types:
- **Fixed**: constant radius.
- **Capsule**: radius = height / 2.
- **Concentric**: radius = parent radius − padding (inner and outer curves share a centre). Give it a **fallback radius** for when the component is not nested.
Rules:
- iPhone: use capsules with extra margin near the screen edge (floating tab bar, toolbar pills).
- iPad and Mac: use concentric shapes aligned to the window corner. Windows have rounder corners in 26.
- Nested cards and artwork must be concentric. "Pinched" corners (inner radius too large) or "flared" corners (too small) are errors.
- Capsules appear in sliders, switches, buttons, bars, and the corners of grouped tables. macOS Mini/Small/Medium controls stay rounded rectangles. Large controls become capsules. A new **X-Large** size uses glass for emphasis.
- Lists, tables and forms have taller rows, more padding, and larger section corner radii. **Section headers are now Title Case, not ALL CAPS.**
- Sheets have larger corner radii. Half sheets are inset from the screen edges so content peeks around them.
- Optical centring: centre things mathematically where that looks right, and nudge them optically where it doesn't.

## 7. Bars, toolbars, tab bars, sidebars, search
- **Toolbar grouping.** Group items by function and frequency. Each group shares one glass capsule. Separate groups with fixed spacers.
  - Don't put a symbol and a text button in one group, because they read as one button. Text buttons get their own capsule.
  - Move secondary actions into a "…" menu.
  - **Primary action stands alone and is tinted** (iOS: blue checkmark; macOS: prominent text button).
  - Prefer icons (SF Symbols) over text for standard actions. Every icon needs an accessibility label.
  - To hide an item, hide the whole item, not its inner view, or you get an empty bubble.
- **Tab bar (iPhone).** A floating capsule above content. It holds sections, never actions. Keep few tabs. **Search is a dedicated tab** at the trailing end, visually separated. An accessory view above the tab bar can host persistent controls (for example a mini player). Screen actions (Checkout) stay with their content. The tab bar can **minimize on scroll down** and come back on scroll up.
- **iPad.** The tab bar morphs into a sidebar and back, depending on width. Start with a tab bar if unsure. Treat rotation and resizing as width changes. Adaptation must be non-destructive. Window controls sit at the leading edge of the toolbar (no reserved strip). Search goes in the upper trailing corner. The pointer hover highlight is a small glass platter that refracts the control under it and slides between buttons in a cluster.
- **Sidebar.** It is inset (floating) glass, and content flows **under** it. **Background extension effect**: a hero image is mirrored and blurred under the sidebar or inspector, so the image looks edge-to-edge while the content stays centred in the visible area. Scroll views extend under the sidebar by default.
- **Menus** pop out of the button that triggered them (morph from the source). Action sheets also spring from their source element, not from the bottom of the screen. Menu items get leading icons. For a group of related items, show the icon once. Order items by frequency, never hide items (dim them instead), and never hide whole menus.
- **Sheets.** A modal sheet gets a **dimming layer**. A parallel-task sheet relies on glass separation alone. When dragged to full height, the sheet becomes **more opaque** and grows slightly.
- **Screen structure** (session 359): every screen answers *Where am I? What can I do? Where can I go?* Use a screen-specific title (not branding), a back button, and only essential actions as SF Symbols. Prefer lists over grids for structured info, use progressive disclosure ("Show all" next to the section title), and add a gradient or blur behind text over busy imagery.

## 8. Scroll edge effects
- They replace hairline dividers where floating UI overlaps scrolling content. They are **functional, not decorative**, and must not darken or block like an overlay.
- **Soft** (default; iOS/iPadOS): content gently fades/blurs into the background under the bar. When dark content is underneath and the glass is in its dark style, the effect becomes a subtle dimming instead.
- **Hard** (mainly macOS, or pinned accessories like column headers, text-only controls without backgrounds): a stronger, more opaque, uniform band across toolbar + accessory height.
- One effect per view edge. Don't stack or mix soft and hard. Don't add one where nothing floats. In split views each pane may have its own, but keep their heights consistent.

## 9. Motion and interaction
- Visual design and motion are one system. The material is **gel-like**: it flexes and moves with the finger.
- **Press**: the material instantly "energizes". It **illuminates from within, starting under the fingertip**, and the glow spreads to neighbouring glass elements. The element lifts or **scales up** slightly (it does not shrink like old buttons).
- Controls can **lift into glass only while touched**. Slider knobs and toggle thumbs become a glass lens during drag and return to solid at rest, so the resting UI stays quiet.
- **Morphing**: controls on the floating plane morph continuously between app states. A button morphs into its menu or popover, and tab bar ↔ sidebar. Elements that share a container (GlassEffectContainer) can merge and split like droplets.
- Springs with a little overshoot (bounce). There are no opacity fades for glass entry. Lensing ramps instead.
- Tab bar minimizes on scroll, and sheets grow when dragged.

## 10. Accessibility
These apply automatically for system components. Recreate them with media queries.
- **Reduce Transparency** → glass becomes **frostier/more opaque** and hides more of what's behind.
- **Increase Contrast** → elements become predominantly **black or white with a contrasting border**.
- **Reduce Motion** → effect intensity is reduced and **elastic/gel properties are disabled**.
- Users can also choose a preferred Liquid Glass look in Settings (the adoption doc mentions this). From general knowledge, not these sources: since iOS 26.1 the choice is Clear vs Tinted, and Tinted is more opaque. Test both.
- Every icon-only control needs a label. Support Dynamic Type (in CSS, rem-based sizes and user font scaling).

## 11. App icons (if the web recreation shows icons)
- Layered: one background plus 1–n foreground layers. The system adds glass (specular edges, frost, translucency, shadows). Don't bake in shadows or bevels.
- Appearances: default (light), dark, clear (mono glass, light or dark), tinted (dark tint colours the foreground, light tint colours the glass).
- 1024 px canvas (iOS/iPadOS/macOS), rounded-rect mask with a rounder radius, circle on watchOS (1088 px canvas). Use flat frontal art, rounded shapes, bold lines, fewer overlaps, and soft light-to-dark gradient backgrounds (System Light / System Dark gradients instead of pure white or black).

## 12. Typography and fonts
- New-system typography is **bolder and left-aligned** (alerts, onboarding). System text styles give the hierarchy. Group titles can use a bolder or wider face.
- Apple fonts: SF Pro (9 weights, variable optical sizes, 4 widths, rounded), SF Compact (watch), SF Mono (6 weights), New York (serif, 6 weights, optical sizes), and SF Arabic/Armenian/Georgian/Hebrew.
- **Licensing:** the license allows use **only for mock-ups of UIs for Apple-platform software**, by registered Apple developers. It explicitly bars embedding the font in other products and using it for "website content" or other work products. **Do not self-host SF Pro as a webfont (@font-face) on a public site.**
- **Legit web approach:** reference the font the user's OS already has through the system stack. Apple devices render SF; others fall back:
  ```css
  :root {
    --font-text: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    --font-rounded: ui-rounded, "SF Pro Rounded", system-ui, sans-serif;   /* ui-rounded: Safari only */
    --font-serif: ui-serif, "New York", Georgia, serif;                      /* ui-serif → New York on Apple */
    --font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
  }
  body { font-family: var(--font-text); -webkit-font-smoothing: antialiased; }
  ```
  On Apple platforms SF optical sizing happens automatically with `system-ui` (`font-optical-sizing: auto`). Cross-platform look-alike open fonts: **Inter** (closest SF Pro substitute; turn on `cv11`/`ss01` or not to taste), Geist, and **Source Serif 4**/Newsreader for New York.
- Approximate iOS text-style scale (Large Dynamic Type default, pt ≈ CSS px). These are the long-standing HIG values: Large Title 34/41 bold(ish), Title1 28/34, Title2 22/28, Title3 20/25, Headline 17/22 semibold, Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption1 12/16, Caption2 11/13. Tracking: SF uses size-dependent tracking (slightly negative at large sizes, positive at small sizes). Check against the 27 Figma kit.

---

## 13. Web implementation techniques

### 13.1 Reality check / browser support (Oct 2026)
| Technique | Chrome/Edge | Safari | Firefox |
|---|---|---|---|
| `backdrop-filter: blur() saturate() brightness()` | yes | yes (still ship `-webkit-` prefix) | yes |
| `backdrop-filter: url(#svgFilter)` (true refraction of what's behind) | **yes (Chromium only)** | **no: renders nothing, but `@supports` still returns true** | no |
| `filter: url(#svg)` on an element's own content | yes | yes (but WebKit bug 313914: SVG filters don't apply to `<foreignObject>` HTML) | yes |
| `-apple-visual-effect: -apple-system-glass-material` | no | **only in WKWebView with a private pref, not in Safari web pages** | no |
| `mask-image` on a backdrop-filtered element | yes | yes (`-webkit-mask-image`) | yes |

Consequences:
- Build a **progressive** component. The base is blur+saturate+tint+specular edge (works everywhere and is already ~80% of the look). On Chromium, add SVG refraction.
- Detect Chromium by engine (e.g. `CSS.supports` cannot do it; use `navigator.userAgentData?.brands` containing "Chromium", or `'chrome' in window`) and set a class such as `html.lg-refract`.
- Performance: every backdrop-filtered element re-filters whenever what's under it changes (scroll = every frame). Limit it to a few floating elements (tab bar, toolbar, FAB, sheet). SVG backdrop filters are GPU-heavy, so test on mid-range Android. Don't use it on lists or cards (Apple says the same).
- Gotchas: an ancestor with `overflow:hidden`/`clip-path` or a missing stacking context can make the backdrop sample nothing. `backdrop-filter` creates a containing block for `position:fixed` children. SVG filter maps are in px, so the filter must match the element size (rebuild the map on resize). Overscan `inset:-Npx` to avoid transparent gutters from displacement.

### 13.2 Design tokens
```css
:root {
  /* glass, light-style */
  --glass-tint: rgb(255 255 255 / .18);      /* regular */
  --glass-tint-clear: rgb(255 255 255 / .06);
  --glass-blur: 2px;                          /* LG is mostly clear in the middle; refraction does the work */
  --glass-blur-large: 12px;                   /* bigger surfaces = "thicker" */
  --glass-sat: 180%;
  --glass-edge: rgb(255 255 255 / .55);       /* specular rim */
  --glass-edge-dim: rgb(255 255 255 / .12);
  --glass-shadow: 0 8px 24px rgb(0 0 0 / .12), 0 1px 2px rgb(0 0 0 / .08);
  --label: rgb(0 0 0 / .88);
  --accent: #0088ff;                          /* approx iOS 26+ systemBlue; verify in the Figma kit */
  --spring: cubic-bezier(.34, 1.56, .64, 1);  /* overshoot */
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --pad: 6px;                                 /* glass padding → concentric math */
  --r-outer: 28px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --glass-tint: rgb(30 30 32 / .32);
    --glass-edge: rgb(255 255 255 / .28);
    --glass-edge-dim: rgb(255 255 255 / .08);
    --glass-shadow: 0 8px 24px rgb(0 0 0 / .35);
    --label: rgb(255 255 255 / .92);
    --accent: #0091ff;
  }
}
```

### 13.3 Base glass (all browsers): blur + tint + specular rim + inner light
```css
.glass {
  position: relative;
  isolation: isolate;
  border-radius: 999px;                        /* capsule by default */
  background: var(--glass-tint);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat)) brightness(1.05);
          backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat)) brightness(1.05);
  box-shadow:
    var(--glass-shadow),
    inset 0 1px 0 0 var(--glass-edge),           /* top specular line */
    inset 0 -1px 0 0 var(--glass-edge-dim),      /* faint bottom rim */
    inset 0 0 0 .5px rgb(255 255 255 / .18);     /* hairline all round */
}
/* angled specular rim: gradient border via mask (lit top-left, dim bottom-right) */
.glass::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg, rgb(255 255 255 / .7), rgb(255 255 255 / .05) 40%,
                                      rgb(255 255 255 / .02) 60%, rgb(255 255 255 / .35));
  -webkit-mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  pointer-events: none;
}
/* bigger surfaces = thicker glass */
.glass--large { --glass-blur: var(--glass-blur-large); border-radius: var(--r-outer); }
```

### 13.4 Real refraction on Chromium: SVG displacement in `backdrop-filter`
Two ways to make the displacement map:
- (a) **Procedural, cheap.** `feTurbulence` noise produces a wobbly look, but it is **not** Apple-like because LG refraction is edge-only and smooth. Fine for decorative blobs.
- (b) **Edge-lens map (recommended, kube.io approach).** Generate the map in JS/canvas. Inside a bezel width `b` from the edge, push pixels **inward** along the edge normal by a magnitude derived from a convex squircle height profile and Snell's law (n≈1.5). Leave the flat centre untouched (R=G=128). Pack x→R and y→G (128 = no shift), and store the max displacement as `scale`.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="lg-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feImage id="lg-map" href="" x="0" y="0" width="200" height="56" result="map" preserveAspectRatio="none"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale="40"
                       xChannelSelector="R" yChannelSelector="G" result="refracted"/>
    <feGaussianBlur in="refracted" stdDeviation="0.6" result="soft"/>
    <feColorMatrix in="soft" type="saturate" values="1.6"/>
  </filter>
</svg>
```
```js
// Edge-lens displacement map for a rounded rect (w,h,radius r), bezel b px.
function lensMap(w, h, r, b = 14) {
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
  const ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
  const sdf = (x, y) => {                       // signed distance to rounded rect (neg inside)
    const qx = Math.abs(x - w / 2) - (w / 2 - r), qy = Math.abs(y - h / 2) - (h / 2 - r);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dist = -sdf(x + .5, y + .5);          // px from edge, inside > 0
    let dx = 0, dy = 0;
    if (dist > 0 && dist < b) {
      const e = 0.5;                            // numeric gradient = outward normal
      const nx = sdf(x + e, y) - sdf(x - e, y), ny = sdf(x, y + e) - sdf(x, y - e);
      const len = Math.hypot(nx, ny) || 1;
      const t = 1 - dist / b;                   // 1 at rim → 0 at flat
      const mag = Math.pow(t, 2.2);             // squircle-ish falloff; tune
      dx = -nx / len * mag; dy = -ny / len * mag; // sample from inward = lens magnification
    }
    const i = (y * w + x) * 4;
    d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}
// usage (rebuild on resize via ResizeObserver; keep elements few)
const el = document.querySelector('.tabbar'), feImg = document.getElementById('lg-map');
new ResizeObserver(([e]) => {
  const { width: w, height: h } = e.contentRect;
  feImg.setAttribute('href', lensMap(Math.round(w), Math.round(h), h / 2));
  feImg.setAttribute('width', w); feImg.setAttribute('height', h);
}).observe(el);
```
```css
/* Only enable where it works (Safari parses url() and then renders NOTHING) */
html.lg-refract .glass--refract {
  -webkit-backdrop-filter: url(#lg-refract) brightness(1.05);
          backdrop-filter: url(#lg-refract) brightness(1.05);
}
```
```js
// engine sniff for Chromium (feature query is unreliable here)
const isChromium = !!(navigator.userAgentData?.brands || []).find(b => /Chromium/.test(b.brand));
document.documentElement.classList.toggle('lg-refract', isChromium);
```
Notes: use one `<filter>` per distinct element size (unique ids). For a sign-flip "magnify" vs "minify" look, invert dx/dy. A chromatic-aberration hint: run 3 displacement maps at slightly different scales for the R/G/B channels and merge them with `feColorMatrix` + `feBlend mode="screen"`. This is costly, so use it only for hero elements. A WebGL shader (Snell refraction of a captured background) is the only cross-browser route to true refraction, but the page must be rendered into a texture, so it's practical only over known backgrounds (a wallpaper image), and you should cap it at ~30 fps.

Cross-browser "fake refraction" when the background is known (e.g. a wallpaper image): put a copy of the background inside the glass, `background-attachment: fixed`, and apply `filter:url(#lg-refract)` (a regular filter, which works in Safari and Firefox) to that inner copy.

### 13.5 Adaptivity: light/dark flip for small elements
No CSS can read the pixels behind an element. Options:
- `mix-blend-mode: difference` on glyphs (crude, colours invert). Not Apple-like.
- **JS luminance sampling**: for known backgrounds (images, or sections with `data-tone="dark"`), use an `IntersectionObserver` with a `rootMargin` to set the tab bar region, check which section is under the bar, and toggle `.glass--on-dark`. Animate the change with a 250 ms colour transition.
- Large surfaces (sidebar, menus): do NOT flip; follow `prefers-color-scheme` only.
- Shadow adaptivity: raise shadow opacity when the region under the bar contains text (the same observer works).

```css
.glass--on-dark { --glass-tint: rgb(20 20 22 / .30); --label: #fff; --glass-edge: rgb(255 255 255 / .3); }
.glass, .glass * { transition: color .25s var(--ease-out), background-color .25s var(--ease-out); }
```

### 13.6 Clear variant + dimming layer
```css
.glass--clear { background: var(--glass-tint-clear);
  -webkit-backdrop-filter: blur(1px) saturate(150%); backdrop-filter: blur(1px) saturate(150%); }
/* dimming behind the clear control (on media). Localized version for small elements: */
.media-dim::after { content:""; position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(120% 80% at 50% 100%, rgb(0 0 0 / .35), transparent 60%); }
.glass--clear { color: #fff; font-weight: 600; } /* content must be bold & bright */
```

### 13.7 Tint (primary action only)
Approximate "tones mapped to luminance behind" by mixing the accent with the backdrop rather than painting a solid colour:
```css
.glass--tinted {
  background: color-mix(in oklab, var(--accent) 55%, transparent);
  -webkit-backdrop-filter: blur(4px) saturate(200%) brightness(1.1);
          backdrop-filter: blur(4px) saturate(200%) brightness(1.1);
  color: #fff;
}
/* optional: multiply layer so dark backdrops darken the tint & light ones brighten it */
.glass--tinted::after { content:""; position:absolute; inset:0; border-radius:inherit;
  background: var(--accent); mix-blend-mode: color; opacity:.35; pointer-events:none; }
```

### 13.8 Concentric radii
```css
.card     { --r: 28px; --p: 12px; border-radius: var(--r); padding: var(--p); }
.card > * { border-radius: max(var(--r) - var(--p), 8px); }  /* concentric + fallback min */
.capsule  { border-radius: 999px; }                           /* = height/2 */
/* phone: floating bar inset from screen edge; its radius = capsule */
.tabbar { position: fixed; left: 16px; right: 16px; bottom: max(12px, env(safe-area-inset-bottom)); height: 62px; }
```
Use `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` so `env(safe-area-inset-*)` works. Inner selection pill in the tab bar: radius = bar radius − bar padding (that is, a capsule).

### 13.9 Toolbar grouping
```html
<header class="toolbar">
  <div class="glass group"><button aria-label="Back">‹</button></div>
  <h1 class="title">Inbox</h1>
  <div class="glass group"><button aria-label="Share">…</button><button aria-label="Flag">…</button></div>
  <div class="glass group"><button aria-label="More">⋯</button></div>
  <button class="glass glass--tinted" aria-label="Done">✓</button>  <!-- primary: alone, tinted -->
</header>
```
```css
.toolbar { display:flex; align-items:center; gap: 8px; }   /* fixed spacer between groups */
.group   { display:flex; padding: 4px; gap: 0; }          /* items share one capsule */
.group > button { width: 44px; height: 44px; border-radius: 999px; background: transparent; }
```

### 13.10 Scroll edge effect (soft + hard)
```css
/* Soft: progressive blur + fade under a floating top bar */
.scroll-edge-top {
  position: fixed; inset: 0 0 auto 0; height: 110px; pointer-events: none; z-index: 1;
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  -webkit-mask-image: linear-gradient(to bottom, #000 40%, transparent);
          mask-image: linear-gradient(to bottom, #000 40%, transparent);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--bg) 70%, transparent), transparent);
}
/* For a smoother ramp, stack ~5–7 layers with increasing blur, each masked to its own band (overlapping). */
/* dark-content variant: dimming instead of fade */
.scroll-edge-top.on-dark { background: linear-gradient(to bottom, rgb(0 0 0 / .35), transparent); }
/* Hard (macOS / pinned headers): uniform opaque band across bar + accessory */
.scroll-edge-hard { background: color-mix(in srgb, var(--bg) 92%, transparent);
  -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%); }
```
Show it only once content is actually under the bar (toggle with a scroll-driven animation or an IO sentinel):
```css
@supports (animation-timeline: scroll()) {
  .scroll-edge-top { animation: edge-in linear both; animation-timeline: scroll(root); animation-range: 0 40px; }
  @keyframes edge-in { from { opacity: 0 } to { opacity: 1 } }
}
```

### 13.11 Interaction: illumination from touch point + scale up + gel
```css
.glass { --mx: 50%; --my: 50%; transition: transform .35s var(--spring), scale .35s var(--spring); }
.glass::after {                                  /* inner glow from finger */
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background: radial-gradient(120px circle at var(--mx) var(--my), rgb(255 255 255 / .45), transparent 60%);
  opacity: 0; transition: opacity .4s var(--ease-out);
}
.glass:active::after, .glass.is-pressed::after { opacity: 1; transition-duration: .08s; }
.glass:active, .glass.is-pressed { scale: 1.06; }          /* scale UP, not down */
```
```js
document.addEventListener('pointerdown', e => {
  const g = e.target.closest('.glass'); if (!g) return;
  const r = g.getBoundingClientRect();
  g.style.setProperty('--mx', `${e.clientX - r.left}px`);
  g.style.setProperty('--my', `${e.clientY - r.top}px`);
  g.classList.add('is-pressed');
  // spread: briefly light neighbours in the same bar
  g.parentElement?.querySelectorAll('.glass').forEach(n => n !== g && n.classList.add('is-lit'));
  const up = () => { g.classList.remove('is-pressed');
    g.parentElement?.querySelectorAll('.is-lit').forEach(n => n.classList.remove('is-lit'));
    removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
});
```
```css
.glass.is-lit::after { opacity: .35; }
/* gel stretch while dragging (e.g. slider thumb): squash along motion */
.thumb.dragging { scale: 1.25 1.1; transition: scale .2s var(--spring); }
```
Use **Web Animations API springs** (or `linear()` easing that approximates a spring) for a better gel feel:
```css
:root { --spring-linear: linear(0, .009, .035 2.1%, .141 4.4%, .723 12.9%, .938 16.7%, 1.017 19.4%,
  1.067, 1.087 24.2%, 1.085 26.5%, 1.067 29.5%, .987 41.8%, .971 45.8%, .996 62.7%, 1); }
```

### 13.12 Materialize without fading, and morphing
```css
@keyframes lg-in {           /* ramp refraction/blur + scale, no opacity fade */
  from { -webkit-backdrop-filter: blur(0) saturate(100%); backdrop-filter: blur(0) saturate(100%);
         background-color: transparent; box-shadow: none; scale: .92; }
}
.glass.enter { animation: lg-in .45s var(--spring-linear); }
```
- Chromium refraction: animate `<feDisplacementMap scale>` 0 → N with JS (cheap; the map stays the same).
- **Morph button → menu/popover:** use the View Transitions API with the same `view-transition-name` on the trigger capsule and the menu panel. The browser morphs size and radius (set `border-radius` on both, and `::view-transition-group(x){animation-timing-function: var(--spring-linear)}`). Fallback: FLIP with `transform` + `border-radius`.
- **Droplet merge** of adjacent glass (GlassEffectContainer analogue) is the classic SVG "goo" filter (`feGaussianBlur` → `feColorMatrix` alpha 0 0 0 18 -7) on a mask layer that is then used as `mask-image` for the glass. Use it only for small clusters.
- Tab bar minimize on scroll: translate/scale the bar into a smaller capsule on scroll down, restore on scroll up (scroll direction from JS, transitions with springs).

### 13.13 Accessibility mapping
```css
@media (prefers-reduced-transparency: reduce) {   /* Chromium & Safari support it; Firefox is behind a flag */
  .glass { background: color-mix(in srgb, var(--bg) 92%, transparent);
    -webkit-backdrop-filter: blur(30px) saturate(120%); backdrop-filter: blur(30px) saturate(120%); }
  html.lg-refract .glass--refract { backdrop-filter: blur(30px); }  /* drop refraction */
}
@media (prefers-contrast: more) {
  .glass { background: Canvas; color: CanvasText; backdrop-filter: none; -webkit-backdrop-filter: none;
           border: 2px solid CanvasText; box-shadow: none; }
  .glass::before, .glass::after { display: none; }
}
@media (forced-colors: active) { .glass { border: 1px solid ButtonText; backdrop-filter: none; } }
@media (prefers-reduced-motion: reduce) {
  .glass, .glass * { transition-duration: .01ms !important; animation: none !important; }
  .glass:active { scale: 1; }       /* no gel/elastic; keep the illumination as a static state */
}
```
Also: give every icon button an `aria-label`, keep hit targets ≥ 44×44 px, and test contrast of labels over the worst-case backdrop (bright photos, scrolling white text), not over the mockup wallpaper.

### 13.14 Practical recipe summary
1. Content layer edge-to-edge (images flow under bars and sidebar). Use a mirrored+blurred hero under the sidebar for background extension: duplicate the `<img>`, `transform: scaleX(-1)`, `filter: blur(30px)`, and position it under the sidebar.
2. Floating functional layer: a capsule tab bar (with the search tab separated), grouped toolbar capsules, a tinted primary button, and an inset sidebar on wide screens.
3. Base glass everywhere, SVG edge refraction on Chromium for the 2–4 most prominent elements, and a soft scroll-edge effect under the top bar.
4. Springs, scale-up press, touch-point glow, morphs via View Transitions.
5. Media-query fallbacks for transparency, contrast and motion. Use the system font stack, never self-hosted SF.

## Sources
- WWDC25 219 Meet Liquid Glass — https://developer.apple.com/videos/play/wwdc2025/219/
- WWDC25 356 Get to know the new design system — https://developer.apple.com/videos/play/wwdc2025/356/
- WWDC25 359 Design foundations from idea to interface — https://developer.apple.com/videos/play/wwdc2025/359/
- WWDC25 208 Elevate the design of your iPad app — https://developer.apple.com/videos/play/wwdc2025/208/
- WWDC25 220 Say hello to the new look of app icons — https://developer.apple.com/videos/play/wwdc2025/220/
- Adopting Liquid Glass — https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- Fonts & license — https://developer.apple.com/fonts/
- What's new / Resources / Get started — https://developer.apple.com/design/whats-new/ , /design/resources/ , /design/get-started/
- Liquid Glass on the web: 6 ways — https://dev.to/devyatov/liquid-glass-on-the-web-6-ways-to-build-it-with-css-and-svg-3m07
- LogRocket: Liquid glass with CSS & SVG — https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/
- kube.io: Liquid Glass in the browser (Snell's law displacement maps) — https://kube.io/blog/liquid-glass-css-svg/
- WebKit bug 313914 (SVG filter + foreignObject) — https://bugs.webkit.org/show_bug.cgi?id=313914
- -apple-visual-effect (WKWebView only) — https://peerlist.io/saxenashikhil/articles/heres-the-scoop-from-alastairs-article-on-apples-hidden-css-
