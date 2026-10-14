# Apple HIG — Foundations notes (Liquid Glass era)

Source: Apple Human Interface Guidelines, Foundations section, fetched 2026-10-13 via the
`developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json` endpoints.
Purpose: raw material for a **web design-system skill** that emulates Apple's current design language.

Conventions in these notes:
- "pt" = Apple point. On the web, treat **1 pt = 1 CSS px** (both are density-independent at @1x).
- **[GAP]** = asked for but not on the current page (or truncated in fetch).
- **[REF – not from current page]** = widely published legacy/UIKit values added for convenience; verify before treating as canonical.
- **[WEB]** = my translation of the guidance into web/CSS terms (not Apple text).

Foundations index (18 child pages): accessibility, app-icons, branding, color, dark-mode, icons, images,
immersive-experiences, inclusion, layout, materials, motion, privacy, right-to-left, sf-symbols,
spatial-layout, typography, writing. (`design-principles`, `designing-for-ios/macos/ipados` live outside
Foundations but were read too.)

---------------------------------------------------------------------------------------------------

## 0. TL;DR rules for a web design system

1. Two layers: **content layer** (your data, media, brand color, standard materials) and a floating
   **control/navigation layer** (Liquid Glass: tab bars, toolbars, sidebars, nav bars, popovers, alerts).
2. **Never put Liquid Glass in the content layer**; never stack glass on glass; use it sparingly — only the
   most important functional controls. Exception: sliders/toggles turn glassy only *while being dragged*.
3. Glass **Regular** (blur + luminosity adjustment) is the default; **Clear** only over rich media, plus a
   **35 % dark dim** layer when media is bright.
4. No solid / semi‑opaque bars under controls — let content scroll beneath and use a **scroll edge effect**
   (blur + fade of content near bar edges) instead.
5. Color is sparse: tint glass only for the primary action (tint the *background*, not the label); never tint
   several controls. Brand color lives in the content layer.
6. Every color needs light, dark, increased‑contrast-light, increased‑contrast-dark values. Contrast ≥ 4.5:1
   (≤17 pt text), ≥ 3:1 (≥18 pt or bold); aim 7:1 for small custom text.
7. Type: SF Pro / system-ui; body **17 pt / 22 leading** on iOS, **13/16** on macOS; minimum 11 pt iOS,
   10 pt macOS. Avoid Ultralight/Thin/Light. Support text scaling to 200 %.
8. Hit targets: **44×44 pt** default (min 28×28) iOS; **28×28** (min 20×20) macOS. ~12 pt spacing around
   bezeled controls, ~24 pt around borderless ones.
9. Motion: purposeful, brief, cancelable, interruptible, gesture-tracked; Reduce Motion → fades instead of
   slides/zooms, tighter springs, no blur animations.
10. Writing: verbs on buttons, sentence/title case chosen per element type and applied consistently, no
    "oops", no blame, no "we", "Unable to load content".

---------------------------------------------------------------------------------------------------

## 1. Design principles (page reintroduced June 8, 2026)

Eight principles (replace the old clarity/deference/depth trio):

1. **Purpose — make something meaningful.** Create value; keep focused on the most important features;
   find new ways to solve the problem rather than re-creating existing solutions.
2. **Agency — let people do things their own way.** Stay out of the way (get people straight to content);
   freedom to explore (no locked flows; guided flows must be skippable/exitable); help people recover
   from mistakes (undo, return to previous state, at no cost of time/work).
3. **Responsibility — act in people's best interest.** Be transparent about what the product does and why
   (clear rationale when asking permission, clear data use); keep information safe (collect only what's
   needed, anticipate misuse).
4. **Familiarity — build on what people know.** Use known concepts and conventions; keep visuals and
   interactions consistent once established; provide clear feedback (availability, content changes,
   system patterns for alerts/choices).
5. **Flexibility — adapt to diverse contexts.** Design for everyone (accessibility from the start);
   preserve context (consistent, predictable positions; natural transition animations); support many
   inputs (voice, touch, keyboard…); give every platform equal care.
6. **Simplicity — be clear and direct.** Simplicity ≠ minimalism; every element earns its place. Include
   only what's necessary; be concise in wording; establish hierarchy (recognizable controls, consistent
   structure, "where am I / what's next").
7. **Craft — care about every detail.** Quality sets the tone (visuals, animation, wording, audio);
   prototype early, discard what fails, test in real conditions; keep maintaining after ship.
8. **Delight — make it human.** Pick the emotion to inspire (energize / calm / thrill); create defining
   moments (even error messages); delight is not decoration and must not block the core task; delight
   emerges from agency + safety + familiarity + flexibility.

---------------------------------------------------------------------------------------------------

## 2. Materials & Liquid Glass

### 2.1 Concepts
- A material = visual effect creating depth/layering/hierarchy between foreground and background. Color
  bleeds through from background to foreground → people keep a sense of place.
- Two material families: **Liquid Glass** (controls/navigation) and **standard materials** (structure inside
  the content layer).
- Liquid Glass forms a **distinct functional layer floating above content** (tab bars, sidebars, toolbars…).
  Content scrolls and peeks through underneath → dynamism + depth while controls stay legible.

### 2.2 Rules for Liquid Glass
- **Don't use Liquid Glass in the content layer** (confusing hierarchy). Use standard materials for
  content-layer elements such as app backgrounds.
  - Exception: content-layer controls with a transient interactive element (**sliders, toggles**) take on a
    glass appearance **while activated**, to emphasize interactivity.
- **Use it sparingly.** System components adopt it automatically; for custom controls limit it to the most
  important functional elements. Overuse across many custom controls distracts from content.
- **Use Clear glass only over visually rich backgrounds** (photos, video).
- Glass appearance changes with system settings: user's preferred Liquid Glass look (e.g. tinted/clear
  preference), **Reduce Transparency**, **Increase Contrast** — design must survive these.
- Avoid glass on glass (implied by "distinct layer" + sparing use; layout page: controls float on content,
  never on other glass). [WEB] Don't nest blurred panels; a popover over a glass toolbar should itself be
  the only glass surface in its region.
- Liquid Glass responds to input: more emphasis with direct touch, subdued with trackpad (Motion page).

### 2.3 Variants
| Variant | API | Behavior | Use for |
|---|---|---|---|
| **Regular** | `Glass.regular` | Blurs + adjusts luminosity of what's behind → legible text | Default for most system components; anywhere background could harm legibility; text-heavy components (**alerts, sidebars, popovers**) |
| **Clear** | `Glass.clear` | Highly translucent, prioritizes seeing underlying content | Components floating over **media** (photos, video) for immersion |

- Clear over **bright** content → add a **dark dimming layer at 35 % opacity** beneath/behind the glass.
  Not needed if content is already dark enough or when using standard AVKit playback controls (they dim
  themselves).
- **Scroll edge effect**: improves legibility of bars by **blurring and reducing opacity** of content
  scrolling under them. Use it *instead of* a solid/semi-opaque background behind controls.
- Small glass elements (toolbars, tab bars) **flip between light and dark** depending on content behind;
  their symbols/text are **monochromatic** by default. Larger elements (sidebars) are **more opaque** to
  preserve legibility.

### 2.4 Liquid Glass color (from Color page)
- Glass has **no inherent color**; it picks up color from content behind.
- You **can tint** glass to emphasize a control, e.g. the primary call to action (system "prominent" button
  style does this). Symbols/labels on glass can also be colored.
- **Apply color sparingly**: reserve for status indicators or primary actions. For a primary action, color
  the **background** of the control, not its symbol/text. **Don't color the backgrounds of multiple
  controls.**
- Avoid similar colors in control labels when the content behind is colorful → prefer monochrome toolbars
  / tab bars, or an accent color with enough differentiation.
- Mind the content layer: avoid overlapping similar colors in content and controls; ensure the **resting
  state** of scrollable content (e.g. top of the screen) is legible under the bars.

### 2.5 Standard materials
- Use blur, vibrancy, blending modes to convey structure **inside the content layer** beneath glass.
- Choose a material by **semantic purpose**, not by the color it produces (system settings change looks).
- Put **vibrant** (system-defined) colors on top of materials for legibility in any context.
- Thicker = more opaque = better contrast for text/fine detail. Thinner = more translucent = more context.

**iOS/iPadOS** content-layer materials: **ultraThin, thin, regular (default), thick**.
- Label vibrancy levels: `label` (default, highest contrast), `secondaryLabel`, `tertiaryLabel`,
  `quaternaryLabel` (lowest). **Don't use quaternary on thin or ultraThin** (too low contrast).
- Fill vibrancy: `fill` (default), `secondaryFill`, `tertiaryFill` — usable on all materials.
- Separator vibrancy: one value `separator`, works on all materials.

**macOS**: several purpose-named materials (`NSVisualEffectView.Material`), vibrant versions of all system
colors; decide case-by-case where vibrancy helps; blending modes: **behind window** vs **within window**.

**tvOS** material table:
| Material | Recommended for |
|---|---|
| ultraThin | Full-screen views needing a light color scheme |
| thin | Overlays partially obscuring content, light scheme |
| regular | Overlays partially obscuring content |
| thick | Overlays partially obscuring content, dark scheme |
tvOS: glass on navigation + system experiences; image views and buttons become glass when focused.

**visionOS**: windows use fixed system **glass**; adapts brightness to surroundings (no Dark Mode). Prefer
translucency to opaque fills in windows. `thin` → draws attention to interactive elements/selection;
`regular` → separates sections (sidebar, grouped table); `thick` → dark element distinct atop regular.
Vibrancy: `label` (standard), `secondaryLabel` (footnotes/subtitles), `tertiaryLabel` (inactive only).

**watchOS**: materials give context in full-screen modals; don't remove/replace default modal sheet
material backgrounds.

### 2.6 [WEB] translation sketch
- Glass regular: `background: color-mix(in srgb, var(--bg) 55–70%, transparent); backdrop-filter:
  blur(20–30px) saturate(180%);` + 0.5–1px inner highlight border (`rgba(255,255,255,.5)` light /
  `.15` dark) + soft shadow. Pill/capsule shapes, large radii, floating with margin from viewport edges.
- Glass clear: much lower fill alpha (~10–20 %), lighter blur; add 35 % black scrim when media is bright.
- Scroll edge effect: a gradient mask/blur strip under top/bottom bars
  (`mask-image: linear-gradient(...)` on a blurred pseudo-element) — not a solid bar.
- `@media (prefers-reduced-transparency: reduce)` → near-opaque surfaces;
  `@media (prefers-contrast: more)` → opaque surfaces + visible borders + increased-contrast palette.
- Standard materials (content layer): ultraThin/thin/regular/thick ≈ increasing fill alpha with blur.

---------------------------------------------------------------------------------------------------

## 3. Color

### 3.1 Best practices
- **One meaning per color.** Especially status/interactivity: if brand color marks borderless buttons as
  tappable, don't also use it on non-interactive text.
- **Every color must work in light, dark and increased contrast.** Supply light + dark + increased-contrast
  variants for each custom color. Even single-appearance apps should provide both light and dark colors so
  Liquid Glass can adapt.
- Test under varied lighting (sunlight mutes/darkens; dim light saturates) and on varied devices/profiles
  (True Tone, P3 vs sRGB, many TVs).
- Consider how artwork and translucency shift nearby colors (Maps: light scheme in map mode, dark in
  satellite mode; colors shift behind translucent toolbars).
- Prefer the system color picker when people choose colors.

### 3.2 Inclusive color
- **Never rely on color alone** — pair with text labels or glyph shapes.
- Avoid low-contrast and color-blind-confusable combos.
- Cultural meaning varies: Stocks shows positive trend **green in English, red in Chinese**. White can mean
  death/grief or purity/peace (Inclusion page).

### 3.3 System colors (same for iOS, iPadOS, macOS, tvOS; visionOS uses Default dark)
Apple warns values change between releases — use semantic APIs, don't hard-code. Updated June 9, 2025.

| Name | Light | Dark | Inc. contrast light | Inc. contrast dark |
|---|---|---|---|---|
| Red | 255,56,60 `#FF383C` | 255,66,69 `#FF4245` | 233,21,45 `#E9152D` | 255,97,101 `#FF6165` |
| Orange | 255,141,40 `#FF8D28` | 255,146,48 `#FF9230` | 197,83,0 `#C55300` | 255,160,86 `#FFA056` |
| Yellow | 255,204,0 `#FFCC00` | 255,214,0 `#FFD600` | 161,106,0 `#A16A00` | 254,223,67 `#FEDF43` |
| Green | 52,199,89 `#34C759` | 48,209,88 `#30D158` | 0,137,50 `#008932` | 74,217,104 `#4AD968` |
| Mint | 0,200,179 `#00C8B3` | 0,218,195 `#00DAC3` | 0,133,117 `#008575` | 84,223,203 `#54DFCB` |
| Teal | 0,195,208 `#00C3D0` | 0,210,224 `#00D2E0` | 0,129,152 `#008198` | 59,221,236 `#3BDDEC` |
| Cyan | 0,192,232 `#00C0E8` | 60,211,254 `#3CD3FE` | 0,126,174 `#007EAE` | 109,217,255 `#6DD9FF` |
| Blue | 0,136,255 `#0088FF` | 0,145,255 `#0091FF` | 30,110,244 `#1E6EF4` | 92,184,255 `#5CB8FF` |
| Indigo | 97,85,245 `#6155F5` | 109,124,255 `#6D7CFF` | 86,74,222 `#564ADE` | 167,170,255 `#A7AAFF` |
| Purple | 203,48,224 `#CB30E0` | 219,52,242 `#DB34F2` | 176,47,194 `#B02FC2` | 234,141,255 `#EA8DFF` |
| Pink | 255,45,85 `#FF2D55` | 255,55,95 `#FF375F` | 231,18,77 `#E7124D` | 255,138,196 `#FF8AC4` |
| Brown | 172,127,94 `#AC7F5E` | 183,138,102 `#B78A66` | 149,109,81 `#956D51` | 219,166,121 `#DBA679` |

Note: default light Blue `#0088FF` and default light Yellow/Orange are **not** text-safe on white
(contrast < 4.5:1) — that is why increased-contrast variants exist. For text links on white, the
increased-contrast blue `#1E6EF4` (~4.6:1) is the safer web token. [WEB]

### 3.4 System grays (iOS/iPadOS)
Names: Gray, Gray 2 … Gray 6 (`systemGray`…`systemGray6`; SwiftUI `Color.gray` = systemGray).
[GAP] current page shows them only as images. [REF – not from current page] long-standing UIKit values:

| Name | Light | Dark |
|---|---|---|
| systemGray | 142,142,147 `#8E8E93` | 142,142,147 `#8E8E93` |
| systemGray2 | 174,174,178 `#AEAEB2` | 99,99,102 `#636366` |
| systemGray3 | 199,199,204 `#C7C7CC` | 72,72,74 `#48484A` |
| systemGray4 | 209,209,214 `#D1D1D6` | 58,58,60 `#3A3A3C` |
| systemGray5 | 229,229,234 `#E5E5EA` | 44,44,46 `#2C2C2E` |
| systemGray6 | 242,242,247 `#F2F2F7` | 28,28,30 `#1C1C1E` |
(Increased-contrast grays: [GAP].)

### 3.5 Semantic colors — iOS/iPadOS
**Backgrounds** — two parallel stacks, each with primary/secondary/tertiary:
- Plain: `systemBackground` (overall view) → `secondarySystemBackground` (grouping inside) →
  `tertiarySystemBackground` (grouping inside secondary).
- Grouped (for grouped table views/inset lists): `systemGroupedBackground` →
  `secondarySystemGroupedBackground` → `tertiarySystemGroupedBackground`.
- Dark Mode has **base** (dimmer, recedes) and **elevated** (brighter, advances: popovers, sheets,
  multitasking) sets — use system backgrounds so elevation is automatic.

[REF – not from current page] typical values:
| Token | Light | Dark base | Dark elevated |
|---|---|---|---|
| systemBackground | `#FFFFFF` | `#000000` | `#1C1C1E` |
| secondarySystemBackground | `#F2F2F7` | `#1C1C1E` | `#2C2C2E` |
| tertiarySystemBackground | `#FFFFFF` | `#2C2C2E` | `#3A3A3C` |
| systemGroupedBackground | `#F2F2F7` | `#000000` | `#1C1C1E` |
| secondarySystemGroupedBackground | `#FFFFFF` | `#1C1C1E` | `#2C2C2E` |
| tertiarySystemGroupedBackground | `#F2F2F7` | `#2C2C2E` | `#3A3A3C` |

**Foreground** (from page; values [REF]):
| Token | Use | Light | Dark |
|---|---|---|---|
| label | primary text | `#000000` | `#FFFFFF` |
| secondaryLabel | secondary text | rgba(60,60,67,.60) | rgba(235,235,245,.60) |
| tertiaryLabel | tertiary text | rgba(60,60,67,.30) | rgba(235,235,245,.30) |
| quaternaryLabel | quaternary text | rgba(60,60,67,.18) | rgba(235,235,245,.16) |
| placeholderText | placeholders in fields | rgba(60,60,67,.30) | rgba(235,235,245,.30) |
| separator | hairline letting content show through | rgba(60,60,67,.29) | rgba(84,84,88,.60) |
| opaqueSeparator | hairline blocking content | `#C6C6C8` | `#38383A` |
| link | link text | `#007AFF` (legacy) | `#0984FF` (legacy) |

**Fills** [REF]: systemFill light rgba(120,120,128,.20) / dark rgba(120,120,128,.36);
secondarySystemFill .16 / .32; tertiarySystemFill rgba(118,118,128,.12) / .24;
quaternarySystemFill rgba(116,116,128,.08) / rgba(118,118,128,.18).
Use fills for thin/small shapes (slider track), medium shapes (switch bg), large shapes (search field,
segmented control bg), and large areas containing complex content, respectively.

### 3.6 Semantic colors — macOS (AppKit `NSColor`, all dynamic)
alternateSelectedControlTextColor (text on selected list row) · alternatingContentBackgroundColors (zebra
rows) · controlAccentColor (user accent) · controlBackgroundColor (large control bg: browser, table) ·
controlColor (control surface) · controlTextColor · currentControlTint · disabledControlTextColor ·
findHighlightColor · gridColor (table gridlines) · headerTextColor · highlightColor (virtual light source)
· keyboardFocusIndicatorColor (focus ring) · labelColor · linkColor · placeholderTextColor ·
quaternaryLabelColor (watermark-level) · secondaryLabelColor (subheadings) · selectedContentBackgroundColor
(key window selection) · selectedControlColor · selectedControlTextColor · selectedMenuItemTextColor ·
selectedTextBackgroundColor · selectedTextColor · separatorColor · shadowColor · tertiaryLabelColor ·
textBackgroundColor · textColor (document text) · underPageBackgroundColor (behind document) ·
unemphasizedSelectedContentBackgroundColor (selection in non-key window) ·
unemphasizedSelectedTextBackgroundColor · unemphasizedSelectedTextColor · windowBackgroundColor ·
windowFrameTextColor (title bar text).

- macOS 11+ **app accent color** colors buttons, selection highlight, sidebar icons — only when the user's
  System Settings accent is **multicolor**; otherwise user's accent wins. Fixed-color sidebar icons keep
  their meaningful color.
- Web takeaway: model "selected in focused window" vs "selected in unfocused window" (unemphasized =
  gray selection) for desktop-like web apps.

### 3.7 Platform notes
- tvOS: limited palette coordinated with logo; never color alone for focus — use scale + animation.
- visionOS: color sparingly on glass, mostly in bold text and large areas; balance brightness in immersive
  scenes (no bright flashing objects on very dark backgrounds).
- watchOS: background color to add information, not decoration; avoid full-screen color in long-lived
  views (workouts, audio); tinted complications mode.

### 3.8 Color management
- sRGB is the safe default; embed color profiles in images.
- Wide color: **Display P3, 16 bits per channel, export PNG**; design wide color on a wide-gamut display.
- Provide color-space-specific variants when P3 colors become indistinguishable / gradients clip in sRGB.
- [WEB] `@media (color-gamut: p3)` + `color(display-p3 …)` overrides.

---------------------------------------------------------------------------------------------------

## 4. Dark Mode

- Respect the system setting; **avoid an app-specific appearance toggle** (people must change settings
  twice and may think the app is broken). [WEB] Default to `prefers-color-scheme`; an override is OK but
  should default to "System".
- Look good in Light, Dark and Auto (switches during the day, possibly while app is open → handle live).
- Test Dark + **Increase Contrast** + **Reduce Transparency**, separately and together.
- Rare valid case for dark-only: immersive media apps (Stocks example).
- Dark palette = **dimmer backgrounds, brighter foregrounds**; not a simple inversion.
- Use adaptive (semantic) colors; avoid hard-coded values.
- **Contrast: minimum 4.5:1; aim for 7:1 for custom foreground/background, especially small text.**
- **Soften white backgrounds in content images** so they don't glow in dark mode. [WEB] e.g.
  `filter: brightness(.9)` on images with white backgrounds in dark scheme.
- Icons/images: prefer SF Symbols (auto-adapt). Make separate light/dark artwork when needed (full moon
  needs a dark outline on light bg; oil drop needs a light border on dark bg). Check illustration darks
  don't vanish.
- Text: use label color hierarchy; use system text views (vibrancy-aware).
- iOS/iPadOS: **base vs elevated** backgrounds (see 3.5). Custom backgrounds can hide the elevation cue.
- macOS: **desktop tinting** — with graphite accent, window backgrounds pick up a subtle tint from the
  wallpaper. For custom components with a visible background/bezel, include some transparency **only in
  neutral (uncolored) states**; never in colored states.
- visionOS and watchOS: no Dark Mode.

---------------------------------------------------------------------------------------------------

## 5. Typography

### 5.1 Principles
- Legibility first; thin custom weights need larger than minimum sizes.
- Prefer **Regular, Medium, Semibold, Bold**; avoid **Ultralight, Thin, Light** (especially small).
- Hierarchy via weight, size, color; preserve hierarchy when text size changes.
- Limit typefaces (mixing many obscures hierarchy).
- At large sizes, enlarge what matters (content), not everything.
- Avoid tight leading for 3+ lines. Loose leading for wide columns/long passages; tight for constrained
  areas like list rows.

### 5.2 Default & minimum sizes
| Platform | Default | Minimum |
|---|---|---|
| iOS, iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| tvOS | 29 pt | 23 pt |
| visionOS | 17 pt | 12 pt |
| watchOS | 16 pt | 12 pt |

### 5.3 System fonts
- **San Francisco**: SF Pro (iOS/iPadOS/macOS/tvOS/visionOS system font), SF Compact (watchOS), SF Mono,
  SF Arabic/Armenian/Georgian/Hebrew. Rounded variants for SF Pro/Compact/Arabic/Armenian/Georgian/Hebrew
  (softer voice). watchOS complications use SF Compact Rounded.
- **New York**: serif; works alone or with SF.
- Both variable fonts; weights Ultralight→Black (9 weights); SF also Condensed/Expanded widths.
- **Dynamic optical sizes**: Text and Display optical sizes are merged into one continuous design that adapts
  to point size (discrete Text/Display only needed in tools without variable-font support). [REF – legacy
  HIG] historically SF Pro Text ≤19 pt, SF Pro Display ≥20 pt.
- **Tracking** adjusted dynamically per size by the system; set manually in mockups. [GAP] tracking table
  not on current page. [REF – legacy SF Pro tracking, pt, approximate; verify]: Text cut: 11pt +0.06 ·
  12pt 0 · 13pt −0.08 · 15pt −0.23 · 17pt −0.43; Display cut (≥20pt) switches to small positive values
  ≈ +0.35…+0.40 (20, 22, 28, 34pt). Note the sign flip only applies to the discrete Display face.
  [WEB] With `-apple-system`/`system-ui` on Apple devices, opsz + tracking are applied automatically; with
  "SF Pro" or Inter fallbacks, apply small negative letter-spacing at 15–24 px (≈ −0.01 to −0.025em).
- Don't embed system fonts; reference them via the system font APIs. [WEB] font stack:
  `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", system-ui, "Helvetica Neue", Arial,
  sans-serif`; serif: `"New York", ui-serif, Georgia, serif`; mono: `ui-monospace, "SF Mono", SFMono-Regular,
  Menlo, monospace`; rounded: `ui-rounded, "SF Pro Rounded", system-ui`.
- SF Symbols share font weights → icons match adjacent text weight.

### 5.4 Custom fonts
- Respect minimum sizes (larger for thin weights); support Dynamic Type and Bold Text equivalents.
- Branding page: common pattern = custom font for headlines/subheads, system font for body/captions.

### 5.5 Dynamic Type (iOS, iPadOS, tvOS, visionOS, watchOS; not macOS)
- Test every size; meaningful icons scale with text (SF Symbols auto).
- Minimize truncation; at largest accessibility sizes show as much as at largest standard size; allow
  multi-line labels.
- At large sizes: **stack horizontally arranged items vertically**, reduce column count.
- Keep hierarchy; primary elements near the top.
- Accessibility page: support text enlargement of **at least 200 %** (watchOS **140 %**).
- [WEB] use `rem` for all type; respect browser zoom/text size; `@supports (font: -apple-system-body)` →
  `font: -apple-system-body` on html maps to iOS Dynamic Type in Safari.

### 5.6 iOS/iPadOS Dynamic Type tables (size / leading in pt)
Weights for all categories: all styles **Regular** except **Headline = Semibold**.
Emphasized weight: Large Title, Title 1, Title 2 → **Bold**; all others → **Semibold**.
Point sizes assume 144 ppi @2x / 216 ppi @3x.

| Style | xSmall | Small | Medium | **Large (default)** | xLarge | xxLarge | xxxLarge |
|---|---|---|---|---|---|---|---|
| Large Title | 31/38 | 32/39 | 33/40 | **34/41** | 36/43 | 38/46 | 40/48 |
| Title 1 | 25/31 | 26/32 | 27/33 | **28/34** | 30/37 | 32/39 | 34/41 |
| Title 2 | 19/24 | 20/25 | 21/26 | **22/28** | 24/30 | 26/32 | 28/34 |
| Title 3 | 17/22 | 18/23 | 19/24 | **20/25** | 22/28 | 24/30 | 26/32 |
| Headline (Semibold) | 14/19 | 15/20 | 16/21 | **17/22** | 19/24 | 21/26 | 23/29 |
| Body | 14/19 | 15/20 | 16/21 | **17/22** | 19/24 | 21/26 | 23/29 |
| Callout | 13/18 | 14/19 | 15/20 | **16/21** | 18/23 | 20/25 | 22/28 |
| Subhead | 12/16 | 13/18 | 14/19 | **15/20** | 17/22 | 19/24 | 21/28 |
| Footnote | 12/16 | 12/16 | 12/16 | **13/18** | 15/20 | 17/22 | 19/24 |
| Caption 1 | 11/13 | 11/13 | 11/13 | **12/16** | 14/19 | 16/21 | 18/23 |
| Caption 2 | 11/13 | 11/13 | 11/13 | **11/13** | 13/18 | 15/20 | 17/22 |

Accessibility sizes:
| Style | AX1 | AX2 | AX3 | AX4 | AX5 |
|---|---|---|---|---|---|
| Large Title | 44/52 | 48/57 | 52/61 | 56/66 | 60/70 |
| Title 1 | 38/46 | 43/51 | 48/57 | 53/62 | 58/68 |
| Title 2 | 34/41 | 39/47 | 44/52 | 50/59 | 56/66 |
| Title 3 | 31/38 | 37/44 | 43/51 | 49/58 | 55/65 |
| Headline | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Body | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Callout | 26/32 | 32/39 | 38/46 | 44/52 | 51/60 |
| Subhead | 25/31 | 30/37 | 36/43 | 42/50 | 49/58 |
| Footnote | 23/29 | 27/33 | 33/40 | 38/46 | 44/52 |
| Caption 1 | 22/28 | 26/32 | 32/39 | 37/44 | 43/51 |
| Caption 2 | 20/25 | 24/30 | 29/35 | 34/41 | 40/48 |

Web type scale at default (Large), px / line-height ratio:
LargeTitle 34/41 (1.206) · Title1 28/34 (1.214) · Title2 22/28 (1.273) · Title3 20/25 (1.25) ·
Headline 17/22 600 · Body 17/22 (1.294) · Callout 16/21 · Subhead 15/20 · Footnote 13/18 · Caption1 12/16
· Caption2 11/13. Scaling factor Body xSmall→AX5: 14→53 (≈ 0.82× → 3.1×).

### 5.7 macOS built-in text styles (no Dynamic Type; @2x 144 ppi)
| Style | Weight | Size | Line height | Emphasized |
|---|---|---|---|---|
| Large Title | Regular | 26 | 32 | Bold |
| Title 1 | Regular | 22 | 26 | Bold |
| Title 2 | Regular | 17 | 22 | Bold |
| Title 3 | Regular | 15 | 20 | Semibold |
| Headline | **Bold** | 13 | 16 | Heavy |
| Body | Regular | 13 | 16 | Semibold |
| Callout | Regular | 12 | 15 | Semibold |
| Subheadline | Regular | 11 | 14 | Semibold |
| Footnote | Regular | 10 | 13 | Semibold |
| Caption 1 | Regular | 10 | 13 | Medium |
| Caption 2 | **Medium** | 10 | 13 | Semibold |

macOS dynamic font variants (AppKit): controlContentFont, labelFont, menuFont, menuBarFont, messageFont,
paletteFont, titleBarFont, toolTipsFont, userFont (document text), userFixedPitchFont (mono document),
boldSystemFont, systemFont.
[WEB] For desktop-density web apps (dashboards, tools) use the macOS scale (13 px body); for touch/mobile
or marketing use the iOS scale (17 px body).

### 5.8 tvOS built-in text styles (partial; table truncated in fetch)
| Style | Weight | Size | Leading | Emphasized |
|---|---|---|---|---|
| Title 1 | Medium | 76 | 96 | Bold |
| Title 2 | Medium | 57 | 66 | Bold |
| Title 3 | Medium | 48 | 56 | Bold |
| Headline | Medium | 38 | 46 | Bold |
| Subtitle 1 | Regular | 38 | 46 | Medium |
[GAP] remaining tvOS rows (Callout, Body, Caption…), watchOS and visionOS Dynamic Type tables — page JSON
was truncated by the fetcher. visionOS uses **bolder** body/title styles and adds **Extra Large Title 1/2**.

### 5.9 visionOS text guidance
Prefer 2D text (depth hurts legibility); legible at all scales; default **white** text; on no background use
**bold, not shadows**; billboard text to face viewer.

---------------------------------------------------------------------------------------------------

## 6. Layout

### 6.1 Visual hierarchy
- Order by importance: top → bottom, leading → trailing (mirror for RTL).
- Align deliberately: aligned = related; indented = subordinate.
- Group with **negative space, container shapes, or separators**.
- Progressive disclosure: disclosure triangles, menus, nested views; scrollable sections for media apps.
- **Differentiate controls from content**:
  - Use Liquid Glass for controls.
  - **Don't put a solid or semi-opaque background color beneath controls**; use the **scroll edge effect**
    to elevate them.
  - **Extend full-screen background content under sidebars, toolbars and tab bars** so it fills the whole
    window.
- **Background extension effect**: when a sidebar/inspector would cover important parts of a hero image
  scaled to the window edge, the image is **mirrored, flipped and blurred** beneath those components
  (`backgroundExtensionEffect()` / `UIBackgroundExtensionView`). [WEB] duplicate the hero with
  `transform: scaleX(-1); filter: blur(...)` beneath a floating sidebar.

### 6.2 Adaptability
Handle: compact/regular size classes; many screen sizes; orientations/aspect ratios; Dynamic Island & other
hardware; external displays, Display Zoom, resizable windows (iPad, Mac); text size; locale (LTR/RTL,
date/number formats, font variation, text length).
- Respect safe areas, margins, layout guides.
- Resize well even with locked orientation.
- Dynamic Type: stack adjacent views, let rows grow, allow multiline.
- Preview the **largest and smallest** layouts first; test localizations + text sizes.
- Background art: keep aspect ratio, scale to **fill**, expect overflow in very wide/tall windows.

### 6.3 Size classes (iOS/iPadOS)
Horizontal compact = narrow, regular = wide; vertical compact = short, regular = tall.
Examples: C/C ≈ quarter-screen window; C-width/R-height ≈ half-screen narrow tall; R-width/C-height ≈
half-screen wide short; R/R ≈ most of the screen.
- Base layout on **available space (size class)**, not device type or orientation.
- Consider every combination.
- **Keep functionality constant** across sizes; only change how much is visible (e.g. **tab bar → sidebar**,
  overflow-menu items surfaced when wide).
- Keep the idiom familiar while resizing.
[WEB] Use container queries; "compact width" ≈ < ~600–700 px, "regular" above.
[GAP] Screen dimension tables, standard margins, readable width are not on the current page.
[REF] common iOS values: layout margins 16 pt (compact) / 20 pt (regular); readable content width ≈ 672 pt
max; standard spacing 8 pt grid.

### 6.4 Safe areas & guides
Layout guides: rectangular regions for standard margins and **readable text width**; custom guides allowed.
Safe area = window minus hardware intrusions (Dynamic Island, camera housing) and bars (status, tool, tab).
[WEB] `env(safe-area-inset-*)` + `viewport-fit=cover`.

### 6.5 Platform specifics
- **macOS**: keep controls/critical info **off the bottom** of windows (people drag windows partly
  off-screen); don't place content behind the camera housing at the top.
- **tvOS**: safe area inset **60 pt top/bottom, 80 pt sides**. Focused items grow → pad them. Grid:
| Columns | Unfocused width | H spacing | Min V spacing |
|---|---|---|---|
| 2 | 860 | 40 | 100 |
| 3 | 560 | 40 | 100 |
| 4 | 410 | 40 | 100 |
| 5 | 320 | 40 | 100 |
| 6 | 260 | 40 | 100 |
| 7 | 217 | 40 | 100 |
| 8 | 184 | 40 | 100 |
| 9 | 160 | 40 | 100 |
  Keep partially-offscreen content symmetrical.
- **visionOS**: support resizing; center content horizontally at large sizes; min/max sizes only to prevent
  overlap, not to block resizing; sparing 3D in windows; supplemental content in adjacent window, not
  ornament; **button centers ≥ 60 pt apart** (Spatial layout: and **≥ 16 pt** gap between).
- **watchOS**: max **3 glyph buttons** or **2 text buttons** side-by-side; text buttons usually full-width.

### 6.6 Platform ergonomics (Designing for…)
- **iOS**: medium high-res display; held in 1–2 hands; viewing distance **≤ 1–2 ft**; sessions from a
  minute to an hour+; frequent app switching. Best practices: limit onscreen controls, make secondary actions
  discoverable with minimal interaction; adapt to orientation, Dark Mode, Dynamic Type; **put frequent
  controls in middle/bottom (reachability)**; support swipe-to-go-back and row swipe actions; use
  platform capabilities (Apple Pay, biometrics, location) to avoid data entry.
- **iPadOS**: large display; held or on stand, **≈ 3 ft**; touch, keyboard, trackpad, Pencil; multitasking,
  drag & drop. Showcase content; minimize modals and full-screen transitions; base density on viewing
  distance + input; reachable controls that don't get in the way.
- **macOS**: large display(s); stationary at desk, **1–3 ft**; keyboard + pointer; long sessions; multiple
  apps. Show more content with fewer nested levels and less modality at comfortable density; resizable,
  movable windows + full screen; all commands in menu bar; high-precision pointer editing; keyboard
  shortcuts; personalization (customizable toolbars, fonts, colors).

---------------------------------------------------------------------------------------------------

## 7. Accessibility

### 7.1 Principles
Intuitive (familiar, consistent), Perceivable (never a single channel), Adaptable (honor system settings /
personalization). Audit with Accessibility Inspector.

### 7.2 Vision
- Support text enlargement **≥ 200 %** (watchOS 140 %).
- Default/min sizes per §5.2. Thicker weights read better small.
- **Contrast minimums (WCAG AA, used by Accessibility Inspector; APCA also referenced):**
| Text size | Weight | Min ratio |
|---|---|---|
| up to 17 pt | all | **4.5:1** |
| 18 pt+ | all | **3:1** |
| any | bold | **3:1** |
- If defaults fall short, ship a higher-contrast scheme under **Increase Contrast**. Check both light & dark.
- Prefer system colors (have accessible variants).
- Don't convey info by color alone: add shapes/icons (checkmark-in-circle vs X-in-octagon example);
  offer customizable color schemes (charts, game characters).
- Label everything for VoiceOver.

### 7.3 Hearing
Captions, subtitles, audio descriptions, transcripts; customizable caption styling; pair audio cues with
haptics; add visual cues to audio cues.

### 7.4 Mobility — control sizes
| Platform | Default | Minimum |
|---|---|---|
| iOS, iPadOS | **44×44 pt** | 28×28 pt |
| macOS | **28×28 pt** | 20×20 pt |
| tvOS | 66×66 pt | 56×56 pt |
| visionOS | 60×60 pt | 28×28 pt |
| watchOS | 44×44 pt | 28×28 pt |
- Spacing: **≈ 12 pt padding around bezeled elements; ≈ 24 pt around non-bezeled elements' visible edges**.
- Simplest gesture for frequent actions; no custom multi-finger gestures; always an onscreen alternative
  (swipe-to-delete ↔ Edit mode delete button; swipe-dismiss ↔ close button).
- Support Voice Control (labels), Siri/Shortcuts, VoiceOver, AssistiveTouch, Full Keyboard Access,
  Pointer Control, Switch Control.

### 7.5 Speech / keyboard
Full Keyboard Access: everything reachable by keyboard; **don't override system shortcuts**. Switch Control
support. [WEB] visible `:focus-visible` rings (macOS uses keyboardFocusIndicatorColor = accent-based ring).

### 7.6 Cognitive
- Simple, consistent interactions; system gestures.
- **Minimize auto-dismissing/timed UI**; prefer explicit dismissal.
- Let people control playback; no autoplay without controls; consider global autoplay opt-out.
- Respect **Dim Flashing Lights**.
- **Reduce Motion** behaviors: reduce automatic/repeating animations (zoom, scale, peripheral motion);
  **tighten springs** (less bounce); track animations directly to gestures; avoid z-axis depth animation;
  **replace x/y/z slides with fades**; avoid animating into/out of blur.
- Assistive Access: one interaction per screen; core features only; **confirm twice** before hard-to-undo
  actions.
- Games: difficulty accommodations.

### 7.7 Not on page [GAP]: Reduce Transparency, Smart Invert, Bold Text, Differentiate Without Color as
settings. [WEB] map to `prefers-reduced-transparency`, `prefers-contrast`, `prefers-reduced-motion`,
`forced-colors`; for Smart Invert-like behaviour don't invert media.

---------------------------------------------------------------------------------------------------

## 8. Motion

- System components animate automatically and adapt to accessibility settings and input method
  (Liquid Glass: stronger response to direct touch, subdued with trackpad).
- **Purposeful only**; gratuitous motion distracts or causes discomfort.
- **Motion optional**: never the only carrier of information — supplement with haptics/audio (web: text/state).
- **Realistic feedback** that follows gestures: a view revealed by sliding down shouldn't dismiss sideways
  (exit the way you entered).
- **Brief and precise** feedback animations.
- **No motion on frequent interactions** in apps beyond the system's subtle defaults.
- **Cancelable**: never block input waiting for an animation.
- Animated symbols where meaningful (SF Symbols 5+).
- Games: target **30–60 fps**; good defaults per device; let people trade visuals for battery.
- visionOS: avoid peripheral motion; large moving objects → more translucency/lower contrast; fade-move-fade
  when relocating; don't rotate the world; stationary frame of reference; avoid sustained oscillation
  near **0.2 Hz**.
- watchOS: built-in easing at start and end, not customizable.
- [GAP] No durations/curves on the page. [WEB/REF] Apple-like defaults: springs (response ≈ 0.3–0.5 s,
  damping ≈ 0.8–1.0; bouncy ≈ 0.7), micro-feedback 100–200 ms, view transitions 300–500 ms, ease-out
  (`cubic-bezier(.2,.8,.2,1)`-ish) or `linear()` spring approximations; under reduced motion → 0–150 ms
  opacity fades.

---------------------------------------------------------------------------------------------------

## 9. Icons (interface icons / glyphs)

- Glyphs: streamlined shapes, black + clear (system colors the black areas). App icons are different.
- **Highly simplified, recognizable**, familiar metaphors directly tied to the action/content.
- **Visual consistency**: same size, detail level, **stroke weight**, perspective across all icons (custom,
  system or mixed). Adjust individual dimensions for optical weight (alarm clock may poke above bounds).
- **Match icon weight to adjacent text weight** (unless deliberately emphasizing one).
- **Optical centering**: asymmetric icons (e.g. download arrow heavy at bottom) need padding baked in so the
  asset can be geometrically centered.
- Selected-state variant only if needed; standard bars handle selection (toolbar selected = accent color).
- Inclusive, gender-neutral figures; avoid culture-specific imagery.
- Text in icons only when essential (e.g. "B" for bold); localize characters; abstract lines for text
  passages; provide RTL-flipped version.
- **Vector formats (PDF/SVG)**; PNG needs multiple scales.
- Accessibility labels for every custom icon.
- No replicas of Apple hardware.

### Standard SF Symbols for common actions
Cut `scissors` · Copy `document.on.document` · Paste `document.on.clipboard` · Done `checkmark` ·
Cancel `xmark` · Delete `trash` · Undo `arrow.uturn.backward` · Redo `arrow.uturn.forward` ·
Compose `square.and.pencil` · Duplicate `plus.square.on.square` · Rename `pencil` · Move to `folder` ·
Attach `paperclip` · Add `plus` · More `ellipsis` · Select `checkmark.circle` · Deselect `xmark` ·
Superscript `textformat.superscript` · Subscript `textformat.subscript` · Bold `bold` · Italic `italic` ·
Underline `underline` · Align left `text.alignleft` · Center `text.aligncenter` · Justify `text.justify` ·
Align right `text.alignright` · Search `magnifyingglass` · Find `text.page.badge.magnifyingglass` ·
Filter `line.3.horizontal.decrease` · Share `square.and.arrow.up` · Print `printer` ·
Account `person.crop.circle` · Like `hand.thumbsup` · Dislike `hand.thumbsdown` ·
Bring to front `square.3.layers.3d.top.filled` · Send to back `square.3.layers.3d.bottom.filled` ·
Bring forward `square.2.layers.3d.top.filled` · Send backward `square.2.layers.3d.bottom.filled` ·
Alarm `alarm` · Archive `archivebox` · Calendar `calendar`.
(Save, Close, Export, Find & Replace, User, Profile: no prescribed symbol.)
[WEB] SF Symbols may not be redistributed in web assets outside Apple platforms (license); use a
look-alike line icon set (e.g. Lucide/Phosphor "regular") with stroke ≈ text weight (1.5–2 px at 17–20 px).

### macOS document icons
Folded top-right corner; parts = background fill + center image + extension text. Smallest 16×16 px.
Background fill sizes: 512/1024, 256/512, 128/256, 32/64, 16/32 (@1x/@2x). Center image = half canvas:
256/512, 128/256, 32/64, 16/32. **~10 % margin; image ≈ 80 % of canvas** (256 canvas → 205×205).
Reduce detail at small sizes; nothing important in top-right. Extension text in caps; use descriptive term
for obscure extensions.

---------------------------------------------------------------------------------------------------

## 10. SF Symbols

- Thousands of symbols aligned to SF font metrics; use anywhere icons appear (toolbars, tab bars, menus,
  inline text). Don't use in app icons/logos/trademarks.
- **Rendering modes** (layers: primary/secondary/tertiary):
  - Monochrome: one color everywhere.
  - Hierarchical: one color, opacity by layer (≈ **100 % / 50 % / 25 %**).
  - Palette: one color per layer (2 colors on 3 layers → secondary & tertiary share).
  - Multicolor: intrinsic meaningful colors (leaf green, trash.slash red).
  - Use system colors; verify legibility per context; "Automatic" picks preferred mode.
- **Gradients** (SF Symbols 7+): linear gradient from one source color; best at larger sizes.
- **Variable color**: layers light up as a 0–100 % value crosses thresholds (speaker.wave.3). For
  change over time (capacity, strength), not for depth.
- **9 weights** (Ultralight→Black) matching SF; **3 scales** (small, medium default, large) relative to
  cap height — change emphasis without breaking weight match.
- **Variants**: outline (default; toolbars, lists, inline), fill (emphasis: iOS tab bars, swipe actions,
  accent selection), slash (unavailable), enclosed (circle/square; legibility at small sizes). Tab bars
  prefer fill; toolbars outline. Localized variants for many scripts.
- **Animations**: Appear, Disappear, Bounce (action occurred / needed; once), Scale (persistent emphasis of
  selection), Pulse (opacity, ongoing activity), Variable Color (cumulative / iterative; progress or
  activity: playback, connecting), Replace (down-up = state change; up-up = forward progression; off-up =
  next available action), **Magic Replace** (default; morphs related shapes like slash/badge), Wiggle
  (call to action, direction), Breathe (opacity + size; recording/live status), Rotate (whole or by layer;
  in-progress), **Draw On/Off** (SF Symbols 7; progress, direction). Speed, repeat, autoreverse options.
  Use judiciously, each with clear purpose, aligned with brand tone.
- Custom symbols: start from a template; annotate layers; match detail/weight/alignment/perspective; negative
  side margins for badged symbols (`left-margin-Regular-M`); draw whole shapes + erase layers; don't bake
  enclosures/badges; alt text; no Apple product replicas (copyrighted symbols non-customizable).

---------------------------------------------------------------------------------------------------

## 11. App icons (Liquid Glass era, updated June 8, 2026)

- iOS/iPadOS/macOS/watchOS: one background layer + one or more foreground layers; system adds glass
  (specular highlights, refraction, translucency). Built in **Icon Composer**.
- Appearances (iOS/iPadOS/macOS): **Default, Dark, Clear (light/dark), Tinted (light/dark)**; system
  generates any not supplied.
- Square layers; system masks to rounded rect (iOS/macOS), circle (visionOS/watchOS). **Don't pre-mask.**
- Specs: iOS/iPadOS/macOS **1024×1024 px**; tvOS **800×480** (2–5 layers, parallax); visionOS 1024×1024
  (background + 1–2 layers, circular); watchOS **1088×1088** (circular; no black background).
- Sharp-edged foreground shapes, vary opacity for depth, solid/gradient backgrounds, vector art; one core
  concept; no text except a mnemonic letter; prefer illustration over photo; avoid thin lines; **don't add
  your own highlights, shadows, bevels, blurs, glows**. Keep features consistent across appearances.
- Color spaces: sRGB, Gray Gamma 2.2, Display P3 (not visionOS).
- [WEB] favicon/PWA icon: full-bleed square, no baked rounded corners (platform masks), provide dark variant.

---------------------------------------------------------------------------------------------------

## 12. Branding (refined Sept 9, 2026)

- Use your brand **voice and tone** in all copy.
- **Accent color judiciously**: minimize on controls; reserve for **primary actions and status** (unread
  badges, selected tab icon). To express brand color, **move it into the content layer** where it scrolls
  beneath glass controls and gets picked up dynamically (airport map example: brand color in content ✓,
  brand color on all controls ✗).
- **Custom font** OK if legible at all sizes and supports Bold Text / Dynamic Type; common: custom font for
  headlines/subheads, system font for body/captions.
- Express brand **through familiar components**; if customized, keep sizing, placement, behavior native.
- **Branding defers to content**: no screen space spent only on a brand asset.
- Standard patterns: UI in expected places, standard symbols, standard navigation/modality.
- **Don't show the logo throughout** the app.
- **Launch screen is not a branding moment** (minimize perceived load); use onboarding/welcome instead.
  [WEB] no splash screens; skeletons instead.
- Follow Apple trademark rules.

---------------------------------------------------------------------------------------------------

## 13. Writing (UX copy)

### Voice/tone
- Know your audience; choose familiar vocabulary; decide the feeling (bank → trust; game → fun); maintain a
  term list for consistency.
- Match tone to context (serious for fall detection; celebratory for streaks).
- Be clear; cut unnecessary words; read aloud.
- Write for everyone: plain language, no jargon, no gendered terms; localization-friendly.

### Best practices
- One idea per screen; most important info first; format for scanning.
- **Action-oriented**: active voice; **buttons/links are verbs**; clarity over cleverness ("Send" not
  "Let's do it!"); no "Click here" — descriptive link text ("Learn more about UX Writing").
- Build language patterns and reuse them.
- **Capitalization**: choose **title case (more formal) or sentence case (more casual)** per UI element type
  and apply consistently (e.g. all alerts title case, all headlines sentence case). Buttons have their own
  rules (Buttons page).
- Flows: start with "Get Started"; transitions "Continue" or "Next" (consistent); finish "Done".
- Possessives sparingly ("Favorites" > "Your Favorites"); don't mix "my"/"your" perspectives.
- **Avoid "we"** ("We're having trouble loading this content" → "Unable to load content").
- Device-specific verbs: **"tap"** on iPhone/iPad, not "click"; brevity on small screens and TVs.
- **Empty states**: next step + button/link; welcoming/teaching; no crucial info (they're temporary).
- **Errors**: prevent first; show near the problem; no blame; say how to fix ("Choose a password with at
  least 8 characters" not "That password is too short"); **no "oops"/"uh-oh"**; if many people hit it,
  redesign the interaction.
- Pick delivery method by urgency (notification vs alert vs action sheet vs inline).
- **Settings labels** practical; description says what happens when **on** (Handwashing Timer: "Apple Watch
  can detect when you're washing your hands and start a 20-second timer."); link directly to settings.
- **Text fields**: always labeled; placeholder shows format ("name@example.com", "Your name"); inline errors
  that explain the fix ("Use only letters for your name" not "Don't use numbers or symbols"; never just
  "Invalid name").

### Inclusion (language)
- Address people as "you"; never "the user"/"the player"; "we/our" only for the company.
- Define jargon; remove colloquialisms with exclusionary origins ("grandfathered in", "peanut gallery");
  humor sparingly.
- Gender-neutral nouns; customizable avatars; if collecting gender, offer nonbinary / self-identify /
  decline; consider pronouns.
- Diverse imagery (race, body type, age, ability); no occupational stereotypes; avoid affluence signals.
- No culture-specific security questions.
- People-first disability language; disability as spectrum incl. temporary/situational.

---------------------------------------------------------------------------------------------------

## 14. Images

- Scale factors: @1x (1 px/pt), @2x, @3x. iOS **@2x + @3x**; iPadOS & watchOS **@2x**; macOS & tvOS
  **@1x + @2x**; visionOS **@2x or higher** (perf cost rises notably above @6x; use high-quality filtering
  above @2x).
- Design at lowest resolution and scale up; put vector control points on whole values so they snap at 1x.
- Formats: bitmap → de-interlaced **PNG**; limited color → 8-bit palette PNG; photos → **JPEG or HEIC**;
  stereo/spatial → stereo HEIC; flat icons/interface art → **PDF or SVG**.
- Embed color profiles; test on real devices.
- tvOS layered images: **2–5 layers**, opaque background layer, text in foreground, subtle parallax, safe
  zone around foreground.
- visionOS: prefer vector; spatial photos shown standalone (sheet/window), text over them on feathered
  glass.
- watchOS: avoid transparency except template icons; autoscaling PDF scales 38mm 90 %, 40mm 100 %,
  41mm 106 %, 42mm 100 %, 44mm 110 %, 45mm 119 %, 49mm 119 %.
- [WEB] `srcset` with 1x/2x/3x, `<picture>` with AVIF/WebP + JPEG fallback, SVG for UI icons.

---------------------------------------------------------------------------------------------------

## 15. Right to left

- System components flip automatically; custom layout must mirror (leading/trailing, not left/right).
  [WEB] logical properties (`margin-inline-start`, `inset-inline-end`), `dir="rtl"`.
- Align text to the interface direction; paragraphs of **3+ lines align by their own language**; 1–2 line
  blocks follow context; lists aligned consistently even with mixed scripts.
- **Never reverse digits within a number**; do reverse the **direction** of progress/counting UI (progress
  bars, sliders, ratings) without flipping numerals. Numeral systems: Hebrew uses Western Arabic digits;
  Arabic may use Western or Eastern Arabic per region.
- Flip: progress controls (and their end-glyphs), back/forward/next/previous navigation, fixed-order item
  sequences, icons depicting text/reading direction or motion.
- Don't flip: controls pointing to a real direction, photos/illustrations/artwork, logos, checkmarks,
  universal signs, real-world objects (clock, pencil) unless directional, consistent symbols (backslash
  prohibition).
- Arabic/Hebrew lack uppercase → bump RTL font size **≈ +2 pt** next to all-caps Latin.
- Localize icons that contain text (signature, rich text, I-beam).

---------------------------------------------------------------------------------------------------

## 16. Spatial layout (visionOS — skim)

- Point = angle; content scales with distance. Center important content in field of view (figure shows
  30°/60°/90° guides); no head-anchored content; depth sparingly (not on text); use depth for hierarchy
  (sheet over window), large important elements (tab bars, toolbars).
- Dynamic scale (default for windows; interactive) vs fixed scale (life-size noninteractive objects).
- Few windows; prioritize indirect gestures; Digital Crown recenters; keep people stationary.
- **Buttons ≥ 60 pt center-to-center, ≥ 16 pt apart**; interactive elements must not overlap.

---------------------------------------------------------------------------------------------------

## 17. Consolidated token proposal for the web skill [WEB]

```
/* spacing: 4/8 grid */ --space-1:4px --space-2:8px --space-3:12px --space-4:16px --space-5:20px
                       --space-6:24px --space-8:32px --space-10:40px
/* page margins */      compact 16px, regular 20–24px; readable line length ≈ 672px max (~70ch)
/* targets */           --hit-min: 44px (touch), 28px (pointer-dense desktop; never <20px)
/* gaps between controls */ bezeled ≥12px, borderless ≥24px
/* type (iOS default) */ large-title 34/41 400 (700 emphasized) · title1 28/34 · title2 22/28 ·
                         title3 20/25 · headline 17/22 600 · body 17/22 · callout 16/21 ·
                         subhead 15/20 · footnote 13/18 · caption1 12/16 · caption2 11/13
/* type (macOS dense) */ large-title 26/32 · title1 22/26 · title2 17/22 · title3 15/20 ·
                         headline 13/16 700 · body 13/16 · callout 12/15 · subhead 11/14 ·
                         footnote 10/13 · caption 10/13
/* colors */             system palette in §3.3 with 4 variants; label/secondary/tertiary/quaternary
                         label; separator vs opaque separator; fills ×4; backgrounds plain + grouped,
                         dark base vs elevated
/* contrast */           ≥4.5:1 body, ≥3:1 ≥18px or bold, aim 7:1 small custom text
/* glass */              regular (blur + luminosity) default; clear only over media + 35% black scrim
                         when bright; reduced-transparency → opaque; increased-contrast → borders
/* shapes */             capsule buttons/bars; concentric corner radii (child radius = parent radius −
                         padding) — Liquid Glass shapes are concentric with device/window corners [REF]
/* motion */             spring-ish ease-out, 150–400ms, interruptible; reduced-motion → fades
```

Key [GAP]s to fill from other sources if needed: iOS gray/background/label numeric values on current
page (only images), watchOS & visionOS type tables, remaining tvOS type rows, SF tracking table, numeric
corner radii / concentricity specs (likely on Components pages or WWDC25 "Get to know the new design
system", session 356), device screen size table.
