// Behaviour for the framework-free components in components.css. Markup contracts:
//   <button class="hig-switch" role="switch" aria-checked="false"><span class="hig-switch__thumb"></span></button>
//   <div class="hig-segmented" role="radiogroup"><span class="hig-segmented__thumb"></span><button role="radio" aria-checked="true">…</button>…</div>
//   <div class="hig-tabbar" role="tablist"><span class="hig-tabbar__lens"></span><button class="hig-tab" role="tab" aria-selected aria-controls="panel-id">…</button>…</div>
//   <button aria-haspopup="menu" aria-controls="menu-id" aria-expanded="false"> + <div class="hig-menu" role="menu" id="menu-id" hidden>…</div>
//   <button data-hig-open="dialog-id"> + <dialog class="hig-sheet|hig-alert|hig-action-sheet" id="dialog-id">… <button data-hig-close>
//   <input type="range" class="hig-slider">  ·  <div class="hig-input"><input><button class="hig-input__clear" hidden></div>
//   v0.2: pop-up buttons ([data-hig-popup]), parent checkboxes (aria-controls), toggle chips ([aria-pressed]),
//   scope bars (.hig-scope), token fields ([data-hig-tokens]), page controls ([data-hig-pager]), popovers
//   (.hig-popover[popover]), tooltips ([data-hig-tooltip]), sortable tables (.hig-table), swipe rows (.hig-swipe),
//   context menus ([data-hig-contextmenu]) and showToast().
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

// Arrow keys, Home/End, Esc and Tab inside an open menu (shared by menus and context menus).
function menuKeys(e, list, close) {
  const i = list.indexOf(document.activeElement);
  if (e.key === 'Escape') { e.preventDefault(); close(); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length]?.focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus(); }
  else if (e.key === 'Home') { e.preventDefault(); list[0]?.focus(); }
  else if (e.key === 'End') { e.preventDefault(); list[list.length - 1]?.focus(); }
  else if (e.key === 'Tab') close(false);
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
  const onKey = e => menuKeys(e, items(), close);
  const onPick = e => {
    const item = e.target.closest('[role^="menuitem"]');
    if (!item || item.disabled) return;
    if (item.getAttribute('role') === 'menuitemradio') {
      menu.querySelectorAll('[role="menuitemradio"]').forEach(x => x.setAttribute('aria-checked', String(x === item)));
    } else if (item.getAttribute('role') === 'menuitemcheckbox') {
      item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
    }
    if (trigger.hasAttribute('data-hig-popup') && item.getAttribute('role') === 'menuitemradio') {
      const value = trigger.querySelector('.hig-popup__value');
      if (value) value.textContent = (item.querySelector('.hig-menu__label') || item).textContent.trim();
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


// ── Checkboxes: indeterminate from markup, parent ↔ children (HIG: a parent shows "mixed" when children differ)
function initCheckbox(box) {
  if (box.hasAttribute('data-hig-indeterminate')) box.indeterminate = true;
  const ids = box.getAttribute('aria-controls');
  if (!ids) return;
  const kids = () => ids.split(/\s+/).map(id => document.getElementById(id)).filter(Boolean);
  const sync = () => {
    const k = kids(), on = k.filter(x => x.checked).length;
    box.checked = on === k.length; box.indeterminate = on > 0 && on < k.length;
  };
  const onParent = () => { kids().forEach(x => { x.checked = box.checked; }); box.indeterminate = false; };
  const onKid = e => { if (kids().includes(e.target)) sync(); };
  box.addEventListener('change', onParent);
  document.addEventListener('change', onKid);
  sync();
  return () => { box.removeEventListener('change', onParent); document.removeEventListener('change', onKid); };
}

// ── Toggle buttons and filter chips
function initToggle(btn) {
  const click = () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    btn.dispatchEvent(new CustomEvent('hig:change', { bubbles: true, detail: { pressed: on } }));
  };
  btn.addEventListener('click', click);
  return () => btn.removeEventListener('click', click);
}

// ── Token field: comma or Return makes a token, Backspace on an empty input removes the last one
function initTokens(field) {
  const input = field.querySelector('input');
  if (!input) return;
  const label = field.getAttribute('data-hig-tokens-label') || 'Remove';
  const values = () => [...field.querySelectorAll('.hig-token')].map(t => t.firstChild.textContent.trim());
  const emit = () => field.dispatchEvent(new CustomEvent('hig:change', { bubbles: true, detail: { tokens: values() } }));
  const add = text => {
    const v = text.trim();
    if (!v || values().includes(v)) return;
    const t = document.createElement('span'); t.className = 'hig-token';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'hig-token__remove'; b.setAttribute('aria-label', `${label} ${v}`);
    t.append(document.createTextNode(v), b);
    field.insertBefore(t, input);
  };
  const commit = () => { input.value.split(',').forEach(add); input.value = ''; emit(); };
  const onKey = e => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) { e.preventDefault(); commit(); }
    else if (e.key === 'Backspace' && !input.value) { const last = field.querySelector('.hig-token:last-of-type'); if (last) { last.remove(); emit(); } }
  };
  const onClick = e => {
    const rm = e.target.closest('.hig-token__remove');
    if (rm) { rm.parentElement.remove(); emit(); input.focus(); }
    else if (e.target === field) input.focus();
  };
  const onBlur = () => { if (input.value.trim()) commit(); };
  input.addEventListener('keydown', onKey); field.addEventListener('click', onClick); input.addEventListener('blur', onBlur);
  return () => { input.removeEventListener('keydown', onKey); field.removeEventListener('click', onClick); input.removeEventListener('blur', onBlur); };
}

// ── Page control bound to a scroll-snap pager
function initPageControl(ctrl) {
  const pager = document.getElementById(ctrl.getAttribute('data-hig-pager'));
  if (!pager) return;
  const pages = [...pager.children];
  const label = ctrl.getAttribute('data-hig-page-label') || 'Page';
  ctrl.replaceChildren(...pages.map((_, i) => {
    const b = document.createElement('button'); b.type = 'button';
    b.setAttribute('aria-label', `${label} ${i + 1} / ${pages.length}`);
    b.addEventListener('click', () => go(i));
    return b;
  }));
  const dots = [...ctrl.children];
  const current = () => Math.round(pager.scrollLeft / Math.max(1, pager.clientWidth)) * (getComputedStyle(pager).direction === 'rtl' ? -1 : 1);
  const mark = () => { const c = current(); dots.forEach((d, i) => d.setAttribute('aria-current', String(i === c))); };
  const go = i => { pager.scrollTo({ left: pages[i].offsetLeft - pager.offsetLeft, behavior: reduceMotion() ? 'auto' : 'smooth' }); };
  const onKey = e => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault(); go(Math.max(0, Math.min(pages.length - 1, current() + d)));
  };
  pager.addEventListener('scroll', mark, { passive: true });
  pager.addEventListener('keydown', onKey);
  mark();
  return () => { pager.removeEventListener('scroll', mark); pager.removeEventListener('keydown', onKey); };
}

// ── Popover: anchor below (or above) its invoker with the arrow pointing at it; a bottom sheet under 600 px
function placePopover(pop, anchor) {
  if (!anchor || matchMedia('(max-width: 599px)').matches) { pop.style.left = pop.style.top = ''; return; }
  const a = anchor.getBoundingClientRect(), p = pop.getBoundingClientRect(), gap = 12, m = 8;
  const below = a.bottom + gap + p.height <= innerHeight - m || a.top - gap - p.height < m;
  const left = Math.max(m, Math.min(a.left + a.width / 2 - p.width / 2, innerWidth - p.width - m));
  pop.style.left = `${left}px`;
  pop.style.top = `${below ? a.bottom + gap : a.top - gap - p.height}px`;
  pop.classList.toggle('is-above', !below);
  pop.style.setProperty('--arrow-x', `${Math.max(20, Math.min(a.left + a.width / 2 - left, p.width - 20))}px`);
}
function initPopover(pop) {
  const anchor = () => document.querySelector(`[popovertarget="${CSS.escape(pop.id)}"]`);
  const place = () => placePopover(pop, anchor());
  const onToggle = e => {
    if (e.newState === 'open') { place(); addEventListener('resize', place); addEventListener('scroll', place, true); }
    else { removeEventListener('resize', place); removeEventListener('scroll', place, true); }
  };
  pop.addEventListener('toggle', onToggle);
  return () => pop.removeEventListener('toggle', onToggle);
}

// ── Tooltip / help tag: hover (after a delay) or focus; Esc dismisses; the pointer can move onto it (WCAG 1.4.13)
let tipSeq = 0;
function initTooltip(el) {
  const tip = document.createElement('div');
  tip.className = 'hig-tooltip'; tip.setAttribute('role', 'tooltip'); tip.id = `hig-tip-${++tipSeq}`; tip.hidden = true;
  tip.textContent = el.getAttribute('data-hig-tooltip');
  document.body.append(tip);
  el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), tip.id].filter(Boolean).join(' '));
  let timer;
  const show = delay => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      tip.hidden = false;
      const a = el.getBoundingClientRect(), t = tip.getBoundingClientRect();
      const top = a.top - t.height - 8 < 8 ? a.bottom + 8 : a.top - t.height - 8;
      tip.style.left = `${Math.max(8, Math.min(a.left + a.width / 2 - t.width / 2, innerWidth - t.width - 8))}px`;
      tip.style.top = `${top}px`;
    }, delay);
  };
  const hide = () => { clearTimeout(timer); timer = setTimeout(() => { tip.hidden = true; }, 120); };
  const onEnter = e => { if (e.pointerType === 'mouse') show(500); };
  const onFocus = () => { if (el.matches(':focus-visible')) show(0); };
  const onKey = e => { if (e.key === 'Escape' && !tip.hidden) { clearTimeout(timer); tip.hidden = true; } };
  const keep = () => clearTimeout(timer);
  el.addEventListener('pointerenter', onEnter); el.addEventListener('pointerleave', hide);
  el.addEventListener('focus', onFocus); el.addEventListener('blur', hide);
  tip.addEventListener('pointerenter', keep); tip.addEventListener('pointerleave', hide);
  document.addEventListener('keydown', onKey);
  return () => { tip.remove(); document.removeEventListener('keydown', onKey); el.removeEventListener('pointerenter', onEnter); el.removeEventListener('pointerleave', hide); el.removeEventListener('focus', onFocus); el.removeEventListener('blur', hide); };
}

// ── Sortable table: click a header to sort, click again to reverse
function initTable(table) {
  const heads = [...table.querySelectorAll('thead th')];
  const sort = (th, dir) => {
    const col = heads.indexOf(th), body = table.tBodies[0];
    const key = r => r.cells[col]?.getAttribute('data-sort') ?? r.cells[col]?.textContent.trim() ?? '';
    const num = [...body.rows].every(r => key(r) === '' || !isNaN(parseFloat(key(r))));
    const rows = [...body.rows].sort((a, b) => {
      const x = key(a), y = key(b);
      return (num ? parseFloat(x) - parseFloat(y) : x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' })) * (dir === 'ascending' ? 1 : -1);
    });
    body.append(...rows);
    heads.forEach(h => h === th ? h.setAttribute('aria-sort', dir) : h.removeAttribute('aria-sort'));
    table.dispatchEvent(new CustomEvent('hig:change', { bubbles: true, detail: { column: col, direction: dir } }));
  };
  const onClick = e => {
    const btn = e.target.closest('.hig-table__sort'); if (!btn) return;
    const th = btn.closest('th');
    sort(th, th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending');
  };
  table.addEventListener('click', onClick);
  return () => table.removeEventListener('click', onClick);
}

// ── Swipe actions: drag the row left to reveal; focusing an action reveals it too (CSS)
let openSwipe = null;
function initSwipe(row) {
  const content = row.querySelector('.hig-swipe__content'), actions = row.querySelector('.hig-swipe__actions');
  if (!content || !actions) return;
  const width = () => actions.offsetWidth;
  const setW = () => row.style.setProperty('--hig-swipe-w', `${width()}px`);
  const close = () => { row.classList.remove('is-open'); row.style.removeProperty('--x'); if (openSwipe === row) openSwipe = null; };
  let x0 = 0, y0 = 0, base = 0, dx = 0, mode = '';
  const down = e => {
    if (e.button > 0) return;
    if (openSwipe && openSwipe !== row) openSwipe.dispatchEvent(new Event('hig:swipe-close'));
    x0 = e.clientX; y0 = e.clientY; base = row.classList.contains('is-open') ? -width() : 0; dx = 0; mode = '';
    content.addEventListener('pointermove', move); content.addEventListener('pointerup', up); content.addEventListener('pointercancel', up);
  };
  const move = e => {
    const mx = e.clientX - x0, my = e.clientY - y0;
    if (!mode) { if (Math.abs(mx) < 6 && Math.abs(my) < 6) return; mode = Math.abs(mx) > Math.abs(my) ? 'x' : 'y'; if (mode === 'x') { content.setPointerCapture(e.pointerId); row.classList.add('is-dragging'); } }
    if (mode !== 'x') return;
    dx = Math.min(0, Math.max(base + mx, -width() * 1.25));
    row.style.setProperty('--x', `${dx}px`);
  };
  const up = () => {
    content.removeEventListener('pointermove', move); content.removeEventListener('pointerup', up); content.removeEventListener('pointercancel', up);
    row.classList.remove('is-dragging');
    if (mode !== 'x') return;
    row.style.removeProperty('--x');
    if (dx < -width() / 2) { setW(); row.classList.add('is-open'); openSwipe = row; } else close();
  };
  const onClickContent = e => { if (mode === 'x') { e.preventDefault(); e.stopPropagation(); mode = ''; } else if (row.classList.contains('is-open')) close(); };
  const onAction = () => setTimeout(close, 150);
  setW();
  const ro = new ResizeObserver(setW); ro.observe(actions);
  content.addEventListener('pointerdown', down);
  content.addEventListener('click', onClickContent, true);
  actions.addEventListener('click', onAction);
  row.addEventListener('hig:swipe-close', close);
  return () => { ro.disconnect(); content.removeEventListener('pointerdown', down); content.removeEventListener('click', onClickContent, true); actions.removeEventListener('click', onAction); };
}

// ── Context menu: right-click, long press (500 ms) or Shift+F10 / Menu key. The item lifts; the page dims.
function initContextMenu(target) {
  const menu = document.getElementById(target.getAttribute('data-hig-contextmenu'));
  if (!menu) return;
  menu.classList.add('hig-menu--context');
  let scrim = null, timer = 0, sx = 0, sy = 0;
  const items = () => [...menu.querySelectorAll('[role^="menuitem"]:not(:disabled)')];
  const close = (focus = true) => {
    if (menu.hidden) return;
    menu.hidden = true; target.classList.remove('is-lifted'); scrim?.remove(); scrim = null;
    document.removeEventListener('pointerdown', outside, true);
    if (focus) target.focus();
  };
  const outside = e => { if (!menu.contains(e.target)) close(false); };
  const open = (x, y) => {
    scrim = document.createElement('div'); scrim.className = 'hig-context-scrim'; document.body.append(scrim);
    target.classList.add('is-lifted');
    menu.hidden = false;
    const r = menu.getBoundingClientRect(), m = 8;
    const left = Math.max(m, Math.min(x, innerWidth - r.width - m));
    const flip = y + r.height > innerHeight - m;
    const top = flip ? Math.max(m, y - r.height) : y;
    menu.style.left = `${left}px`; menu.style.top = `${top}px`;
    menu.style.setProperty('--origin', `${x - left}px ${flip ? '100%' : '0'}`);
    menu.classList.remove('hig-glass-enter'); void menu.offsetWidth; menu.classList.add('hig-glass-enter');
    setTimeout(() => document.addEventListener('pointerdown', outside, true));
    items()[0]?.focus();
  };
  const fromElement = () => { const r = target.getBoundingClientRect(); open(r.left + 12, r.bottom + 8); };
  const onContext = e => { e.preventDefault(); clearTimeout(timer); open(e.clientX, e.clientY); };
  const onDown = e => {
    if (e.pointerType !== 'touch') return;
    sx = e.clientX; sy = e.clientY;
    timer = setTimeout(() => { navigator.vibrate?.(10); fromElement(); }, 500);
  };
  const onMove = e => { if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) clearTimeout(timer); };
  const cancel = () => clearTimeout(timer);
  const onKey = e => { if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); fromElement(); } };
  const onMenuKey = e => menuKeys(e, items(), close);
  const onPick = e => {
    const item = e.target.closest('[role^="menuitem"]');
    if (!item || item.disabled) return;
    menu.dispatchEvent(new CustomEvent('hig:select', { bubbles: true, detail: { item, target } }));
    close();
  };
  target.addEventListener('contextmenu', onContext);
  target.addEventListener('pointerdown', onDown); target.addEventListener('pointermove', onMove);
  target.addEventListener('pointerup', cancel); target.addEventListener('pointercancel', cancel);
  target.addEventListener('keydown', onKey);
  menu.addEventListener('keydown', onMenuKey); menu.addEventListener('click', onPick);
  return () => { close(false); target.removeEventListener('contextmenu', onContext); target.removeEventListener('pointerdown', onDown); target.removeEventListener('keydown', onKey); menu.removeEventListener('keydown', onMenuKey); menu.removeEventListener('click', onPick); };
}

/**
 * Show a HUD toast at the top of the screen (role="status"; it stays while hovered or focused).
 * @returns a function that dismisses it early.
 */
export function showToast(message, { icon = '', duration = 4000 } = {}) {
  let region = document.querySelector('.hig-toast-region');
  if (!region) {
    region = document.createElement('div'); region.className = 'hig-toast-region';
    region.setAttribute('role', 'status'); region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  const t = document.createElement('div');
  t.className = 'hig-glass hig-glass--large hig-toast';
  t.innerHTML = icon;
  t.append(Object.assign(document.createElement('span'), { textContent: message }));
  region.append(t);
  let timer;
  const dismiss = () => {
    clearTimeout(timer);
    if (reduceMotion()) { t.remove(); return; }
    t.classList.add('is-leaving'); t.addEventListener('animationend', () => t.remove(), { once: true });
  };
  const arm = () => { clearTimeout(timer); timer = setTimeout(dismiss, Math.max(duration, 2000)); };
  t.addEventListener('pointerenter', () => clearTimeout(timer)); t.addEventListener('pointerleave', arm);
  arm();
  return dismiss;
}

const done = new WeakMap(); // initializer → WeakSet of elements (one element can host several components)
/** Wire up every component under `root`. Safe to call again after adding markup. */
export function initComponents(root = document) {
  const cleanups = [];
  const each = (sel, fn) => {
    if (!done.has(fn)) done.set(fn, new WeakSet());
    const seen = done.get(fn);
    root.querySelectorAll(sel).forEach(el => { if (seen.has(el)) return; seen.add(el); cleanups.push(fn(el)); });
  };
  each('.hig-switch', initSwitch);
  each('.hig-segmented', initSegmented);
  each('.hig-tabbar', initTabbar);
  each('[aria-haspopup="menu"][aria-controls]', initMenu);
  each('dialog.hig-sheet, dialog.hig-alert, dialog.hig-action-sheet', initDialog);
  each('input.hig-slider', initSlider);
  each('.hig-input', initClearable);
  each('input.hig-checkbox', initCheckbox);
  each('.hig-chip[aria-pressed], .hig-toggle-btn[aria-pressed]', initToggle);
  each('.hig-scope[role="radiogroup"], .hig-scope[role="tablist"]', initSegmented);
  each('[data-hig-tokens]', initTokens);
  each('[data-hig-pager]', initPageControl);
  each('.hig-popover[popover]', initPopover);
  each('[data-hig-tooltip]', initTooltip);
  each('table.hig-table', initTable);
  each('.hig-swipe', initSwipe);
  each('[data-hig-contextmenu]', initContextMenu);
  const onOpen = e => {
    const t = e.target.closest?.('[data-hig-open]');
    if (t) openDialog(t.getAttribute('data-hig-open'));
  };
  if (!done.has(root)) { done.set(root, true); root.addEventListener('click', onOpen); cleanups.push(() => root.removeEventListener('click', onOpen)); }
  return () => cleanups.forEach(f => f && f());
}
