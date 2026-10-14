import type { ThemeConfig, ConfigProviderProps } from 'antd';

export interface HigAntdOptions {
  /** 'apple' = Apple's values (default); 'aa' = WCAG 2.2 AA-safe palette and visible control borders. */
  mode?: 'apple' | 'aa';
  scheme?: 'light' | 'dark';
  /** 'more' = increased-contrast palette (maps to prefers-contrast: more). */
  contrast?: 'standard' | 'more';
  /** 'touch' = iOS scale (17px body, 44px controls); 'desktop' = macOS scale (13px body, 28px controls). */
  density?: 'touch' | 'desktop';
  /** Extra antd algorithms, e.g. theme.compactAlgorithm. */
  algorithm?: ThemeConfig['algorithm'];
}

export declare function getAntdTheme(options?: HigAntdOptions): ThemeConfig;
export declare function higAntd(options?: HigAntdOptions): Pick<
  ConfigProviderProps,
  'theme' | 'button' | 'input' | 'select' | 'datePicker' | 'inputNumber' | 'componentSize'
>;
export default higAntd;
