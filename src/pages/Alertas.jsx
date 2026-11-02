import React, { useState } from 'react'
import { useStore, actions } from '../store.js'
import { ALERTA_TIPOS } from '../engine.js'
import { Top, Tag, Sev, Modal, F, useForm, Empty, go } from '../ui/common.jsx'
import { fmtDate, today, addDays } from '../dates.js'

export default function Alertas() {
  const st = useStore()
  const [f, setF] = useState('abertos'); const [tipo, setTipo] = useState(''); const [novo, setNovo] = useState(false)
  const nome = (id) => st.empresas.find(e => e.id === id)?.nome || '—'
  const list = st.alertas.filter(a => (f === 'abertos' ? a.status !== 'resolvido' : f === 'resolvidos' ? a.status === 'resolvido' : true) && (!tipo || a.tipo === tipo))
    .sort((a, b) => (a.status === 'resolvido' ? 1 : 0) - (b.status === 'resolvido' ? 1 : 0) || b.gravidade - a.gravidade || (a.prazo || '').localeCompare(b.prazo || ''))
  const atrasados = list.filter(a => a.status !== 'resolvido' && a.prazo && a.prazo < today()).length
  return <>
    <Top eyebrow="Operação" title="Alertas" sub={`${st.alertas.filter(a => a.status !== 'resolvido').length} abertos · ${atrasados} com prazo vencido · alertas automáticos são recalculados a cada registro`}>
      <button className="btn" onClick={() => actions.recalcularAlertas()}>Recalcular agora</button>
      <button className="btn primary" onClick={() => setNovo(true)}>Alerta manual</button>
    </Top>
    <div className="toolbar">
      <select value={f} onChange={e => setF(e.target.value)}><option value="abertos">Abertos e em tratamento</option><option value="resolvidos">Resolvidos</option><option value="todos">Todos</option></select>
      <select value={tipo} onChange={e => setTipo(e.target.value)}><option value="">Todos os tipos</option>{Object.entries(ALERTA_TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
    </div>
    <div className="callout small"><b>Regras ativas:</b> {st.settings.alertas.semRegistroAmarelo} dias úteis sem registro (amarelo) · {st.settings.alertas.semRegistroVermelho} dias (vermelho) · negativa sem resposta em 48 h · avaliações do mês &lt; {100 - st.settings.alertas.quedaAvaliacoesPct}% da média de 3 meses · nota caiu ≥ {st.settings.alertas.quedaNota} em 30 dias · índice &lt; {st.settings.alertas.indiceBaixo} por {st.settings.alertas.indiceBaixoSemanas} semanas · pagamento &gt; {st.settings.alertas.atrasoPagamentoDias} dias · pico &gt; {st.settings.alertas.picoFator}× a média · onboarding &gt; {st.settings.alertas.onboardingDiasUteis} dias úteis. Ajuste em Configurações.</div>
    {list.length === 0 ? <Empty>Nenhum alerta neste filtro.</Empty> : <div className="card" style={{ padding: 0 }}>
      <table className="tbl">
        <thead><tr><th></th><th>Empresa</th><th>Alerta</th><th>Tipo</th><th>Responsável</th><th>Prazo</th><th>Status</th><th></th></tr></thead>
        <tbody>{list.map(a => <tr key={a.id}>
          <td><Sev g={a.gravidade || 1} /></td>
          <td><a href={'#/empresa/' + a.empresaId}><b>{nome(a.empresaId)}</b></a><div className="small muted">criado {fmtDate(a.criadoEm)}{a.origem === 'auto' ? ' · automático' : ' · manual'}</div></td>
          <td><b>{a.titulo}</b><div className="small muted">{a.detalhe}</div>{a.resolucao && <div className="small" style={{ color: '#047857' }}>↳ {a.resolucao}</div>}</td>
          <td className="small">{ALERTA_TIPOS[a.tipo] || a.tipo}</td>
          <td className="small"><input value={a.responsavel || ''} onChange={e => actions.salvarAlerta({ id: a.id, responsavel: e.target.value })} style={{ border: '1px solid #E5E7EB', borderRadius: 4, padding: '3px 6px', width: 150, fontSize: 12 }} /></td>
          <td className="small">{a.prazo && a.status !== 'resolvido' && a.prazo < today() ? <Tag k="bad">{fmtDate(a.prazo)}</Tag> : fmtDate(a.prazo)}</td>
          <td><Tag k={a.status === 'resolvido' ? 'ok' : a.status === 'tratando' ? 'blue' : 'warn'}>{a.status}</Tag></td>
          <td className="r" style={{ whiteSpace: 'nowrap' }}>{a.status === 'aberto' && <button className="btn sm" onClick={() => actions.salvarAlerta({ id: a.id, status: 'tratando' })}>Tratar</button>} {a.status !== 'resolvido' && <button className="btn sm" onClick={() => { const r = prompt('Como foi resolvido?'); if (r != null) actions.salvarAlerta({ id: a.id, status: 'resolvido', resolvidoEm: today(), resolucao: r }) }}>Resolver</button>}</td>
        </tr>)}</tbody>
      </table>
    </div>}
    {novo && <NovoAlerta empresas={st.empresas} onClose={() => setNovo(false)} />}
  </>
}

function NovoAlerta({ empresas, onClose }) {
  const [v, set] = useForm({ empresaId: empresas[0]?.id || '', titulo: '', detalhe: '', gravidade: 2, responsavel: 'Gestor operacional', prazo: addDays(today(), 2) })
  return <Modal title="Alerta manual" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn primary" onClick={() => { if (!v.titulo) return; actions.salvarAlerta({ ...v, tipo: 'manual', gravidade: Number(v.gravidade), chave: 'manual:' + Date.now() }); onClose() }}>Salvar</button></>}>
    <div className="form">
      <F label="Empresa"><select value={v.empresaId} onChange={set('empresaId')}>{empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select></F>
      <F label="Gravidade"><select value={v.gravidade} onChange={set('gravidade')}><option value={1}>1 · Atenção</option><option value={2}>2 · Importante</option><option value={3}>3 · Grave</option></select></F>
      <F label="Título" full><input value={v.titulo} onChange={set('titulo')} autoFocus /></F>
      <F label="Detalhe" full><textarea value={v.detalhe} onChange={set('detalhe')} /></F>
      <F label="Responsável"><input value={v.responsavel} onChange={set('responsavel')} /></F>
      <F label="Prazo"><input type="date" value={v.prazo} onChange={set('prazo')} /></F>
    </div>
  </Modal>
}
