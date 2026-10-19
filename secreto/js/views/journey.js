import { h, card, eyebrow, para, note, linkBtn, button, scripture, checklist, textarea, toast } from '../ui.js';
import { DAYS, dayByDate, MORNING_SCHEDULE } from '../data/days.js';
import { formatLong, formatShort, nowISO } from '../dates.js';
import { dayStats } from '../progress.js';

export function journey(ctx) {
  const today = ctx.today();
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow('Jornada'), h('h1', { class: 'title', text: 'Os dez dias' }), para('Cada dia tem leitura, oração, exercício, prática e uma pergunta para o diário. Os dias passados podem ser retomados; os futuros podem ser lidos com antecedência.')], 'card-plain'));
  view.append(card([eyebrow('Rotina da manhã (referência ajustável)'), h('div', { class: 'schedule' }, MORNING_SCHEDULE.flatMap((s) => [h('span', { class: 't', text: s.time }), h('span', { text: s.label })])), note('Se você dormiu muito pouco, adapte o horário e preserve o descanso. Isso não é fracasso espiritual.')]));
  const list = h('div', { class: 'list' });
  for (const d of DAYS) {
    const s = dayStats(d.date);
    const status = s.eveningDone ? 'Concluído' : s.started ? 'Em andamento' : d.date === today ? 'Hoje' : ctx.dayIndex(d.date) > ctx.dayIndex(today) ? 'Em breve' : 'Não iniciado';
    list.append(h('a', { class: 'item', href: `#/dia/${d.date}` }, h('div', { class: 'item-meta' }, h('span', { text: `Dia ${d.n} · ${formatShort(d.date)}` }), h('span', { text: status })), h('div', { class: 'item-title', text: d.title }), h('p', { class: 'muted', text: d.mainRef })));
  }
  view.append(list);
  return view;
}

export function dayView(ctx, params) {
  const date = params[0] && dayByDate(params[0]) ? params[0] : ctx.activeDate();
  const d = dayByDate(date);
  const s = dayStats(date);
  const view = h('div', { class: 'view' });
  view.append(card([
    eyebrow(`Dia ${d.n} de ${DAYS.length} · ${formatLong(d.date)}`),
    h('h1', { class: 'title', text: d.title }),
    h('p', { class: 'subtitle', text: d.theme }),
    h('div', { class: 'btn-row' },
      linkBtn(s.morningDone ? 'Rever rotina da manhã' : s.started ? 'Continuar a manhã' : 'Iniciar rotina da manhã', `#/manha/${date}`, { variant: s.morningDone ? 'secondary' : 'primary', icon: 'sun' }),
      linkBtn(s.eveningDone ? 'Rever revisão noturna' : 'Revisão noturna', `#/noite/${date}`, { icon: 'moon' })),
  ], 'hero card-gold'));

  view.append(card([eyebrow('Objetivo'), para(d.theme), eyebrow('Prática do dia'), para(d.practice), eyebrow('Pergunta do diário'), h('p', { class: 'verse', text: d.journalQuestion })]));
  view.append(card([eyebrow('Leituras'), ...d.readings.map((r) => scripture(r))]));
  view.append(exerciseCard(ctx, d, s));
  view.append(card([eyebrow('Perguntas de reflexão'), h('ol', { class: 'ol' }, d.questions.map((q) => h('li', { text: q }))), note('As respostas são registradas na etapa de leitura da rotina da manhã.')]));
  const prev = DAYS[d.n - 2], next = DAYS[d.n];
  view.append(h('div', { class: 'btn-row' }, prev ? linkBtn(`Dia ${prev.n}`, `#/dia/${prev.date}`, { icon: 'left' }) : null, next ? linkBtn(`Dia ${next.n}`, `#/dia/${next.date}`, { icon: 'right' }) : null));
  return view;
}

export function exerciseCard(ctx, d, s) {
  const ex = d.exercise;
  const base = ['days', d.date, 'exercise'];
  const children = [eyebrow('Exercício do dia'), h('h3', { class: 'title', text: ex.title }), para(ex.intro)];
  if (ex.type === 'columns') {
    children.push(h('div', { class: 'two-col' }, ex.columns.map((c) => h('div', { class: 'field' }, h('div', { class: 'label', text: c.label }), checklist([...base, c.key], { placeholder: c.placeholder, withDone: false, empty: 'Nenhum item ainda.' })))));
  } else if (ex.type === 'text' || ex.type === 'compare') {
    if (ex.type === 'compare') children.push(compareDayOne(ctx));
    children.push(...ex.prompts.map((p) => h('div', { class: 'field' }, h('div', { class: 'label', text: p.label }), textarea([...base, p.key], { placeholder: p.placeholder, rows: 3 }))));
    if (ex.type === 'compare') children.push(linkBtn('Construir o plano de continuidade', '#/encerramento', { variant: 'outline-gold', icon: 'flag' }));
  } else if (ex.type === 'work') {
    children.push(linkBtn('Abrir Trabalho e DClin', `#/trabalho/${d.date}`, { variant: 'outline-gold', icon: 'briefcase' }));
  }
  const done = s.exerciseDone;
  children.push(h('div', { class: 'row' }, button(done ? 'Exercício concluído' : 'Marcar exercício como concluído', { variant: done ? 'ghost' : 'primary', icon: 'check', onClick: () => {
    if (done) { ctx.store.set([...base, 'done'], false); ctx.toast('Marcação removida'); ctx.rerender(); return; }
    if (!exerciseHasContent(ctx, d)) { ctx.toast('Registre pelo menos um item antes de concluir.', 'error'); return; }
    ctx.store.set([...base, 'done'], true); ctx.store.set([...base, 'doneAt'], nowISO());
    ctx.store.logActivity(`Exercício do Dia ${d.n} concluído`, { date: d.date });
    ctx.toast('Exercício registrado');
    ctx.rerender();
  } })));
  return card(children);
}

function exerciseHasContent(ctx, d) {
  const ex = d.exercise; const base = ['days', d.date, 'exercise'];
  if (ex.type === 'columns') return ex.columns.some((c) => (ctx.store.get([...base, c.key], []) || []).length > 0);
  if (ex.type === 'text' || ex.type === 'compare') return ex.prompts.some((p) => (ctx.store.get([...base, p.key], '') || '').trim());
  if (ex.type === 'work') { const w = ctx.store.getDay(d.date, 'work', {}); return !!((w.main || '').trim() || Object.values(w.priorities || {}).some((p) => (p || '').trim())); }
  return true;
}

function compareDayOne(ctx) {
  const d1 = DAYS[0];
  const ex1 = ctx.store.getDay(d1.date, 'exercise', {});
  const m1 = ctx.store.getDay(d1.date, 'morning', {});
  const j1 = m1.journal || {};
  const rows = [
    ['Depende de mim (Dia 1)', (ex1.mine || []).map((i) => i.text).join('; ')],
    ['Não depende de mim (Dia 1)', (ex1.notMine || []).map((i) => i.text).join('; ')],
    ['O que entreguei a Deus (Dia 1)', j1.surrender || ''],
    ['Pergunta do Dia 1', j1.dayQuestion || ''],
  ].filter((r) => r[1]);
  if (!rows.length) return h('div', { class: 'banner banner-info', text: 'Não há registros do Dia 1 para comparar. Você pode preencher o Dia 1 na Jornada, ou seguir apenas com o que escrever hoje.' });
  return h('div', { class: 'synthesis' }, h('div', { class: 'eyebrow', text: 'Seus registros do Dia 1' }), ...rows.map((r) => h('div', {}, h('div', { class: 'label', text: r[0] }), h('p', { class: 'p', text: r[1] }))));
}
