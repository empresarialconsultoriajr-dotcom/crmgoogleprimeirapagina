import { h, card, eyebrow, para, note, button, linkBtn, chips, textarea, field, toast } from '../ui.js';
import { RELATIONSHIP_QUESTIONS, RELATIONSHIP_PRINCIPLES, SITUATION_A, SITUATION_B, SITUATION_C } from '../data/content.js';
import { nowISO, formatDateTime } from '../dates.js';

export function relationship(ctx, params) {
  const tab = params[0] || 'reflexao';
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow('Relacionamento'), h('h1', { class: 'title', text: 'Área privada sobre a Dani' }), para('Reflexão honesta, sem vigilância, sem interpretação de redes sociais e sem estratégia.')], 'card-plain'));
  view.append(h('div', { class: 'chips' }, [['reflexao', 'Reflexão'], ['a', 'A. Mensagem'], ['b', 'B. Ela me procura'], ['c', 'C. Conversa sobre o futuro']].map(([k, l]) => h('a', { class: `chip${tab === k ? ' chip-on' : ''}`, href: `#/dani/${k}` }, l))));
  if (tab === 'reflexao') view.append(reflection(ctx));
  if (tab === 'a') view.append(situationA(ctx));
  if (tab === 'b') view.append(card([eyebrow(SITUATION_B.title), h('ul', { class: 'ul' }, SITUATION_B.points.map((p) => h('li', { text: p }))), linkBtn('Registrar no diário', `#/diario/${ctx.activeDate()}`, { icon: 'pen' })]));
  if (tab === 'c') view.append(card([eyebrow(SITUATION_C.title), para(SITUATION_C.intro), ...SITUATION_C.fields.map((f) => field(f.label, textarea(['relationship', 'futureTalk', f.key], { rows: 2, placeholder: f.placeholder }))), note('Salvo automaticamente. A decisão sobre o futuro pertence aos dois.')]));
  view.append(card([eyebrow('Princípios'), h('ul', { class: 'ul' }, RELATIONSHIP_PRINCIPLES.map((p) => h('li', { text: p })))]));
  return view;
}

function reflection(ctx) {
  const base = ['relationship', 'draft'];
  const form = card([
    eyebrow('Reflexão de hoje'),
    ...RELATIONSHIP_QUESTIONS.map((q) => h('div', { class: 'field' }, h('div', { class: 'label', text: q.text }), chips([...base, q.key], q.options))),
    field('Observações (opcional)', textarea([...base, 'notes'], { rows: 2, placeholder: 'Fatos observáveis, sem suposições.' })),
    button('Salvar reflexão', { variant: 'primary', icon: 'check', onClick: () => {
      const d = ctx.store.get(base, {});
      const answered = RELATIONSHIP_QUESTIONS.filter((q) => d[q.key]).length;
      if (answered < 3) { toast('Responda pelo menos três perguntas.', 'error'); return; }
      ctx.store.push('relationship.reflections', { id: ctx.store.uid(), at: nowISO(), date: ctx.today(), ...d }, { immediate: true });
      ctx.store.set(base, {}, { immediate: true });
      ctx.store.logActivity('Reflexão sobre o relacionamento registrada');
      toast('Reflexão salva'); ctx.rerender();
    } }),
  ]);
  const refs = ctx.store.get('relationship.reflections', []).slice().reverse();
  const hist = card([eyebrow('Reflexões anteriores'), refs.length ? h('div', { class: 'list' }, refs.map((r) => h('div', { class: 'item' }, h('div', { class: 'item-meta' }, h('span', { text: formatDateTime(r.at) })), h('dl', { class: 'kv' }, RELATIONSHIP_QUESTIONS.filter((q) => r[q.key]).flatMap((q) => [h('dt', { text: shortQ(q.key) }), h('dd', { text: r[q.key] })])), r.notes ? h('p', { text: r.notes }) : null))) : note('Nenhuma reflexão registrada ainda.')]);
  return h('div', { class: 'stack' }, form, hist);
}
function shortQ(k) { return { need: 'Motivo', space: 'Tempo dela', initiating: 'Inicio tudo', convincing: 'Convencer', identity: 'Identidade', limits: 'Meus limites', reciprocity: 'Reciprocidade' }[k] || k; }

function situationA(ctx) {
  const base = ['relationship', 'msgDraft'];
  const verdict = h('div', { class: 'banner banner-info', text: '' });
  const update = () => {
    const d = ctx.store.get(base, {});
    const intent = d.intent || '';
    const wait = /ansiedade|Verificar|Cobrar/.test(intent) || d.need === 'Não' || d.timing === 'Não, é tarde ou estou emocionalmente alterado';
    if (!intent) verdict.textContent = 'Responda às perguntas acima para ver a orientação.';
    else if (wait) verdict.textContent = 'Orientação: esperar. ' + SITUATION_A.verdictHint;
    else if (d.timing === 'Posso esperar') verdict.textContent = 'Orientação: pode esperar. Se ainda fizer sentido mais tarde, escreva com calma.';
    else verdict.textContent = 'Há necessidade real e o momento é adequado. Escreva a mensagem com clareza e respeito, confira a lista e envie você mesmo pelo seu aplicativo quando estiver calmo.';
  };
  update();
  const checks = SITUATION_A.checklist.map((c, i) => h('label', { class: 'check-row', style: { cursor: 'pointer' } }, h('input', { type: 'checkbox', id: `msgchk${i}`, checked: !!(ctx.store.get([...base, 'checks'], [])[i]), onChange: (e) => { const arr = (ctx.store.get([...base, 'checks'], []) || []).slice(); arr[i] = e.target.checked; ctx.store.set([...base, 'checks'], arr); } }), h('span', { class: 'check-text', text: c })));
  return card([
    eyebrow(SITUATION_A.title), para(SITUATION_A.intro),
    h('div', { class: 'field' }, h('div', { class: 'label', text: SITUATION_A.intent.label }), chips([...base, 'intent'], SITUATION_A.intent.options, { onChange: update })),
    h('div', { class: 'field' }, h('div', { class: 'label', text: SITUATION_A.need.label }), chips([...base, 'need'], SITUATION_A.need.options, { onChange: update })),
    h('div', { class: 'field' }, h('div', { class: 'label', text: SITUATION_A.timing.label }), chips([...base, 'timing'], SITUATION_A.timing.options, { onChange: update })),
    verdict,
    h('div', { class: 'field' }, h('div', { class: 'label', text: 'Conferência antes de enviar' }), h('div', { class: 'checklist' }, checks)),
    field(SITUATION_A.draft.label, textarea([...base, 'text'], { rows: 4, placeholder: SITUATION_A.draft.placeholder })),
    h('div', { class: 'btn-row' }, button('Guardar rascunho no histórico', { icon: 'check', onClick: () => { const d = ctx.store.get(base, {}); if (!(d.text || '').trim()) { toast('Escreva o rascunho antes de guardar.', 'error'); return; } ctx.store.push('relationship.messages', { id: ctx.store.uid(), at: nowISO(), ...d }, { immediate: true }); ctx.store.set(base, {}, { immediate: true }); toast('Rascunho guardado'); ctx.rerender(); } }), linkBtn('Preciso de ajuda agora', '#/ajuda', { variant: 'outline-gold', icon: 'lifebuoy' })),
    (() => { const msgs = ctx.store.get('relationship.messages', []).slice().reverse(); return msgs.length ? h('div', { class: 'list' }, msgs.map((m) => h('div', { class: 'item' }, h('div', { class: 'item-meta' }, h('span', { text: formatDateTime(m.at) }), h('span', { text: m.intent || '' })), h('p', { text: m.text })))) : null; })(),
    note('Este sistema nunca envia mensagens. O envio, se for o caso, é uma decisão sua, feita no seu aplicativo.'),
  ]);
}
