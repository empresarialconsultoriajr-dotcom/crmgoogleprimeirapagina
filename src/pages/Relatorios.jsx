import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store.js'
import { avaliarEmpresa, indicadoresRede, NIVEL_LABEL, agregar, indiceExecucao } from '../engine.js'
import { Top, Nivel, Natureza, Tag, Empty, KPI } from '../ui/common.jsx'
import { monthKey, addMonths, monthLabel, monthEnd, today, fmtDate, pct, brl, num } from '../dates.js'
import { gerarRecomendacao } from './Empresa.jsx'

export default function Relatorios({ id }) {
  const st = useStore()
  const [comp, setComp] = useState(monthKey(today()))
  const [sel, setSel] = useState(id || '')
  useEffect(() => { setSel(id || '') }, [id])
  const emp = st.empresas.find(e => e.id === sel)
  const refData = comp === monthKey(today()) ? today() : monthEnd(comp + '-01')
  const rede = useMemo(() => indicadoresRede(st, refData), [st, refData])
  return <>
    <Top eyebrow="Auditoria" title="Relatórios" sub="Relatório mensal por empresa (documento 7) e relatório da rede. Use Imprimir para gerar PDF.">
      <select value={comp} onChange={e => setComp(e.target.value)} style={{ border: '1px solid #D1D5DB', borderRadius: 6, padding: 6 }}>{[0, 1, 2, 3, 4, 5].map(i => { const ym = addMonths(monthKey(today()), -i); return <option key={ym} value={ym}>{monthLabel(ym)}</option> })}</select>
      <select value={sel} onChange={e => setSel(e.target.value)} style={{ border: '1px solid #D1D5DB', borderRadius: 6, padding: 6, minWidth: 240 }}><option value="">Relatório da rede</option>{st.empresas.filter(e => e.status !== 'cancelada').sort((a, b) => a.nome.localeCompare(b.nome)).map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select>
      <button className="btn primary" onClick={() => print()}>Imprimir / PDF</button>
    </Top>
    {emp ? <RelatorioEmpresa st={st} emp={emp} comp={comp} refData={refData} /> : <RelatorioRede st={st} rede={rede} comp={comp} />}
  </>
}

function RelatorioEmpresa({ st, emp, comp, refData }) {
  const av = avaliarEmpresa(st, emp, refData)
  const mes = av.hist.find(h => h.ym === comp) || av.hist[av.hist.length - 1]
  const ant = av.hist[av.hist.findIndex(h => h.ym === comp) - 1]
  const agg = agregar(av.regs, comp + '-01', refData)
  const idx = indiceExecucao(emp, agg, av.pend, st.settings)
  const pares = st.empresas.filter(e => e.status === 'ativa' && e.segmento === emp.segmento && e.id !== emp.id).map(e => avaliarEmpresa(st, e, refData))
  const convGrupo = pares.length ? pares.reduce((x, p) => x + (p.ult30.conversao || 0), 0) / pares.length : null
  const posicao = pares.length ? Math.round((pares.filter(p => p.idxCorrente.total < idx.total).length / pares.length) * 100) : null
  const temas = {}; for (const r of av.regs.filter(r => r.data.startsWith(comp) && r.reclamacao)) temas[r.reclamacao] = (temas[r.reclamacao] || 0) + 1
  const pend = av.pend; const inativa = agg.diasComRegistro === 0
  const recs = [gerarRecomendacao(av, convGrupo)]
  if (agg.novas > 0 && agg.respondidas / agg.novas < 0.9) recs.push('Responder 100% das avaliações em até 48 h; usar os modelos da biblioteca para 5–4 e 1–3 estrelas.')
  if (Object.keys(temas).length) recs.push(`Tratar o tema mais citado pelos clientes ("${Object.entries(temas).sort((a, b) => b[1] - a[1])[0][0]}") com o gestor da empresa e registrar a melhoria na próxima reunião de grupo.`)
  return <div className="rep">
    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div><div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1D4ED8', fontWeight: 600 }}>Relatório mensal · {st.settings.empresa.clube}</div><h1>{emp.nome}</h1><div className="muted">{monthLabel(comp)} · {emp.segmento} · {st.grupos.find(g => g.id === emp.grupoId)?.nome || 'sem grupo'} · colaborador: {emp.colaborador?.nome}</div></div>
      <div style={{ textAlign: 'right' }}><Nivel n={idx.nivel} /><div className="small muted" style={{ marginTop: 4 }}>emitido em {fmtDate(today())}</div></div>
    </div>
    <div className="grid g3" style={{ marginTop: 14 }}>
      <KPI v={`${agg.novas} / ${av.meta}`} l="Avaliações novas vs. meta individual" d={<Natureza comprovado />} />
      <KPI v={agg.notaFinal != null ? agg.notaFinal.toFixed(1) + ' ★' : (av.notaAtual?.toFixed(1) ?? '—')} l="Nota média" d={agg.notaInicial != null && agg.notaFinal != null ? `${(agg.notaFinal - agg.notaInicial >= 0 ? '+' : '')}${(agg.notaFinal - agg.notaInicial).toFixed(1)} no mês` : ''} />
      <KPI v={idx.total} l="Índice de Execução" d={ant ? `${idx.total - ant.indice >= 0 ? '+' : ''}${idx.total - ant.indice} vs. ${monthLabel(ant.ym)}` : ''} />
    </div>
    <div className="sec"><h3>1. Resumo do mês</h3>
      {inativa ? <p>Não houve registros de atividade no período. A empresa está em procedimento de reativação: contato com o colaborador e o empresário, plano de duas semanas com meta reduzida e novo onboarding se necessário.</p> :
        <p>O colaborador executou a rotina em {agg.diasComRegistro} de {agg.diasUteis} dias úteis e registrou {agg.solicitacoes} convites de avaliação. O perfil recebeu {agg.novas} avaliações novas ({av.meta ? Math.round(agg.novas / av.meta * 100) : 0}% da meta individual){agg.conversao != null ? `, uma conversão implícita de ${pct(agg.conversao)}` : ''}. {agg.novas > 0 ? `${Math.round(Math.min(1, agg.respondidas / agg.novas) * 100)}% das avaliações foram respondidas.` : ''} {ant ? `O índice ${idx.total >= ant.indice ? 'subiu' : 'caiu'} de ${ant.indice} para ${idx.total}.` : ''}</p>}
    </div>
    <div className="sec"><h3>2. Execução</h3>
      <table className="tbl"><tbody>
        <tr><td>Dias com rotina executada</td><td className="r">{agg.diasComRegistro} / {agg.diasUteis}</td><td><Natureza comprovado /></td></tr>
        <tr><td>Clientes atendidos (contagem)</td><td className="r">{num(agg.atendidos)}</td><td><Natureza /></td></tr>
        <tr><td>Solicitações registradas</td><td className="r">{num(agg.solicitacoes)} (previstas {idx.solicPrev})</td><td><Natureza /></td></tr>
        <tr><td>Avaliações novas no perfil</td><td className="r">{agg.novas}</td><td><Natureza comprovado /></td></tr>
        <tr><td>Conversão implícita</td><td className="r">{agg.conversao != null ? pct(agg.conversao) : '—'}</td><td><Natureza comprovado /></td></tr>
        <tr><td>Respondidas (meta 100% em 48 h)</td><td className="r">{agg.respondidas} / {agg.novas}</td><td><Natureza comprovado /></td></tr>
        <tr><td>Avaliações 1–3 estrelas recebidas / respondidas</td><td className="r">{agg.negativasNovas} / {agg.negativasRespondidas}</td><td><Natureza comprovado /></td></tr>
        <tr><td>Total de avaliações no perfil</td><td className="r">{av.totalAtual}{emp.avaliacoesBase != null ? ` (+${av.totalAtual - emp.avaliacoesBase} desde a entrada)` : ''}</td><td><Natureza comprovado /></td></tr>
      </tbody></table>
      <div className="dims" style={{ marginTop: 8 }}>{[['participacao', 'Participação'], ['solicitacoes', 'Solicitações'], ['avaliacoes', 'Avaliações'], ['resposta', 'Resposta'], ['qualidade', 'Qualidade']].map(([k, l]) => <div key={k} className="d"><b>{idx.dims[k]} <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 400 }}>/ {st.settings.pesos[k]}</span></b><span>{l}</span></div>)}</div>
    </div>
    <div className="sec"><h3>3. Comparação com pares</h3>{posicao == null ? <p className="muted">Sem outras empresas ativas do mesmo segmento para comparar.</p> : <p>Pelo índice de execução, a empresa está à frente de <b>{posicao}%</b> das {pares.length} empresas ativas de {emp.segmento} no Clube. Conversão média dos pares: {convGrupo != null ? pct(convGrupo) : '—'}. Comparação anônima e agregada.</p>}</div>
    <div className="sec"><h3>4. O que os clientes disseram</h3>{Object.keys(temas).length === 0 ? <p className="muted">Nenhuma reclamação ou oportunidade anotada pelo colaborador no período.</p> : <ul>{Object.entries(temas).sort((a, b) => b[1] - a[1]).map(([t, n]) => <li key={t}>{t} <span className="muted">({n}×)</span></li>)}</ul>}</div>
    <div className="sec"><h3>5. Recomendações do mês</h3><ol>{recs.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}</ol></div>
    <div className="sec"><h3>6. Pendências e próximos passos</h3>{pend.length === 0 ? <p className="muted">Sem pendências abertas.</p> : <ul>{pend.map(p => <li key={p.id}>{p.descricao} <span className="muted">(prazo {fmtDate(p.prazo)})</span></li>)}</ul>}<p className="small muted">Próxima reunião de grupo e diagnóstico trimestral conforme agenda do grupo.</p></div>
    <div className="hr" /><div className="small muted">7. Contato: analista de relacionamento · canal de suporte do Clube em horário comercial, resposta em até 4 h úteis. Indicadores marcados como "Informado" foram declarados pelo colaborador; "Comprovado" foram lidos do Perfil da Empresa ou do sistema. Metas são referências operacionais, não garantias.</div>
  </div>
}

function RelatorioRede({ st, rede, comp }) {
  const rows = [...rede.avals].sort((a, b) => b.idxCorrente.total - a.idxCorrente.total)
  return <div className="rep">
    <div className="eyebrow" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#1D4ED8', fontWeight: 600 }}>Relatório da rede · {st.settings.empresa.clube}</div>
    <h1>{monthLabel(comp)}</h1>
    <div className="grid g4" style={{ marginTop: 12 }}>
      <KPI v={rede.ativas} l="Empresas ativas" d={`${rede.onboarding} em onboarding`} /><KPI v={brl(rede.mrr)} l="MRR" d={`${rede.atrasados} em atraso`} /><KPI v={rede.indiceMedio} l="Índice médio" d={`A ${rede.niveis.A} · B ${rede.niveis.B} · C ${rede.niveis.C}`} /><KPI v={num(rede.novasMes)} l="Avaliações novas no mês" d={`${num(rede.solicMes)} solicitações`} />
    </div>
    <div className="sec"><h3>Ranking de execução (índice corrente)</h3>
      <table className="tbl"><thead><tr><th>#</th><th>Empresa</th><th>Grupo</th><th className="r">Índice</th><th>Nível</th><th className="r">Avaliações no mês</th><th className="r">Meta</th><th className="r">Conversão 30 d</th><th className="r">Nota</th></tr></thead>
        <tbody>{rows.map((a, i) => <tr key={a.emp.id}><td>{i + 1}</td><td><b>{a.emp.nome}</b></td><td className="small">{st.grupos.find(g => g.id === a.emp.grupoId)?.nome || '—'}</td><td className="r"><b>{a.idxCorrente.total}</b></td><td><Nivel n={a.idxCorrente.nivel} /></td><td className="r">{a.mes.novas}</td><td className="r">{a.meta}</td><td className="r">{a.ult30.conversao != null ? pct(a.ult30.conversao) : '—'}</td><td className="r">{a.notaAtual?.toFixed(1) ?? '—'}</td></tr>)}</tbody></table>
    </div>
    <div className="sec"><h3>Por grupo</h3><table className="tbl"><thead><tr><th>Grupo</th><th className="r">Empresas ativas</th><th className="r">Índice médio</th></tr></thead><tbody>{rede.porGrupo.map(g => <tr key={g.grupo}><td>{g.grupo}</td><td className="r">{g.empresas}</td><td className="r">{g.indice}</td></tr>)}</tbody></table></div>
    <div className="sec"><h3>Financeiro</h3><p>Churn do mês {pct(rede.churn, 1)} ({rede.canceladasMes} cancelamento(s)). Contribuição por empresa {brl(rede.contrib)}. Resultado operacional estimado {brl(rede.resultado)} com custo fixo de {brl(st.settings.financeiro.custoFixo)}. Ponto de equilíbrio: {rede.breakEven} empresas.</p></div>
    <div className="small muted">Metas são referências operacionais; projeções usam os parâmetros de Configurações.</div>
  </div>
}
