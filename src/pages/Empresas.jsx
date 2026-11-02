import React, { useMemo, useState } from 'react'
import { useStore, actions } from '../store.js'
import { avaliarEmpresa, metaIndividual, solicitacoesPrevistasMes } from '../engine.js'
import { Top, Nivel, Tag, Modal, F, useForm, go, Empty } from '../ui/common.jsx'
import { today, uid, fmtDate } from '../dates.js'

const STATUS = { onboarding: ['Onboarding', 'blue'], ativa: ['Ativa', 'ok'], pausada: ['Pausada', 'warn'], cancelada: ['Cancelada', 'gray'] }
export const StatusTag = ({ s }) => <Tag k={STATUS[s]?.[1] || 'gray'}>{STATUS[s]?.[0] || s}</Tag>

export default function Empresas() {
  const st = useStore()
  const [q, setQ] = useState(''); const [grupo, setGrupo] = useState(''); const [status, setStatus] = useState(''); const [nivel, setNivel] = useState('')
  const [edit, setEdit] = useState(null)
  const rows = useMemo(() => st.empresas.map(e => ({ e, av: avaliarEmpresa(st, e) })), [st])
  const vis = rows.filter(({ e, av }) => (!q || e.nome.toLowerCase().includes(q.toLowerCase()) || (e.colaborador?.nome || '').toLowerCase().includes(q.toLowerCase()) || (e.codigo || '').toLowerCase().includes(q.toLowerCase()))
    && (!grupo || e.grupoId === grupo) && (!status || e.status === status) && (!nivel || av.idxCorrente.nivel === nivel))
    .sort((a, b) => a.e.nome.localeCompare(b.e.nome))
  return <>
    <Top eyebrow="Cadastro" title="Empresas" sub={`${st.empresas.length} cadastradas · ${st.empresas.filter(e => e.status === 'ativa').length} ativas`}>
      <button className="btn primary" onClick={() => setEdit({})}>Nova empresa</button>
    </Top>
    <div className="toolbar">
      <input placeholder="Buscar por empresa, colaborador ou código" value={q} onChange={e => setQ(e.target.value)} style={{ minWidth: 280 }} />
      <select value={grupo} onChange={e => setGrupo(e.target.value)}><option value="">Todos os grupos</option>{st.grupos.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}</select>
      <select value={status} onChange={e => setStatus(e.target.value)}><option value="">Todos os status</option>{Object.keys(STATUS).map(k => <option key={k} value={k}>{STATUS[k][0]}</option>)}</select>
      <select value={nivel} onChange={e => setNivel(e.target.value)}><option value="">Todos os níveis</option><option value="A">A · Referência</option><option value="B">B · Em desenvolvimento</option><option value="C">C · Atenção</option></select>
    </div>
    {vis.length === 0 ? <Empty>Nenhuma empresa encontrada. {st.empresas.length === 0 && <>Cadastre a primeira em <b>Nova empresa</b> ou carregue os dados de demonstração em Configurações.</>}</Empty> :
      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Empresa</th><th>Grupo</th><th>Status</th><th>Colaborador</th><th className="r">Clientes/dia</th><th className="r">Meta/mês</th><th className="r">Índice</th><th>Nível</th><th className="r">Avaliações</th><th className="r">Nota</th><th className="r">Entrada</th><th></th></tr></thead>
          <tbody>{vis.map(({ e, av }) => <tr key={e.id} className="click" onClick={() => go('/empresa/' + e.id)}>
            <td><b>{e.nome}</b><div className="small muted">{e.codigo} · {e.segmento}</div></td>
            <td className="small">{st.grupos.find(g => g.id === e.grupoId)?.nome || <span className="muted">sem grupo</span>}</td>
            <td><StatusTag s={e.status} /></td>
            <td className="small">{e.colaborador?.nome || '—'}<div className="muted">{e.horarioRotina ? 'rotina ' + e.horarioRotina : ''}</div></td>
            <td className="r">{e.clientesDia || '—'}</td>
            <td className="r">{av.meta}</td>
            <td className="r"><b>{e.status === 'ativa' ? av.idxCorrente.total : '—'}</b></td>
            <td>{e.status === 'ativa' ? <Nivel n={av.idxCorrente.nivel} /> : ''}</td>
            <td className="r">{av.totalAtual}<div className="small muted">+{av.ult30.novas} em 30 d</div></td>
            <td className="r">{av.notaAtual != null ? av.notaAtual.toFixed(1) : '—'}</td>
            <td className="r small">{fmtDate(e.dataEntrada)}</td>
            <td><button className="btn sm" onClick={(ev) => { ev.stopPropagation(); setEdit(e) }}>Editar</button></td>
          </tr>)}</tbody>
        </table>
      </div>}
    {edit && <EmpresaForm emp={edit} grupos={st.grupos} settings={st.settings} onClose={() => setEdit(null)} />}
  </>
}

export function EmpresaForm({ emp, grupos, settings, onClose }) {
  const novo = !emp.id
  const defaults = {
    nome: '', cnpj: '', segmento: 'Saúde', cidade: '', grupoId: grupos[0]?.id || '', perfilUrl: '', avaliacoesBase: '', notaBase: '', clientesDia: '', metaMensal: '',
    horarioRotina: '17:30', canal: 'WhatsApp da empresa', sistemaRegistro: '', plano: 'mensal', status: 'onboarding', dataEntrada: today(), observacoes: '', codigo: 'GPP-' + String(Math.floor(100 + Math.random() * 900)),
  }
  const [v, set, setV] = useForm({
    ...defaults, ...emp,
    empresario: { nome: '', whatsapp: '', email: '', ...(emp.empresario || {}) },
    colaborador: { nome: '', funcao: '', whatsapp: '', ...(emp.colaborador || {}) },
    substituto: { nome: '', ...(emp.substituto || {}) },
    assinatura: { diaCobranca: 5, valor: settings.financeiro.preco, valorAnual: settings.financeiro.preco * 10, ...(emp.assinatura || {}) },
  })
  const metaCalc = metaIndividual(Number(v.clientesDia), settings)
  const salvar = () => {
    if (!v.nome.trim()) return alert('Informe o nome da empresa.')
    const item = { ...v, id: emp.id || uid(), clientesDia: Number(v.clientesDia) || 0, metaMensal: Number(v.metaMensal) || metaCalc, avaliacoesBase: v.avaliacoesBase === '' ? null : Number(v.avaliacoesBase), notaBase: v.notaBase === '' ? null : Number(v.notaBase), checklist: emp.checklist || {} }
    if (item.status === 'cancelada' && !item.dataCancelamento) item.dataCancelamento = today()
    actions.salvarEmpresa(item); onClose()
  }
  return <Modal title={novo ? 'Nova empresa' : 'Editar · ' + emp.nome} onClose={onClose} wide footer={<>
    {!novo && <button className="btn danger" onClick={() => { if (confirm('Remover a empresa e todos os seus registros? Esta ação não pode ser desfeita.')) { actions.removerEmpresa(emp.id); onClose(); go('/empresas') } }}>Remover</button>}
    <span className="spacer" /><button className="btn" onClick={onClose}>Cancelar</button><button className="btn primary" onClick={salvar}>Salvar</button></>}>
    <div className="form c3">
      <F label="Nome da empresa" full><input value={v.nome} onChange={set('nome')} autoFocus /></F>
      <F label="Código (link do colaborador)"><input value={v.codigo} onChange={set('codigo')} /></F>
      <F label="CNPJ"><input value={v.cnpj} onChange={set('cnpj')} /></F>
      <F label="Segmento"><select value={v.segmento} onChange={set('segmento')}>{['Saúde', 'Odontologia', 'Estética e bem-estar', 'Serviços profissionais', 'Serviços locais', 'Outro'].map(s => <option key={s}>{s}</option>)}</select></F>
      <F label="Cidade / bairro"><input value={v.cidade} onChange={set('cidade')} /></F>
      <F label="Grupo"><select value={v.grupoId || ''} onChange={set('grupoId')}><option value="">Sem grupo</option>{grupos.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}</select></F>
      <F label="Status"><select value={v.status} onChange={set('status')}>{Object.keys(STATUS).map(k => <option key={k} value={k}>{STATUS[k][0]}</option>)}</select></F>
      <F label="Data de entrada (pagamento)"><input type="date" value={v.dataEntrada || ''} onChange={set('dataEntrada')} /></F>
      <F label="Link do Perfil da Empresa no Google" full><input value={v.perfilUrl} onChange={set('perfilUrl')} placeholder="https://g.page/r/..." /></F>
      <F label="Avaliações na entrada (linha de base)" hint="Contagem do perfil no dia do onboarding"><input type="number" value={v.avaliacoesBase ?? ''} onChange={set('avaliacoesBase')} /></F>
      <F label="Nota na entrada"><input type="number" step="0.1" min="1" max="5" value={v.notaBase ?? ''} onChange={set('notaBase')} /></F>
      <F label="Clientes atendidos por dia (média)"><input type="number" value={v.clientesDia} onChange={set('clientesDia')} /></F>
      <F label="Meta mensal de avaliações" hint={`Fórmula: ${v.clientesDia || 0} × ${settings.diasUteisMes} × ${settings.elegiveis * 100}% × ${settings.conversaoRef * 100}% = ${metaCalc} (≈ ${solicitacoesPrevistasMes(metaCalc, settings)} solicitações/mês). Deixe vazio para usar a fórmula.`}><input type="number" value={v.metaMensal} onChange={set('metaMensal')} placeholder={String(metaCalc)} /></F>
      <F label="Empresário responsável"><input value={v.empresario.nome} onChange={set('empresario.nome')} /></F>
      <F label="WhatsApp do empresário"><input value={v.empresario.whatsapp} onChange={set('empresario.whatsapp')} /></F>
      <F label="E-mail para relatórios"><input value={v.empresario.email} onChange={set('empresario.email')} /></F>
      <F label="Colaborador responsável"><input value={v.colaborador.nome} onChange={set('colaborador.nome')} /></F>
      <F label="Função"><input value={v.colaborador.funcao} onChange={set('colaborador.funcao')} /></F>
      <F label="WhatsApp do colaborador"><input value={v.colaborador.whatsapp} onChange={set('colaborador.whatsapp')} /></F>
      <F label="Colaborador substituto"><input value={v.substituto.nome} onChange={set('substituto.nome')} /></F>
      <F label="Horário da rotina diária"><input type="time" value={v.horarioRotina} onChange={set('horarioRotina')} /></F>
      <F label="Canal autorizado com clientes"><select value={v.canal} onChange={set('canal')}>{['WhatsApp da empresa', 'SMS', 'E-mail', 'Presencial (QR code) + WhatsApp'].map(c => <option key={c}>{c}</option>)}</select></F>
      <F label="Sistema onde registra atendimentos"><input value={v.sistemaRegistro} onChange={set('sistemaRegistro')} placeholder="Agenda, prontuário, CRM, planilha" /></F>
      <F label="Plano"><select value={v.plano} onChange={set('plano')}><option value="mensal">Mensal</option><option value="anual">Anual (à vista)</option></select></F>
      <F label="Dia de cobrança"><input type="number" min="1" max="28" value={v.assinatura.diaCobranca} onChange={set('assinatura.diaCobranca')} /></F>
      <F label={v.plano === 'anual' ? 'Valor anual (R$)' : 'Valor mensal (R$)'}><input type="number" value={v.plano === 'anual' ? v.assinatura.valorAnual : v.assinatura.valor} onChange={set(v.plano === 'anual' ? 'assinatura.valorAnual' : 'assinatura.valor')} /></F>
      <F label="Observações" full><textarea value={v.observacoes} onChange={set('observacoes')} /></F>
    </div>
  </Modal>
}
