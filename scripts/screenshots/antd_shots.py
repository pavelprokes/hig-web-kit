import asyncio
from playwright.async_api import async_playwright
URL = 'http://127.0.0.1:8765/examples/antd/index.html'
OUT = 'docs/screenshots/raw/'
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        errs = []
        for name, scheme, h in [('antd-light', 'light', ''), ('antd-dark', 'dark', ''), ('antd-aa', 'light', '#aa'), ('antd-aa-dark', 'dark', '#aa')]:
            ctx = await b.new_context(viewport={'width': 430, 'height': 932}, device_scale_factor=2, color_scheme=scheme)
            p = await ctx.new_page()
            p.on('pageerror', lambda e: errs.append(str(e)))
            p.on('console', lambda m: m.type == 'error' and errs.append(m.text))
            await p.goto(URL + h); await p.wait_for_timeout(1200)
            await p.screenshot(path=OUT + name + '.png')
            if name in ('antd-light', 'antd-aa'):
                await p.click('.ant-select'); await p.wait_for_timeout(600)
                await p.screenshot(path=OUT + name + '-select.png')
            await ctx.close()
        print('ERRORS:', errs)
        await b.close()
asyncio.run(main())
