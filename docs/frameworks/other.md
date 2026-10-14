# Any other stack

Everything is plain CSS variables plus small dependency-free ES modules. That covers Vue, Svelte, Angular, Solid, Lit, htmx, WordPress themes, static sites and anything else.

## CSS variables

Load `hig.css`, then style with `var(--hig-…)`:

```css
.button-primary { background: var(--hig-accent-fill); color: var(--hig-on-accent); border-radius: 999px; min-height: var(--hig-size-tap); }
.muted { color: var(--hig-label-2); }
.field { background: var(--hig-fill-3); box-shadow: inset 0 0 0 1px var(--hig-control-border); border-radius: var(--hig-radius-field); }
.field:focus-within { outline: 3px solid var(--hig-focus-ring); }
```

Use `box-shadow: inset 0 0 0 1px var(--hig-control-border)` for control boundaries. The token is transparent in Apple mode and a 3:1 gray in AA mode, so one rule serves both.

## Framework themes that need hex values

Vuetify, Quasar, PrimeVue, Chakra, Mantine, Naive UI, Element Plus, Angular Material and others take color values in a JS theme object. Use the resolved tokens:

```js
import { tokens } from 'hig-web-kit';        // or require('hig-web-kit') / tokens.json
const c = tokens.color.aa.dark;              // apple|aa × light|dark|lightHc|darkHc
// Vuetify
createVuetify({ theme: { themes: { dark: { dark: true, colors: {
  primary: c.accentFill, error: c.destructiveFill, success: c.switchOn, warning: c.orange,
  background: c.groupedBg, surface: c.groupedBg2, 'on-primary': c.onAccent,
} } } } });
```

Rebuild the theme from `watchPreferences()` (from `hig-web-kit/a11y`) when mode, scheme or contrast changes.

## Design tools

`dist/tokens.json` holds every resolved value (camelCase keys). It can be imported into Figma (Tokens Studio), Style Dictionary or any token pipeline. `tokens/tokens.json` is the editable source.

## Framework-free components

`components.css` + `components.js` give you HIG controls without a framework:

```html
<button class="hig-switch" role="switch" aria-checked="false" aria-label="Wi-Fi"><span class="hig-switch__thumb"></span></button>
<script type="module">import { initComponents } from 'hig-web-kit/components'; initComponents();</script>
```

The markup contract for each component is at the top of `src/components.js`, and `demo/index.html` shows all of them.
