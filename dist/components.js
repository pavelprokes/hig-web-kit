/*! hig-web-kit v0.1.0 | MIT | Not affiliated with Apple Inc. | Generated from tokens/tokens.json — do not edit */
// Behaviour for the framework-free components in components.css. Markup contracts:
//   <button class="hig-switch" role="switch" aria-checked="false"><span class="hig-switch__thumb"></span></button>
//   <div class="hig-segmented" role="radiogroup"><span class="hig-segmented__thumb"></span><button role="radio" aria-checked="true">…</button>…</div>
//   <div class="hig-tabbar" role="tablist"><span class="hig-tabbar__lens"></span><button class="hig-tab" role="tab" aria-selected aria-controls="panel-id">…</button>…</div>
//   <button aria-haspopup="menu" aria-controls="menu-id" aria-expanded="false"> + <div class="hig-menu" role="menu" id="menu-id" hidden>…</div>
//   <button data-hig-open="dialog-id"> + <dialog class="hig-sheet|hig-alert|hig-action-sheet" id="dialog-id">… <button data-hig-close>
//   <input type="range" class="hig-slider">  ·  <div class="hig-input"><input><button class="hig-input__clear" hidden></div>
//
//   import { initComponents } from 'hig-web-kit/components';
//   initComponents();   // idempotent per element; returns a cleanup function

const reduceMotion = () =>
  document.documentElement.getAttribute('data-hig-motion') === 'reduce' ||
  (document.documentElement.getAttribute('data-hig-motion') !== 'standard' && matchMedia('(prefers-reduced-motion: reduce)').matches);

function initSwitch(sw) {
  const down = () => sw.classList.add('is-pressed');
  const up = () => sw.classList.remove('is-pressed');
  const click = () => {
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', String(on));
    sw.dispatchEvent(new CustomEvent('hig:change', { bubbles: true, detail: { checked: on } }));
  };
  sw.addEventListener('pointerdown', down);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(e => sw.addEventListener(e, up));
  sw.addEventListener('click', click);
  return () => { sw.removeEventListener('pointerdown', down); sw.removeEventListener('click', click); };
}

export function layoutSegmented(seg) {
  const thumb = seg.querySelector('.hig-segmented__thumb');
  const sel = [...seg.querySelectorAll(':scope > button')].find(b => b.getAttribute('aria-checked') === 'true' || b.getAttribute('aria-selected') === 'true');
  if (!thumb || !sel || !sel.offsetWidth) return;
  thumb.style.width = `${sel.offsetWidth}px`;
  thumb.style.translate = `${sel.offsetLeft - 3}px 0`;
}

function initSegmented(seg) {
  const btns = [...seg.querySelectorAll(':scope > button')];
  const attr = btns[0]?.getAttribute('role') === 'tab' ? 'aria-selected' : 'aria-checked';
  const select = b => {
    btns.forEach(x => { x.setAttribute(attr, String(x === b)); x.tabIndex = x === b ? 0 : -1; });
    layoutSegmented(seg);
    seg.dispatchEvent(new CustomEvent('hig:change', { bubbles: true, detail: { value: b.value || b.textContent.trim(), index: btns.indexOf(b) } }));
  };
  btns.forEach((b, i) => {
    b.tabIndex = b.getAttribute(attr) === 'true' ? 0 : -1;
    b.addEventListener('click', () => select(b));
    b.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const rtl = getComputedStyle(seg).direction === 'rtl' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ? -1 : 1;
      const n = btns[(i + d * rtl + btns.length) % btns.length];
      n.focus(); select(n);
    });
  });
  const ro = new ResizeObserver(() => layoutSegmented(seg));
  ro.observe(seg);
  layoutSegmented(seg);
  return () => ro.disconnect();
}

export function layoutTabbar(bar) {
  const lens = bar.querySelector('.hig-tabbar__lens');
  const sel = bar.querySelector('.hig-tab[aria-selected="true"]');
  if (!lens || !sel) return;
  lens.style.translate = `${sel.offsetLeft - 4}px 0`;
  lens.style.width = `${sel.offsetWidth}px`;
}

function initTabbar(bar) {
  const tabs = [...bar.querySelectorAll('.hig-tab')];
  const dock = bar.closest('.hig-tabdock');
  const select = t => {
    if (dock?.classList.contains('is-minimized') && t.getAttribute('aria-selected') === 'true') { dock.classList.remove('is-minimized'); return; }
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = x.getAttribute('aria-controls') && document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    dock?.classList.remove('is-minimized');
    layoutTabbar(bar);
    bar.dispatchEvent(new CustomEvent('hig:change', { bubbles: true, detail: { tab: t, index: tabs.indexOf(t) } }));
  };
  tabs.forEach((t, i) => {
    t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); select(n);
    });
  });
  const ro = new ResizeObserver(() => layoutTabbar(bar));
  ro.observe(bar);
  layoutTabbar(bar);
  return () => ro.disconnect();
}

function initMenu(trigger) {
  const menu = document.getElementById(trigger.getAttribute('aria-controls'));
  if (!menu) return () => {};
  const items = () => [...menu.querySelectorAll('[role^="menuitem"]:not(:disabled)')];
  const close = (focus = true) => {
    menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
    if (focus) trigger.focus();
  };
  const open = () => {
    menu.hidden = false;
    menu.classList.remove('hig-glass-enter'); void menu.offsetWidth; menu.classList.add('hig-glass-enter');
    trigger.setAttribute('aria-expanded', 'true');
    items()[0]?.focus();
  };
  const onTrigger = e => { e.stopPropagation(); menu.hidden ? open() : close(); };
  const onDoc = e => { if (!menu.hidden && !menu.contains(e.target) && e.target !== trigger) close(false); };
  const onKey = e => {
    const list = items(), i = list.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); list[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); list[list.length - 1]?.focus(); }
    else if (e.key === 'Tab') close(false);
  };
  const onPick = e => {
    const item = e.target.closest('[role^="menuitem"]');
    if (!item || item.disabled) return;
    if (item.getAttribute('role') === 'menuitemradio') {
      menu.querySelectorAll('[role="menuitemradio"]').forEach(x => x.setAttribute('aria-checked', String(x === item)));
    } else if (item.getAttribute('role') === 'menuitemcheckbox') {
      item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
    }
    menu.dispatchEvent(new CustomEvent('hig:select', { bubbles: true, detail: { item } }));
    close();
  };
  trigger.addEventListener('click', onTrigger);
  document.addEventListener('click', onDoc);
  menu.addEventListener('keydown', onKey);
  menu.addEventListener('click', onPick);
  return () => { trigger.removeEventListener('click', onTrigger); document.removeEventListener('click', onDoc); menu.removeEventListener('keydown', onKey); menu.removeEventListener('click', onPick); };
}

/** Open a hig dialog (sheet / alert / action sheet) as a modal. */
export function openDialog(d) {
  if (typeof d === 'string') d = document.getElementById(d);
  if (!d || d.open) return;
  d.classList.remove('is-closing', 'is-large');
  d.showModal();
}

/** Close with the exit animation (sheets slide down the way they came in). */
export function closeDialog(d) {
  if (typeof d === 'string') d = document.getElementById(d);
  if (!d?.open) return;
  if (d.classList.contains('hig-alert') || reduceMotion()) { d.close(); return; }
  d.classList.add('is-closing');
  d.addEventListener('animationend', () => { d.classList.remove('is-closing'); d.close(); }, { once: true });
}

function initDialog(d) {
  const onClick = e => {
    if (e.target.closest('[data-hig-close]')) { closeDialog(d); return; }
    if (e.target.closest('.hig-sheet__grabber')) { d.classList.toggle('is-large'); return; }
    // backdrop tap closes sheets/action sheets (not alerts) — only when outside the dialog box
    if (e.target === d && !d.classList.contains('hig-alert')) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(d);
    }
  };
  const onCancel = e => { e.preventDefault(); closeDialog(d); };
  d.addEventListener('click', onClick);
  d.addEventListener('cancel', onCancel);
  return () => { d.removeEventListener('click', onClick); d.removeEventListener('cancel', onCancel); };
}

function initSlider(s) {
  const fill = () => {
    const p = ((s.value - (s.min || 0)) / ((s.max || 100) - (s.min || 0))) * 100;
    s.style.setProperty('--p', `${p}%`);
    if (s.dataset.higUnit) s.setAttribute('aria-valuetext', `${s.value} ${s.dataset.higUnit}`);
  };
  s.addEventListener('input', fill);
  fill();
  return () => s.removeEventListener('input', fill);
}

function initClearable(wrap) {
  const input = wrap.querySelector('input'), btn = wrap.querySelector('.hig-input__clear');
  if (!input || !btn) return () => {};
  const sync = () => { btn.hidden = !input.value; };
  const clear = () => { input.value = ''; sync(); input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); };
  input.addEventListener('input', sync); btn.addEventListener('click', clear);
  sync();
  return () => { input.removeEventListener('input', sync); btn.removeEventListener('click', clear); };
}

const done = new WeakSet();
/** Wire up every component under `root`. Safe to call again after adding markup. */
export function initComponents(root = document) {
  const cleanups = [];
  const each = (sel, fn) => root.querySelectorAll(sel).forEach(el => { if (done.has(el)) return; done.add(el); cleanups.push(fn(el)); });
  each('.hig-switch', initSwitch);
  each('.hig-segmented', initSegmented);
  each('.hig-tabbar', initTabbar);
  each('[aria-haspopup="menu"][aria-controls]', initMenu);
  each('dialog.hig-sheet, dialog.hig-alert, dialog.hig-action-sheet', initDialog);
  each('input.hig-slider', initSlider);
  each('.hig-input', initClearable);
  const onOpen = e => {
    const t = e.target.closest?.('[data-hig-open]');
    if (t) openDialog(t.getAttribute('data-hig-open'));
  };
  if (!done.has(root)) { done.add(root); root.addEventListener('click', onOpen); cleanups.push(() => root.removeEventListener('click', onOpen)); }
  return () => cleanups.forEach(f => f && f());
}
