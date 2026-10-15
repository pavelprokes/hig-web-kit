# Captures the accent-theme screenshot (docs/screenshots/themes.png). Serve the repo root on :8765 first.
import asyncio
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw

DEMO = 'http://127.0.0.1:8765/dist/demo.html'
RAW = 'docs/screenshots/raw/'

async def shot(b, scheme, hash, tab, head, out, offset=-90):
    ctx = await b.new_context(viewport={'width': 402, 'height': 874}, device_scale_factor=2, color_scheme=scheme, has_touch=True)
    p = await ctx.new_page()
    await p.goto(DEMO + hash); await p.wait_for_timeout(800)
    await p.click(f'#t-{tab}'); await p.wait_for_timeout(600)
    if head:
        await p.evaluate(f"scrollTo(0, [...document.querySelectorAll('.hig-section-head')].find(e => e.textContent === '{head}').getBoundingClientRect().top + scrollY + {offset})")
        await p.wait_for_timeout(700)
    await p.screenshot(path=RAW + out); await ctx.close()

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        await shot(b, 'light', '#theme=vzb', 'library', 'Progress', 'th-progress.png')
        await shot(b, 'dark', '#aa-theme=vzb', 'library', 'Gauges and ratings', 'th-gauges-aa-dark.png')
        await shot(b, 'light', '#theme=vzb', 'controls', None, 'th-controls.png')
        await shot(b, 'dark', '#aa-theme=vzb', 'settings', 'Accent color', 'th-settings-aa-dark.png', -330)
        await b.close()

def compose(names, out, h=1100, gap=40, radius=40):
    shots = [Image.open(RAW + n).convert('RGBA') for n in names]
    shots = [s.resize((round(s.width * h / s.height), h), Image.LANCZOS) for s in shots]
    comp = Image.new('RGBA', (sum(s.width for s in shots) + gap * (len(shots) - 1), h), (0, 0, 0, 0)); x = 0
    for s in shots:
        m = Image.new('L', (s.width * 4, h * 4), 0)
        ImageDraw.Draw(m).rounded_rectangle([0, 0, s.width * 4 - 1, h * 4 - 1], radius=radius * 4, fill=255)
        s.putalpha(m.resize(s.size, Image.LANCZOS)); comp.alpha_composite(s, (x, 0)); x += s.width + gap
    comp.save(out)

asyncio.run(main())
compose(['th-progress.png', 'th-gauges-aa-dark.png', 'th-controls.png', 'th-settings-aa-dark.png'], 'docs/screenshots/themes.png')
