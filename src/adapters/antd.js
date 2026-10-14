// Ant Design (v5 and v6) adapter.
//
//   import { ConfigProvider } from 'antd';
//   import { higAntd } from 'hig-web-kit/antd';
//   <ConfigProvider {...higAntd({ mode: 'aa', scheme: 'dark' })}>…</ConfigProvider>
//
// Ant Design derives shades from real color values, so this adapter passes resolved hex values (not CSS
// variables). Re-render with new options when the scheme / mode / contrast changes — see watchPreferences()
// in hig-web-kit/a11y or the useHigAntd() recipe in docs/frameworks/antd.md.
import { theme as antdTheme } from 'antd';
import { tokens } from './tokens.js';

// Mix a hex color toward black by `amount` (0..1) — used for hover/active states that keep white labels legible.
const darken = (hex, amount) => {
  const n = parseInt(hex.slice(1, 7), 16);
  const ch = s => Math.round(((n >> s) & 255) * (1 - amount)).toString(16).padStart(2, '0');
  return `#${ch(16)}${ch(8)}${ch(0)}`;
};

const pick = (mode, scheme, contrast) => {
  const key = scheme === 'dark' ? (contrast === 'more' ? 'darkHc' : 'dark') : (contrast === 'more' ? 'lightHc' : 'light');
  return tokens.color[mode === 'aa' ? 'aa' : 'apple'][key];
};

/**
 * Build an Ant Design ThemeConfig from hig-web-kit tokens.
 * @param {import('./antd').HigAntdOptions} [options]
 * @returns {import('antd').ThemeConfig}
 */
export function getAntdTheme(options = {}) {
  const { mode = 'apple', scheme = 'light', contrast = 'standard', density = 'touch', algorithm = [] } = options;
  const c = pick(mode, scheme, contrast);
  const touch = density !== 'desktop';
  const type = touch ? tokens.font.ios : tokens.font.macos;
  const h = touch ? { sm: 32, md: 44, lg: 52 } : { sm: 22, md: 28, lg: 32 };
  const r = tokens.radius;
  const aa = mode === 'aa' || contrast === 'more';
  const border = aa ? c.controlBorder : c.sepOpaque;
  const focus = `0 0 0 3px ${c.focusRing}`;

  // antd's algorithms re-derive brand colors (the dark algorithm shifts them), which would break the
  // measured contrast. This last algorithm pins them to the exact token values.
  const pins = {
    colorPrimary: c.accentFill, colorPrimaryHover: darken(c.accentFill, 0.08), colorPrimaryActive: darken(c.accentFill, 0.16),
    colorInfo: c.accentFill, colorInfoHover: darken(c.accentFill, 0.08), colorInfoActive: darken(c.accentFill, 0.16),
    colorError: c.destructiveFill, colorErrorHover: darken(c.destructiveFill, 0.08), colorErrorActive: darken(c.destructiveFill, 0.16),
    colorSuccess: c.switchOn, colorWarning: c.orange,
    colorLink: c.link, colorLinkHover: c.link, colorLinkActive: c.link,
    colorPrimaryText: c.accentText, colorPrimaryTextHover: c.accentText, colorPrimaryTextActive: c.accentText,
    colorErrorText: c.destructiveText, colorSuccessText: c.successText, colorWarningText: c.warningText, colorInfoText: c.accentText,
    colorTextLightSolid: c.onAccent,
  };
  const pin = (_seed, map) => ({ ...map, ...pins });

  return {
    algorithm: [scheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm, ...[].concat(algorithm), pin],
    token: {
      // brand & status
      colorPrimary: c.accentFill,
      colorInfo: c.accentFill,
      colorSuccess: c.switchOn,
      colorWarning: c.orange,
      colorError: c.destructiveFill,
      colorLink: c.link,
      colorLinkHover: c.link,
      colorLinkActive: c.link,
      colorTextLightSolid: c.onAccent,
      colorPrimaryText: c.accentText,
      colorPrimaryTextHover: c.accentText,
      colorPrimaryTextActive: c.accentText,
      colorSuccessText: c.successText,
      colorWarningText: c.warningText,
      colorErrorText: c.destructiveText,
      colorInfoText: c.accentText,
      // text
      colorText: c.label,
      colorTextHeading: c.label,
      colorTextSecondary: c.label2,
      colorTextDescription: c.label2,
      colorTextTertiary: aa ? c.label2 : c.label3,
      colorTextQuaternary: c.label3,
      colorTextPlaceholder: c.placeholder,
      colorTextDisabled: c.label3,
      colorIcon: c.label2,
      colorIconHover: c.label,
      // surfaces
      colorBgBase: c.bg,
      colorBgLayout: c.groupedBg,
      colorBgContainer: c.groupedBg2,
      colorBgElevated: c.bgElevated,
      colorBgSpotlight: scheme === 'dark' ? c.bg3 : '#1c1c1e',
      colorBgMask: c.scrim,
      colorFill: c.fill,
      colorFillSecondary: c.fill2,
      colorFillTertiary: c.fill3,
      colorFillQuaternary: c.fill4,
      colorBorder: border,
      colorBorderSecondary: c.sep,
      colorSplit: c.sep,
      // focus (WCAG 2.4.7 / 2.4.13)
      controlOutline: c.focusRing,
      controlOutlineWidth: 3,
      lineWidthFocus: 3,
      colorPrimaryBorder: c.focusRing,
      // type
      fontFamily: tokens.font.family.sans,
      fontFamilyCode: tokens.font.family.mono,
      fontSize: type.body.size,
      fontSizeSM: type.footnote.size,
      fontSizeLG: type.headline.size + (touch ? 1 : 2),
      fontSizeHeading1: type['large-title'].size,
      fontSizeHeading2: type['title-1'].size,
      fontSizeHeading3: type['title-2'].size,
      fontSizeHeading4: type['title-3'].size,
      fontSizeHeading5: type.headline.size,
      lineHeight: type.body.line / type.body.size,
      fontWeightStrong: 600,
      // shape & size
      borderRadius: r.md,
      borderRadiusSM: r.sm,
      borderRadiusLG: r.lg,
      borderRadiusXS: r.xs,
      borderRadiusOuter: r.sm,
      controlHeight: h.md,
      controlHeightSM: h.sm,
      controlHeightLG: h.lg,
      wireframe: false,
      // motion
      motionEaseOut: 'cubic-bezier(.22, 1, .36, 1)',
      motionEaseInOut: 'cubic-bezier(.4, 0, .2, 1)',
      motionDurationFast: '0.15s',
      motionDurationMid: '0.3s',
      motionDurationSlow: '0.45s',
      boxShadow: `0 8px 28px ${c.glassShadowColor}, 0 1px 3px ${c.glassShadowColor}`,
      boxShadowSecondary: `0 8px 28px ${c.glassShadowColor}, 0 1px 3px ${c.glassShadowColor}`,
    },
    components: {
      Button: {
        fontWeight: 600,
        primaryShadow: 'none', defaultShadow: 'none', dangerShadow: 'none',
        primaryColor: c.onAccent,
        dangerColor: c.onDestructive,
        defaultBg: c.fill2, defaultColor: c.accentText, defaultBorderColor: 'transparent',
        defaultHoverBg: c.fill, defaultHoverColor: c.accentText, defaultHoverBorderColor: 'transparent',
        defaultActiveBg: c.fill, defaultActiveColor: c.accentText, defaultActiveBorderColor: 'transparent',
        textTextColor: c.accentText, textHoverBg: c.fill3,
        contentFontSize: type.body.size, contentFontSizeSM: type.subhead.size, contentFontSizeLG: type.body.size,
        paddingInline: touch ? 20 : 12, paddingInlineLG: touch ? 26 : 16, paddingInlineSM: touch ? 14 : 8,
      },
      Input: {
        activeBorderColor: c.accent, hoverBorderColor: border,
        activeShadow: focus, errorActiveShadow: `0 0 0 3px ${c.destructiveText}`, warningActiveShadow: `0 0 0 3px ${c.warningText}`,
        borderRadius: r.field, borderRadiusLG: r.field, borderRadiusSM: r.md,
        paddingInline: 12,
      },
      InputNumber: { activeBorderColor: c.accent, hoverBorderColor: border, activeShadow: focus, borderRadius: r.field },
      Select: {
        activeBorderColor: c.accent, hoverBorderColor: border, activeOutlineColor: c.focusRing,
        optionSelectedBg: c.fill3, optionSelectedColor: c.label, optionActiveBg: c.fill4, optionSelectedFontWeight: 600,
        optionHeight: touch ? 44 : 24, borderRadius: r.field,
      },
      DatePicker: { activeBorderColor: c.accent, hoverBorderColor: border, activeShadow: focus, borderRadius: r.field },
      Switch: {
        colorPrimary: c.switchOn, colorPrimaryHover: c.switchOn,
        colorTextQuaternary: aa ? c.controlBorder : c.fill, colorTextTertiary: aa ? c.label2 : c.fill2,
        trackHeight: touch ? 28 : 22, trackMinWidth: touch ? 64 : 40,
        handleSize: touch ? 24 : 18, trackPadding: 2,
        handleShadow: '0 3px 8px rgba(0,0,0,.15), 0 1px 1px rgba(0,0,0,.16)',
      },
      Segmented: {
        trackBg: c.fill3, trackPadding: 3, itemSelectedBg: scheme === 'dark' ? '#636366' : c.bgElevated,
        itemSelectedColor: c.label, itemColor: aa ? c.label : c.label2, itemHoverColor: c.label, itemHoverBg: c.fill4,
        borderRadius: 999, borderRadiusSM: 999, borderRadiusLG: 999, borderRadiusXS: 999,
      },
      Slider: {
        railBg: aa ? c.controlBorder : c.fill, railHoverBg: aa ? c.controlBorder : c.fill2,
        trackBg: c.accent, trackHoverBg: c.accent,
        handleColor: c.accent, handleActiveColor: c.accent, handleActiveOutlineColor: c.focusRing,
        railSize: 6, handleSize: touch ? 22 : 16, handleSizeHover: touch ? 26 : 18,
      },
      Checkbox: { borderRadiusSM: 6 },
      Card: { borderRadiusLG: r.card, headerFontSize: type.headline.size },
      Modal: {
        borderRadiusLG: r.alert, contentBg: c.bgElevated, headerBg: 'transparent', footerBg: 'transparent',
        titleFontSize: type.headline.size, titleColor: c.label,
      },
      Drawer: { colorBgElevated: c.bgElevated },
      Menu: {
        itemBorderRadius: r.md, subMenuItemBorderRadius: r.md, itemHeight: touch ? 44 : 28,
        itemSelectedBg: c.fill3, itemSelectedColor: aa ? c.label : c.accentText, itemHoverBg: c.fill4,
        itemColor: c.label, activeBarHeight: 0, activeBarBorderWidth: 0, iconSize: touch ? 20 : 16,
        dangerItemColor: c.destructiveText,
      },
      Dropdown: { borderRadiusLG: touch ? r.menu : r.md, paddingBlock: touch ? 12 : 4, controlHeight: touch ? 44 : 24 },
      Tabs: {
        inkBarColor: c.accent, itemSelectedColor: c.accentText, itemColor: aa ? c.label : c.label2,
        itemHoverColor: c.label, itemActiveColor: c.accentText, titleFontSize: type.subhead.size,
      },
      Table: {
        headerBg: c.bg2, headerColor: c.label2, borderColor: c.sep, rowHoverBg: c.fill4,
        rowSelectedBg: c.fill3, rowSelectedHoverBg: c.fill2, headerSplitColor: 'transparent',
        cellPaddingBlock: touch ? 14 : 6,
      },
      Tooltip: { colorBgSpotlight: scheme === 'dark' ? c.bg3 : '#1c1c1e', borderRadius: r.md },
      Popover: { borderRadiusLG: r.lg },
      Tag: { borderRadiusSM: 999 },
      Badge: { colorError: c.red },
      Progress: { remainingColor: aa ? c.controlBorder : c.fill, defaultColor: c.accent },
      Notification: { borderRadiusLG: r.lg },
      Message: { borderRadiusLG: 999 },
      Alert: { borderRadiusLG: r.md },
      Layout: { bodyBg: c.groupedBg, headerBg: 'transparent', siderBg: c.bg2, footerBg: 'transparent' },
    },
  };
}

/**
 * Props to spread onto <ConfigProvider>: theme + HIG-style component defaults
 * (capsule buttons, filled inputs in Apple mode, outlined inputs with visible borders in AA mode).
 * @param {import('./antd').HigAntdOptions} [options]
 */
export function higAntd(options = {}) {
  const aa = options.mode === 'aa' || options.contrast === 'more';
  return {
    theme: getAntdTheme(options),
    button: { shape: 'round', autoInsertSpace: false },
    input: { variant: aa ? 'outlined' : 'filled' },
    select: { variant: aa ? 'outlined' : 'filled' },
    datePicker: { variant: aa ? 'outlined' : 'filled' },
    inputNumber: { variant: aa ? 'outlined' : 'filled' },
    componentSize: 'middle',
  };
}

export default higAntd;
