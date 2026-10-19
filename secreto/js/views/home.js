import { h, card, button, linkBtn, eyebrow, para, note, progressBar, icon } from '../ui.js';
import { DAYS } from '../data/days.js';
import { APP_TAGLINE } from '../data/content.js';
import { formatLong, formatDateTime, formatShort } from '../dates.js';
import { dayStats, overall } from '../progress.js';

export function home(ctx) {
  const today = ctx.today();
  const idx = ctx.dayIndex(today);
  const view = h('div', { class: 'view' });

  if (idx < 1 && !dayStats(DAYS[0].date).started) {
    const d = DAYS[0];
    view.append(card([
      eyebrow('Antes do início'),
      h('h1', { class: 'title', text: `O propósito começa em ${formatShort(d.date)}` }),
      h('p', { class: 'subtitle', text: APP_TAGLINE }),
      h('div', { class: 'date', text: formatLong(today) }),
      para(`Faltam ${1 - idx} dia(s). Você pode conhecer o plano completo, preparar sua rotina e, se quiser, já começar o Dia 1 antecipadamente.`),
      h('div', { class: 'btn-row' }, linkBtn('Ver o plano dos dez dias', '#/jornada', { icon: 'compass' }), linkBtn('Começar o Dia 1 agora', `#/manha/${d.date}`, { variant: 'primary', icon: 'sun' })),
    ], 'hero card-gold'));
    view.append(helpCard());
    return view;
  }

  if (idx > DAYS.length) {
    const o = overall();
    view.append(card([
      eyebrow('Período concluído'),
      h('h1', { class: 'title', text: 'Os dez dias terminaram' }),
      h('div', { class: 'date', text: formatLong(today) }),
      para(`Você iniciou ${o.started} dia(s) e concluiu ${o.completed} revisão(ões) noturna(s). O encerramento e o plano de continuidade ficam disponíveis abaixo. Dias não concluídos podem ser retomados na Jornada.`),
      h('div', { class: 'btn-row' }, linkBtn('Encerramento e continuidade', '#/encerramento', { variant: 'primary', icon: 'flag' }), linkBtn('Rever a jornada', '#/jornada', { icon: 'compass' })),
    ], 'hero card-gold'));
    view.append(helpCard());
    return view;
  }

  const d = DAYS[Math.max(idx, 1) - 1];
  const early = idx < 1;
  const s = dayStats(d.date);
  const o = overall();
  const next = nextActivity(s);
  const last = ctx.store.lastActivity();

  view.append(card([
    eyebrow(`Dia ${d.n} de ${DAYS.length}${early ? ' · iniciado antecipadamente' : ''}`),
    h('h1', { class: 'title', text: d.title }),
    h('div', { class: 'date', text: formatLong(d.date) + (early ? ` (hoje é ${formatLong(today)})` : '') }),
    h('p', { class: 'subtitle', text: d.theme }),
    h('blockquote', { class: 'verse' }, d.message, h('div', { class: 'verse-ref', text: `Leitura principal: ${d.mainRef}` })),
  ], 'hero card-gold'));

  view.append(card([
    h('div', { class: 'row', style: { justifyContent: 'space-between' } }, eyebrow('Progresso geral'), h('span', { class: 'note', text: `${o.percent}% · ${o.started} iniciados · ${o.completed} concluídos` })),
    progressBar(o.percent, 100, 'Progresso geral dos dez dias'),
    h('div', { class: 'days-grid' }, DAYS.map((x) => { const st = dayStats(x.date); const cls = ['day-cell', x.date === d.date ? 'today' : '', st.started ? 'started' : '', st.eveningDone ? 'complete' : '', ctx.dayIndex(x.date) > Math.max(idx, 1) ? 'future' : ''].join(' '); return h('a', { class: cls, href: `#/dia/${x.date}`, title: x.title }, h('b', { text: String(x.n) }), h('span', { text: formatShort(x.date) })); })),
    note('Apenas atividades registradas por você contam. Se falhar em alguma, retome sem reiniciar os dez dias.'),
  ]));

  view.append(card([
    eyebrow('Próxima atividade'),
    h('div', { class: 'item-title', text: next.label }),
    next.hint ? note(next.hint) : null,
    h('div', { class: 'btn-row' },
      !s.started ? linkBtn('Iniciar meu dia', `#/manha/${d.date}`, { variant: 'primary', icon: 'sun' }) : null,
      s.started && !s.morningDone ? linkBtn('Continuar minha consagração', `#/manha/${d.date}`, { variant: 'primary', icon: 'sun' }) : null,
      s.morningDone ? linkBtn('Rever a manhã', `#/manha/${d.date}`, { icon: 'sun' }) : null,
      linkBtn(s.eveningDone ? 'Rever meu dia' : 'Encerrar meu dia', `#/noite/${d.date}`, { variant: s.morningDone && !s.eveningDone ? 'primary' : 'secondary', icon: 'moon' }),
    ),
    h('div', { class: 'btn-row' }, linkBtn('Preciso de ajuda agora', '#/ajuda', { variant: 'outline-gold', icon: 'lifebuoy' }), linkBtn('Exercício e prática do dia', `#/dia/${d.date}`, { icon: 'compass' })),
  ]));

  view.append(card([
    eyebrow('Última atividade concluída'),
    last ? h('div', {}, h('div', { class: 'item-title', text: last.label }), note(formatDateTime(last.at))) : note('Nenhuma atividade registrada ainda.'),
  ]));

  return view;
}

function nextActivity(s) {
  if (!s.started) return { label: 'Rotina da manhã', hint: 'Preparação, leitura, oração, diário e compromisso. Uma etapa por vez.' };
  if (!s.morningDone) return { label: 'Continuar a rotina da manhã', hint: 'Suas respostas ficaram salvas. Retome de onde parou.' };
  if (!s.exerciseDone) return { label: 'Exercício do dia', hint: 'Disponível na tela do dia, junto com a prática.' };
  if (!s.eveningDone) return { label: 'Revisão noturna', hint: 'Cerca de cinco minutos, ao final do dia.' };
  return { label: 'Dia concluído', hint: 'Você pode editar o diário ou consultar o progresso.' };
}

function helpCard() {
  return card([eyebrow('Sempre disponível'), para('Se a ansiedade apertar em qualquer momento, use o botão "Preciso de ajuda agora". Ele conduz uma pausa breve e um registro honesto.'), linkBtn('Preciso de ajuda agora', '#/ajuda', { variant: 'outline-gold', icon: 'lifebuoy' })]);
}
