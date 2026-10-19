import { h, card, eyebrow, para, note, button, linkBtn, textarea, input, field, chips, toast, modal } from '../ui.js';
import { CLOSING_REPORT, PLAN_AREAS, PLAN_FREQ, PLAN_SUGGESTIONS } from '../data/content.js';
import { DAYS } from '../data/days.js';
import { addDays, formatShort, formatLong, nowISO } from '../dates.js';
import { overall } from '../progress.js';

export function closing(ctx) {
  const view = h('div', { class: 'view' });
  const o = overall();
  view.append(card([eyebrow('Encerramento e continuidade'), h('h1', { class: 'title', text: 'O que fica depois dos dez dias' }), para(`Até agora: ${o.started} dia(s) iniciado(s), ${o.completed} revisão(ões) concluída(s), ${o.helpEpisodes} episódio(s) de ansiedade registrado(s). O relatório abaixo é escrito por você; o sistema não conclui nada sobre o relacionamento.`)], 'card-plain'));
  view.append(card([eyebrow('Relatório pessoal'), ...CLOSING_REPORT.map((f) => field(f.label, textarea(['closing', 'report', f.key], { rows: 3 }))), note('Salvo automaticamente.')]));
  view.append(plan30(ctx));
  return view;
}

function plan30(ctx) {
  const base = ['closing', 'plan'];
  const start = addDays(DAYS[DAYS.length - 1].date, 1);
  const habits = () => ctx.store.get([...base, 'habits'], []) || [];
  const list = h('div', { class: 'list' });
  const render = () => {
    list.innerHTML = '';
    if (!habits().length) list.append(h('div', { class: 'empty', text: 'Nenhum hábito definido ainda.' }));
    habits().forEach((hb, i) => list.append(h('div', { class: 'item' }, h('div', { class: 'item-meta' }, h('span', { text: `${hb.area} · ${hb.freq}` }), h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Remover', onClick: () => { const arr = habits().slice(); arr.splice(i, 1); ctx.store.set([...base, 'habits'], arr); render(); } }, '×')), h('div', { class: 'item-title', text: hb.text }))));
  };
  render();
  const addHabit = () => {
    const draft = ['closing', 'habitDraft'];
    ctx.store.set(draft, { area: PLAN_AREAS[0], freq: PLAN_FREQ[0] }, { immediate: true });
    modal({ title: 'Novo hábito', body: h('div', { class: 'stack' },
      field('Hábito', input([...draft, 'text'], { placeholder: 'Ex.: leitura bíblica antes do trabalho' })),
      h('div', { class: 'field' }, h('div', { class: 'label', text: 'Área' }), chips([...draft, 'area'], PLAN_AREAS)),
      h('div', { class: 'field' }, h('div', { class: 'label', text: 'Frequência' }), chips([...draft, 'freq'], PLAN_FREQ)),
      h('div', { class: 'field' }, h('div', { class: 'label', text: 'Sugestões' }), h('div', { class: 'chips' }, PLAN_SUGGESTIONS.map((s) => h('button', { type: 'button', class: 'chip', onClick: () => { ctx.store.set(draft, { ...s }, { immediate: true }); const inp = document.getElementById('in-closing-habitDraft-text'); if (inp) inp.value = s.text; } }, s.text)))),
    ), actions: [{ label: 'Cancelar' }, { label: 'Adicionar', variant: 'primary', onClick: () => { const d = ctx.store.get(draft, {}); if (!(d.text || '').trim()) { toast('Descreva o hábito.', 'error'); return false; } ctx.store.push([...base, 'habits'], { id: ctx.store.uid(), text: d.text.trim(), area: d.area || PLAN_AREAS[0], freq: d.freq || PLAN_FREQ[0] }, { immediate: true }); render(); } }] });
  };
  const reviews = [1, 2, 3, 4].map((w) => { const date = addDays(start, w * 7 - 1); return h('div', { class: 'field' }, h('div', { class: 'label', text: `Revisão da semana ${w} · ${formatShort(date)}` }), textarea([...base, 'reviews', `w${w}`], { rows: 2, placeholder: 'O que mantive, o que ajustei, o que preciso corrigir.' })); });
  return card([
    eyebrow(`Plano de continuidade · 30 dias a partir de ${formatLong(start)}`),
    para('Hábitos sustentáveis e revisões semanais. O plano não pressupõe que o relacionamento terá sido restaurado; ele serve para a sua vida devocional, emocional, física e profissional.'),
    h('div', { class: 'label', text: 'Hábitos' }), list, button('Adicionar hábito', { icon: 'plus', onClick: addHabit }),
    h('hr', { class: 'rule' }),
    field('Como vou cuidar da minha saúde emocional nestes 30 dias', textarea([...base, 'notes', 'emotional'], { rows: 2, placeholder: 'Inclua ajuda profissional, se a dificuldade persistir.' })),
    field('Limites que vou respeitar no relacionamento', textarea([...base, 'notes', 'limits'], { rows: 2 })),
    field('O que farei em momentos difíceis', textarea([...base, 'notes', 'hard'], { rows: 2, placeholder: 'Ex.: usar o protocolo de pausa, ligar para alguém, caminhar.' })),
    h('hr', { class: 'rule' }),
    ...reviews,
    h('div', { class: 'btn-row' }, button(ctx.store.get([...base, 'committedAt']) ? 'Plano registrado' : 'Registrar plano de 30 dias', { variant: 'primary', icon: 'flag', onClick: () => { if (!habits().length) { toast('Adicione pelo menos um hábito.', 'error'); return; } ctx.store.set([...base, 'committedAt'], nowISO(), { immediate: true }); ctx.store.logActivity('Plano de continuidade de 30 dias registrado'); toast('Plano registrado'); ctx.rerender(); } })),
  ]);
}
