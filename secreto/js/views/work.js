import { h, card, eyebrow, para, note, linkBtn, textarea, input, field, checklist } from '../ui.js';
import { dayByDate, DAYS } from '../data/days.js';
import { WORK_REMINDER } from '../data/content.js';
import { formatLong, formatShort } from '../dates.js';

export function work(ctx, params) {
  const date = params[0] && dayByDate(params[0]) ? params[0] : ctx.activeDate();
  const d = dayByDate(date);
  const base = ['days', date, 'work'];
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow(`Trabalho e DClin · Dia ${d.n} · ${formatLong(date)}`), h('h1', { class: 'title', text: 'A vida profissional continua' }), h('div', { class: 'banner banner-info', text: WORK_REMINDER })], 'card-plain'));
  view.append(h('div', { class: 'chips' }, DAYS.map((x) => h('a', { class: `chip${x.date === date ? ' chip-on' : ''}`, href: `#/trabalho/${x.date}` }, formatShort(x.date)))));
  view.append(card([
    eyebrow('Principal responsabilidade do dia'),
    input([...base, 'main'], { placeholder: 'A única coisa que precisa ser feita hoje.' }),
    eyebrow('Três prioridades profissionais'),
    ...[0, 1, 2].map((i) => input([...base, 'priorities', i], { placeholder: `Prioridade ${i + 1}` })),
  ]));
  view.append(card([eyebrow('Compromissos e horários'), checklist([...base, 'appointments'], { placeholder: 'Ex.: 09:00 reunião com fornecedor' })]));
  view.append(card([eyebrow('Tarefas da DClin'), checklist([...base, 'dclin'], { placeholder: 'Tarefa relacionada à clínica' })]));
  view.append(card([eyebrow('Pendências pessoais'), checklist([...base, 'personal'], { placeholder: 'Pendência pessoal' })]));
  view.append(card([eyebrow('Entregas realizadas'), checklist([...base, 'deliveries'], { placeholder: 'O que entreguei hoje', withDone: false, empty: 'Nenhuma entrega registrada ainda.' }), field('Observações', textarea([...base, 'notes'], { rows: 3, placeholder: 'Notas do dia de trabalho.' }))]));
  view.append(note('Nada aqui se conecta a aplicativos externos nem envia mensagens. Os dados ficam somente neste dispositivo.'));
  return view;
}
