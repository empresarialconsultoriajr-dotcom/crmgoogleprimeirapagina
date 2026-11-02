import React, { useMemo, useState } from 'react'
import { useStore, actions } from '../store.js'
import { indicadoresRede } from '../engine.js'
import { Top, KPI, Tag, Modal, F, useForm, Empty } from '../ui/common.jsx'
import { brl, pct, monthKey, addMonths, monthLabel, today, fmtDate, daysBetween } from '../dates.js'
import { StatusTag } from './Empresas.jsx'

const CAUSAS = { a: 'Resultado abaixo do esperado', b: 'Execução interna falhou', c: 'Atendimento do Clube', d: 'Preço / caixa', e: 'Fechamento ou mudança' }
const OFERTAS = { a: 'Revisão de meta + plano de 30 dias com acompanhamento semanal', b: 'Mês de reinício com novo colaborador', c: 'Pedido de desculpas, correção e 1 mês de crédito', d: 'Pausa de 1 mês ou plano anual com desconto', e: 'Encerrar bem; porta aberta por 6 meses' }

export default function Financeiro() {
  const st = useStore()
  const [comp, setComp] = useState(monthKey(today()))
  const [canc, setCanc] = useState(null)
  const r = useMemo(() => indicadoresRede(st), [st])
  const f = st.settings.financeiro
  const pagantes = st.empresas.filter(e => e.status === 'ativa' || e.status === 'onboarding' || e.status === 'pausada')
  const rows = pagantes.map(e => {
    const pg = st.pagamentos.find(p => p.empresaId === e.id && p.competencia === comp)
    const dia = Number(e.assinatura?.diaCobranca || 5); const venc = `${comp}-${String(dia).padStart(2, '0')}`
    const atraso = pg?.status === 'pago' ? 0 : Math.max(0, daysBetween(venc, today()))
    const valor = e.plano === 'anual' ? (pg?.valor ?? 0) : Number(e.assinatura?.valor || f.preco)
    return { e, pg, venc, atraso, valor }
  }).sort((a, b) => b.atraso - a.atraso || a.e.nome.localeCompare(b.e.nome))
  const recebido = rows.filter(x => x.pg?.status === 'pago').reduce((s, x) => s + Number(x.pg.valor || 0), 0)
  const previsto = rows.reduce((s, x) => s + (x.e.plano === 'anual' ? 0 : x.valor), 0)
  const cancelados = st.cancelamentos.sort((a, b) => b.data.localeCompare(a.data))
  // projeção 90 dias
  const proj = [0, 1, 2].map(i => { const ym = addMonths(monthKey(today()), i); const mrr = r.mrr * Math.pow(1 - 0.03, i); const res = mrr * (1 - f.inadimplencia) * (1 - f.taxa) - mrr * f.imposto - f.custoFixo - f.cac; return { ym, mrr, res } })
  return <>
    <Top eyebrow="Gestão" title="Financeiro" sub="Assinaturas, recebimentos, churn e fluxo de cancelamento e retenção (documento 10)">
      <select value={comp} onChange={e => setComp(e.target.value)} style={{ border: '1px solid #D1D5DB', borderRadius: 6, padding: 6 }}>{[0, 1, 2, 3, 4, 5].map(i => { const ym = addMonths(monthKey(today()), -i); return <option key={ym} value={ym}>{monthLabel(ym)}</option> })}</select>
    </Top>
    <div className="grid g6" style={{ marginBottom: 14 }}>
      <KPI v={brl(r.mrr)} l="MRR" d={`${pagantes.length} assinaturas · anual contado ÷ 12`} />
      <KPI v={brl(r.mrr * 12)} l="ARR" />
      <KPI v={brl(recebido)} l={`Recebido em ${monthLabel(comp)}`} d={`previsto ${brl(previsto)} (mensais)`} k={previsto && recebido < previsto * 0.9 ? 'warn' : 'ok'} />
      <KPI v={rows.filter(x => x.atraso > 0).length} l="Pagamentos em atraso" d={rows.length ? pct(rows.filter(x => x.atraso > 0).length / rows.length) + ' da base' : ''} k={rows.filter(x => x.atraso > 0).length ? 'warn' : 'ok'} />
      <KPI v={pct(r.churn, 1)} l="Churn do mês" d={`${r.canceladasMes} cancelamento(s) · meta ≤ 3%`} k={r.churn > 0.03 ? 'bad' : 'ok'} />
      <KPI v={brl(r.contrib)} l="Contribuição / empresa" d={`imposto ${pct(f.imposto)} · taxa ${pct(f.taxa)} · inad. ${pct(f.inadimplencia)}`} />
    </div>
    <div className="grid g-2-1">
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '12px 16px 0' }}><h3>Cobranças · {monthLabel(comp)}</h3><p className="small muted">Marque como pago ao confirmar na plataforma de pagamentos. Régua de cobrança: D+3, D+7, D+15; painéis suspensos após 15 dias; cancelamento após 45.</p></div>
        {rows.length === 0 ? <Empty>Nenhuma assinatura.</Empty> : <table className="tbl">
          <thead><tr><th>Empresa</th><th>Status</th><th>Plano</th><th className="r">Valor</th><th>Vencimento</th><th>Pagamento</th><th></th></tr></thead>
          <tbody>{rows.map(({ e, pg, venc, atraso, valor }) => <tr key={e.id}>
            <td><a href={'#/empresa/' + e.id}><b>{e.nome}</b></a></td>
            <td><StatusTag s={e.status} /></td>
            <td className="small">{e.plano}</td>
            <td className="r">{e.plano === 'anual' ? (pg?.valor ? brl(pg.valor) : <span className="muted small">anual</span>) : brl(valor)}</td>
            <td className="small">{fmtDate(venc)}</td>
            <td>{pg?.status === 'pago' ? <Tag k="ok">pago {fmtDate(pg.dataPagamento)}</Tag> : atraso > 15 ? <Tag k="bad">{atraso} dias em atraso</Tag> : atraso > 0 ? <Tag k="warn">{atraso} dias em atraso</Tag> : <Tag k="gray">a vencer</Tag>}</td>
            <td className="r" style={{ whiteSpace: 'nowrap' }}>
              {pg?.status !== 'pago' && e.plano !== 'anual' && <button className="btn sm" onClick={() => actions.salvarPagamento({ empresaId: e.id, competencia: comp, valor, status: 'pago', dataPagamento: today() })}>Marcar pago</button>}
              {pg?.status !== 'pago' && e.plano === 'anual' && <button className="btn sm" onClick={() => { const v = prompt('Valor recebido (anual):', e.assinatura?.valorAnual || f.preco * 10); if (v) actions.salvarPagamento({ empresaId: e.id, competencia: comp, valor: Number(v), status: 'pago', dataPagamento: today() }) }}>Registrar</button>}
              {pg?.status === 'pago' && <button className="btn sm" onClick={() => actions.salvarPagamento({ empresaId: e.id, competencia: comp, valor: 0, status: 'pendente', dataPagamento: null })}>Desfazer</button>}
              {' '}{e.status !== 'cancelada' && <button className="btn sm danger" onClick={() => setCanc(e)}>Cancelamento</button>}
            </td>
          </tr>)}</tbody>
        </table>}
      </div>
      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <h3>Projeção de caixa · 90 dias</h3>
          <table className="tbl"><thead><tr><th>Mês</th><th className="r">MRR</th><th className="r">Resultado</th></tr></thead><tbody>{proj.map(p => <tr key={p.ym}><td>{monthLabel(p.ym)}</td><td className="r">{brl(p.mrr)}</td><td className="r" style={{ color: p.res < 0 ? '#B91C1C' : '#047857' }}>{brl(p.res)}</td></tr>)}</tbody></table>
          <p className="small muted">Hipótese: churn de 3%/mês sem novas entradas; custo fixo {brl(f.custoFixo)} + CAC {brl(f.cac)}. Ponto de equilíbrio: {r.breakEven} empresas. Ajuste em Configurações.</p>
        </div>
        <div className="card">
          <h3>Cancelamentos e retenções</h3>
          {cancelados.length === 0 ? <p className="small muted">Nenhum registro.</p> : <table className="tbl"><tbody>{cancelados.map(c => <tr key={c.id}><td><b>{st.empresas.find(e => e.id === c.empresaId)?.nome}</b><div className="small muted">{fmtDate(c.data)} · causa {c.causa}: {CAUSAS[c.causa]}</div><div className="small">{c.oferta}{c.observacao ? ' · ' + c.observacao : ''}</div></td><td className="r"><Tag k={c.resultado === 'retida' ? 'ok' : 'gray'}>{c.resultado}</Tag></td></tr>)}</tbody></table>}
        </div>
      </div>
    </div>
    {canc && <CancelamentoForm emp={canc} onClose={() => setCanc(null)} />}
  </>
}

function CancelamentoForm({ emp, onClose }) {
  const [v, set] = useForm({ causa: 'a', oferta: OFERTAS.a, resultado: 'retida', observacao: '', data: today() })
  const salvar = () => {
    actions.salvarCancelamento({ empresaId: emp.id, ...v })
    if (v.resultado === 'cancelada') actions.salvarEmpresa({ id: emp.id, status: 'cancelada', dataCancelamento: v.data })
    if (v.resultado === 'pausada') actions.salvarEmpresa({ id: emp.id, status: 'pausada' })
    onClose()
  }
  return <Modal title={`Fluxo de cancelamento e retenção · ${emp.nome}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancelar</button><button className="btn primary" onClick={salvar}>Registrar</button></>}>
    <div className="callout small">1. Pedido recebido: agradecer e agendar conversa de 20 min em até 2 dias úteis. 2. Ouvir e classificar a causa. 3. Uma oferta adequada à causa. 4. Se aceitar: acompanhar 30 dias. 5. Se não: 30 dias de aviso, relatório final, porta aberta por 6 meses.</div>
    <div className="form">
      <F label="Causa"><select value={v.causa} onChange={e => { set('causa')(e); set('oferta')(OFERTAS[e.target.value]) }}>{Object.entries(CAUSAS).map(([k, t]) => <option key={k} value={k}>{k}) {t}</option>)}</select></F>
      <F label="Data"><input type="date" value={v.data} onChange={set('data')} /></F>
      <F label="Oferta feita (uma só)" full><input value={v.oferta} onChange={set('oferta')} /></F>
      <F label="Resultado"><select value={v.resultado} onChange={set('resultado')}><option value="retida">Retida (aceitou a oferta)</option><option value="pausada">Pausa de 1 mês</option><option value="cancelada">Cancelada</option></select></F>
      <F label="Observação" full><textarea value={v.observacao} onChange={set('observacao')} /></F>
    </div>
  </Modal>
}
