import React, { useMemo, useState } from 'react'
import { useStore, actions } from '../store.js'
import { registrosEmpresa } from '../engine.js'
import { Top, F, useForm, Tag, Natureza, Empty } from '../ui/common.jsx'
import { today, fmtDate, isWeekend } from '../dates.js'

export default function Registro({ codigo, publico }) {
  const st = useStore()
  const [sel, setSel] = useState('')
  const emp = codigo ? st.empresas.find(e => (e.codigo || '').toLowerCase() === codigo.toLowerCase()) : st.empresas.find(e => e.id === sel)
  const [done, setDone] = useState(false)
  const ultimo = useMemo(() => emp ? registrosEmpresa(st, emp.id).slice(-1)[0] : null, [st, emp])
  if (publico) {
    return <div className="public">
      <div className="head"><small>Clube Google Primeira Página · Registro diário</small><div style={{ fontSize: 18, fontWeight: 600 }}>{emp ? emp.nome : 'Empresa não encontrada'}</div>{emp && <div className="small" style={{ color: '#CBD5E1' }}>Colaborador: {emp.colaborador?.nome} · rotina às {emp.horarioRotina}</div>}</div>
      {!emp ? <Empty>Código inválido. Peça o link correto ao analista de relacionamento.</Empty> : done ? <div className="card"><h2>Registro recebido. Obrigado!</h2><p>Seu painel será atualizado amanhã às 7h. Se algo travou hoje, avise no canal de suporte.</p><button className="btn" onClick={() => setDone(false)}>Registrar outro dia</button></div> :
        <div className="card"><RegistroForm emp={emp} ultimo={ultimo} onDone={() => setDone(true)} publico /></div>}
      <p className="small muted" style={{ marginTop: 14 }}>Registre apenas contagens. Nunca informe nomes ou telefones de clientes. Um convite por cliente, sem incentivos, para todos os clientes atendidos.</p>
    </div>
  }
  const ativas = st.empresas.filter(e => e.status === 'ativa' || e.status === 'onboarding').sort((a, b) => a.nome.localeCompare(b.nome))
  const hoje = today()
  const semHoje = ativas.filter(e => e.status === 'ativa' && !st.registros.some(r => r.empresaId === e.id && r.data === hoje))
  return <>
    <Top eyebrow="Operação" title="Registro diário" sub="Formulário do colaborador (6 campos, 30 segundos). Cada empresa tem um link próprio em sua página; aqui a equipe pode registrar em nome de uma empresa." />
    <div className="grid g-1-2">
      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <F label="Empresa"><select value={sel} onChange={e => { setSel(e.target.value); setDone(false) }}><option value="">Selecione…</option>{ativas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select></F>
        </div>
        <div className="card"><h3>Ainda sem registro hoje ({isWeekend(hoje) ? 'fim de semana' : semHoje.length})</h3>
          {isWeekend(hoje) ? <p className="small muted">Hoje não é dia útil.</p> : semHoje.length === 0 ? <p className="small muted">Todas as empresas ativas registraram.</p> : <ul className="small" style={{ margin: 0, paddingLeft: 16 }}>{semHoje.map(e => <li key={e.id}><a href="#" onClick={(ev) => { ev.preventDefault(); setSel(e.id); setDone(false) }}>{e.nome}</a> <span className="muted">· {e.colaborador?.nome} · {e.horarioRotina}</span></li>)}</ul>}
        </div>
      </div>
      <div className="card">
        {!emp ? <Empty>Selecione uma empresa para registrar.</Empty> : done ? <div><h3>Registro salvo para {emp.nome}.</h3><button className="btn" onClick={() => setDone(false)}>Novo registro</button></div> : <RegistroForm emp={emp} ultimo={ultimo} onDone={() => setDone(true)} />}
      </div>
    </div>
  </>
}

export function RegistroForm({ emp, registro, ultimo, onDone, publico }) {
  const [v, set, setV] = useForm({ data: today(), atendidos: '', solicitacoes: '', canal: emp.canal || 'WhatsApp da empresa', avaliacoesTotal: '', nota: '', respondidas: '', negativasNovas: 0, negativasRespondidas: 0, reclamacao: '', dificuldade: '', ...(registro || {}) })
  const prevTotal = registro ? null : (ultimo?.avaliacoesTotal ?? emp.avaliacoesBase)
  const novas = v.avaliacoesTotal !== '' && prevTotal != null ? Math.max(0, Number(v.avaliacoesTotal) - Number(prevTotal)) : null
  const salvar = () => {
    if (!v.data) return alert('Informe a data.')
    if (v.solicitacoes === '' || v.atendidos === '') return alert('Informe clientes atendidos e solicitações enviadas.')
    if (Number(v.solicitacoes) > Number(v.atendidos)) return alert('Solicitações não podem ser maiores que clientes atendidos.')
    actions.salvarRegistro({ ...(registro || {}), empresaId: emp.id, data: v.data, atendidos: Number(v.atendidos), solicitacoes: Number(v.solicitacoes), canal: v.canal, avaliacoesTotal: v.avaliacoesTotal === '' ? null : Number(v.avaliacoesTotal), nota: v.nota === '' ? null : Number(v.nota), respondidas: Number(v.respondidas) || 0, negativasNovas: Number(v.negativasNovas) || 0, negativasRespondidas: Number(v.negativasRespondidas) || 0, reclamacao: v.reclamacao, dificuldade: v.dificuldade })
    onDone && onDone()
  }
  return <div>
    <div className="steps" style={{ marginBottom: 12 }}>{['Identificar', 'Solicitar', 'Registrar', 'Acompanhar', 'Responder', 'Reportar'].map((s, i) => <div key={s} className={i === 2 ? 'on' : i < 2 ? 'done' : ''}>{i + 1}. {s}</div>)}</div>
    <div className="form">
      <F label="Data da atividade" hint={v.data !== today() ? 'Registro retroativo: não conta para participação.' : 'Registre no mesmo dia.'}><input type="date" value={v.data} max={today()} onChange={set('data')} disabled={!!registro} /></F>
      <F label="Canal usado"><select value={v.canal} onChange={set('canal')}>{['WhatsApp da empresa', 'SMS', 'E-mail', 'Presencial (QR code) + WhatsApp'].map(c => <option key={c}>{c}</option>)}</select></F>
      <F label={<>Clientes atendidos hoje <Natureza /></>} hint="Apenas a quantidade. Sem nomes."><input type="number" min="0" value={v.atendidos} onChange={set('atendidos')} autoFocus /></F>
      <F label={<>Convites de avaliação enviados <Natureza /></>} hint="Um por cliente; exclua quem foi convidado nos últimos 90 dias."><input type="number" min="0" value={v.solicitacoes} onChange={set('solicitacoes')} /></F>
      <F label={<>Total de avaliações no perfil agora <Natureza comprovado /></>} hint={prevTotal != null ? `Última contagem: ${prevTotal}${novas != null ? ` → ${novas} nova(s) hoje` : ''}` : 'Abra o Perfil da Empresa e copie o número total.'}><input type="number" min="0" value={v.avaliacoesTotal ?? ''} onChange={set('avaliacoesTotal')} /></F>
      <F label={<>Nota média atual <Natureza comprovado /></>}><input type="number" step="0.1" min="1" max="5" value={v.nota ?? ''} onChange={set('nota')} placeholder={ultimo?.nota ?? emp.notaBase ?? ''} /></F>
      <F label={<>Avaliações respondidas hoje <Natureza comprovado /></>}><input type="number" min="0" value={v.respondidas} onChange={set('respondidas')} /></F>
      <F label="Avaliações de 1 a 3 estrelas recebidas / respondidas" hint="Negativas devem ser respondidas em até 24 h e o gestor avisado."><div className="row"><input type="number" min="0" style={{ width: 80, border: '1px solid #D1D5DB', borderRadius: 6, padding: 7 }} value={v.negativasNovas} onChange={set('negativasNovas')} /> / <input type="number" min="0" style={{ width: 80, border: '1px solid #D1D5DB', borderRadius: 6, padding: 7 }} value={v.negativasRespondidas} onChange={set('negativasRespondidas')} /></div></F>
      <F label="Reclamação ou oportunidade observada" hint="Sem nomes. Ex.: espera acima de 20 min." full><input value={v.reclamacao} onChange={set('reclamacao')} /></F>
      <F label="Dificuldade operacional (vai para o suporte)" full><input value={v.dificuldade} onChange={set('dificuldade')} /></F>
    </div>
    <div className="actions" style={{ marginTop: 14, justifyContent: 'flex-end' }}>
      {!publico && registro && <button className="btn danger" onClick={() => { if (confirm('Remover este registro?')) { actions.removerRegistro(registro.id); onDone && onDone() } }}>Remover</button>}
      <span className="spacer" />
      <button className="btn primary" onClick={salvar}>{registro ? 'Salvar alterações' : 'Enviar registro do dia'}</button>
    </div>
  </div>
}
