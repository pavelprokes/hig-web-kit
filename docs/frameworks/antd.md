# Ant Design (v5 and v6)

The adapter turns hig-web-kit tokens into an Ant Design `ThemeConfig` and a set of `ConfigProvider` defaults. Tests run it against antd 6.6 and check that the tokens antd actually resolves still meet WCAG 2.2 AA in `aa` mode (`test/outputs.test.mjs`).

## Setup

```bash
npm i antd hig-web-kit
```

```tsx
// main.tsx
import 'hig-web-kit/hig.css';         // --hig-* variables (used by glass + your own CSS)
import 'hig-web-kit/glass.css';       // optional: Liquid Glass classes
import 'hig-web-kit/antd-glass.css';  // optional: glass dropdowns, selects, popovers, modals, drawers
```

```tsx
import { ConfigProvider } from 'antd';
import { higAntd } from 'hig-web-kit/antd';

<ConfigProvider {...higAntd({ mode: 'apple', scheme: 'light' })}>
  <App />
</ConfigProvider>
```

`higAntd()` returns `theme` plus component defaults:

- `button.shape: 'round'` (capsules);
- `variant: 'filled'` on inputs, selects and pickers in Apple mode;
- `variant: 'outlined'` in AA mode, so field boundaries reach 3:1.

Use `getAntdTheme()` when you only want the `ThemeConfig`.

## Options

| Option | Values | Effect |
|---|---|---|
| `mode` | `'apple'` (default) · `'aa'` | AA palette, visible control borders, AA-safe hover/active colors |
| `scheme` | `'light'` · `'dark'` | Picks the color set and `theme.darkAlgorithm` |
| `contrast` | `'standard'` · `'more'` | Increased-contrast palette |
| `density` | `'touch'` (default) · `'desktop'` | iOS scale (17 px body, 44 px controls) or macOS scale (13 px body, 28 px controls) |
| `algorithm` | antd algorithm(s) | Added after the base algorithm, e.g. `theme.compactAlgorithm` |

## Follow OS settings and the AA switch live

```tsx
import { useEffect, useState } from 'react';
import { restorePreferences, watchPreferences, type HigPreferences } from 'hig-web-kit/a11y';

function useHigPreferences() {
  const [prefs, setPrefs] = useState<HigPreferences>(() => restorePreferences());
  useEffect(() => watchPreferences(setPrefs), []);
  return prefs;
}

export function Root() {
  const p = useHigPreferences();
  return (
    <ConfigProvider {...higAntd({ mode: p.mode, scheme: p.scheme, contrast: p.contrast })}>
      <App />
    </ConfigProvider>
  );
}
```

`setMode('aa')`, `setScheme('dark')` or a change in OS settings re-renders the tree with the matching theme. The full example is in [`examples/antd/App.tsx`](../../examples/antd/App.tsx).

For SSR (Next.js), render with `restorePreferences` guarded by `typeof document`, or read a cookie on the server; the attributes on `<html>` keep the CSS side in sync without JS.

## What the adapter maps

| HIG | Ant Design |
|---|---|
| `accent-fill`, hover/active darkened 8 % / 16 % | `colorPrimary*`, `colorInfo*` (pinned after antd's algorithms, which would otherwise shift them in dark mode) |
| `label`, `label-2`, `label-3`, `placeholder` | `colorText`, `colorTextSecondary`, `colorTextTertiary`/`Quaternary`, `colorTextPlaceholder` |
| `grouped-bg`, `grouped-bg-2`, `bg-elevated` | `colorBgLayout`, `colorBgContainer`, `colorBgElevated` |
| `fill` … `fill-4`, `sep` | `colorFill*`, `colorBorderSecondary`, `colorSplit` |
| `control-border` (AA) / `sep-opaque` (Apple) | `colorBorder` |
| `focus-ring` | `controlOutline` (3 px) |
| `destructive-*`, `success-text`, `warning-text` | `colorError*`, `colorSuccessText`, `colorWarningText` |
| iOS / macOS type ramp | `fontSize`, `fontSizeHeading1–5`, `lineHeight` |
| Radii 8 / 12 / 20 / 26 / 32 | `borderRadius*`, `Card`, `Modal`, `Dropdown` |
| Switch 64×28, green "on" | `Switch` component tokens |
| Segmented capsule track | `Segmented` component tokens |
| Checkbox / radio: 22 px (touch) or 16 px boxes, visible outline | `controlInteractiveSize`, `Checkbox`, `Radio` |
| Path control colors | `Breadcrumb` |
| Disclosure rows | `Collapse` (use `ghost`) |
| Monogram avatar (AA-safe gray), red badge | `Avatar`, `Badge` (`on-destructive` text in AA) |
| Light help tag | `Tooltip` |
| Skeleton, page dots, table sort states, capsule tags | `Skeleton`, `Carousel`, `Table`, `Tag` |
| Glass banner and HUD capsule | `Notification`, `Message` + `antd-glass.css` |

### Which antd component for which HIG component

| HIG | Ant Design |
|---|---|
| Pop-up button (one exclusive choice) | `Select` |
| Pull-down button (actions) | `Dropdown` with a `Button` |
| Context menu | `Dropdown trigger={['contextMenu']}` — keep every item reachable elsewhere |
| Popover | `Popover` (switch to a bottom `Drawer` under 600 px) |
| Disclosure | `Collapse ghost expandIconPlacement="end"` (chevron on the trailing side; `expandIconPosition` before antd 6) |
| Scope bar / filter chips | `Segmented`, or `Radio.Group optionType="button"`; `Tag.CheckableTag` for independent filters |
| Path control | `Breadcrumb` with a chevron `separator` |
| Sidebar | `Layout.Sider` + `Menu` (`theme="light"`) |
| Page control | `Carousel` dots |
| HUD toast / notification banner | `message` / `notification` (from `App.useApp()`) |
| Empty state, loading | `Empty`, `Skeleton`, `Spin` |
| Table with alternating rows | `Table className="hig-striped"` |

## HIG rules antd won't enforce for you

- One `type="primary"` button per view (two at most). Use the default (gray) or `type="text"` buttons for everything else.
- Destructive actions use `danger` and are never the default button in a `Modal.confirm`. Use `okButtonProps={{ danger: true }}` with `autoFocusButton="cancel"`.
- Alert titles are specific ("Delete 3 Lessons?"), buttons are verbs, never "Yes/No".
- Prefer `Segmented` for 2–5 related views, a `Tabs` bar for app sections, and a `Drawer` placed at the bottom (`placement="bottom"`) as a sheet on phones.
- Keep `Form` labels visible; never rely on placeholders.
