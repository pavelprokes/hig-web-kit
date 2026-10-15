# Accent themes

Apple's HIG gives an app **one accent color**. It tints primary buttons, links, selection, the slider fill and the focus ring. Labels, fills, system colors and the green switch stay as they are. hig-web-kit themes change exactly that accent, in every mode and scheme.

## Built-in themes

| Name | Brand | Notes |
|---|---|---|
| *(none)* | Apple system blue | default |
| `vzb` | Vzdělání budoucnosti, navy `#01497c` (dark scheme starts from `#1768ac`) | from vzdelanibudoucnosti.cz |
| `indigo`, `purple`, `pink`, `orange`, `green`, `teal` | Apple system colors of the matching scheme | like the macOS accent picker |
| `graphite` | neutral gray | |

```html
<html data-hig-theme="vzb">              <!-- CSS only: hig.css contains every built-in theme -->
```
```js
import { setTheme, restoreTheme, listThemes } from 'hig-web-kit/theme';
restoreTheme();          // saved choice, or #theme=vzb in the URL (combinable: #aa-dark-theme=vzb)
setTheme('vzb');         // persisted; setTheme(null) returns to system blue
```

## Any brand color

```js
import { applyBrandColor, deriveBrandTheme } from 'hig-web-kit/theme';
applyBrandColor('#c8102e');                                   // injects CSS and activates it
applyBrandColor({ light: '#01497c', dark: '#1768ac' }, { name: 'acme' });
const sets = deriveBrandTheme('#c8102e');                     // just the values, e.g. sets['aa.dark']['accent-fill']
```

### How the colors are derived

The brand's hue and saturation are kept; only its lightness moves, as little as possible:

| Token | Apple mode | AA mode and Increase Contrast |
|---|---|---|
| `accent` (indicators) | ≥ 3:1 on the page | ≥ 3:1 on page, card and secondary background |
| `accent-fill` + `on-accent` | brand; white label (black only for very light brands) | label ≥ 4.5:1, fill ≥ 3:1 against page and card; white label preferred |
| `accent-text`, `link` | = accent | ≥ 4.5:1 on page, card, secondary background and the gray button |
| `focus-ring` | accent at 50–60 % | = accent text (≥ 3:1) |

`npm run check:contrast` measures every theme on top of every set, and CI fails if any AA set drops below WCAG 2.2 AA. The tests also run eight extreme brand colors (white, black, yellow, red…) through the derivation.

## Your own built-in theme

Add it to `tokens/tokens.json` and run `npm run build`:

```json
"themes": {
  "acme": { "label": "Acme", "brand": { "light": "#5b2be0", "dark": "#8f6bff" },
            "sets": { "apple.light": { "accent-fill": "#5b2be0" } } }
}
```

`brand` is one color or `{ light, dark }`; `"apple:indigo"` refers to a system color. `sets` pins exact values per color set; the contrast gate still checks them.

## Frameworks

| Stack | Use |
|---|---|
| CSS, Tailwind, shadcn/ui, Bootstrap runtime | nothing extra: everything reads `--hig-accent*`, so `data-hig-theme` is enough |
| Ant Design | `higAntd({ mode, scheme, accent: 'vzb' })` or `accent: '#c8102e'` |
| MUI | `higMui({ mode, scheme, accent: 'vzb' })` |
| JS (charts, canvas) | `tokens.themes.vzb.color.aa.dark.accentFill` |

## Brand colors beyond the accent

Keep secondary brand colors (a red call-to-action, logo colors) in the content layer: illustrations, hero images, cards, tags. On controls, HIG uses one accent; a second "primary" color would compete with it.
