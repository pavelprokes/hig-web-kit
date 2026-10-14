# shadcn/ui

`shadcn.css` maps shadcn's CSS variables (`--background`, `--primary`, `--ring`, `--radius`, sidebar and chart colors) onto the `--hig-*` tokens. Light/dark, increased contrast and AA mode then switch automatically, so you can delete the `.dark { … }` block that `shadcn init` generates.

```css
/* globals.css — after Tailwind */
@import "tailwindcss";
@import "hig-web-kit/hig.css";
@import "hig-web-kit/shadcn.css";
@import "hig-web-kit/tailwind.css";   /* optional: bg-hig-* utilities too */
```

Keep shadcn's `@theme inline { --color-background: var(--background); … }` block as generated.

Recommended tweaks to stay close to the HIG:

- **Button:** add `rounded-full min-h-11 px-5 font-semibold` to the default variant, and use `variant="secondary"` for gray buttons (fill + accent text).
- **Input:** `rounded-[14px] min-h-11 bg-[var(--hig-fill-3)]`. In AA mode the border comes from `--input`, which maps to the 3:1 control border.
- **Dialog, Sheet, Popover, DropdownMenu content:** add `hig-glass hig-glass--large` (load `glass.css`) for Liquid Glass surfaces.
- **Switch:** set the checked track to `data-[state=checked]:bg-[var(--hig-switch-on)]` for Apple's green.
