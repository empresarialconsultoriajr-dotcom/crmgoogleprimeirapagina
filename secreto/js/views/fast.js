import { h, card, eyebrow, para, note, button, linkBtn, chips, textarea, field, toast, modal } from '../ui.js';
import { FAST_RULES, FAST_PROTOCOL, FAST_ALTERNATIVES, FAST_BREAK } from '../data/content.js';
import { nowISO, formatDateTime } from '../dates.js';

export function fast(ctx) {
  const view = h('div', { class: 'view' });
  const eps = ctx.store.get('fast.episodes', []);
  const urges = eps.filter((e) => e.type === 'urge');
  const resisted = urges.filter((e) => e.outcome === 'resisti').length;
  const breaks = eps.filter((e) => e.type === 'break').length;
  view.append(card([eyebrow('Jejum digital'), h('h1', { class: 'title', text: 'Domínio próprio no celular' }), para('Reduzir estímulos que alimentam ansiedade, comparação e impulsividade. Uma falha isolada não é o fracasso do propósito.')], 'card-plain'));
  view.append(card([
    h('div', { class: 'btn-row' }, button('Senti vontade de verificar as redes', { variant: 'primary', icon: 'phone', full: true, onClick: () => urgeProtocol(ctx) })),
    h('div', { class: 'btn-row' }, button('Quebrei uma regra', { variant: 'outline-gold', onClick: () => breakProtocol(ctx) })),
  ], 'card-gold'));
  view.append(card([eyebrow('Regras que pretendo seguir'), h('ul', { class: 'ul' }, FAST_RULES.map((r) => h('li', { text: r })))]));
  view.append(card([eyebrow('Registros'), h('div', { class: 'stats' }, stat('Impulsos registrados', urges.length), stat('Passaram sem abrir', resisted), stat('Regras quebradas', breaks)), note('Contagens honestas, sem pontuação. Elas existem para você enxergar padrões.')]));
  if (eps.length) {
    const list = h('div', { class: 'list' });
    eps.slice().reverse().forEach((e) => list.append(h('div', { class: 'item' },
      h('div', { class: 'item-meta' }, h('span', { text: formatDateTime(e.at) }), h('span', { text: e.type === 'urge' ? (e.outcome === 'resisti' ? 'Vontade passou' : e.outcome === 'abri' ? 'Abri a rede' : 'Impulso') : 'Regra quebrada' })),
      e.feeling ? h('p', {}, h('b', { text: 'Sentimento: ' }), e.feeling) : null,
      e.trigger ? h('p', {}, h('b', { text: 'Gatilho: ' }), e.trigger) : null,
      e.alternative ? h('p', {}, h('b', { text: 'Alternativa: ' }), e.alternative) : null,
      e.prepare ? h('p', {}, h('b', { text: 'Preparação: ' }), e.prepare) : null,
      h('div', { class: 'row' }, button('Excluir', { variant: 'ghost', small: true, onClick: () => { ctx.store.set('fast.episodes', ctx.store.get('fast.episodes', []).filter((x) => x.id !== e.id), { immediate: true }); ctx.rerender(); } })),
    )));
    view.append(card([eyebrow('Histórico'), list]));
  }
  return view;
}

function stat(label, value) { return h('div', { class: 'stat' }, h('div', { class: 'stat-value', text: String(value) }), h('div', { class: 'stat-label', text: label })); }

function urgeProtocol(ctx) {
  const base = ['fast', 'draft'];
  ctx.store.set(base, {}, { immediate: true });
  const body = h('div', { class: 'stack' },
    ...FAST_PROTOCOL.map((f) => field(f.label, textarea([...base, f.key], { rows: 2, placeholder: f.placeholder }))),
    h('div', { class: 'field' }, h('div', { class: 'label', text: 'Alternativas saudáveis para os próximos dez minutos' }), chips([...base, 'alternative'], FAST_ALTERNATIVES)),
    h('div', { class: 'field' }, h('div', { class: 'label', text: 'O que aconteceu?' }), chips([...base, 'outcome'], [{ value: 'resisti', label: 'A vontade passou sem abrir' }, { value: 'abri', label: 'Acabei abrindo' }, { value: 'pendente', label: 'Ainda não sei' }])),
  );
  modal({ title: 'Senti vontade de verificar as redes', body, actions: [
    { label: 'Descartar' },
    { label: 'Salvar registro', variant: 'primary', onClick: () => {
      const d = ctx.store.get(base, {});
      if (!(d.feeling || '').trim() && !d.alternative) { toast('Responda ao menos a primeira pergunta ou escolha uma alternativa.', 'error'); return false; }
      ctx.store.push('fast.episodes', { id: ctx.store.uid(), type: 'urge', at: nowISO(), date: ctx.today(), ...d }, { immediate: true });
      ctx.store.set(base, {}, { immediate: true });
      ctx.store.logActivity('Impulso digital registrado');
      toast('Registro salvo'); ctx.rerender();
    } },
  ] });
}

function breakProtocol(ctx) {
  const base = ['fast', 'draft'];
  ctx.store.set(base, {}, { immediate: true });
  const body = h('div', { class: 'stack' },
    note('Sem vergonha, sem punição. O registro serve para entender e se preparar melhor.'),
    h('div', { class: 'field' }, h('div', { class: 'label', text: 'Qual regra?' }), chips([...base, 'rule'], FAST_RULES.map((r, i) => ({ value: String(i), label: r.length > 60 ? r.slice(0, 58) + '…' : r })))),
    ...FAST_BREAK.map((f) => field(f.label, textarea([...base, f.key], { rows: 2, placeholder: f.placeholder }))),
  );
  modal({ title: 'Quebrei uma regra', body, actions: [
    { label: 'Descartar' },
    { label: 'Salvar registro', variant: 'primary', onClick: () => {
      const d = ctx.store.get(base, {});
      if (!(d.trigger || '').trim() && !(d.before || '').trim()) { toast('Descreva o que aconteceu antes ou o gatilho.', 'error'); return false; }
      ctx.store.push('fast.episodes', { id: ctx.store.uid(), type: 'break', at: nowISO(), date: ctx.today(), ...d, ruleText: d.rule != null ? FAST_RULES[Number(d.rule)] : '' }, { immediate: true });
      ctx.store.set(base, {}, { immediate: true });
      ctx.store.logActivity('Regra do jejum digital quebrada (registrada)');
      toast('Registro salvo. Amanhã continua.'); ctx.rerender();
    } },
  ] });
}
