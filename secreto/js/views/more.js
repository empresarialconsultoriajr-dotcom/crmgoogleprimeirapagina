import { h, card, eyebrow, para, note, button, icon, toast, confirmModal, field, input, modal } from '../ui.js';
import { APP_TAGLINE } from '../data/content.js';
import { DAYS } from '../data/days.js';
import { formatLong, formatDateTime, formatShort, todayISO, isValidISO } from '../dates.js';
import { JOURNAL_FIELDS, EVENING_QUESTIONS, CLOSING_REPORT } from '../data/content.js';

export function more(ctx) {
  const items = [
    ['#/jejum', 'phone', 'Jejum digital', 'Regras, protocolo de impulso e registros'],
    ['#/dani', 'heart', 'Relacionamento', 'Reflexão privada e orientações para três situações'],
    ['#/ajuda/historico', 'lifebuoy', 'Diário emocional', 'Episódios de ansiedade e padrões'],
    ['#/progresso', 'chart', 'Progresso', 'Indicadores de consistência'],
    ['#/encerramento', 'flag', 'Encerramento e continuidade', 'Relatório pessoal e plano de 30 dias'],
    ['#/ajustes', 'settings', 'Ajustes e backup', 'Exportar, importar, horários'],
  ];
  return h('div', { class: 'view' },
    card([eyebrow('Mais'), h('h1', { class: 'title', text: 'Módulos' }), h('p', { class: 'subtitle', text: APP_TAGLINE })], 'card-plain'),
    card([h('div', { class: 'menu-list' }, items.map(([href, ic, t, d]) => h('a', { class: 'menu-item', href }, icon(ic, 22), h('span', { class: 'menu-text' }, h('span', { text: t }), h('span', { class: 'menu-desc', text: d })), icon('right', 18))))]),
  );
}

export function settings(ctx) {
  const view = h('div', { class: 'view' });
  view.append(card([eyebrow('Ajustes'), h('h1', { class: 'title', text: 'Dados, backup e rotina' })], 'card-plain'));
  view.append(card([
    eyebrow('Onde ficam os meus dados'),
    para('Todos os registros ficam somente neste navegador, neste aparelho (armazenamento local). Não há conta, servidor ou sincronização. Limpar os dados do navegador, usar modo privado ou trocar de aparelho faz os registros desaparecerem. Exporte um backup com regularidade.'),
  ]));
  view.append(card([
    eyebrow('Exportar registros'),
    para('Gera uma versão legível (texto) ou um arquivo completo (JSON) para restaurar depois.'),
    h('div', { class: 'btn-row' }, button('Texto legível', { icon: 'download', onClick: () => showExport(ctx, 'md') }), button('Backup completo (JSON)', { icon: 'download', onClick: () => showExport(ctx, 'json') })),
  ]));
  const file = h('input', { type: 'file', accept: 'application/json,.json', class: 'input', id: 'import-file' });
  view.append(card([
    eyebrow('Importar backup'), para('Substitui os registros atuais pelos do arquivo JSON exportado anteriormente.'), file,
    button('Importar', { onClick: () => {
      const f = file.files && file.files[0]; if (!f) { toast('Escolha um arquivo .json.', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => { confirmModal('Importar backup', 'Os registros atuais serão substituídos pelos do arquivo. Deseja continuar?', () => { try { ctx.store.importJSON(String(reader.result)); toast('Backup importado'); ctx.navigate('#/'); } catch (e) { toast(e.message || 'Arquivo inválido.', 'error'); } }); };
      reader.onerror = () => toast('Não foi possível ler o arquivo.', 'error');
      reader.readAsText(f);
    } }),
  ]));
  view.append(card([
    eyebrow('Rotina'),
    field('Horário de despertar (referência)', input('settings.wakeTime', { type: 'time' })),
    field('Horário do treino (referência)', input('settings.workoutTime', { type: 'time' })),
    note('Referências ajustáveis. Preserve o sono quando necessário.'),
  ]));
  view.append(card([
    eyebrow('Zona de cuidado'),
    para('Apagar todos os registros deste aparelho. Esta ação não pode ser desfeita.'),
    button('Apagar todos os registros', { variant: 'danger', onClick: () => confirmModal('Apagar tudo', 'Todos os registros serão apagados deste aparelho. Exporte um backup antes, se quiser guardá-los.', () => { ctx.store.resetAll(); toast('Registros apagados'); ctx.navigate('#/'); }, { yesLabel: 'Apagar', danger: true }) }),
  ]));
  view.append(note(`Hoje em São Paulo: ${formatLong(todayISO())}. Início do propósito: ${formatShort(ctx.startDate())}.`));
  return view;
}

function showExport(ctx, kind) {
  const text = kind === 'json' ? ctx.store.exportJSON() : exportMarkdown(ctx);
  const name = kind === 'json' ? `secreto-backup-${todayISO()}.json` : `secreto-registros-${todayISO()}.md`;
  const pre = h('pre', { class: 'pre', text: text });
  const copy = async () => { try { await navigator.clipboard.writeText(text); toast('Copiado para a área de transferência'); } catch (e) { const r = document.createRange(); r.selectNodeContents(pre); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast('Selecione e copie o texto manualmente.'); } };
  const download = () => { try { const blob = new Blob([text], { type: kind === 'json' ? 'application/json' : 'text/markdown' }); const url = URL.createObjectURL(blob); const a = h('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); toast('Download iniciado. Se nada acontecer, use "Copiar".'); } catch (e) { toast('Download indisponível aqui. Use "Copiar".', 'error'); } };
  modal({ title: kind === 'json' ? 'Backup completo' : 'Registros em texto', body: h('div', { class: 'stack' }, note(`${name} · ${(text.length / 1024).toFixed(1)} KB`), pre), actions: [{ label: 'Copiar', onClick: () => { copy(); return false; } }, { label: 'Baixar arquivo', variant: 'primary', onClick: () => { download(); return false; } }, { label: 'Fechar' }] });
}

export function exportMarkdown(ctx) {
  const s = ctx.store.getState();
  const L = [];
  L.push('# SECRETO — 10 dias de consagração', `Exportado em ${formatDateTime(new Date().toISOString())} (São Paulo)`, '');
  for (const d of DAYS) {
    const day = s.days[d.date]; if (!day) continue;
    L.push(`## Dia ${d.n} — ${d.title} (${formatShort(d.date)})`);
    const m = day.morning || {};
    if (m.startedAt) L.push(`- Manhã iniciada: ${formatDateTime(m.startedAt)}${m.completedAt ? ` · concluída: ${formatDateTime(m.completedAt)}` : ''}`);
    if (m.mood && m.mood.length) L.push(`- Como cheguei: ${m.mood.join(', ')}${m.moodOther ? ', ' + m.moodOther : ''}`);
    if (m.reading) d.questions.forEach((q, i) => { if (m.reading[`q${i + 1}`]) L.push(`- ${q}\n  ${m.reading[`q${i + 1}`]}`); });
    if (m.prayer && m.prayer.text) L.push(`- Minha oração: ${m.prayer.text}`);
    if (m.journal) { const j = m.journal; [['Entrego a Deus', j.surrender], ['Minha responsabilidade', j.mine], ['Fora do meu controle', j.notMine], ['Atitude de fidelidade', j.attitude], [d.journalQuestion, j.dayQuestion]].forEach(([k, v]) => { if (v) L.push(`- ${k}: ${v}`); }); }
    if (m.commitment && m.commitment.text) L.push(`- Compromisso: ${m.commitment.text}${m.commitment.fulfilledLabel ? ` (${m.commitment.fulfilledLabel})` : ''}`);
    const ex = day.exercise; if (ex) { const e = d.exercise; if (e.type === 'columns') e.columns.forEach((c) => { const arr = ex[c.key] || []; if (arr.length) L.push(`- ${c.label}: ${arr.map((i) => i.text).join('; ')}`); }); else if (e.prompts) e.prompts.forEach((p) => { if (ex[p.key]) L.push(`- ${p.label}: ${ex[p.key]}`); }); }
    const w = day.work; if (w) { if (w.main) L.push(`- Principal responsabilidade: ${w.main}`); const pr = Object.values(w.priorities || {}).filter(Boolean); if (pr.length) L.push(`- Prioridades: ${pr.join('; ')}`); ['appointments', 'dclin', 'personal', 'deliveries'].forEach((k) => { const arr = w[k] || []; if (arr.length) L.push(`- ${k}: ${arr.map((i) => (i.done ? '[x] ' : '') + i.text).join('; ')}`); }); if (w.notes) L.push(`- Observações de trabalho: ${w.notes}`); }
    const j = day.journal; if (j) JOURNAL_FIELDS.forEach((f) => { const v = j[f.key]; if (v !== undefined && v !== '' && v !== null) L.push(`- ${f.label}: ${v}`); });
    const ev = day.evening; if (ev && ev.answers) { L.push('- Revisão noturna:'); EVENING_QUESTIONS.forEach((q) => { const a = ev.answers[q.key]; if (a && (a.choice || a.text)) L.push(`  - ${q.text} ${[a.choice, a.text].filter(Boolean).join(' · ')}`); }); }
    L.push('');
  }
  if (s.help.episodes.length) { L.push('## Episódios de ansiedade'); s.help.episodes.forEach((e) => L.push(`- ${formatDateTime(e.at)} · ${e.situation || ''}${e.happened ? ' · Fato: ' + e.happened : ''}${e.decision || e.decisionChoice ? ' · Decisão: ' + [e.decisionChoice, e.decision].filter(Boolean).join(' / ') : ''}`)); L.push(''); }
  if (s.fast.episodes.length) { L.push('## Jejum digital'); s.fast.episodes.forEach((e) => L.push(`- ${formatDateTime(e.at)} · ${e.type === 'urge' ? 'Impulso' : 'Regra quebrada'}${e.outcome ? ' · ' + e.outcome : ''}${e.feeling ? ' · ' + e.feeling : ''}${e.trigger ? ' · Gatilho: ' + e.trigger : ''}`)); L.push(''); }
  if (s.relationship.reflections.length) { L.push('## Reflexões sobre o relacionamento'); s.relationship.reflections.forEach((r) => L.push(`- ${formatDateTime(r.at)} · ${Object.entries(r).filter(([k]) => !['id', 'at', 'date'].includes(k)).map(([k, v]) => `${k}: ${v}`).join('; ')}`)); L.push(''); }
  const rep = s.closing.report || {}; if (Object.values(rep).some(Boolean)) { L.push('## Relatório pessoal'); CLOSING_REPORT.forEach((f) => { if (rep[f.key]) L.push(`- ${f.label}: ${rep[f.key]}`); }); L.push(''); }
  const plan = s.closing.plan || {}; if ((plan.habits || []).length) { L.push('## Plano de 30 dias'); plan.habits.forEach((hb) => L.push(`- ${hb.text} (${hb.area}, ${hb.freq})`)); Object.entries(plan.reviews || {}).forEach(([k, v]) => { if (v) L.push(`- Revisão ${k}: ${v}`); }); L.push(''); }
  return L.join('\n');
}
