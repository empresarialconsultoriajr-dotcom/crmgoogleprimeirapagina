// Motor de auditoria: meta individual, índice de execução, níveis, coerência, alertas e indicadores financeiros.
import { today, addDays, isWeekend, businessDaysBetween, businessDaysBack, monthKey, monthStart, monthEnd, addMonths, daysBetween, weekRange, weekKey } from './dates.js'

export const DEFAULT_SETTINGS = {
  pesos: { participacao: 25, solicitacoes: 20, avaliacoes: 25, resposta: 15, qualidade: 15 },
  niveis: { A: 80, B: 60 },
  conversaoRef: 0.35, elegiveis: 0.8, diasUteisMes: 20,
  alertas: { semRegistroAmarelo: 2, semRegistroVermelho: 5, quedaAvaliacoesPct: 30, quedaNota: 0.1, indiceBaixo: 60, indiceBaixoSemanas: 2, atrasoPagamentoDias: 5, picoFator: 3, onboardingDiasUteis: 7 },
  financeiro: { preco: 1000, imposto: 0.15, taxa: 0.03, inadimplencia: 0.05, custoFixo: 25000, cac: 5000 },
  coerencia: { convMin: 0.10, convMax: 0.60 },
  empresa: { nome: 'Google Primeira Página', clube: 'Clube Google Primeira Página' },
}

export const NIVEL_LABEL = { A: 'Referência', B: 'Em desenvolvimento', C: 'Atenção' }

export function metaIndividual(clientesDia, s = DEFAULT_SETTINGS) {
  return Math.round((clientesDia || 0) * s.diasUteisMes * s.elegiveis * s.conversaoRef)
}
export function solicitacoesPrevistasMes(meta, s = DEFAULT_SETTINGS) { return Math.round(meta / s.conversaoRef) }

export function nivel(indice, s = DEFAULT_SETTINGS) { return indice >= s.niveis.A ? 'A' : indice >= s.niveis.B ? 'B' : 'C' }

const byDate = (a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0)

/** Registros de uma empresa ordenados por data, com campo derivado `novas` (avaliações novas = diferença da contagem do perfil). */
export function registrosEmpresa(state, empresaId) {
  const regs = state.registros.filter(r => r.empresaId === empresaId).sort(byDate)
  const emp = state.empresas.find(e => e.id === empresaId)
  let prev = emp?.avaliacoesBase ?? null
  return regs.map(r => {
    const total = r.avaliacoesTotal == null ? null : Number(r.avaliacoesTotal)
    let novas = 0
    if (total != null && prev != null) novas = Math.max(0, total - prev)
    if (total != null) prev = total
    return { ...r, novas, retroativo: r.retroativo ?? (r.criadoEm ? r.criadoEm.slice(0, 10) !== r.data : false) }
  })
}

/** Agrega registros de um período [ini, fim]. */
export function agregar(regs, ini, fim) {
  const sel = regs.filter(r => r.data >= ini && r.data <= fim)
  const diasUteis = businessDaysBetween(ini, fim)
  const diasComRegistro = new Set(sel.filter(r => !r.retroativo && !isWeekend(r.data)).map(r => r.data)).size
  const sum = (k) => sel.reduce((a, r) => a + Number(r[k] || 0), 0)
  const notas = sel.filter(r => r.nota != null && r.nota !== '').map(r => Number(r.nota))
  return {
    ini, fim, diasUteis, diasComRegistro, registros: sel.length,
    atendidos: sum('atendidos'), solicitacoes: sum('solicitacoes'), novas: sum('novas'), respondidas: sum('respondidas'),
    negativasNovas: sum('negativasNovas'), negativasRespondidas: sum('negativasRespondidas'),
    notaFinal: notas.length ? notas[notas.length - 1] : null, notaInicial: notas.length ? notas[0] : null,
    conversao: sum('solicitacoes') > 0 ? sum('novas') / sum('solicitacoes') : null,
    retroativos: sel.filter(r => r.retroativo).length,
  }
}

/** Índice de Execução 0–100 para uma empresa em um período. Pendências: lista de {tipo:'treinamento'|'inconsistencia'|'violacao'} abertas. */
export function indiceExecucao(emp, agg, pendencias = [], s = DEFAULT_SETTINGS) {
  const p = s.pesos
  const meta = emp.metaMensal || metaIndividual(emp.clientesDia, s) || 1
  const fator = agg.diasUteis / s.diasUteisMes // proporção do mês
  const metaPeriodo = Math.max(1, meta * fator)
  const solicPrev = Math.max(1, solicitacoesPrevistasMes(meta, s) * fator)
  const participacao = agg.diasUteis ? Math.min(1, agg.diasComRegistro / agg.diasUteis) * p.participacao : 0
  const solicitacoes = Math.min(1, agg.solicitacoes / solicPrev) * p.solicitacoes
  const avaliacoes = Math.min(1, agg.novas / metaPeriodo) * p.avaliacoes
  const resposta = agg.novas > 0 ? Math.min(1, agg.respondidas / agg.novas) * p.resposta : p.resposta
  let qualidade = p.qualidade
  for (const pd of pendencias) {
    if (pd.tipo === 'treinamento') qualidade -= 5
    else if (pd.tipo === 'inconsistencia') qualidade -= 5
    else if (pd.tipo === 'violacao') qualidade -= p.qualidade
  }
  qualidade = Math.max(0, qualidade)
  const total = Math.round(participacao + solicitacoes + avaliacoes + resposta + qualidade)
  return {
    total, nivel: nivel(total, s), metaPeriodo: Math.round(metaPeriodo), solicPrev: Math.round(solicPrev),
    dims: { participacao: r1(participacao), solicitacoes: r1(solicitacoes), avaliacoes: r1(avaliacoes), resposta: r1(resposta), qualidade: r1(qualidade) },
  }
}
const r1 = (v) => Math.round(v * 10) / 10

export function pendenciasAbertas(state, empresaId) {
  return (state.pendencias || []).filter(p => p.empresaId === empresaId && p.status !== 'resolvida')
}

/** Teste de coerência da auditoria semanal. */
export function coerencia(agg, regs, s = DEFAULT_SETTINGS) {
  const sinais = []
  if (agg.solicitacoes >= 10 && agg.conversao != null && agg.conversao < s.coerencia.convMin)
    sinais.push({ tipo: 'conversao_baixa', texto: `Conversão implícita de ${Math.round(agg.conversao * 100)}%: mensagem, link ou canal inadequado, ou registro inflado.`, acao: 'Revisar mensagem e link; pedir evidência de tela de 3 envios.' })
  if (agg.solicitacoes >= 5 && agg.conversao != null && agg.conversao > s.coerencia.convMax)
    sinais.push({ tipo: 'conversao_alta', texto: `Conversão implícita de ${Math.round(agg.conversao * 100)}%: sub-registro ou avaliações fora do processo.`, acao: 'Verificar origem; reforçar registro diário.' })
  if (agg.novas > 0 && agg.solicitacoes === 0)
    sinais.push({ tipo: 'sem_atividade', texto: 'Avaliações entraram sem solicitações registradas.', acao: 'Treinar registro; não contar para participação.' })
  const dentro = regs.filter(r => r.data >= agg.ini && r.data <= agg.fim)
  const media30 = media(regs.filter(r => r.data < agg.ini && r.data >= addDays(agg.ini, -30)).map(r => r.novas))
  for (const r of dentro) if (media30 > 0 && r.novas >= 5 && r.novas > s.alertas.picoFator * media30)
    sinais.push({ tipo: 'pico', texto: `Pico de ${r.novas} avaliações em ${r.data} (média anterior ${media30.toFixed(1)}/dia).`, acao: 'Verificação obrigatória em 48 h: campanha presencial legítima ou prática irregular?' })
  if (agg.retroativos > 0) sinais.push({ tipo: 'retroativos', texto: `${agg.retroativos} registro(s) retroativo(s) no período.`, acao: 'Não contam para participação; orientar registro no dia.' })
  return sinais
}
const media = (xs) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0

/** Avaliação completa de uma empresa (mês corrente, semana corrente, 30 dias, histórico mensal). */
export function avaliarEmpresa(state, emp, ref = today()) {
  const s = state.settings
  const regs = registrosEmpresa(state, emp.id)
  const pend = pendenciasAbertas(state, emp.id)
  const mes = agregar(regs, monthStart(ref), ref <= monthEnd(ref) ? ref : monthEnd(ref))
  const [wi, wf] = weekRange(ref)
  const semana = agregar(regs, wi, wf > ref ? ref : wf)
  const idxMes = indiceExecucao(emp, mes, pend, s)
  const idxSemana = indiceExecucao(emp, semana, pend, s)
  const corr = agregar(regs, businessDaysBack(ref, s.diasUteisMes - 1), ref)
  const idxCorrente = indiceExecucao(emp, corr, pend, s)
  const ult30 = agregar(regs, addDays(ref, -29), ref)
  const ant30 = agregar(regs, addDays(ref, -59), addDays(ref, -30))
  // histórico mensal (12 meses)
  const hist = []
  for (let i = 11; i >= 0; i--) {
    const ym = addMonths(monthKey(ref), -i)
    const ini = ym + '-01'; const fim = i === 0 ? ref : monthEnd(ini)
    const a = agregar(regs, ini, fim)
    const idx = indiceExecucao(emp, a, i === 0 ? pend : [], s)
    hist.push({ ym, novas: a.novas, solicitacoes: a.solicitacoes, dias: a.diasComRegistro, diasUteis: a.diasUteis, indice: idx.total, nota: a.notaFinal, conversao: a.conversao })
  }
  const ultimo = regs.length ? regs[regs.length - 1] : null
  const notaAtual = ultimo?.nota != null && ultimo.nota !== '' ? Number(ultimo.nota) : (emp.notaBase ?? null)
  const reg30 = regs.filter(r => r.data <= addDays(ref, -30) && r.nota != null && r.nota !== '')
  const nota30 = reg30.length ? Number(reg30[reg30.length - 1].nota) : (emp.notaBase ?? null)
  const totalAtual = ultimo?.avaliacoesTotal != null ? Number(ultimo.avaliacoesTotal) : (emp.avaliacoesBase ?? 0)
  // dias úteis sem registro (antes de hoje)
  let diasSemRegistro = 0
  if (emp.status === 'ativa') {
    const datas = new Set(regs.map(r => r.data))
    let d = ref; let guard = 0
    while (guard < 60) { if (!isWeekend(d) && datas.has(d)) break; if (!isWeekend(d) && d !== ref) diasSemRegistro++; d = addDays(d, -1); guard++ }
    if (guard >= 60) diasSemRegistro = 60
  }
  return { emp, regs, pend, mes, semana, idxMes, idxSemana, corr, idxCorrente, ult30, ant30, hist, ultimo, notaAtual, nota30, totalAtual, diasSemRegistro, meta: emp.metaMensal || metaIndividual(emp.clientesDia, s) }
}

/** Gera alertas automáticos para todas as empresas. Retorna lista de alertas candidatos com `chave` única. */
export function gerarAlertas(state, ref = today()) {
  const s = state.settings; const A = s.alertas; const out = []
  const ym = monthKey(ref)
  for (const emp of state.empresas) {
    if (emp.status === 'cancelada') continue
    const av = avaliarEmpresa(state, emp, ref)
    const push = (tipo, gravidade, titulo, detalhe, destinatario, prazoDias) =>
      out.push({ empresaId: emp.id, tipo, gravidade, titulo, detalhe, destinatario, prazo: addDays(ref, prazoDias), chave: `${emp.id}:${tipo}:${tipo.startsWith('sem_registro') || tipo === 'pagamento' ? ym : weekKey(ref)}` })
    if (emp.status === 'onboarding') {
      const inicio = emp.dataEntrada || ref
      if (businessDaysBetween(inicio, ref) - 1 > A.onboardingDiasUteis && av.regs.length === 0)
        push('onboarding_lento', 2, 'Onboarding acima do prazo', `Pagamento em ${inicio} e nenhuma solicitação registrada após ${A.onboardingDiasUteis} dias úteis.`, 'Relacionamento', 2)
      continue
    }
    if (emp.status !== 'ativa') continue
    if (av.diasSemRegistro >= A.semRegistroVermelho) push('sem_registro_vermelho', 3, 'Inatividade: 5+ dias úteis sem registro', `${av.diasSemRegistro} dias úteis sem registro. Contato com empresário em 24 h (doc. 9).`, 'Empresário + relacionamento', 1)
    else if (av.diasSemRegistro >= A.semRegistroAmarelo) push('sem_registro_amarelo', 1, 'Sem registro há 2 dias úteis', `${av.diasSemRegistro} dias úteis sem registro. Lembrete automático ao colaborador.`, 'Colaborador', 1)
    const negPend = av.ult30.negativasNovas - av.ult30.negativasRespondidas
    if (negPend > 0) push('negativa_sem_resposta', 2, 'Avaliação negativa sem resposta', `${negPend} avaliação(ões) de 1–3 estrelas sem resposta registrada nos últimos 30 dias (prazo: 48 h).`, 'Colaborador e gestor da empresa', 1)
    // queda de avaliações: mês atual pro-rata vs média 3 meses anteriores
    const h = av.hist; const atual = h[h.length - 1]; const ant = h.slice(-4, -1).filter(x => x.diasUteis > 0)
    if (ant.length === 3 && ant.every(x => x.novas > 0) && atual.diasUteis >= 5) {
      const proj = atual.novas / atual.diasUteis * s.diasUteisMes; const med = media(ant.map(x => x.novas))
      if (proj < med * (1 - A.quedaAvaliacoesPct / 100)) push('queda_avaliacoes', 2, 'Queda de resultado', `Projeção do mês (${Math.round(proj)}) abaixo de ${100 - A.quedaAvaliacoesPct}% da média dos 3 meses anteriores (${Math.round(med)}).`, 'Gestor operacional', 3)
    }
    if (av.notaAtual != null && av.nota30 != null && av.nota30 - av.notaAtual >= A.quedaNota) push('queda_nota', 2, 'Queda de nota', `Nota caiu de ${av.nota30.toFixed(1)} para ${av.notaAtual.toFixed(1)} em 30 dias.`, 'Relacionamento', 7)
    // índice baixo por 2 semanas (semana atual e anterior)
    const [wi] = weekRange(ref); const semAnt = agregar(av.regs, addDays(wi, -7), addDays(wi, -1))
    const idxAnt = indiceExecucao(emp, semAnt, av.pend, s).total
    if (av.semana.diasUteis >= 3 && av.idxSemana.total < A.indiceBaixo && idxAnt < A.indiceBaixo) push('indice_baixo', 3, 'Índice abaixo de 60 por 2 semanas', `Semana atual ${av.idxSemana.total}, anterior ${idxAnt}. Entrar no procedimento de empresas inativas (doc. 9).`, 'Gestor operacional', 2)
    // pico
    for (const sg of coerencia(av.semana, av.regs, s)) if (sg.tipo === 'pico') push('pico', 2, 'Pico atípico de avaliações', sg.texto, 'Auditoria', 2)
    // pagamento
    const pg = (state.pagamentos || []).find(p => p.empresaId === emp.id && p.competencia === ym)
    const dia = Number(emp.assinatura?.diaCobranca || 5); const venc = `${ym}-${String(dia).padStart(2, '0')}`
    if ((!pg || pg.status !== 'pago') && daysBetween(venc, ref) > A.atrasoPagamentoDias)
      push('pagamento', 2, 'Pagamento em atraso', `Competência ${ym} não paga; vencimento ${venc}. Régua D+3, D+7, D+15.`, 'Financeiro + relacionamento', 3)
  }
  return out
}

/** Sincroniza alertas automáticos: cria novos (sem duplicar chave aberta) e resolve automaticamente os que deixaram de ocorrer. */
export function sincronizarAlertas(state, ref = today()) {
  const candidatos = gerarAlertas(state, ref)
  const chaves = new Set(candidatos.map(c => c.chave))
  const existentes = state.alertas || []
  const abertas = new Set(existentes.filter(a => a.status !== 'resolvido').map(a => a.chave))
  const novos = candidatos.filter(c => !abertas.has(c.chave)).map(c => ({ id: Math.random().toString(36).slice(2, 10), ...c, criadoEm: ref, status: 'aberto', origem: 'auto', responsavel: c.destinatario }))
  const atualizados = existentes.map(a => (a.origem === 'auto' && a.status !== 'resolvido' && !chaves.has(a.chave)) ? { ...a, status: 'resolvido', resolvidoEm: ref, resolucao: 'Condição deixou de ocorrer (automático).' } : a)
  return [...atualizados, ...novos]
}

/** Indicadores da rede. */
export function indicadoresRede(state, ref = today()) {
  const s = state.settings; const ym = monthKey(ref)
  const ativas = state.empresas.filter(e => e.status === 'ativa')
  const onboarding = state.empresas.filter(e => e.status === 'onboarding')
  const avals = ativas.map(e => avaliarEmpresa(state, e, ref))
  const niveis = { A: 0, B: 0, C: 0 }
  for (const a of avals) niveis[a.idxCorrente.nivel]++
  const indiceMedio = avals.length ? Math.round(avals.reduce((x, a) => x + a.idxCorrente.total, 0) / avals.length) : 0
  const novasMes = avals.reduce((x, a) => x + a.mes.novas, 0)
  const solicMes = avals.reduce((x, a) => x + a.mes.solicitacoes, 0)
  const pagantes = [...ativas, ...onboarding]
  const mrr = pagantes.reduce((x, e) => x + (e.plano === 'anual' ? (Number(e.assinatura?.valorAnual || s.financeiro.preco * 10) / 12) : Number(e.assinatura?.valor || s.financeiro.preco)), 0)
  const atrasados = pagantes.filter(e => { const pg = (state.pagamentos || []).find(p => p.empresaId === e.id && p.competencia === ym); const dia = Number(e.assinatura?.diaCobranca || 5); return (!pg || pg.status !== 'pago') && daysBetween(`${ym}-${String(dia).padStart(2, '0')}`, ref) > 0 })
  const canceladasMes = state.empresas.filter(e => e.status === 'cancelada' && (e.dataCancelamento || '').slice(0, 7) === ym).length
  const inicioMes = pagantes.length + canceladasMes
  const churn = inicioMes ? canceladasMes / inicioMes : 0
  const alertasAbertos = (state.alertas || []).filter(a => a.status !== 'resolvido')
  const contrib = s.financeiro.preco * (1 - s.financeiro.imposto - s.financeiro.taxa - s.financeiro.inadimplencia)
  const resultado = mrr * (1 - s.financeiro.inadimplencia) * (1 - s.financeiro.taxa) - mrr * s.financeiro.imposto - s.financeiro.custoFixo - s.financeiro.cac
  const breakEven = Math.ceil((s.financeiro.custoFixo + s.financeiro.cac) / contrib)
  // série diária de avaliações (30 dias)
  const serie = []
  for (let i = 29; i >= 0; i--) { const d = addDays(ref, -i); let n = 0; for (const a of avals) for (const r of a.regs) if (r.data === d) n += r.novas; serie.push({ data: d, novas: n }) }
  // índice por grupo
  const porGrupo = state.grupos.map(g => { const xs = avals.filter(a => a.emp.grupoId === g.id); return { grupo: g.nome, indice: xs.length ? Math.round(xs.reduce((x, a) => x + a.idxCorrente.total, 0) / xs.length) : 0, empresas: xs.length } })
  return { ativas: ativas.length, onboarding: onboarding.length, total: state.empresas.length, mrr, atrasados: atrasados.length, churn, canceladasMes, niveis, indiceMedio, novasMes, solicMes, alertasAbertos: alertasAbertos.length, alertasGraves: alertasAbertos.filter(a => a.gravidade >= 3).length, contrib, resultado, breakEven, serie, porGrupo, avals }
}

/** Texto do resumo semanal para WhatsApp. */
export function resumoSemanal(av, observacao = '') {
  const e = av.emp; const w = av.semana
  const idx = av.idxSemana
  const linhas = [
    `*Resumo da semana · ${e.nome}*`,
    `Avaliações novas: *${w.novas}* (meta semanal ≈ ${idx.metaPeriodo}) · Nota atual: *${av.notaAtual != null ? av.notaAtual.toFixed(1) : '—'}*`,
    `Solicitações registradas: ${w.solicitacoes} · Dias com rotina: ${w.diasComRegistro}/${w.diasUteis} · Respondidas: ${w.respondidas}/${w.novas}`,
    `Índice de Execução da semana: *${idx.total}* (nível ${idx.nivel} · ${NIVEL_LABEL[idx.nivel]})`,
  ]
  if (observacao) linhas.push('', observacao)
  const pend = av.pend
  if (pend.length) linhas.push('', `Pendência: ${pend[0].descricao}${pend[0].prazo ? ' (prazo ' + pend[0].prazo + ')' : ''}`)
  linhas.push('', '— Equipe Clube Google Primeira Página')
  return linhas.join('\n')
}

export const ALERTA_TIPOS = {
  sem_registro_amarelo: 'Sem registro (amarelo)', sem_registro_vermelho: 'Inatividade (vermelho)', negativa_sem_resposta: 'Negativa sem resposta',
  queda_avaliacoes: 'Queda de resultado', queda_nota: 'Queda de nota', indice_baixo: 'Índice baixo', pico: 'Pico atípico', pagamento: 'Pagamento', onboarding_lento: 'Onboarding lento', manual: 'Manual',
}
