import { h, card, eyebrow, para, note, button, linkBtn, chips, textarea, field, stepHeader, toast } from '../ui.js';
import { HELP_SITUATIONS, HELP_STEPS, HELP_DISCLAIMER } from '../data/content.js';
import { nowISO, formatDateTime } from '../dates.js';

// Apoio em momentos de ansiedade. O episódio em andamento fica em help.current até ser salvo.
export function help(ctx) {
  const base = ['help', 'current'];
  const cur = () => ctx.store.get(base, {});
  if (!cur().startedAt) ctx.store.set(base, { startedAt: nowISO(), step: 0 }, { immediate: true });
  let step = cur().step || 0;
  const view = h('div', { class: 'view' });
  const body = h('div', { class: 'stack' });
  view.append(card([eyebrow('Preciso de ajuda agora'), h('h1', { class: 'title', text: 'Vamos com calma' }), note('Uma experiência curta. Nada aqui envia mensagens nem toma decisões por você.')], 'card-plain'), body);
  const go = (n) => { step = n; ctx.store.set([...base, 'step'], n, { immediate: true }); render(); window.scrollTo({ top: 0 }); };
  const nav = (next, { validate, nextLabel = 'Continuar' } = {}) => h('div', { class: 'step-nav' }, step > 0 ? button('Voltar', { icon: 'left', onClick: () => go(step - 1) }) : button('Cancelar', { variant: 'ghost', onClick: () => { ctx.store.set(base, {}, { immediate: true }); ctx.navigate('#/'); } }), button(nextLabel, { variant: 'primary', icon: 'right', onClick: () => { if (validate && !validate()) return; go(next); } }));

  function render() {
    body.innerHTML = '';
    if (step === 0) body.append(card([
      h('h2', { class: 'title', text: 'O que está acontecendo neste momento?' }),
      chips([...base, 'situation'], HELP_SITUATIONS, { allowOther: true }),
      nav(1, { validate: () => { if (!cur().situation) { toast('Escolha uma opção para continuar.', 'error'); return false; } return true; } }),
    ]));
    if (step === 1) body.append(card([stepHeader(1, 6, HELP_STEPS.pause.title), para(HELP_STEPS.pause.text), breathing(), nav(2, { nextLabel: 'Já respirei. Continuar' })]));
    if (step === 2) body.append(card([stepHeader(2, 6, HELP_STEPS.identify.title), ...HELP_STEPS.identify.fields.map((f) => field(f.label, textarea([...base, f.key], { rows: 2, placeholder: f.placeholder }))), nav(3)]));
    if (step === 3) body.append(card([
      stepHeader(3, 6, HELP_STEPS.reality.title), para(HELP_STEPS.reality.intro),
      h('div', { class: 'example' }, HELP_STEPS.reality.example.flatMap(([k, v]) => [h('b', { text: k }), h('span', { text: v })])),
      note('Não trate a hipótese como verdade.'),
      ...HELP_STEPS.reality.fields.map((f) => field(f.label, textarea([...base, f.key], { rows: 2, placeholder: f.placeholder }))),
      nav(4),
    ]));
    if (step === 4) body.append(card([stepHeader(4, 6, HELP_STEPS.responsibility.title), h('div', { class: 'label', text: HELP_STEPS.responsibility.question }), chips([...base, 'actionNeeded'], HELP_STEPS.responsibility.options), note(HELP_STEPS.responsibility.hint), field('Se sim, qual é a ação necessária?', textarea([...base, 'actionText'], { rows: 2, placeholder: 'Algo concreto, que não seja apenas aliviar a ansiedade.' })), nav(5)]));
    if (step === 5) body.append(card([
      stepHeader(5, 6, HELP_STEPS.decision.title), para(HELP_STEPS.decision.intro),
      chips([...base, 'decisionChoice'], HELP_STEPS.decision.options),
      field(HELP_STEPS.decision.field.label, textarea([...base, 'decision'], { rows: 2, placeholder: HELP_STEPS.decision.field.placeholder })),
      note('Se a decisão envolve mensagem necessária, o módulo Relacionamento ajuda a escrevê-la com clareza. Nada é enviado por este sistema.'),
      nav(6, { validate: () => { if (!cur().decisionChoice && !(cur().decision || '').trim()) { toast('Escolha ou escreva uma decisão.', 'error'); return false; } return true; } }),
    ]));
    if (step === 6) body.append(card([
      stepHeader(6, 6, HELP_STEPS.record.title), para(HELP_STEPS.record.text),
      h('div', { class: 'btn-row' },
        button('Salvar no diário emocional', { variant: 'primary', icon: 'check', onClick: () => {
          const ep = { ...cur(), id: ctx.store.uid(), at: nowISO(), date: ctx.today() };
          delete ep.step; delete ep.startedAt;
          ctx.store.push('help.episodes', ep, { immediate: true });
          ctx.store.set(base, {}, { immediate: true });
          ctx.store.logActivity('Episódio de ansiedade registrado');
          toast('Episódio salvo');
          ctx.navigate('#/ajuda/historico');
        } }),
        button('Descartar sem salvar', { variant: 'ghost', onClick: () => { ctx.store.set(base, {}, { immediate: true }); ctx.navigate('#/'); } }),
      ),
    ]));
    body.append(note(HELP_DISCLAIMER));
  }
  render();
  return view;
}

function breathing() {
  const circle = h('div', { style: { width: '72px', height: '72px', borderRadius: '50%', border: '1px solid var(--gold)', margin: '8px auto', transition: 'transform 4s ease-in-out', transform: 'scale(0.7)' } });
  const label = h('div', { class: 'note', style: { textAlign: 'center' }, text: 'Toque para iniciar uma respiração guiada (4-2-6).' });
  let running = false;
  const wrap = h('button', { type: 'button', class: 'btn btn-ghost btn-full', style: { flexDirection: 'column', minHeight: '140px' }, onClick: () => {
    if (running) return; running = true;
    const cycle = (n) => { if (n <= 0) { running = false; label.textContent = 'Concluído. Repita se precisar.'; circle.style.transform = 'scale(0.7)'; return; }
      label.textContent = 'Inspire… (4)'; circle.style.transform = 'scale(1.3)';
      setTimeout(() => { label.textContent = 'Segure… (2)'; setTimeout(() => { label.textContent = 'Solte… (6)'; circle.style.transitionDuration = '6s'; circle.style.transform = 'scale(0.7)'; setTimeout(() => { circle.style.transitionDuration = '4s'; cycle(n - 1); }, 6000); }, 2000); }, 4000); };
    cycle(3);
  } }, circle, label);
  return wrap;
}

export function helpHistory(ctx) {
  const eps = ctx.store.get('help.episodes', []).slice().reverse();
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow('Diário emocional'), h('h1', { class: 'title', text: 'Episódios registrados' }), para('Observe padrões: situações, horários e decisões que se repetem. Isto não é um diagnóstico.')], 'card-plain'));
  if (!eps.length) view.append(card([note('Nenhum episódio registrado ainda.')]));
  const counts = {};
  eps.forEach((e) => { const l = labelFor(e.situation, e.situationOther); counts[l] = (counts[l] || 0) + 1; });
  if (eps.length) view.append(card([eyebrow('Padrões (contagem por situação)'), h('dl', { class: 'kv' }, Object.entries(counts).sort((a, b) => b[1] - a[1]).flatMap(([k, v]) => [h('dt', { text: String(v) }), h('dd', { text: k })]))]));
  const list = h('div', { class: 'list' });
  eps.forEach((e) => list.append(h('div', { class: 'item' },
    h('div', { class: 'item-meta' }, h('span', { text: formatDateTime(e.at) }), h('span', { text: labelFor(e.situation, e.situationOther) })),
    e.happened ? h('p', {}, h('b', { text: 'Fato: ' }), e.happened) : null,
    e.emotion ? h('p', {}, h('b', { text: 'Emoção: ' }), e.emotion) : null,
    (e.decisionChoice || e.decision) ? h('p', {}, h('b', { text: 'Decisão: ' }), [e.decisionChoice, e.decision].filter(Boolean).join(' · ')) : null,
    h('div', { class: 'row' }, button('Excluir', { variant: 'ghost', small: true, onClick: () => { ctx.store.set('help.episodes', ctx.store.get('help.episodes', []).filter((x) => x.id !== e.id), { immediate: true }); ctx.rerender(); } })),
  )));
  view.append(list);
  view.append(h('div', { class: 'btn-row' }, linkBtn('Preciso de ajuda agora', '#/ajuda', { variant: 'outline-gold', icon: 'lifebuoy' }), linkBtn('Início', '#/', { variant: 'ghost', icon: 'home' })));
  return view;
}

function labelFor(value, other) { const s = HELP_SITUATIONS.find((x) => x.value === value); if (value === 'outro' && other) return other; return s ? s.label : (value || 'Sem situação'); }
