import { h, card, eyebrow, para, note, linkBtn, textarea, input, field, chips, range } from '../ui.js';
import { dayByDate, DAYS } from '../data/days.js';
import { JOURNAL_FIELDS, EMOTIONS } from '../data/content.js';
import { formatLong, formatShort } from '../dates.js';
import { dayStats } from '../progress.js';

export function journal(ctx, params) {
  const date = params[0] && dayByDate(params[0]) ? params[0] : ctx.activeDate();
  const d = dayByDate(date);
  const base = ['days', date, 'journal'];
  const s = dayStats(date);
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow(`Diário · Dia ${d.n} · ${formatLong(date)}`), h('h1', { class: 'title', text: 'Diário espiritual e emocional' }), para('Privado, editável a qualquer momento. As notas de intensidade são subjetivas e não constituem medida clínica.')], 'card-plain'));
  view.append(h('div', { class: 'chips' }, DAYS.map((x) => { const st = dayStats(x.date); return h('a', { class: `chip${x.date === date ? ' chip-on' : ''}`, href: `#/diario/${x.date}`, title: st.journalFilled ? `${st.journalFilled} campos` : '' }, formatShort(x.date) + (st.journalFilled ? ' •' : '')); })));
  const morningReading = d.readings.map((r) => r.ref).join(' · ');
  const controls = JOURNAL_FIELDS.map((f) => {
    if (f.type === 'emotion') return h('div', { class: 'field' }, h('div', { class: 'label', text: f.label }), chips([...base, f.key], EMOTIONS, { allowOther: true }));
    if (f.type === 'range') return h('div', { class: 'field' }, h('div', { class: 'label', text: f.label }), range([...base, f.key]));
    if (f.type === 'text') { const inp = input([...base, f.key], { placeholder: f.placeholder }); if (f.key === 'reading' && !inp.value) inp.placeholder = morningReading; return field(f.label, inp); }
    return field(f.label, textarea([...base, f.key], { rows: 3, placeholder: f.placeholder }));
  });
  view.append(card([eyebrow(`${s.journalFilled} de ${s.journalTotal} campos preenchidos`), ...controls, note('Salvo automaticamente a cada alteração.')]));
  view.append(emotionChart(ctx));
  view.append(history(ctx));
  return view;
}

export function emotionChart(ctx) {
  const points = DAYS.map((d) => { const s = dayStats(d.date); return { n: d.n, date: d.date, v: s.intensity, emotion: s.emotion }; });
  const have = points.filter((p) => p.v != null);
  if (!have.length) return card([eyebrow('Evolução emocional'), note('O gráfico aparece quando houver intensidade registrada em pelo menos um dia.')]);
  const W = 400, H = 200, padL = 30, padR = 14, padT = 14, padB = 30;
  const x = (n) => padL + ((n - 1) / (DAYS.length - 1)) * (W - padL - padR);
  const y = (v) => padT + (1 - v / 10) * (H - padT - padB);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'chart'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Intensidade da emoção predominante por dia, de 0 a 10');
  let inner = '';
  for (const g of [0, 5, 10]) inner += `<line class="grid" x1="${padL}" x2="${W - padR}" y1="${y(g)}" y2="${y(g)}"/><text x="${padL - 8}" y="${y(g) + 4}" text-anchor="end">${g}</text>`;
  for (const p of points) inner += `<text x="${x(p.n)}" y="${H - 10}" text-anchor="middle">${p.n}</text>`;
  const segs = []; let cur = [];
  for (const p of points) { if (p.v == null) { if (cur.length) segs.push(cur); cur = []; } else cur.push(p); }
  if (cur.length) segs.push(cur);
  for (const seg of segs) {
    if (seg.length > 1) { const path = seg.map((p, i) => `${i ? 'L' : 'M'}${x(p.n)},${y(p.v)}`).join(' '); inner += `<path class="area" d="${path} L${x(seg[seg.length - 1].n)},${y(0)} L${x(seg[0].n)},${y(0)} Z"/><path class="line" d="${path}"/>`; }
    for (const p of seg) inner += `<circle class="dot" cx="${x(p.n)}" cy="${y(p.v)}" r="5"><title>Dia ${p.n}: ${p.v}${p.emotion ? ' · ' + p.emotion : ''}</title></circle>`;
  }
  svg.innerHTML = inner;
  const table = h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, h('th', { text: 'Dia' }), h('th', { text: 'Emoção' }), h('th', { text: 'Intensidade' }))), h('tbody', {}, have.map((p) => h('tr', {}, h('td', { text: `Dia ${p.n}` }), h('td', { text: p.emotion || '—' }), h('td', { class: 'num', text: String(p.v) }))))));
  return card([eyebrow('Evolução emocional (0 a 10)'), h('div', { class: 'chart-wrap' }, svg), table, note('Registro subjetivo da intensidade da emoção predominante. Não é diagnóstico nem medida de saúde mental.')]);
}

function history(ctx) {
  const items = DAYS.map((d) => ({ d, j: ctx.store.getDay(d.date, 'journal', {}), s: dayStats(d.date) })).filter((x) => x.s.journalFilled > 0);
  if (!items.length) return card([eyebrow('Histórico'), note('Os dias com registros aparecerão aqui.')]);
  return card([eyebrow('Histórico'), h('div', { class: 'list' }, items.map(({ d, j }) => h('a', { class: 'item', href: `#/diario/${d.date}` }, h('div', { class: 'item-meta' }, h('span', { text: `Dia ${d.n} · ${formatShort(d.date)}` }), h('span', { text: [j.emotion, j.intensity != null ? `${j.intensity}/10` : ''].filter(Boolean).join(' · ') })), j.learning ? h('p', {}, h('b', { text: 'Aprendizado: ' }), j.learning) : j.reflection ? h('p', { text: j.reflection.slice(0, 160) }) : null)))]);
}
