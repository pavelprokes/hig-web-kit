import asyncio, sys
from playwright.async_api import async_playwright
DEMO = 'http://127.0.0.1:8765/dist/demo.html'
OUT = 'docs/screenshots/raw/'
async def page_for(b, scheme, w=402, h=874, hash=''):
    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, color_scheme=scheme, has_touch=True)
    p = await ctx.new_page()
    errs = []
    p.on('pageerror', lambda e: errs.append(str(e)))
    p.on('console', lambda m: m.type == 'error' and errs.append(m.text))
    await p.goto(DEMO + hash)
    await p.wait_for_timeout(900)
    return p, errs
async def tab(p, name):
    await p.click(f'#t-{name}')
    await p.wait_for_timeout(700)
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        allerr = []
        # 1 glass light / dark
        for scheme in ['light', 'dark']:
            p, e = await page_for(b, scheme); allerr += e
            await p.screenshot(path=OUT + f'glass-{scheme}.png')
            await p.mouse.wheel(0, 260); await p.wait_for_timeout(700)
            await p.screenshot(path=OUT + f'glass-scrolled-{scheme}.png')
            await p.context.close()
        # 2 controls apple vs aa (light)
        for mode, h in [('apple', ''), ('aa', '#aa')]:
            p, e = await page_for(b, 'light', hash=h); allerr += e
            await tab(p, 'controls')
            await p.screenshot(path=OUT + f'controls-{mode}.png')
            await p.context.close()
        # 3 controls dark aa
        p, e = await page_for(b, 'dark', hash='#aa'); allerr += e
        await tab(p, 'controls'); await p.screenshot(path=OUT + 'controls-aa-dark.png'); await p.context.close()
        # 4 settings contrast table apple vs aa
        for mode, h in [('apple', ''), ('aa', '#aa')]:
            p, e = await page_for(b, 'light', h=1100, hash=h); allerr += e
            await tab(p, 'settings')
            await p.screenshot(path=OUT + f'contrast-{mode}.png')
            await p.context.close()
        # 5 sheet, menu, alert
        p, e = await page_for(b, 'light'); allerr += e
        await tab(p, 'controls')
        await p.locator('[aria-controls="sortMenu"]').scroll_into_view_if_needed()
        await p.click('[aria-controls="sortMenu"]'); await p.wait_for_timeout(700)
        await p.screenshot(path=OUT + 'menu.png')
        await p.keyboard.press('Escape'); await p.wait_for_timeout(300)
        await p.click('[data-hig-open="sheet"]'); await p.wait_for_timeout(900)
        await p.screenshot(path=OUT + 'sheet.png')
        await p.click('#sheet [data-hig-close]'); await p.wait_for_timeout(600)
        await p.click('button.hig-btn--destructive[data-hig-open="alert"]'); await p.wait_for_timeout(700)
        await p.screenshot(path=OUT + 'alert.png')
        await p.context.close()
        # 6 desktop wide
        p, e = await page_for(b, 'dark', w=1280, h=800); allerr += e
        await p.screenshot(path=OUT + 'desktop-dark.png'); await p.context.close()
        print('ERRORS:', allerr)
        await b.close()
asyncio.run(main())
