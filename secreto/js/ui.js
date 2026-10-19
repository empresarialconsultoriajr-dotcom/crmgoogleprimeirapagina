// Componentes de interface reutilizáveis (sem dependências).
import * as store from './store.js';

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  pen: '<path d="M4 20h4l10-10-4-4L4 16z"/><path d="M12.5 7.5l4 4"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4 10-10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-4 2 2-6z"/>',
  lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6 9.2 9.2M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
};

export function icon(name, size = 20) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size); svg.setAttribute('height', size);
  svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name] || '';
  return svg;
}

export function button(label, { onClick, variant = 'secondary', icon: ic, type = 'button', disabled = false, full = false, small = false, id } = {}) {
  const b = h('button', { class: `btn btn-${variant}${full ? ' btn-full' : ''}${small ? ' btn-small' : ''}`, type, id, disabled, onClick }, ic ? icon(ic, 18) : null, h('span', {}, label));
  return b;
}

export function eyebrow(text) { return h('div', { class: 'eyebrow', text }); }
export function title(text, level = 2) { return h(`h${level}`, { class: 'title', text }); }
export function para(text, cls = 'p') { return h('p', { class: cls, text }); }
export function note(text) { return h('p', { class: 'note', text }); }
export function divider() { return h('hr', { class: 'rule' }); }
export function card(children, cls = '') { return h('section', { class: `card ${cls}`.trim() }, children); }

let idSeq = 0;
export function field(label, control, { hint, id } = {}) {
  const fid = id || control.id || `f${++idSeq}`;
  control.id = fid;
  return h('div', { class: 'field' }, h('label', { class: 'label', for: fid, text: label }), control, hint ? h('div', { class: 'hint', text: hint }) : null);
}

// Campo de texto ligado a um caminho do estado, com salvamento automático.
export function textarea(path, { placeholder = '', rows = 3, id, maxlength = 4000, onInput } = {}) {
  const t = h('textarea', { class: 'input', placeholder, rows, id: id || pathId(path), maxlength });
  t.value = store.get(path, '') || '';
  t.addEventListener('input', () => { store.set(path, t.value); autosize(t); onInput && onInput(t.value); });
  requestAnimationFrame(() => autosize(t));
  return t;
}
export function input(path, { placeholder = '', type = 'text', id, maxlength = 200, onInput } = {}) {
  const t = h('input', { class: 'input', placeholder, type, id: id || pathId(path), maxlength });
  t.value = store.get(path, '') || '';
  t.addEventListener('input', () => { store.set(path, t.value); onInput && onInput(t.value); });
  return t;
}
function pathId(path) { return 'in-' + (Array.isArray(path) ? path.join('-') : String(path)).replace(/[^a-zA-Z0-9_-]/g, '-'); }
function autosize(t) { t.style.height = 'auto'; t.style.height = Math.max(t.scrollHeight, 44) + 'px'; }

// Grupo de opções (uma ou várias) ligado ao estado.
export function chips(path, options, { multi = false, onChange, allowOther = false } = {}) {
  const wrap = h('div', { class: 'chips', role: multi ? 'group' : 'radiogroup' });
  const render = () => {
    wrap.innerHTML = '';
    const current = store.get(path, multi ? [] : '');
    for (const opt of options) {
      const value = typeof opt === 'string' ? opt : opt.value;
      const label = typeof opt === 'string' ? opt : opt.label;
      const selected = multi ? (current || []).includes(value) : current === value;
      wrap.append(h('button', { type: 'button', class: `chip${selected ? ' chip-on' : ''}`, 'aria-pressed': String(selected), onClick: () => {
        let next;
        if (multi) { const arr = (store.get(path, []) || []).slice(); const i = arr.indexOf(value); if (i >= 0) arr.splice(i, 1); else arr.push(value); next = arr; }
        else next = selected ? '' : value;
        store.set(path, next);
        render();
        onChange && onChange(next);
      } }, label));
    }
  };
  render();
  if (allowOther) {
    const otherPath = Array.isArray(path) ? [...path.slice(0, -1), path[path.length - 1] + 'Other'] : path + 'Other';
    return h('div', {}, wrap, h('div', { class: 'mt-2' }, input(otherPath, { placeholder: 'Outro (descreva, se quiser)' })));
  }
  return wrap;
}

export function range(path, { min = 0, max = 10, id } = {}) {
  const val = store.get(path, null);
  const out = h('output', { class: 'range-out', text: val == null ? '—' : String(val) });
  const r = h('input', { type: 'range', class: 'range', min, max, step: 1, id: id || pathId(path), 'aria-label': 'Intensidade' });
  r.value = val == null ? Math.round((min + max) / 2) : val;
  if (val == null) r.classList.add('range-unset');
  r.addEventListener('input', () => { r.classList.remove('range-unset'); store.set(path, Number(r.value)); out.textContent = r.value; });
  return h('div', { class: 'range-wrap' }, r, out);
}

// Lista editável de itens (texto + concluído opcional).
export function checklist(path, { placeholder = 'Adicionar item', withDone = true, empty = 'Nada registrado ainda.', maxItems = 50 } = {}) {
  const wrap = h('div', { class: 'checklist' });
  const render = () => {
    wrap.innerHTML = '';
    const items = store.get(path, []) || [];
    if (!items.length) wrap.append(h('div', { class: 'empty', text: empty }));
    items.forEach((it, i) => {
      const row = h('div', { class: `check-row${it.done ? ' done' : ''}` });
      if (withDone) row.append(h('button', { type: 'button', class: 'check-box', 'aria-label': it.done ? 'Desmarcar' : 'Concluir', 'aria-pressed': String(!!it.done), onClick: () => { const arr = store.get(path, []).slice(); arr[i] = { ...arr[i], done: !arr[i].done, doneAt: !arr[i].done ? new Date().toISOString() : null }; store.set(path, arr); render(); } }, it.done ? icon('check', 14) : null));
      row.append(h('span', { class: 'check-text', text: it.text }));
      row.append(h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Remover', onClick: () => { const arr = store.get(path, []).slice(); arr.splice(i, 1); store.set(path, arr); render(); } }, icon('x', 14)));
      wrap.append(row);
    });
    const inp = h('input', { class: 'input', placeholder, maxlength: 200, 'aria-label': placeholder });
    const add = () => { const v = inp.value.trim(); if (!v) { inp.classList.add('invalid'); setTimeout(() => inp.classList.remove('invalid'), 800); return; } const arr = store.get(path, []).slice(); if (arr.length >= maxItems) return; arr.push({ id: store.uid(), text: v, done: false, at: new Date().toISOString() }); store.set(path, arr); render(); };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    wrap.append(h('div', { class: 'add-row' }, inp, h('button', { type: 'button', class: 'btn btn-secondary btn-small', onClick: add, 'aria-label': 'Adicionar' }, icon('plus', 16))));
  };
  render();
  return wrap;
}

// Toasts
let toastHost;
export function toast(message, kind = 'ok') {
  if (!toastHost) { toastHost = h('div', { class: 'toast-host', 'aria-live': 'polite' }); document.body.append(toastHost); }
  const t = h('div', { class: `toast toast-${kind}`, text: message });
  toastHost.append(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2800);
}

// Modal simples (inclui confirmação sem usar window.confirm).
export function modal({ title: tt, body, actions = [], onClose }) {
  const close = () => { back.remove(); document.body.classList.remove('no-scroll'); onClose && onClose(); };
  const box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': tt });
  box.append(h('div', { class: 'modal-head' }, h('h3', { class: 'title', text: tt }), h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Fechar', onClick: close }, icon('x', 18))));
  box.append(h('div', { class: 'modal-body' }, body));
  if (actions.length) box.append(h('div', { class: 'modal-actions' }, actions.map((a) => button(a.label, { variant: a.variant || 'secondary', onClick: () => { const r = a.onClick ? a.onClick() : true; if (r !== false) close(); } }))));
  const back = h('div', { class: 'modal-back', onClick: (e) => { if (e.target === back) close(); } }, box);
  document.body.append(back);
  document.body.classList.add('no-scroll');
  setTimeout(() => box.querySelector('button, textarea, input')?.focus(), 30);
  return { close };
}

export function confirmModal(tt, text, onYes, { yesLabel = 'Confirmar', danger = false } = {}) {
  return modal({ title: tt, body: para(text), actions: [{ label: 'Cancelar' }, { label: yesLabel, variant: danger ? 'danger' : 'primary', onClick: onYes }] });
}

export function stepHeader(stepNum, total, label) {
  return h('div', { class: 'step-head' }, h('div', { class: 'eyebrow', text: `Etapa ${stepNum} de ${total}` }), h('h2', { class: 'title', text: label }));
}

export function progressBar(value, max, label) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return h('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': value, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-label': label || 'Progresso' }, h('div', { class: 'progress-bar', style: { width: pct + '%' } }));
}

export function stat(label, value, hint) {
  return h('div', { class: 'stat' }, h('div', { class: 'stat-value', text: String(value) }), h('div', { class: 'stat-label', text: label }), hint ? h('div', { class: 'hint', text: hint }) : null);
}

export function linkBtn(label, href, { icon: ic, variant = 'secondary', full = false } = {}) {
  return h('a', { class: `btn btn-${variant}${full ? ' btn-full' : ''}`, href }, ic ? icon(ic, 18) : null, h('span', {}, label));
}

export function scripture(reading) {
  return h('div', { class: 'scripture' },
    h('div', { class: 'scripture-ref', text: reading.ref }),
    h('p', { class: 'p', html: `<strong>Contexto.</strong> ${reading.context}` }),
    h('p', { class: 'p', html: `<strong>O que o texto diz.</strong> ${reading.summary}` }),
    h('p', { class: 'p muted', html: `<strong>Aplicação pessoal sugerida.</strong> ${reading.application}` }),
  );
}
