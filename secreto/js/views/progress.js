import { h, card, eyebrow, para, note, stat, progressBar, linkBtn } from '../ui.js';
import { DAYS } from '../data/days.js';
import { overall } from '../progress.js';
import { emotionChart } from './journal.js';
import { formatShort } from '../dates.js';

export function progressView(ctx) {
  const o = overall();
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow('Acompanhamento'), h('h1', { class: 'title', text: 'Consistência, honestidade e aprendizado' }), para('Indicadores simples, calculados apenas a partir do que você registrou. Não há pontuação de fé, de oração ou de reconciliação.')], 'card-plain'));
  view.append(card([eyebrow(`Progresso geral · ${o.percent}%`), progressBar(o.percent, 100), note('Cada dia conta três unidades: manhã iniciada, manhã concluída e revisão noturna concluída.')]));
  view.append(card([h('div', { class: 'stats' },
    stat('Dias iniciados', o.started), stat('Dias concluídos', o.completed), stat('Leituras realizadas', o.readings), stat('Orações registradas', o.prayers),
    stat('Revisões noturnas', o.evenings), stat('Compromissos cumpridos', `${o.commitmentsKept}/${o.commitmentsSet}`), stat('Episódios de ansiedade', o.helpEpisodes),
    stat('Impulsos digitais', o.urges, `${o.resisted} passaram sem abrir`), stat('Regras quebradas', o.breaks), stat('Reflexões realizadas', o.reflections),
  )]));
  const rows = o.per.map((p) => h('tr', {}, h('td', { text: `Dia ${p.n} · ${formatShort(p.date)}` }), h('td', { text: p.stats.started ? (p.stats.morningDone ? 'Concluída' : 'Em andamento') : '—' }), h('td', { text: p.stats.exerciseDone ? 'Sim' : '—' }), h('td', { text: p.stats.eveningDone ? 'Sim' : '—' }), h('td', { class: 'num', text: p.stats.intensity != null ? String(p.stats.intensity) : '—' })));
  view.append(card([eyebrow('Dia a dia'), h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, h('th', { text: 'Dia' }), h('th', { text: 'Manhã' }), h('th', { text: 'Exercício' }), h('th', { text: 'Revisão' }), h('th', { text: 'Emoção' }))), h('tbody', {}, rows)))]));
  view.append(emotionChart(ctx));
  view.append(h('div', { class: 'btn-row' }, linkBtn('Episódios de ansiedade', '#/ajuda/historico', { icon: 'lifebuoy' }), linkBtn('Jejum digital', '#/jejum', { icon: 'phone' })));
  return view;
}
