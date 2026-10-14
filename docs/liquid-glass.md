# Liquid Glass on the web

## Rules from Apple's guidelines

1. **Two layers.** Content sits at the bottom and runs edge to edge. Controls and navigation float above it in glass.
2. **Never put glass on content.** Cards, list rows and tables keep solid or standard-material backgrounds.
3. **No glass on glass.** Elements on glass use fills (`--hig-fill-*`), not another `.hig-glass`.
4. **Use it sparingly.** Bars, floating buttons, menus, popovers, sheets and alerts. Switch and slider thumbs turn into glass only while they are pressed.
5. **Regular vs Clear.** Regular is the default. Use Clear (`.hig-glass--clear`) only over photos or video, with `.hig-media-dim` behind it and bold, bright symbols on it.
6. **Tint only the primary action** (`.hig-glass--tint`), one per view, and tint the background, not the glyph. Bar labels are monochrome.
7. **No solid bar backgrounds.** Separate bars from scrolling content with `.hig-scroll-edge` only where content scrolls underneath.
8. **Shapes.** Use capsules for controls, and make nested corners concentric (inner radius = outer radius − padding).
9. **Motion.** Glass scales up on press and lights up from the touch point. Menus grow out of their trigger (`.hig-glass-enter`).

## Classes

| Class | Use |
|---|---|
| `.hig-glass` | Regular glass for small controls: bar groups, floating buttons, the tab bar |
| `.hig-glass--large` | More opaque glass for menus, sheets, alerts and sidebars |
| `.hig-glass--clear` | Clear variant over media |
| `.hig-glass--tint` | The primary action |
| `.hig-press-scale` | Scale up while pressed |
| `[data-hig-adapt]` | Flip to the dark style over `[data-hig-tone="dark"]` content (needs `initGlass()`) |
| `[data-hig-refract]` | Real edge refraction in Chromium (needs `initGlass()`) |
| `.hig-scroll-edge--top` / `--bottom` / `--hard` | Scroll edge effect; the top one appears once `data-hig-scrolled` is set (`observeScrolled()`) |
| `.hig-media-dim` | 35 % dimming at the bottom of media under clear glass |

## Browser support (October 2026)

| Technique | Chromium | Safari | Firefox |
|---|---|---|---|
| Blur + saturation + specular rim (base glass) | ✓ | ✓ | ✓ |
| `backdrop-filter: url(#svg)` real refraction | ✓ | renders nothing, though `@supports` reports support | — |
| `prefers-reduced-transparency` | ✓ | ✓ | behind a flag |

`initGlass()` turns on refraction by detecting the browser engine, never with a feature query. Each backdrop-filtered element is re-filtered on every scroll frame, so keep glass to a handful of elements per screen. An ancestor with `overflow: hidden` or `clip-path` can stop the backdrop from sampling anything.

## Tuned values

Apple doesn't publish blur radii or opacities. The kit's values were tuned by eye against iOS 26/27 in a real browser:

- regular glass: 6 px blur and 190 % saturation;
- large glass: 22 px blur;
- refraction bezel = clamp(8 px, 0.32 × height, 22 px), with displacement 1.1 × bezel (stronger values mirror text at the rim);
- blur after refraction: 0.6 px.

To change them, override `--hig-glass-blur`, `--hig-glass-blur-large` and `--hig-glass-saturate`, or pass `strength` to `attachRefraction()`.
