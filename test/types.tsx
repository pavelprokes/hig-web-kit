// Compile-time check that the published type declarations work with real antd / MUI types.
import { ConfigProvider, Button, theme } from 'antd';
import { createTheme } from '@mui/material/styles';
import { higAntd, getAntdTheme } from 'hig-web-kit/antd';
import { higMui } from 'hig-web-kit/mui';
import { tokens, type HigColorName } from 'hig-web-kit';
import { setMode, watchPreferences, checkContrast, currentSet } from 'hig-web-kit/a11y';
import { initGlass } from 'hig-web-kit/glass';
import { initComponents, openDialog } from 'hig-web-kit/components';
import { contrast } from 'hig-web-kit/color';

export function App({ dark }: { dark: boolean }) {
  return (
    <ConfigProvider {...higAntd({ mode: 'aa', scheme: dark ? 'dark' : 'light', density: 'touch' })}>
      <Button type="primary">Continue</Button>
    </ConfigProvider>
  );
}

const cfg = getAntdTheme({ mode: 'apple', algorithm: theme.compactAlgorithm });
const mui = createTheme(higMui({ scheme: 'dark' }));
const name: HigColorName = 'accentFill';
const accent: string = tokens.color.aa.light[name];
setMode('aa');
const stop = watchPreferences(p => console.log(p.mode, currentSet(p)));
const failing = checkContrast().filter(r => !r.pass).length;
const cleanup = initGlass({ refraction: 'auto' });
initComponents(); openDialog('sheet');
const ratio: number = contrast('#000', '#fff');
export { cfg, mui, accent, stop, failing, cleanup, ratio };
