// Ant Design + hig-web-kit: the theme follows light/dark, Increase Contrast and the AA mode switch live.
//
//   npm i antd hig-web-kit
//   main.tsx: import 'hig-web-kit/hig.css'; import 'hig-web-kit/glass.css'; import 'hig-web-kit/antd-glass.css';
import { useEffect, useState } from 'react';
import { App as AntApp, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Collapse, ConfigProvider, Empty, Form, Input, Popover, Radio, Segmented, Select, Skeleton, Space, Switch, Table, Tag, Tooltip, Typography } from 'antd';
import { higAntd, type HigAntdOptions } from 'hig-web-kit/antd';
import { getPreferences, restorePreferences, setMode, watchPreferences, type HigPreferences } from 'hig-web-kit/a11y';
import { getTheme, listThemes, restoreTheme, setTheme } from 'hig-web-kit/theme';

/** Re-renders whenever mode, color scheme or contrast changes (attributes or OS settings). */
export function useHigPreferences(): HigPreferences {
  const [prefs, setPrefs] = useState<HigPreferences>(() => (typeof document === 'undefined' ? getDefault() : restorePreferences()));
  useEffect(() => watchPreferences(setPrefs), []);
  return prefs;
}
const getDefault = (): HigPreferences => ({ mode: 'apple', scheme: 'light', contrast: 'standard', transparency: 'standard', motion: 'standard' });

export default function App() {
  const prefs = useHigPreferences();
  // the same accent theme drives hig.css (data-hig-theme) and the antd tokens
  const [accent, setAccent] = useState<string | null>(() => (typeof document === 'undefined' ? null : restoreTheme()));
  const chooseAccent = (name: string) => { setTheme(name || null); setAccent(getTheme()); };
  const options: HigAntdOptions = { mode: prefs.mode, scheme: prefs.scheme, contrast: prefs.contrast, density: 'touch', accent: accent ?? undefined };

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
              <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                <label htmlFor="accent">Accent color</label>
                <Select id="accent" style={{ minWidth: 200 }} value={accent ?? ''} onChange={chooseAccent}
                  options={[{ value: '', label: 'Blue (system)' }, ...listThemes().map(t => ({ value: t.name, label: t.label }))]} />
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

          <Library />
        </main>
      </AntApp>
    </ConfigProvider>
  );
}

const students = [
  { key: 1, name: 'Adam', course: 'Robotics', score: 94 },
  { key: 2, name: 'Bára', course: 'Python', score: 88 },
  { key: 3, name: 'Eliška', course: '3D Printing', score: 97 },
];

/** The extended components: everything here picks up the HIG theme from higAntd(). */
function Library() {
  const { message, notification } = AntApp.useApp();
  const [loading, setLoading] = useState(false);
  return (
    <Card title="Library" style={{ marginTop: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Breadcrumb separator="›" items={[{ title: <a href="#courses">Courses</a> }, { title: <a href="#robotics">Robotics</a> }, { title: 'Traffic Light' }]} />
        <Checkbox.Group options={['Bold', 'Italic', 'Underline']} defaultValue={['Bold']} />
        <Radio.Group options={['Beginner', 'Intermediate', 'Advanced']} defaultValue="Beginner" />
        <Space wrap>
          <Tag>Robotics</Tag><Tag>Python</Tag>
          <Badge count={3}><Avatar>PP</Avatar></Badge>
          <Avatar.Group><Avatar>AD</Avatar><Avatar>BA</Avatar><Avatar>EL</Avatar></Avatar.Group>
        </Space>
        <Space wrap>
          <Popover title="Traffic Light" content="Thursday 16:30 · Room 2" trigger="click"><Button>Lesson Info</Button></Popover>
          <Tooltip title="Copies the lesson link"><Button>Copy Link</Button></Tooltip>
          <Button onClick={() => message.success('Added to Library')}>Add to Library</Button>
          <Button onClick={() => notification.info({ message: 'Lesson starts in 15 minutes', description: 'Robotics · Room 2' })}>Notify</Button>
        </Space>
        <Collapse ghost expandIconPlacement="end" items={[{ key: 'm', label: 'Materials', children: 'micro:bit, 3 LEDs, breadboard.' }]} />
        <Table className="hig-striped" size="middle" pagination={false} dataSource={students}
          columns={[
            { title: 'Student', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
            { title: 'Course', dataIndex: 'course' },
            { title: 'Score', dataIndex: 'score', align: 'right', sorter: (a, b) => a.score - b.score },
          ]} />
        {loading ? <Skeleton avatar active paragraph={{ rows: 2 }} />
          : <Empty description="No homework yet"><Button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>Check Again</Button></Empty>}
      </Space>
    </Card>
  );
}
