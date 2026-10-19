import { h, card, eyebrow, para, note, button, linkBtn, chips, textarea, input, scripture, stepHeader, field, toast } from '../ui.js';
import { DAYS, dayByDate } from '../data/days.js';
import { MOODS } from '../data/content.js';
import { formatLong, nowISO } from '../dates.js';

const STEPS = ['prepare', 'reading', 'prayer', 'journal', 'commitment'];
const LABELS = { prepare: 'Prepare-se', reading: 'Leitura bíblica', prayer: 'Oração', journal: 'Diário', commitment: 'Compromisso' };

export function morning(ctx, params) {
  const date = params[0] && dayByDate(params[0]) ? params[0] : ctx.activeDate();
  const d = dayByDate(date);
  const base = ['days', date, 'morning'];
  const m = () => ctx.store.get(base, {});
  if (!m().startedAt) {
    ctx.store.set([...base, 'startedAt'], nowISO(), { immediate: true });
    ctx.store.set([...base, 'step'], 0, { immediate: true });
    ctx.store.logActivity(`Dia ${d.n} iniciado`, { date });
  }
  let step = Math.min(Math.max(m().step || 0, 0), STEPS.length);
  const view = h('div', { class: 'view' });
  const body = h('div', { class: 'stack' });
  const header = card([
    eyebrow(`Rotina da manhã · Dia ${d.n} · ${formatLong(date)}`),
    h('h1', { class: 'title', text: d.title }),
    h('div', { class: 'step-dots' }, STEPS.map((s, i) => h('div', { class: `step-dot${i === step ? ' on' : (m().steps || {})[s]?.done ? ' done' : ''}` }))),
  ], 'card-plain');
  view.append(header, body);

  const go = (n) => { step = Math.min(Math.max(n, 0), STEPS.length); ctx.store.set([...base, 'step'], step, { immediate: true }); renderStep(); window.scrollTo({ top: 0 }); };
  const markDone = (key, skipped = false) => { ctx.store.set([...base, 'steps', key], { done: !skipped, skipped, at: nowISO() }, { immediate: true }); if (!skipped) ctx.store.logActivity(`${LABELS[key]} · Dia ${d.n}`, { date }); };
  const nav = (key, { validate } = {}) => h('div', { class: 'step-nav' },
    step > 0 ? button('Voltar', { icon: 'left', onClick: () => go(step - 1) }) : linkBtn('Início', '#/', { icon: 'home' }),
    button('Pular etapa', { variant: 'ghost', onClick: () => { markDone(key, true); go(step + 1); } }),
    button('Salvar e continuar', { variant: 'primary', icon: 'right', onClick: () => { if (validate && !validate()) return; markDone(key); go(step + 1); } }),
  );

  function renderStep() {
    body.innerHTML = '';
    header.querySelectorAll('.step-dot').forEach((el, i) => { el.className = `step-dot${i === step ? ' on' : (m().steps || {})[STEPS[i]]?.done ? ' done' : ''}`; });
    const key = STEPS[step];
    if (step >= STEPS.length) return body.append(renderDone());
    if (key === 'prepare') body.append(card([
      stepHeader(1, 5, 'Prepare-se'),
      para('Silêncio, respiração tranquila e preparação. Não há pressa.'),
      h('div', { class: 'field' }, h('div', { class: 'label', text: 'Como você está chegando a esta manhã?' }), chips([...base, 'mood'], MOODS, { multi: true, allowOther: true })),
      field('Horas de sono (opcional)', input([...base, 'sleep'], { type: 'text', placeholder: 'Ex.: 5h' }), { hint: 'Se dormiu muito pouco, considere encurtar a rotina de hoje e preservar o descanso. Isso não é fracasso espiritual.' }),
      note('Campos opcionais. Marque apenas o que for verdadeiro.'),
      nav('prepare'),
    ]));
    if (key === 'reading') body.append(card([
      stepHeader(2, 5, 'Leitura bíblica'),
      ...d.readings.map((r) => scripture(r)),
      h('hr', { class: 'rule' }),
      eyebrow('Perguntas de reflexão'),
      ...d.questions.map((q, i) => field(`${i + 1}. ${q}`, textarea([...base, 'reading', `q${i + 1}`], { rows: 2, placeholder: 'Opcional, mas recomendado.' }))),
      nav('reading'),
    ]));
    if (key === 'prayer') body.append(card([
      stepHeader(3, 5, 'Oração'),
      para('Uma oração orientadora, para você adaptar com as suas próprias palavras. Ela não promete resultados; pede fidelidade, sabedoria e domínio próprio.'),
      h('blockquote', { class: 'verse', text: d.prayer }),
      field('Minha oração (opcional)', textarea([...base, 'prayer', 'text'], { rows: 4, placeholder: 'Escreva com as suas palavras, se quiser.' })),
      h('div', { class: 'field' }, h('div', { class: 'label', text: 'Orei neste momento?' }), chips([...base, 'prayer', 'prayed'], ['Sim', 'Vou orar mais tarde'])),
      nav('prayer'),
    ]));
    if (key === 'journal') body.append(card([
      stepHeader(4, 5, 'Diário'),
      field('O que estou entregando a Deus hoje?', textarea([...base, 'journal', 'surrender'], { rows: 2 })),
      field('O que está sob minha responsabilidade?', textarea([...base, 'journal', 'mine'], { rows: 2 })),
      field('O que não está sob meu controle?', textarea([...base, 'journal', 'notMine'], { rows: 2 })),
      field('Qual atitude concreta demonstrará fidelidade hoje?', textarea([...base, 'journal', 'attitude'], { rows: 2 })),
      h('hr', { class: 'rule' }),
      field(`Pergunta do Dia ${d.n}: ${d.journalQuestion}`, textarea([...base, 'journal', 'dayQuestion'], { rows: 3 })),
      note('O diário completo (emoção, gatilho, gratidão...) fica em Diário e pode ser preenchido ao longo do dia.'),
      nav('journal'),
    ]));
    if (key === 'commitment') {
      const cur = ctx.store.get([...base, 'commitment', 'text'], '');
      const ta = textarea([...base, 'commitment', 'text'], { rows: 2, placeholder: 'Uma ação prática, específica e possível hoje.' });
      body.append(card([
        stepHeader(5, 5, 'Compromisso'),
        para('Escolha uma ação prática para cumprir durante o dia. À noite, você registrará se a cumpriu.'),
        h('div', { class: 'field' }, h('div', { class: 'label', text: 'Sugestão a partir da prática do dia' }), h('p', { class: 'p muted', text: d.practice }), button('Usar a prática do dia como compromisso', { small: true, onClick: () => { ta.value = d.practice; ctx.store.set([...base, 'commitment', 'text'], d.practice); } })),
        field('Meu compromisso de hoje', ta),
        nav('commitment', { validate: () => { if (!(ctx.store.get([...base, 'commitment', 'text'], '') || '').trim()) { ta.classList.add('invalid'); toast('Escreva o compromisso antes de continuar, ou pule a etapa.', 'error'); return false; } ctx.store.set([...base, 'completedAt'], nowISO(), { immediate: true }); ctx.store.logActivity(`Rotina da manhã do Dia ${d.n} concluída`, { date }); return true; } }),
      ]));
    }
  }

  function renderDone() {
    if (!m().completedAt) { ctx.store.set([...base, 'completedAt'], nowISO(), { immediate: true }); ctx.store.logActivity(`Rotina da manhã do Dia ${d.n} concluída`, { date }); }
    const steps = m().steps || {};
    const skipped = STEPS.filter((s) => steps[s]?.skipped).map((s) => LABELS[s]);
    return card([
      eyebrow('Manhã concluída'),
      h('h2', { class: 'title', text: 'Sua consagração desta manhã está registrada' }),
      m().commitment?.text ? h('div', {}, h('div', { class: 'label', text: 'Compromisso do dia' }), h('p', { class: 'verse', text: m().commitment.text })) : null,
      skipped.length ? note(`Etapas puladas: ${skipped.join(', ')}. Você pode voltar e preenchê-las quando quiser.`) : null,
      h('div', { class: 'btn-row' }, linkBtn('Exercício e prática do dia', `#/dia/${date}`, { variant: 'primary', icon: 'compass' }), linkBtn('Trabalho e DClin', `#/trabalho/${date}`, { icon: 'briefcase' })),
      h('div', { class: 'btn-row' }, button('Rever etapas', { variant: 'ghost', icon: 'left', onClick: () => go(0) }), linkBtn('Início', '#/', { variant: 'ghost', icon: 'home' })),
    ], 'card-gold');
  }

  renderStep();
  return view;
}
