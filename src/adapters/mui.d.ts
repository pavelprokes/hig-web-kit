export interface HigMuiOptions {
  mode?: 'apple' | 'aa';
  scheme?: 'light' | 'dark';
  contrast?: 'standard' | 'more';
  density?: 'touch' | 'desktop';
  /** Built-in theme name ('vzb', 'indigo', …) or a brand color / { light, dark }. */
  accent?: string | { light: string; dark: string };
}
/** MUI ThemeOptions — pass to createTheme(). Typed loosely so it works across MUI majors. */
export declare function higMui(options?: HigMuiOptions): Record<string, any>;
export default higMui;
