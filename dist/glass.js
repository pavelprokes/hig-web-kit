/*! hig-web-kit v0.2.0 | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */
// Liquid Glass behaviours that CSS alone can't do:
//  • edge refraction (SVG displacement inside backdrop-filter — Chromium only, enabled by engine detection)
//  • illumination from the touch point, spreading to sibling glass in the same group
//  • light/dark adaptivity of small glass over [data-hig-tone="dark"] content
//  • scrolled state (for the scroll edge effect + large-title collapse) and tab bar minimize-on-scroll
//
//   import { initGlass } from 'hig-web-kit/glass';
//   const stop = initGlass();          // call once after the DOM is ready; returns a cleanup function

const SVG_NS = 'http://www.w3.org/2000/svg';

/** True in Chromium-based browsers — the only engine that renders backdrop-filter: url(#svg). */
export function supportsRefraction() {
  if (typeof navigator === 'undefined') return false;
  const brands = navigator.userAgentData?.brands || [];
  return brands.some(b => /Chromium/.test(b.brand));
}

/** Edge-lens displacement map: pixels near the rim shift inward along the edge normal; the centre stays flat. */
export function lensMap(w, h, r, bezel) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h), d = img.data;
  const sdf = (x, y) => {
    const qx = Math.abs(x - w / 2) - (w / 2 - r), qy = Math.abs(y - h / 2) - (h / 2 - r);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dist = -sdf(x + 0.5, y + 0.5);
    let dx = 0, dy = 0;
    if (dist > 0 && dist < bezel) {
      const nx = sdf(x + 1, y) - sdf(x - 1, y), ny = sdf(x, y + 1) - sdf(x, y - 1), len = Math.hypot(nx, ny) || 1;
      const mag = Math.pow(1 - dist / bezel, 2.2);
      dx = (-nx / len) * mag; dy = (-ny / len) * mag;
    }
    const i = (y * w + x) * 4;
    d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

let filterHost = null, filterSeq = 0;
function host() {
  if (filterHost?.isConnected) return filterHost;
  filterHost = document.createElementNS(SVG_NS, 'svg');
  filterHost.setAttribute('width', '0'); filterHost.setAttribute('height', '0');
  filterHost.setAttribute('aria-hidden', 'true');
  filterHost.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
  document.body.appendChild(filterHost);
  return filterHost;
}

/** Give one element real edge refraction. Tested defaults: bezel = clamp(8, .32·h, 22) px, scale = 1.1·bezel. */
export function attachRefraction(el, { strength = 1.1 } = {}) {
  const id = `hig-lens-${++filterSeq}`;
  const f = document.createElementNS(SVG_NS, 'filter');
  f.setAttribute('id', id); f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
  const im = document.createElementNS(SVG_NS, 'feImage');
  im.setAttribute('result', 'map'); im.setAttribute('preserveAspectRatio', 'none');
  const dm = document.createElementNS(SVG_NS, 'feDisplacementMap');
  dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'map');
  dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
  f.append(im, dm); host().append(f);
  const build = () => {
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    if (!w || !h) return;
    const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, h / 2, w / 2);
    const bezel = Math.max(8, Math.min(h * 0.32, 22));
    for (const [k, v] of [['x', 0], ['y', 0], ['width', w], ['height', h]]) { f.setAttribute(k, v); im.setAttribute(k, v); }
    im.setAttribute('href', lensMap(w, h, r, bezel));
    dm.setAttribute('scale', String(Math.round(bezel * strength)));
  };
  build();
  const ro = new ResizeObserver(build); ro.observe(el);
  el.style.setProperty('--hig-refract', `url(#${id})`);
  return () => { ro.disconnect(); f.remove(); el.style.removeProperty('--hig-refract'); };
}

/** Press light: glow from the pointer position; neighbours in the same group light up softly. */
function onPointerDown(e) {
  const g = e.target.closest?.('.hig-glass');
  if (!g || g.matches('dialog')) return;
  const r = g.getBoundingClientRect();
  g.style.setProperty('--hig-mx', `${e.clientX - r.left}px`);
  g.style.setProperty('--hig-my', `${e.clientY - r.top}px`);
  g.classList.add('is-pressed');
  const sibs = g.parentElement ? [...g.parentElement.children].filter(n => n !== g && n.classList.contains('hig-glass')) : [];
  sibs.forEach(n => n.classList.add('is-lit'));
  const up = () => {
    g.classList.remove('is-pressed'); sibs.forEach(n => n.classList.remove('is-lit'));
    removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
  };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
}

/** Flip [data-hig-adapt] glass to its dark style when it sits over [data-hig-tone="dark"] content. */
export function adaptGlass(root = document) {
  root.querySelectorAll('[data-hig-adapt]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    const dark = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .some(n => n !== el && !el.contains(n) && n.closest?.('[data-hig-tone="dark"]'));
    el.classList.toggle('hig-glass--on-dark', dark);
  });
  document.querySelectorAll('.hig-scroll-edge').forEach(edge => {
    const r = edge.getBoundingClientRect();
    const y = edge.classList.contains('hig-scroll-edge--bottom') ? r.bottom - 10 : r.top + 10;
    const dark = document.elementsFromPoint(innerWidth / 2, Math.max(0, Math.min(innerHeight - 1, y)))
      .some(n => n.closest?.('[data-hig-tone="dark"]'));
    edge.classList.toggle('is-on-dark', dark);
  });
}

/**
 * Set data-hig-scrolled on <html> once `sentinel` (usually the large title) scrolls under the floating bar.
 * Drives .hig-scroll-edge and .hig-inline-title.
 */
export function observeScrolled(sentinel, { barHeight = 56 } = {}) {
  if (!sentinel) return () => {};
  const io = new IntersectionObserver(([en]) => {
    document.documentElement.toggleAttribute('data-hig-scrolled', !en.isIntersecting);
  }, { rootMargin: `-${barHeight}px 0px 0px 0px` });
  io.observe(sentinel);
  return () => io.disconnect();
}

/** Tab bar minimize on scroll: adds .is-minimized to `dock` when scrolling down, removes it when scrolling up. */
export function minimizeOnScroll(dock, { threshold = 8, top = 40 } = {}) {
  if (!dock) return () => {};
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY, dy = y - lastY;
      if (y < top) dock.classList.remove('is-minimized');
      else if (dy > threshold) dock.classList.add('is-minimized');
      else if (dy < -threshold) dock.classList.remove('is-minimized');
      lastY = y; ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  return () => removeEventListener('scroll', onScroll);
}

/**
 * Wire up everything. Options:
 *   refraction: 'auto' (Chromium only) | true | false — applies to [data-hig-refract] elements
 *   press: true — touch-point illumination on .hig-glass
 *   adapt: true — light/dark flip of [data-hig-adapt] on scroll and resize
 */
export function initGlass({ root = document, refraction = 'auto', press = true, adapt = true } = {}) {
  const cleanups = [];
  const refract = refraction === 'auto' ? supportsRefraction() : !!refraction;
  document.documentElement.classList.toggle('hig-refract', refract);
  if (refract) root.querySelectorAll('[data-hig-refract]').forEach(el => cleanups.push(attachRefraction(el)));
  if (press) { document.addEventListener('pointerdown', onPointerDown); cleanups.push(() => document.removeEventListener('pointerdown', onPointerDown)); }
  if (adapt) {
    let pending = false;
    const run = () => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; adaptGlass(root); }); };
    addEventListener('scroll', run, { passive: true }); addEventListener('resize', run);
    run();
    cleanups.push(() => { removeEventListener('scroll', run); removeEventListener('resize', run); });
  }
  return () => cleanups.forEach(f => f());
}
