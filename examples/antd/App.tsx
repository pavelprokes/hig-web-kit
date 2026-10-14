// Ant Design + hig-web-kit: the theme follows light/dark, Increase Contrast and the AA mode switch live.
//
//   npm i antd hig-web-kit
//   main.tsx: import 'hig-web-kit/hig.css'; import 'hig-web-kit/glass.css'; import 'hig-web-kit/antd-glass.css';
import { useEffect, useState } from 'react';
import { App as AntApp, Button, Card, ConfigProvider, Form, Input, Segmented, Select, Space, Switch, Typography } from 'antd';
import { higAntd, type HigAntdOptions } from 'hig-web-kit/antd';
import { getPreferences, restorePreferences, setMode, watchPreferences, type HigPreferences } from 'hig-web-kit/a11y';

/** Re-renders whenever mode, color scheme or contrast changes (attributes or OS settings). */
export function useHigPreferences(): HigPreferences {
  const [prefs, setPrefs] = useState<HigPreferences>(() => (typeof document === 'undefined' ? getDefault() : restorePreferences()));
  useEffect(() => watchPreferences(setPrefs), []);
  return prefs;
}
const getDefault = (): HigPreferences => ({ mode: 'apple', scheme: 'light', contrast: 'standard', transparency: 'standard', motion: 'standard' });

export default function App() {
  const prefs = useHigPreferences();
  const options: HigAntdOptions = { mode: prefs.mode, scheme: prefs.scheme, contrast: prefs.contrast, density: 'touch' };

  return (
    <ConfigProvider {...higAntd(options)}>
      <AntApp>
        <main style={{ maxWidth: 640, margin: '0 auto', padding: 16, minHeight: '100vh' }}>
          <Typography.Title level={1}>Settings</Typography.Title>

          <Card title="Accessibility">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <label htmlFor="aa">WCAG 2.2 AA mode</label>
                <Switch id="aa" checked={prefs.mode === 'aa'} onChange={on => setMode(on ? 'aa' : 'apple')} />
              </Space>
              <Segmented block options={['Day', 'Week', 'Month', 'Year']} />
            </Space>
          </Card>

          <Card title="New Lesson" style={{ marginTop: 24 }}>
            <Form layout="vertical">
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Enter a lesson name.' }]}>
                <Input placeholder="Micro:bit traffic light" />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Enter an email address like name@example.com.' }]}>
                <Input placeholder="name@example.com" inputMode="email" autoComplete="email" />
              </Form.Item>
              <Form.Item label="Day" name="day" initialValue="thu">
                <Select options={[{ value: 'tue', label: 'Tuesday' }, { value: 'thu', label: 'Thursday' }, { value: 'sat', label: 'Saturday' }]} />
              </Form.Item>
              <Space>
                <Button>Cancel</Button>
                <Button type="primary" htmlType="submit">Save</Button>
              </Space>
            </Form>
          </Card>
        </main>
      </AntApp>
    </ConfigProvider>
  );
}
