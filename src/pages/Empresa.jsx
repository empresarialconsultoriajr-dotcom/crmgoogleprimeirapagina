import React, { useMemo, useState } from 'react'
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts'
import { useStore, actions } from '../store.js'
import { avaliarEmpresa, resumoSemanal, coerencia, NIVEL_LABEL } from '../engine.js'
import { CHECKLIST_ENTRADA } from '../demo.js'
import { Top, Nivel, Tag, KPI, Natureza, Modal, F, useForm, copiar, Empty, Bar as Barra } from '../ui/common.jsx'
import { fmtDate, monthLabel, today, pct, uid } from '../dates.js'
import { EmpresaForm, StatusTag } from './Empresas.jsx'
import { RegistroForm } from './Registro.jsx'

export default function Empresa({ id }) {
  const st = useStore()
  const emp = st.empresas.find(e => e.id === id)
  const [tab, setTab] = useState('painel'); const [edit, setEdit] = useState(false); const [reg, setReg] = useState(null); const [pend, setPend] = useState(false)
  const av = useMemo(() => emp ? avaliarEmpresa(st, emp) : null, [st, emp])
  if (!emp) return <Empty>Empresa não encontrada. <a href="#/empresas">Voltar</a></Empty>
  const grupo = st.grupos.find(g => g.id === emp.grupoId)
  const link = `${location.origin}${location.pathname}#/registro/${emp.codigo}`
  const idx = av.idxCorrente
  const checklistDone = CHECKLIST_ENTRADA.filter(c => emp.checklist?.[c.id]).length
  const alertas = st.alertas.filter(a => a.empresaId === id && a.status !== 'resolvido')
  const pares = st.empresas.filter(e => e.status === 'ativa' && e.segmento === emp.segmento && e.id !== id).map(e => avaliarEmpresa(st, e))
  const convGrupo = pares.length ? pares.reduce((x, p) => x + (p.ult30.conversao || 0), 0) / pares.length : null
  const posicao = pares.length ? Math.round((pares.filter(p => p.idxCorrente.total < idx.total).length / pares.length) * 100) : null
  const recomendacao = gerarRecomendacao(av, convGrupo)
  const hist = av.hist.map(h => ({ ...h, m: monthLabel(h.ym), meta: av.meta }))
  return <>
    <Top eyebrow={<><a href="#/empresas">Empresas</a> · {grupo?.nome || 'sem grupo'}</>} title={emp.nome} sub={<>{emp.codigo} · {emp.segmento} · {emp.cidade} · <StatusTag s={emp.status} /> · entrada {fmtDate(emp.dataEntrada)}</>}>
      <button className="btn" onClick={() => setEdit(true)}>Editar cadastro</button>
      <a className="btn" href={'#/relatorios/' + emp.id}>Relatório mensal</a>
      <button className="btn primary" onClick={() => setReg({})}>Registrar dia</button>
    </Top>
    <div className="grid g6" style={{ marginBottom: 14 }}>
      <KPI v={idx.total} l="Índice corrente" d={<Nivel n={idx.nivel} />} k={idx.nivel === 'A' ? 'ok' : idx.nivel === 'C' ? 'warn' : ''} />
      <KPI v={`${av.mes.novas} / ${av.meta}`} l="Avaliações no mês vs. meta" d={`${av.ult30.novas} nos últimos 30 dias`} />
      <KPI v={av.notaAtual != null ? av.notaAtual.toFixed(1) + ' ★' : '—'} l="Nota média" d={av.nota30 != null && av.notaAtual != null ? `${(av.notaAtual - av.nota30 >= 0 ? '+' : '')}${(av.notaAtual - av.nota30).toFixed(1)} em 30 dias` : 'sem histórico'} k={av.nota30 != null && av.notaAtual != null && av.nota30 - av.notaAtual >= 0.1 ? 'warn' : ''} />
      <KPI v={`${av.corr.diasComRegistro} / ${av.corr.diasUteis}`} l="Dias com rotina (20 d úteis)" d={av.diasSemRegistro ? `${av.diasSemRegistro} dia(s) útil(eis) sem registro` : 'registro em dia'} k={av.diasSemRegistro >= 5 ? 'bad' : av.diasSemRegistro >= 2 ? 'warn' : ''} />
      <KPI v={av.ult30.conversao != null ? pct(av.ult30.conversao) : '—'} l="Conversão implícita (30 d)" d={convGrupo != null ? `pares do segmento: ${pct(convGrupo)}` : 'sem pares para comparar'} />
      <KPI v={av.totalAtual} l="Avaliações no perfil" d={emp.avaliacoesBase != null ? `+${av.totalAtual - emp.avaliacoesBase} desde a entrada` : ''} />
    </div>
    <div className="tabs">{[['painel', 'Painel'], ['registros', `Registros (${av.regs.length})`], ['checklist', `Checklist de entrada (${checklistDone}/${CHECKLIST_ENTRADA.length})`], ['pendencias', `Pendências e alertas (${av.pend.length + alertas.length})`], ['resumo', 'Resumo semanal']].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>

    {tab === 'painel' && <>
      <div className="grid g-2-1" style={{ marginBottom: 14 }}>
        <div className="card">
          <h3>Avaliações novas por mês vs. meta individual</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer><ComposedChart data={hist} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E5E7EB" vertical={false} /><XAxis dataKey="m" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} /><YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} formatter={(v, n) => [v, n === 'novas' ? 'Avaliações' : n === 'meta' ? 'Meta' : n]} />
              <Bar isAnimationActive={false} dataKey="novas" fill="#1D4ED8" radius={[4, 4, 0, 0]} maxBarSize={40}><LabelList dataKey="novas" position="top" style={{ fontSize: 10, fill: '#111827' }} formatter={(v) => v || ''} /></Bar>
              <Line isAnimationActive={false} type="monotone" dataKey="meta" stroke="#374151" strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
            </ComposedChart></ResponsiveContainer>
          </div>
          <div className="small muted">Barras: avaliações novas comprovadas pela contagem do perfil. Linha: meta individual ({av.meta}/mês).</div>
        </div>
        <div className="card">
          <h3>Composição do índice corrente</h3>
          {[['participacao', 'Participação operacional', st.settings.pesos.participacao, true], ['solicitacoes', 'Solicitações vs. meta', st.settings.pesos.solicitacoes, false], ['avaliacoes', 'Avaliações vs. meta', st.settings.pesos.avaliacoes, true], ['resposta', 'Resposta às avaliações', st.settings.pesos.resposta, true], ['qualidade', 'Qualidade e conformidade', st.settings.pesos.qualidade, true]].map(([k, l, max, comp]) =>
            <div key={k} style={{ marginBottom: 8 }}><div className="row small" style={{ marginBottom: 2 }}><span>{l}</span><span className="spacer" /><Natureza comprovado={comp} /><b style={{ marginLeft: 8 }}>{idx.dims[k]} / {max}</b></div><Barra v={idx.dims[k]} max={max} /></div>)}
          <div className="small muted" style={{ marginTop: 6 }}>Período: últimos {av.corr.diasUteis} dias úteis · meta do período {idx.metaPeriodo} avaliações · {idx.solicPrev} solicitações previstas.</div>
        </div>
      </div>
      <div className="grid g3">
        <div className="card"><h3>Posição entre pares</h3>{posicao == null ? <p className="muted">Sem outras empresas ativas do mesmo segmento.</p> : <><div style={{ fontSize: 22, fontWeight: 600, color: '#0B0F19' }}>Melhor que {posicao}%</div><p className="small muted">das {pares.length} empresas ativas de {emp.segmento}, pelo índice corrente. Comparação anônima.</p></>}</div>
        <div className="card"><h3>Recomendação da semana</h3><p>{recomendacao}</p></div>
        <div className="card"><h3>Dados do cadastro</h3><div className="small">
          <div><b>Colaborador:</b> {emp.colaborador?.nome || '—'} ({emp.colaborador?.funcao || '—'}) · {emp.colaborador?.whatsapp}</div>
          <div><b>Substituto:</b> {emp.substituto?.nome || '—'}</div>
          <div><b>Empresário:</b> {emp.empresario?.nome || '—'} · {emp.empresario?.whatsapp}</div>
          <div><b>Rotina:</b> {emp.horarioRotina} · <b>Canal:</b> {emp.canal}</div>
          <div><b>Plano:</b> {emp.plano} · dia {emp.assinatura?.diaCobranca}</div>
          <div style={{ marginTop: 6 }}><b>Link do colaborador:</b> <code style={{ fontSize: 11 }}>{link}</code> <button className="btn sm" onClick={() => copiar(link)}>Copiar</button></div>
          {emp.observacoes && <div style={{ marginTop: 6 }}><b>Obs.:</b> {emp.observacoes}</div>}
        </div></div>
      </div>
    </>}

    {tab === 'registros' && <div className="card" style={{ padding: 0 }}>
      {av.regs.length === 0 ? <Empty>Nenhum registro diário ainda.</Empty> : <table className="tbl">
        <thead><tr><th>Data</th><th className="r">Atendidos</th><th className="r">Solicitações</th><th>Canal</th><th className="r">Total no perfil</th><th className="r">Novas</th><th className="r">Nota</th><th className="r">Respondidas</th><th className="r">Negativas</th><th>Observações</th><th></th></tr></thead>
        <tbody>{[...av.regs].reverse().map(r => <tr key={r.id}>
          <td>{fmtDate(r.data)} {r.retroativo && <Tag k="warn" title="Registrado depois do dia">retroativo</Tag>}</td>
          <td className="r">{r.atendidos}</td><td className="r">{r.solicitacoes}</td><td className="small">{r.canal}</td>
          <td className="r">{r.avaliacoesTotal ?? '—'}</td><td className="r"><b>{r.novas}</b></td><td className="r">{r.nota ?? '—'}</td><td className="r">{r.respondidas}</td>
          <td className="r">{r.negativasNovas || 0}{r.negativasNovas ? ` (${r.negativasRespondidas || 0} resp.)` : ''}</td>
          <td className="small">{[r.reclamacao, r.dificuldade].filter(Boolean).join(' · ')}</td>
          <td><button className="btn sm" onClick={() => setReg(r)}>Editar</button></td>
        </tr>)}</tbody></table>}
    </div>}

    {tab === 'checklist' && <div className="card">
      <div className="row" style={{ marginBottom: 10 }}><h3 style={{ margin: 0 }}>Checklist de entrada (documento 1)</h3><span className="spacer" /><Barra v={checklistDone} max={CHECKLIST_ENTRADA.length} /><b style={{ marginLeft: 10 }}>{checklistDone}/{CHECKLIST_ENTRADA.length}</b></div>
      <p className="small muted">A empresa só entra em Execução com 100% dos itens. {checklistDone === CHECKLIST_ENTRADA.length && emp.status === 'onboarding' && <b>Checklist completo: altere o status para Ativa.</b>}</p>
      <div className="check">{CHECKLIST_ENTRADA.map(c => <label key={c.id}><input type="checkbox" checked={!!emp.checklist?.[c.id]} onChange={e => actions.salvarEmpresa({ id: emp.id, checklist: { ...(emp.checklist || {}), [c.id]: e.target.checked } })} />{c.t}</label>)}</div>
      {checklistDone === CHECKLIST_ENTRADA.length && emp.status === 'onboarding' && <button className="btn primary" style={{ marginTop: 12 }} onClick={() => actions.salvarEmpresa({ id: emp.id, status: 'ativa' })}>Ativar empresa</button>}
    </div>}

    {tab === 'pendencias' && <div className="grid g2">
      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}><h3 style={{ margin: 0 }}>Pendências</h3><span className="spacer" /><button className="btn sm" onClick={() => setPend(true)}>Nova pendência</button></div>
        <p className="small muted">Pendências de treinamento e inconsistências descontam 5 pontos cada na dimensão Qualidade; violação de integridade zera a dimensão.</p>
        {st.pendencias.filter(p => p.empresaId === id).length === 0 ? <Empty>Sem pendências.</Empty> : <table className="tbl"><tbody>{st.pendencias.filter(p => p.empresaId === id).sort((a, b) => (a.status === 'aberta' ? -1 : 1)).map(p => <tr key={p.id}>
          <td><Tag k={p.status === 'aberta' ? (p.tipo === 'violacao' ? 'bad' : 'warn') : 'ok'}>{p.tipo}</Tag></td><td>{p.descricao}<div className="small muted">prazo {fmtDate(p.prazo)}</div></td>
          <td className="r">{p.status === 'aberta' ? <button className="btn sm" onClick={() => actions.salvarPendencia({ id: p.id, status: 'resolvida', resolvidaEm: today() })}>Resolver</button> : <span className="small muted">resolvida {fmtDate(p.resolvidaEm)}</span>}</td></tr>)}</tbody></table>}
      </div>
      <div className="card">
        <h3>Alertas abertos</h3>
        {alertas.length === 0 ? <Empty>Nenhum alerta aberto.</Empty> : <table className="tbl"><tbody>{alertas.map(a => <tr key={a.id}><td><b>{a.titulo}</b><div className="small muted">{a.detalhe}</div></td><td className="r small">{a.responsavel}<br />prazo {fmtDate(a.prazo)}</td></tr>)}</tbody></table>}
        <h3 style={{ marginTop: 14 }}>Sinais de coerência (semana atual)</h3>
        {coerencia(av.semana, av.regs, st.settings).length === 0 ? <p className="small muted">Nenhum sinal: solicitações e avaliações coerentes.</p> : coerencia(av.semana, av.regs, st.settings).map((s, i) => <div key={i} className="callout warn small"><b>{s.texto}</b><br />{s.acao}</div>)}
      </div>
    </div>}

    {tab === 'resumo' && <ResumoSemanal av={av} />}

    {edit && <EmpresaForm emp={emp} grupos={st.grupos} settings={st.settings} onClose={() => setEdit(false)} />}
    {reg && <Modal title={reg.id ? 'Editar registro · ' + fmtDate(reg.data) : 'Registrar dia · ' + emp.nome} onClose={() => setReg(null)}><RegistroForm emp={emp} registro={reg.id ? reg : null} ultimo={av.ultimo} onDone={() => setReg(null)} /></Modal>}
    {pend && <PendenciaForm empresaId={id} onClose={() => setPend(false)} />}
  </>
}

function ResumoSemanal({ av }) {
  const [obs, setObs] = useState('')
  const texto = resumoSemanal(av, obs)
  const [ok, setOk] = useState(false)
  return <div className="grid g2">
    <div className="card"><h3>Observação da auditoria</h3><p className="small muted">Um elogio específico ou uma orientação específica. Entra no resumo enviado na sexta-feira ao colaborador e ao empresário.</p>
      <textarea style={{ width: '100%', minHeight: 90, border: '1px solid #D1D5DB', borderRadius: 6, padding: 8 }} value={obs} onChange={e => setObs(e.target.value)} placeholder="Ex.: Ótima regularidade esta semana. Para a próxima, tente enviar o convite até 2 h após o atendimento." /></div>
    <div className="card"><div className="row" style={{ marginBottom: 8 }}><h3 style={{ margin: 0 }}>Texto para WhatsApp</h3><span className="spacer" /><button className="btn sm primary" onClick={() => copiar(texto).then(r => { setOk(r); setTimeout(() => setOk(false), 1500) })}>{ok ? 'Copiado!' : 'Copiar'}</button></div><pre className="pre">{texto}</pre></div>
  </div>
}

function PendenciaForm({ empresaId, onClose }) {
  const [v, set] = useForm({ tipo: 'treinamento', descricao: '', prazo: today() })
  return <Modal title="Nova pendência" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn primary" onClick={() => { if (!v.descricao) return; actions.salvarPendencia({ empresaId, ...v }); onClose() }}>Salvar</button></>}>
    <div className="form">
      <F label="Tipo"><select value={v.tipo} onChange={set('tipo')}><option value="treinamento">Treinamento pendente (–5)</option><option value="inconsistencia">Inconsistência não explicada (–5)</option><option value="violacao">Violação de integridade (–15)</option><option value="resposta">Resposta atrasada</option><option value="outra">Outra</option></select></F>
      <F label="Prazo"><input type="date" value={v.prazo} onChange={set('prazo')} /></F>
      <F label="Descrição" full><input value={v.descricao} onChange={set('descricao')} autoFocus /></F>
    </div>
  </Modal>
}

export function gerarRecomendacao(av, convGrupo) {
  const e = av.emp
  if (e.status === 'onboarding') return 'Concluir o checklist de entrada e realizar a primeira solicitação com acompanhamento em até 7 dias úteis.'
  if (av.diasSemRegistro >= 5) return `Sem registro há ${av.diasSemRegistro} dias úteis. Ligar para ${e.colaborador?.nome || 'o colaborador'} hoje e, se necessário, acionar o empresário (procedimento de empresas inativas).`
  if (av.diasSemRegistro >= 2) return 'Rotina interrompida há 2 dias úteis. Enviar lembrete e confirmar o horário fixo da rotina.'
  const c = av.ult30.conversao
  if (c != null && convGrupo != null && c < convGrupo * 0.8) return `Conversão de ${Math.round(c * 100)}% abaixo da média do segmento (${Math.round(convGrupo * 100)}%). Testar envio do convite em até 2 h após o atendimento e revisar o texto da mensagem.`
  if (av.corr.diasUteis && av.corr.diasComRegistro / av.corr.diasUteis < 0.7) return 'Participação abaixo de 70% dos dias úteis. Revisar com o empresário se o horário da rotina está protegido na agenda do colaborador.'
  if (av.ult30.novas > 0 && av.ult30.respondidas / av.ult30.novas < 0.9) return 'Nem todas as avaliações foram respondidas. Responder as pendentes com os modelos da biblioteca e manter o prazo de 48 h.'
  if (av.mes.novas >= av.meta) return 'Meta do mês atingida. Pedir indicação ao empresário no próximo contato e registrar boa prática para a reunião de grupo.'
  return 'Rotina estável. Manter o padrão; no próximo diagnóstico, avaliar aumento da meta individual.'
}
