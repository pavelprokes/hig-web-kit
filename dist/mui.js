/*! hig-web-kit v0.1.0 | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */
// MUI (Material UI) adapter.
//
//   import { createTheme, ThemeProvider } from '@mui/material/styles';
//   import { higMui } from 'hig-web-kit/mui';
//   const theme = createTheme(higMui({ mode: 'aa', scheme: 'dark' }));
//
// Returns plain ThemeOptions (no MUI import), so it works with any MUI version that accepts palette /
// typography / shape / components.styleOverrides.
import { tokens } from './tokens.js';

const pick = (mode, scheme, contrast) => {
  const key = scheme === 'dark' ? (contrast === 'more' ? 'darkHc' : 'dark') : (contrast === 'more' ? 'lightHc' : 'light');
  return tokens.color[mode === 'aa' ? 'aa' : 'apple'][key];
};

/** @param {import('./mui').HigMuiOptions} [options] */
export function higMui(options = {}) {
  const { mode = 'apple', scheme = 'light', contrast = 'standard', density = 'touch' } = options;
  const c = pick(mode, scheme, contrast);
  const touch = density !== 'desktop';
  const t = touch ? tokens.font.ios : tokens.font.macos;
  const aa = mode === 'aa' || contrast === 'more';
  const style = s => ({ fontSize: `${s.size / 16}rem`, lineHeight: s.line / s.size, fontWeight: s.weight });

  return {
    palette: {
      mode: scheme,
      primary: { main: c.accentFill, contrastText: c.onAccent },
      secondary: { main: c.indigo, contrastText: '#ffffff' },
      error: { main: c.destructiveFill, contrastText: c.onDestructive },
      warning: { main: c.orange, contrastText: '#000000' },
      success: { main: c.switchOn, contrastText: '#ffffff' },
      info: { main: c.accent, contrastText: c.onAccent },
      text: { primary: c.label, secondary: c.label2, disabled: c.label3 },
      background: { default: c.groupedBg, paper: c.groupedBg2 },
      divider: c.sep,
      action: { hover: c.fill4, selected: c.fill3, disabledBackground: c.fill3, focus: c.fill3 },
    },
    shape: { borderRadius: tokens.radius.md },
    typography: {
      fontFamily: tokens.font.family.sans,
      fontSize: t.body.size === 17 ? 15 : 13, // MUI's "fontSize" is a base for its own rem math
      h1: style(t['large-title']), h2: style(t['title-1']), h3: style(t['title-2']), h4: style(t['title-3']),
      h5: style(t.headline), h6: style(t.headline),
      subtitle1: style(t.headline), subtitle2: style(t.subhead),
      body1: style(t.body), body2: style(t.callout),
      caption: style(t['caption-1']), overline: { ...style(t['caption-2']), textTransform: 'none', letterSpacing: 0 },
      button: { ...style(t.body), fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999, minHeight: touch ? 44 : 28, paddingInline: touch ? 20 : 12,
            '&:active': { opacity: 0.7 },
            '&.Mui-focusVisible': { outline: `3px solid ${c.focusRing}`, outlineOffset: 2 },
          },
          containedPrimary: { backgroundColor: c.accentFill, color: c.onAccent },
          text: { color: c.accentText },
        },
      },
      MuiIconButton: { styleOverrides: { root: { width: touch ? 44 : 28, height: touch ? 44 : 28 } } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radius.field, backgroundColor: c.fill3,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: aa ? c.controlBorder : 'transparent' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: c.focusRing, borderWidth: 2 },
          },
          input: { '&::placeholder': { color: c.placeholder, opacity: 1 } },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: { '&.Mui-checked + .MuiSwitch-track': { backgroundColor: c.switchOn, opacity: 1 } },
          track: { borderRadius: 999, backgroundColor: aa ? c.controlBorder : c.fill, opacity: 1 },
        },
      },
      MuiCard: { styleOverrides: { root: { borderRadius: tokens.radius.card, boxShadow: 'none' } } },
      MuiPaper: { styleOverrides: { rounded: { borderRadius: tokens.radius.lg } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: tokens.radius.alert, backgroundColor: c.bgElevated } } },
      MuiMenu: { styleOverrides: { paper: { borderRadius: touch ? tokens.radius.menu : tokens.radius.md } } },
      MuiMenuItem: { styleOverrides: { root: { minHeight: touch ? 44 : 24, borderRadius: tokens.radius.md } } },
      MuiTooltip: { styleOverrides: { tooltip: { borderRadius: tokens.radius.md, fontSize: '0.8125rem' } } },
      MuiTab: { styleOverrides: { root: { textTransform: 'none', minHeight: 44 } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 999 } } },
      MuiLinearProgress: { styleOverrides: { root: { borderRadius: 999, height: 6, backgroundColor: aa ? c.controlBorder : c.fill } } },
    },
  };
}

export default higMui;
