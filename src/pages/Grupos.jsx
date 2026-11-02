import React, { useMemo, useState } from 'react'
import { useStore, actions } from '../store.js'
import { avaliarEmpresa } from '../engine.js'
import { Top, Modal, F, useForm, Nivel, Empty, Tag } from '../ui/common.jsx'
import { today, fmtDate, addDays } from '../dates.js'

export default function Grupos() {
  const st = useStore()
  const [edit, setEdit] = useState(null); const [reun, setReun] = useState(null)
  const avs = useMemo(() => Object.fromEntries(st.empresas.map(e => [e.id, avaliarEmpresa(st, e)])), [st])
  return <>
    <Top eyebrow="Gestão" title="Grupos e reuniões" sub="10 grupos de 10 empresas · reunião quinzenal de 45 min · ata com 3 pontos · um grupo só abre com 6 empresas confirmadas">
      <button className="btn" onClick={() => setReun({})}>Registrar reunião</button>
      <button className="btn primary" onClick={() => setEdit({})}>Novo grupo</button>
    </Top>
    {st.grupos.length === 0 ? <Empty>Nenhum grupo. Crie o primeiro.</Empty> : <div className="grid g2">
      {st.grupos.map(g => {
        const emps = st.empresas.filter(e => e.grupoId === g.id && e.status !== 'cancelada')
        const ativas = emps.filter(e => e.status === 'ativa')
        const idx = ativas.length ? Math.round(ativas.reduce((x, e) => x + avs[e.id].idxCorrente.total, 0) / ativas.length) : null
        const reunioes = st.reunioes.filter(r => r.grupoId === g.id).sort((a, b) => b.data.localeCompare(a.data))
        const ultima = reunioes[0]; const atrasada = ultima ? addDays(ultima.data, 14) < today() : true
        return <div key={g.id} className="card">
          <div className="row" style={{ marginBottom: 6 }}><h3 style={{ margin: 0 }}>{g.nome}</h3><Tag k="gray">{g.segmento}</Tag><span className="spacer" /><button className="btn sm" onClick={() => setEdit(g)}>Editar</button></div>
          <div className="small muted" style={{ marginBottom: 8 }}>{g.responsavel} · {g.reuniao || 'horário a definir'} · {emps.length}/10 empresas{emps.length < 6 ? ' · abaixo do mínimo de 6' : ''}</div>
          <div className="grid g3" style={{ marginBottom: 10 }}>
            <div className="kpi"><div className="v">{idx ?? '—'}</div><div className="l">Índice médio</div></div>
            <div className="kpi"><div className="v">{ativas.reduce((x, e) => x + avs[e.id].mes.novas, 0)}</div><div className="l">Avaliações no mês</div></div>
            <div className={'kpi' + (atrasada ? ' warn' : '')}><div className="v" style={{ fontSize: 15 }}>{ultima ? fmtDate(ultima.data) : 'nenhuma'}</div><div className="l">Última reunião{atrasada ? ' · atrasada' : ''}</div></div>
          </div>
          <table className="tbl"><tbody>{emps.map(e => <tr key={e.id}><td><a href={'#/empresa/' + e.id}>{e.nome}</a></td><td className="r">{e.status === 'ativa' ? avs[e.id].idxCorrente.total : <span className="small muted">{e.status}</span>}</td><td>{e.status === 'ativa' && <Nivel n={avs[e.id].idxCorrente.nivel} />}</td></tr>)}</tbody></table>
          {ultima && <div className="small" style={{ marginTop: 8 }}><b>Ata da última reunião:</b><ol style={{ margin: '2px 0 0', paddingLeft: 18 }}>{(ultima.pontos || []).filter(Boolean).map((p, i) => <li key={i}>{p}</li>)}</ol><div className="muted">Presentes: {(ultima.presentes || []).length} de {emps.length}</div></div>}
          <button className="btn sm" style={{ marginTop: 8 }} onClick={() => setReun({ grupoId: g.id })}>Registrar reunião deste grupo</button>
        </div>
      })}
    </div>}
    {edit && <GrupoForm g={edit} onClose={() => setEdit(null)} />}
    {reun && <ReuniaoForm r={reun} grupos={st.grupos} empresas={st.empresas} onClose={() => setReun(null)} />}
  </>
}

function GrupoForm({ g, onClose }) {
  const [v, set] = useForm({ nome: '', segmento: 'Saúde', responsavel: 'Gestor operacional', reuniao: '', ...g })
  return <Modal title={g.id ? 'Editar grupo' : 'Novo grupo'} onClose={onClose} footer={<>{g.id && <button className="btn danger" onClick={() => { if (confirm('Remover grupo? As empresas ficam sem grupo.')) { actions.removerGrupo(g.id); onClose() } }}>Remover</button>}<span className="spacer" /><button className="btn" onClick={onClose}>Cancelar</button><button className="btn primary" onClick={() => { if (!v.nome) return; actions.salvarGrupo(v); onClose() }}>Salvar</button></>}>
    <div className="form">
      <F label="Nome" full><input value={v.nome} onChange={set('nome')} placeholder="G1 · Saúde" autoFocus /></F>
      <F label="Segmento / critério"><input value={v.segmento} onChange={set('segmento')} /></F>
      <F label="Responsável na central"><input value={v.responsavel} onChange={set('responsavel')} /></F>
      <F label="Ritmo da reunião" full><input value={v.reuniao} onChange={set('reuniao')} placeholder="Quinzenal · terça 12h30" /></F>
    </div>
  </Modal>
}

function ReuniaoForm({ r, grupos, empresas, onClose }) {
  const [v, set, setV] = useForm({ grupoId: r.grupoId || grupos[0]?.id || '', data: today(), presentes: [], pontos: ['', '', ''], ata: '', ...r })
  const emps = empresas.filter(e => e.grupoId === v.grupoId && e.status !== 'cancelada')
  const toggle = (id) => setV(s => ({ ...s, presentes: s.presentes.includes(id) ? s.presentes.filter(x => x !== id) : [...s.presentes, id] }))
  return <Modal title="Registrar reunião de grupo" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn primary" onClick={() => { actions.salvarReuniao(v); onClose() }}>Salvar</button></>}>
    <div className="form">
      <F label="Grupo"><select value={v.grupoId} onChange={e => setV(s => ({ ...s, grupoId: e.target.value, presentes: [] }))}>{grupos.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}</select></F>
      <F label="Data"><input type="date" value={v.data} onChange={set('data')} /></F>
      <F label="Presentes" full><div className="check" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '4px 14px' }}>{emps.map(e => <label key={e.id}><input type="checkbox" checked={v.presentes.includes(e.id)} onChange={() => toggle(e.id)} />{e.nome}</label>)}</div></F>
      {[0, 1, 2].map(i => <F key={i} label={`Ponto ${i + 1} da ata`} full><input value={v.pontos[i] || ''} onChange={e => setV(s => { const p = [...s.pontos]; p[i] = e.target.value; return { ...s, pontos: p } })} placeholder={['Indicadores do grupo', 'Caso / boa prática do mês', 'Reconhecimento e próxima pauta'][i]} /></F>)}
      <F label="Observações" full><textarea value={v.ata} onChange={set('ata')} /></F>
    </div>
  </Modal>
}
