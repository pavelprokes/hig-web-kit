# Tailwind CSS

Utilities reference the `--hig-*` variables, so light/dark, increased contrast and the AA mode switch at runtime without `dark:` variants.

## Tailwind v4

```css
/* app.css */
@import "tailwindcss";
@import "hig-web-kit/hig.css";
@import "hig-web-kit/tailwind.css";
@import "hig-web-kit/glass.css";       /* optional */
```

```html
<div class="bg-hig-grouped-bg min-h-screen font-hig-sans text-hig-label">
  <section class="rounded-hig-card bg-hig-grouped-bg-2 p-4">
    <h1 class="text-hig-large-title">Settings</h1>
    <p class="text-hig-subhead text-hig-label-2">Changes sync to all devices.</p>
    <button class="min-h-tap rounded-full bg-hig-accent-fill px-5 font-semibold text-hig-on-accent">Continue</button>
  </section>
</div>
```

Generated names:

- `bg-hig-*` / `text-hig-*` / `border-hig-*`: every color token;
- `rounded-hig-{xs,sm,md,field,lg,card,menu,alert,window}`;
- `text-hig-{large-title…caption-2}`: size, line height and weight;
- `font-hig-{sans,rounded,serif,mono}`;
- `ease-hig-spring`.

## Tailwind v3

```js
// tailwind.config.js
module.exports = {
  presets: [require('hig-web-kit/tailwind-preset')],
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],
};
```

Also load `hig-web-kit/hig.css` once in your global CSS. The class names are the same as in v4, plus `min-h-tap` / `min-w-tap` (44 px).

## Dark mode

Don't use `dark:` for HIG colors; the variables already switch. If the rest of your Tailwind setup uses `darkMode: 'selector'`, point it at `[data-hig-scheme="dark"]` so both systems agree:

```css
@custom-variant dark (&:where([data-hig-scheme=dark], [data-hig-scheme=dark] *));
```
