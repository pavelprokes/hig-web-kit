# Captures the extended components and composes docs/screenshots/components.png.
# Run from the repo root with `python3 -m http.server 8765` serving it (see README.md in this folder).
import asyncio
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw

DEMO = 'http://127.0.0.1:8765/dist/demo.html'
RAW = 'docs/screenshots/raw/'

async def page_for(b, scheme, hash=''):
    ctx = await b.new_context(viewport={'width': 402, 'height': 874}, device_scale_factor=2, color_scheme=scheme, has_touch=True)
    p = await ctx.new_page()
    await p.goto(DEMO + hash)
    await p.wait_for_timeout(900)
    return p

async def scroll_to(p, sel, offset=-110):
    await p.evaluate(f"scrollTo(0, document.querySelector('{sel}').getBoundingClientRect().top + scrollY + {offset})")
    await p.wait_for_timeout(700)

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        # 1 Library, light, top
        p = await page_for(b, 'light')
        await p.click('#t-library'); await p.wait_for_timeout(700)
        await p.screenshot(path=RAW + 'lib-top.png'); await p.context.close()
        # 2 AA dark: progress, gauges, popover-adjacent section
        p = await page_for(b, 'dark', '#aa')
        await p.click('#t-library'); await p.wait_for_timeout(500)
        await scroll_to(p, '#featured', -40)
        await p.screenshot(path=RAW + 'lib-aa-dark.png'); await p.context.close()
        # 3 form controls, light
        p = await page_for(b, 'light')
        await p.click('#t-controls'); await p.wait_for_timeout(500)
        await scroll_to(p, '#cbBold', -230)
        await p.screenshot(path=RAW + 'forms.png'); await p.context.close()
        # 4 table + swipe + context menu, light
        p = await page_for(b, 'light')
        await p.click('#t-library'); await p.wait_for_timeout(500)
        await scroll_to(p, '.hig-table-wrap', -60)
        c = p.locator('.hig-swipe__content').first; bb = await c.bounding_box()
        await p.mouse.move(bb['x'] + bb['width'] - 30, bb['y'] + bb['height'] / 2); await p.mouse.down()
        for i in range(12): await p.mouse.move(bb['x'] + bb['width'] - 30 - i * 15, bb['y'] + bb['height'] / 2)
        await p.mouse.up(); await p.wait_for_timeout(700)
        await p.screenshot(path=RAW + 'lib-data.png'); await p.context.close()
        await b.close()

def compose(names, out, h=1100, gap=40, radius=40):
    shots = [Image.open(RAW + n).convert('RGBA') for n in names]
    shots = [s.resize((round(s.width * h / s.height), h), Image.LANCZOS) for s in shots]
    W = sum(s.width for s in shots) + gap * (len(shots) - 1)
    comp = Image.new('RGBA', (W, h), (0, 0, 0, 0)); x = 0
    for s in shots:
        m = Image.new('L', (s.width * 4, h * 4), 0)
        ImageDraw.Draw(m).rounded_rectangle([0, 0, s.width * 4 - 1, h * 4 - 1], radius=radius * 4, fill=255)
        s.putalpha(m.resize(s.size, Image.LANCZOS)); comp.alpha_composite(s, (x, 0)); x += s.width + gap
    comp.save(out)

asyncio.run(main())
compose(['lib-top.png', 'lib-aa-dark.png', 'forms.png', 'lib-data.png'], 'docs/screenshots/components.png')
