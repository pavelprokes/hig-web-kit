export interface HigMuiOptions {
  mode?: 'apple' | 'aa';
  scheme?: 'light' | 'dark';
  contrast?: 'standard' | 'more';
  density?: 'touch' | 'desktop';
}
/** MUI ThemeOptions — pass to createTheme(). Typed loosely so it works across MUI majors. */
export declare function higMui(options?: HigMuiOptions): Record<string, any>;
export default higMui;
