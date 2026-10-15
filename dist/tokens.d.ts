/*! hig-web-kit v0.3.0 | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */

export type HigColorName = 'bg' | 'bg2' | 'bg3' | 'groupedBg' | 'groupedBg2' | 'groupedBg3' | 'bgElevated' | 'bgElevated2' | 'label' | 'label2' | 'label3' | 'label4' | 'placeholder' | 'link' | 'sep' | 'sepOpaque' | 'fill' | 'fill2' | 'fill3' | 'fill4' | 'red' | 'orange' | 'yellow' | 'green' | 'mint' | 'teal' | 'cyan' | 'blue' | 'indigo' | 'purple' | 'pink' | 'brown' | 'gray' | 'gray2' | 'gray3' | 'gray4' | 'gray5' | 'gray6' | 'accent' | 'accentFill' | 'accentText' | 'onAccent' | 'destructiveFill' | 'destructiveText' | 'onDestructive' | 'successText' | 'warningText' | 'switchOn' | 'controlBorder' | 'focusRing' | 'glassTint' | 'glassTintLarge' | 'glassTintClear' | 'glassRim' | 'glassRimDim' | 'glassLabel' | 'glassShadowColor' | 'scrim';
export type HigColorSet = Record<HigColorName, string>;
export interface HigModeColors { light: HigColorSet; dark: HigColorSet; lightHc: HigColorSet; darkHc: HigColorSet; }
export interface HigTextStyle { size: number; line: number; weight: number; }
export type HigTextStyleName = 'large-title' | 'title-1' | 'title-2' | 'title-3' | 'headline' | 'body' | 'callout' | 'subhead' | 'footnote' | 'caption-1' | 'caption-2';
export interface HigTokens {
  color: { apple: HigModeColors; aa: HigModeColors };
  font: { family: Record<'sans' | 'rounded' | 'serif' | 'mono', string>; ios: Record<HigTextStyleName, HigTextStyle>; macos: Record<HigTextStyleName, HigTextStyle> };
  radius: Record<'xs' | 'sm' | 'md' | 'field' | 'lg' | 'card' | 'menu' | 'alert' | 'window' | 'capsule', number>;
  space: Record<'1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12', number>;
  size: Record<'tap' | 'tap-min' | 'tap-desktop' | 'tap-desktop-min' | 'control-xs' | 'control-sm' | 'control-md' | 'control-lg' | 'control-xl' | 'row' | 'row-lg' | 'tabbar' | 'gutter' | 'gutter-regular' | 'readable', number>;
  motion: Record<'spring' | 'ease-out' | 'duration-fast' | 'duration', string>;
  glass: Record<'blur' | 'blur-large' | 'blur-clear' | 'saturate', string>;
  themes: Record<HigThemeName, HigTheme>;
}
export type HigThemeName = 'vzb' | 'indigo' | 'purple' | 'pink' | 'orange' | 'green' | 'teal' | 'graphite';
export type HigAccentName = 'accent' | 'accentFill' | 'accentText' | 'onAccent' | 'link' | 'focusRing';
export interface HigTheme {
  label: string;
  brand: string | { light: string; dark: string };
  color: Record<'apple' | 'aa', Record<'light' | 'dark' | 'lightHc' | 'darkHc', Record<HigAccentName, string>>>;
}
export declare const tokens: HigTokens;
export default tokens;
