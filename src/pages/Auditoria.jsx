import React, { useMemo, useState } from 'react'
import { useStore, actions } from '../store.js'
import { avaliarEmpresa, coerencia, resumoSemanal, NIVEL_LABEL } from '../engine.js'
import { CHECKLIST_AUDITORIA } from '../demo.js'
import { Top, Nivel, Tag, Modal, Natureza, copiar, Empty, KPI } from '../ui/common.jsx'
import { today, weekKey, weekRange, fmtDate, addDays, pct } from '../dates.js'

export default function Auditoria() {
  const st = useStore()
  const [ref, setRef] = useState(today())
  const wk = weekKey(ref); const [wi, wf] = weekRange(ref)
  const [open, setOpen] = useState(null)
  const rows = useMemo(() => st.empresas.filter(e => e.status === 'ativa').map(e => {
    const av = avaliarEmpresa(st, e, ref > wf ? wf : ref)
    const aud = st.auditorias.find(a => a.empresaId === e.id && a.semana === wk)
    const sinais = coerencia(av.semana, av.regs, st.settings)
    return { e, av, aud, sinais }
  }).sort((a, b) => (a.aud ? 1 : 0) - (b.aud ? 1 : 0) || a.av.idxSemana.total - b.av.idxSemana.total), [st, ref, wk, wf])
  const feitas = rows.filter(r => r.aud).length
  return <>
    <Top eyebrow="Auditoria" title="Auditoria semanal" sub={`Semana ${wk} · ${fmtDate(wi)} a ${fmtDate(wf)} · ${feitas}/${rows.length} empresas auditadas`}>
      <div className="row"><button className="btn sm" onClick={() => setRef(addDays(ref, -7))}>‹ semana anterior</button><input type="date" value={ref} onChange={e => setRef(e.target.value)} style={{ border: '1px solid #D1D5DB', borderRadius: 6, padding: 6 }} /><button className="btn sm" onClick={() => setRef(addDays(ref, 7))} disabled={addDays(ref, 7) > today()}>próxima ›</button></div>
    </Top>
    <div className="grid g4" style={{ marginBottom: 14 }}>
      <KPI v={`${feitas}/${rows.length}`} l="Auditadas na semana" d="meta: 100% até quarta-feira" k={feitas === rows.length && rows.length ? 'ok' : 'warn'} />
      <KPI v={rows.filter(r => r.sinais.length).length} l="Empresas com sinais de coerência" d="conversão fora de 10–60%, picos, retroativos" k={rows.filter(r => r.sinais.length).length ? 'warn' : 'ok'} />
      <KPI v={rows.length ? Math.round(rows.reduce((x, r) => x + r.av.idxSemana.total, 0) / rows.length) : 0} l="Índice médio da semana" />
      <KPI v={rows.filter(r => r.av.idxSemana.nivel === 'C').length} l="Empresas em nível C na semana" d="entram na reunião de quinta" />
    </div>
    <div className="callout small"><b>Rotina:</b> segunda consolidar · segunda a quarta conferir (≈ 15 min por empresa) · quarta publicar índice e nível · quinta tratar nível C e inativas · sexta enviar resumo. Clique em uma empresa para abrir o checklist de auditoria.</div>
    {rows.length === 0 ? <Empty>Nenhuma empresa ativa.</Empty> : <div className="card" style={{ padding: 0 }}>
      <table className="tbl">
        <thead><tr><th>Empresa</th><th className="r">Dias c/ registro</th><th className="r">Solicitações</th><th className="r">Avaliações novas</th><th className="r">Conversão</th><th className="r">Nota</th><th className="r">Respondidas</th><th>Sinais</th><th className="r">Índice sem.</th><th>Nível</th><th>Auditoria</th></tr></thead>
        <tbody>{rows.map(({ e, av, aud, sinais }) => <tr key={e.id} className="click" onClick={() => setOpen(e.id)}>
          <td><b>{e.nome}</b><div className="small muted">{e.colaborador?.nome}</div></td>
          <td className="r">{av.semana.diasComRegistro}/{av.semana.diasUteis}{av.semana.retroativos ? <span className="small muted"> (+{av.semana.retroativos} retro)</span> : ''}</td>
          <td className="r">{av.semana.solicitacoes}</td><td className="r"><b>{av.semana.novas}</b></td>
          <td className="r">{av.semana.conversao != null ? <span className={av.semana.conversao < st.settings.coerencia.convMin || av.semana.conversao > st.settings.coerencia.convMax ? 'sev2' : ''}>{pct(av.semana.conversao)}</span> : '—'}</td>
          <td className="r">{av.notaAtual?.toFixed(1) ?? '—'}</td><td className="r">{av.semana.respondidas}/{av.semana.novas}</td>
          <td>{sinais.length ? sinais.map((s, i) => <Tag key={i} k="warn" title={s.texto}>{s.tipo.replace('_', ' ')}</Tag>) : <Tag k="ok">coerente</Tag>}</td>
          <td className="r"><b>{av.idxSemana.total}</b></td><td><Nivel n={av.idxSemana.nivel} /></td>
          <td>{aud ? <Tag k="ok">auditada {fmtDate(aud.data)}</Tag> : <Tag k="gray">pendente</Tag>}</td>
        </tr>)}</tbody>
      </table>
    </div>}
    {open && <AuditoriaForm row={rows.find(r => r.e.id === open)} semana={wk} onClose={() => setOpen(null)} settings={st.settings} />}
  </>
}

function AuditoriaForm({ row, semana, onClose, settings }) {
  const { e, av, aud, sinais } = row
  const [checks, setChecks] = useState(aud?.checks || {})
  const [obs, setObs] = useState(aud?.observacao || '')
  const [explica, setExplica] = useState(aud?.explicacao || '')
  const [auditor, setAuditor] = useState(aud?.auditor || '')
  const [ok, setOk] = useState(false)
  const done = CHECKLIST_AUDITORIA.filter(c => checks[c.id]).length
  const salvar = () => {
    actions.salvarAuditoria({ id: aud?.id, empresaId: e.id, semana, data: today(), checks, observacao: obs, explicacao: explica, auditor, indice: av.idxSemana.total, nivel: av.idxSemana.nivel, conversao: av.semana.conversao, novas: av.semana.novas, solicitacoes: av.semana.solicitacoes, sinais: sinais.map(s => s.tipo) })
    if (sinais.some(s => s.tipo !== 'retroativos') && !explica.trim() && !checks.conversao) {
      if (confirm('Há sinais de coerência sem explicação. Abrir pendência de inconsistência não explicada (–5 pontos em Qualidade)?')) actions.salvarPendencia({ empresaId: e.id, tipo: 'inconsistencia', descricao: `Semana ${semana}: ${sinais.map(s => s.texto).join(' ')}`, prazo: addDays(today(), 7) })
    }
    onClose()
  }
  const texto = resumoSemanal(av, obs)
  return <Modal title={`Auditoria · ${e.nome} · ${semana}`} onClose={onClose} wide footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn primary" onClick={salvar}>Salvar auditoria</button></>}>
    <div className="grid g2">
      <div>
        <h3>Números da semana</h3>
        <table className="tbl"><tbody>
          <tr><td>Dias com registro no dia</td><td className="r"><b>{av.semana.diasComRegistro}/{av.semana.diasUteis}</b> <Natureza comprovado /></td></tr>
          <tr><td>Registros retroativos</td><td className="r">{av.semana.retroativos}</td></tr>
          <tr><td>Clientes atendidos</td><td className="r">{av.semana.atendidos} <Natureza /></td></tr>
          <tr><td>Solicitações registradas</td><td className="r">{av.semana.solicitacoes} <Natureza /></td></tr>
          <tr><td>Avaliações novas (perfil)</td><td className="r"><b>{av.semana.novas}</b> <Natureza comprovado /></td></tr>
          <tr><td>Conversão implícita</td><td className="r">{av.semana.conversao != null ? pct(av.semana.conversao) : '—'} <span className="small muted">(faixa {pct(settings.coerencia.convMin)}–{pct(settings.coerencia.convMax)})</span></td></tr>
          <tr><td>Nota média / variação 30 d</td><td className="r">{av.notaAtual?.toFixed(1) ?? '—'} {av.nota30 != null && av.notaAtual != null && <span className="small muted">({(av.notaAtual - av.nota30 >= 0 ? '+' : '') + (av.notaAtual - av.nota30).toFixed(1)})</span>}</td></tr>
          <tr><td>Respondidas / negativas pendentes</td><td className="r">{av.semana.respondidas}/{av.semana.novas} · {Math.max(0, av.semana.negativasNovas - av.semana.negativasRespondidas)} neg. pendente(s)</td></tr>
          <tr><td>Pendências abertas</td><td className="r">{av.pend.length}</td></tr>
          <tr><td><b>Índice da semana</b></td><td className="r"><b>{av.idxSemana.total}</b> · <Nivel n={av.idxSemana.nivel} /></td></tr>
        </tbody></table>
        <div className="dims" style={{ marginTop: 8 }}>{Object.entries(av.idxSemana.dims).map(([k, v]) => <div key={k} className="d"><b>{v}</b><span>{k}</span></div>)}</div>
        <h3 style={{ marginTop: 14 }}>Sinais de coerência</h3>
        {sinais.length === 0 ? <div className="callout ok small">Coerente: nenhum sinal.</div> : sinais.map((s, i) => <div key={i} className="callout warn small"><b>{s.texto}</b><br />Ação: {s.acao}</div>)}
        {sinais.length > 0 && <label className="f"><span>Explicação / causa investigada</span><textarea value={explica} onChange={e => setExplica(e.target.value)} placeholder="Ex.: campanha presencial com QR code no dia 14, confirmada com o empresário." /></label>}
      </div>
      <div>
        <h3>Checklist de auditoria (documento 6) · {done}/{CHECKLIST_AUDITORIA.length}</h3>
        <div className="check">{CHECKLIST_AUDITORIA.map(c => <label key={c.id}><input type="checkbox" checked={!!checks[c.id]} onChange={ev => setChecks({ ...checks, [c.id]: ev.target.checked })} />{c.t}</label>)}</div>
        <label className="f" style={{ marginTop: 12 }}><span>Observação para o resumo semanal (1 elogio ou 1 orientação)</span><textarea value={obs} onChange={e => setObs(e.target.value)} /></label>
        <label className="f" style={{ marginTop: 8 }}><span>Auditor</span><input value={auditor} onChange={e => setAuditor(e.target.value)} /></label>
        <div className="row" style={{ marginTop: 12, marginBottom: 6 }}><h3 style={{ margin: 0 }}>Resumo para WhatsApp (sexta)</h3><span className="spacer" /><button className="btn sm" onClick={() => copiar(texto).then(r => { setOk(r); setTimeout(() => setOk(false), 1500) })}>{ok ? 'Copiado!' : 'Copiar'}</button></div>
        <pre className="pre small">{texto}</pre>
      </div>
    </div>
  </Modal>
}
