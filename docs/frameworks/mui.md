# MUI (Material UI)

```tsx
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { higMui } from 'hig-web-kit/mui';
import 'hig-web-kit/hig.css'; // optional: for glass.css and your own CSS

const theme = createTheme(higMui({ mode: 'aa', scheme: 'dark', density: 'touch' }));

<ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider>
```

`higMui()` returns plain `ThemeOptions`:

- **palette:** primary is the accent, error is the destructive color, success is the switch green; text, background and divider come from the HIG semantic colors;
- **typography:** the iOS (or macOS) text styles, with `textTransform: none` on buttons;
- **shape:** 12 px radius;
- **component overrides:**
  - capsule buttons without elevation or ripple;
  - 44 px targets;
  - filled inputs (bordered in AA mode);
  - green switch track;
  - 26 px card radius and 32 px dialog radius.

To follow OS settings, recreate the theme from `watchPreferences()` (see the Ant Design guide for a hook), or use MUI's `colorSchemes` API with two `higMui()` calls (`scheme: 'light'` and `scheme: 'dark'`).
