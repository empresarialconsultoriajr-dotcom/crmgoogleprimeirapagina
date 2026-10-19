import { h, card, eyebrow, para, note, button, linkBtn, chips, textarea, field, toast } from '../ui.js';
import { dayByDate } from '../data/days.js';
import { EVENING_QUESTIONS } from '../data/content.js';
import { formatLong, nowISO } from '../dates.js';

export function evening(ctx, params) {
  const date = params[0] && dayByDate(params[0]) ? params[0] : ctx.activeDate();
  const d = dayByDate(date);
  const base = ['days', date, 'evening'];
  const commitment = ctx.store.getDay(date, 'morning.commitment.text', '');
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow(`Revisão noturna · Dia ${d.n} · ${formatLong(date)}`), h('h1', { class: 'title', text: 'Cinco minutos de honestidade' }), para('Responda por escrito ou marque uma opção. A síntese final usa apenas o que você registrar.')], 'card-plain'));

  const form = card([
    commitment ? h('div', { class: 'field' }, h('div', { class: 'label', text: 'Cumpri o compromisso que escolhi pela manhã?' }), h('p', { class: 'p muted', text: commitment }), chips(['days', date, 'morning', 'commitment', 'fulfilledLabel'], ['Sim', 'Em parte', 'Não'], { onChange: (v) => ctx.store.set(['days', date, 'morning', 'commitment', 'fulfilled'], v === 'Sim' ? true : v ? false : null) })) : note('Nenhum compromisso foi definido pela manhã para este dia.'),
    h('hr', { class: 'rule' }),
    ...EVENING_QUESTIONS.map((q, i) => h('div', { class: 'field' },
      h('div', { class: 'label', text: `${i + 1}. ${q.text}` }),
      q.options ? chips([...base, 'answers', q.key, 'choice'], q.options) : null,
      textarea([...base, 'answers', q.key, 'text'], { rows: 2, placeholder: q.options ? 'Comentário (opcional)' : 'Escreva aqui.' }),
    )),
    h('div', { class: 'btn-row' }, button('Concluir revisão e gerar síntese', { variant: 'primary', icon: 'check', onClick: () => {
      const a = ctx.store.get([...base, 'answers'], {});
      const answered = EVENING_QUESTIONS.filter((q) => (a[q.key]?.choice) || (a[q.key]?.text || '').trim()).length;
      if (answered < 3) { toast('Responda pelo menos três perguntas para concluir.', 'error'); return; }
      ctx.store.set([...base, 'completedAt'], nowISO(), { immediate: true });
      ctx.store.logActivity(`Revisão noturna do Dia ${d.n} concluída`, { date });
      toast('Dia encerrado');
      ctx.rerender();
    } })),
  ]);
  view.append(form);
  const ev = ctx.store.get(base, {});
  if (ev.completedAt) view.append(synthesis(ctx, date, d));
  return view;
}

function synthesis(ctx, date, d) {
  const a = ctx.store.getDay(date, 'evening.answers', {});
  const c = ctx.store.getDay(date, 'morning.commitment', {});
  const get = (k) => ({ choice: a[k]?.choice || '', text: (a[k]?.text || '').trim() });
  const advances = [];
  const q1 = get('q1'); if (q1.choice === 'Sim') advances.push('Cumpriu a principal responsabilidade espiritual do dia.'); else if (q1.choice === 'Em parte') advances.push('Cumpriu em parte a responsabilidade espiritual do dia.');
  const q2 = get('q2'); if (q2.text) advances.push(`Fidelidade aos valores: ${q2.text}`);
  const q3 = get('q3'); if (q3.choice === 'Não') advances.push('Não registrou atitudes movidas por ansiedade.'); else if (q3.choice === 'Sim, mas percebi e parei') advances.push('Percebeu uma atitude ansiosa e interrompeu.');
  const q4 = get('q4'); if (q4.choice === 'Sim') advances.push('Respeitou o espaço da Dani.'); else if (q4.choice === 'Não houve contato hoje') advances.push('Não houve contato com a Dani hoje.');
  const q5 = get('q5'); if (q5.choice === 'Sim') advances.push('Manteve as responsabilidades profissionais.');
  if (c.fulfilled === true && c.text) advances.push(`Cumpriu o compromisso: ${c.text}`);
  const improve = [];
  const q6 = get('q6'); if (q6.text) improve.push(q6.text);
  if (!q6.text) { if (q3.choice === 'Sim') improve.push('Houve atitude movida por ansiedade (registrada na pergunta 3).'); else if (q4.choice === 'Não' || q4.choice === 'Em parte') improve.push('O respeito ao espaço da Dani ficou incompleto hoje.'); else if (q5.choice === 'Não' || q5.choice === 'Em parte') improve.push('As responsabilidades profissionais ficaram incompletas.'); else if (c.fulfilled === false) improve.push('O compromisso da manhã não foi cumprido integralmente.'); else if (q1.choice === 'Não') improve.push('A responsabilidade espiritual principal não foi cumprida.'); }
  const q7 = get('q7');
  return card([
    eyebrow('Síntese do dia'),
    h('h2', { class: 'title', text: `Dia ${d.n} · ${d.title}` }),
    h('div', { class: 'synthesis' },
      h('div', { class: 'label', text: 'Avanços reais (a partir das suas respostas)' }),
      advances.length ? h('ul', { class: 'ul' }, advances.map((t) => h('li', { text: t }))) : para('Nenhum avanço foi marcado hoje. Isso é um registro, não um veredito. Amanhã é outro dia da mesma caminhada.'),
      h('div', { class: 'label', text: 'Um ponto concreto de melhoria' }),
      improve.length ? para(improve[0]) : para('Você não indicou um ponto de melhoria. Se quiser, responda à pergunta 6.'),
      q7.text ? h('div', {}, h('div', { class: 'label', text: 'Gratidão' }), para(q7.text)) : null,
    ),
    note('Esta síntese reorganiza apenas o que você escreveu. Nada foi acrescentado ou interpretado.'),
    h('div', { class: 'btn-row' }, linkBtn('Preencher o diário completo', `#/diario/${date}`, { icon: 'pen' }), linkBtn('Início', '#/', { variant: 'ghost', icon: 'home' })),
  ], 'card-gold');
}
