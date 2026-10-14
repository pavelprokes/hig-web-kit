# Bootstrap 5

Bootstrap's Sass needs real color values at build time, and its runtime theming uses `--bs-*` variables. Use both files:

```scss
// styles.scss — load paths: node_modules/hig-web-kit/dist and node_modules
$hig-set: "aa.light";            // or "apple.light" (default)
@import "hig-bootstrap";         // sets $primary, $danger, radii, capsule buttons, fonts…
@import "bootstrap/scss/bootstrap";
```

```html
<link rel="stylesheet" href="hig-web-kit/dist/hig.css">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="hig-web-kit/dist/bootstrap-runtime.css"> <!-- keeps --bs-* in sync with mode/scheme -->
```

`bootstrap-runtime.css` points the main `--bs-*` variables at `--hig-*`, so switching `data-hig-mode`, `data-hig-scheme` or the OS appearance restyles the page without recompiling. Bootstrap's Sass-generated variants (`.btn-primary` hover shades, `.text-bg-*`) keep the build-time `$hig-set` values. For AA, compile with `$hig-set: "aa.light"`.
