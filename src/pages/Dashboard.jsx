import React, { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LabelList } from 'recharts'
import { useStore } from '../store.js'
import { indicadoresRede, ALERTA_TIPOS } from '../engine.js'
import { KPI, Top, Nivel, Tag, Sev, go } from '../ui/common.jsx'
import { brl, pct, fmtDate, today, num } from '../dates.js'

export default function Dashboard() {
  const st = useStore()
  const r = useMemo(() => indicadoresRede(st), [st])
  const hoje = today()
  const abertos = st.alertas.filter(a => a.status !== 'resolvido').sort((a, b) => b.gravidade - a.gravidade || a.criadoEm.localeCompare(b.criadoEm))
  const nome = (id) => st.empresas.find(e => e.id === id)?.nome || '—'
  const acao = [...r.avals].sort((a, b) => a.idxCorrente.total - b.idxCorrente.total)
  return <>
    <Top eyebrow="Painel administrativo" title="Visão geral da rede" sub={`Atualizado em ${fmtDate(hoje)} · ${r.ativas} empresas ativas, ${r.onboarding} em onboarding, ${r.total} cadastradas`}>
      <a className="btn" href="#/registro">Registrar dia</a>
      <a className="btn primary" href="#/auditoria">Auditoria da semana</a>
    </Top>
    <div className="grid g6" style={{ marginBottom: 14 }}>
      <KPI v={r.ativas} l="Empresas ativas" d={`${r.onboarding} em onboarding`} />
      <KPI v={brl(r.mrr)} l="MRR" d={`${r.atrasados} com pagamento atrasado`} k={r.atrasados ? 'warn' : ''} />
      <KPI v={r.indiceMedio} l="Índice médio da rede" d="últimos 20 dias úteis" k={r.indiceMedio >= 80 ? 'ok' : r.indiceMedio >= 60 ? '' : 'warn'} />
      <KPI v={`${r.niveis.A} · ${r.niveis.B} · ${r.niveis.C}`} l="Níveis A · B · C" d={`${r.ativas ? Math.round(r.niveis.C / r.ativas * 100) : 0}% em atenção (meta ≤ 15%)`} k={r.ativas && r.niveis.C / r.ativas > 0.15 ? 'warn' : ''} />
      <KPI v={num(r.novasMes)} l="Avaliações no mês" d={`${num(r.solicMes)} solicitações registradas`} />
      <KPI v={r.alertasAbertos} l="Alertas abertos" d={`${r.alertasGraves} grave(s)`} k={r.alertasGraves ? 'bad' : r.alertasAbertos ? 'warn' : 'ok'} />
    </div>
    <div className="grid g-2-1" style={{ marginBottom: 14 }}>
      <div className="card">
        <h3>Avaliações novas por dia · últimos 30 dias</h3>
        <div style={{ height: 200 }}>
          <ResponsiveContainer><AreaChart data={r.serie.map(x => ({ ...x, d: x.data.slice(8, 10) + '/' + x.data.slice(5, 7) }))} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} /><XAxis dataKey="d" tick={{ fontSize: 11, fill: '#6B7280' }} interval={4} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} /><YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip formatter={(v) => [v, 'Avaliações']} labelFormatter={(l) => 'Dia ' + l} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
            <Area isAnimationActive={false} type="monotone" dataKey="novas" stroke="#1D4ED8" strokeWidth={2} fill="#DBEAFE" />
          </AreaChart></ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h3>Índice médio por grupo</h3>
        <div style={{ height: 200 }}>
          <ResponsiveContainer><BarChart data={r.porGrupo} margin={{ top: 16, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} /><XAxis dataKey="grupo" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v) => [v, 'Índice']} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
            <Bar isAnimationActive={false} dataKey="indice" fill="#1D4ED8" radius={[4, 4, 0, 0]} maxBarSize={48}><LabelList dataKey="indice" position="top" style={{ fontSize: 11, fill: '#111827', fontWeight: 600 }} /></Bar>
          </BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
    <div className="grid g-1-2">
      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}><h3 style={{ margin: 0 }}>Alertas abertos</h3><span className="spacer" /><a className="small" href="#/alertas">ver todos</a></div>
        {abertos.length === 0 ? <div className="empty">Nenhum alerta aberto.</div> :
          <table className="tbl"><tbody>{abertos.slice(0, 8).map(a => <tr key={a.id} className="click" onClick={() => go('/alertas')}>
            <td><Sev g={a.gravidade} /><b>{nome(a.empresaId)}</b><div className="small muted">{a.titulo}</div></td>
            <td className="r small muted">{ALERTA_TIPOS[a.tipo] || a.tipo}<br />prazo {fmtDate(a.prazo)}</td>
          </tr>)}</tbody></table>}
      </div>
      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}><h3 style={{ margin: 0 }}>Lista de ação · empresas por índice corrente</h3><span className="spacer" /><span className="small muted">menor índice primeiro</span></div>
        <table className="tbl">
          <thead><tr><th>Empresa</th><th>Grupo</th><th className="r">Índice</th><th>Nível</th><th className="r">Aval. mês / meta</th><th className="r">Nota</th><th className="r">Sem registro</th><th className="r">Alertas</th></tr></thead>
          <tbody>{acao.slice(0, 12).map(a => <tr key={a.emp.id} className="click" onClick={() => go('/empresa/' + a.emp.id)}>
            <td><b>{a.emp.nome}</b><div className="small muted">{a.emp.colaborador?.nome}</div></td>
            <td className="small">{st.grupos.find(g => g.id === a.emp.grupoId)?.nome || '—'}</td>
            <td className="r"><b>{a.idxCorrente.total}</b></td>
            <td><Nivel n={a.idxCorrente.nivel} /></td>
            <td className="r">{a.mes.novas} / {a.meta}</td>
            <td className="r">{a.notaAtual != null ? a.notaAtual.toFixed(1) : '—'}</td>
            <td className="r">{a.diasSemRegistro ? <Tag k={a.diasSemRegistro >= 5 ? 'bad' : 'warn'}>{a.diasSemRegistro} d</Tag> : <Tag k="ok">em dia</Tag>}</td>
            <td className="r">{abertos.filter(x => x.empresaId === a.emp.id).length || ''}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
    <div className="grid g4" style={{ marginTop: 14 }}>
      <KPI v={pct(r.churn, 1)} l="Churn do mês" d={`${r.canceladasMes} cancelamento(s)`} k={r.churn > 0.03 ? 'warn' : 'ok'} />
      <KPI v={brl(r.contrib)} l="Contribuição por empresa" d="após impostos, taxas e inadimplência" />
      <KPI v={r.breakEven} l="Empresas para o equilíbrio" d={`custo fixo ${brl(st.settings.financeiro.custoFixo)} + CAC ${brl(st.settings.financeiro.cac)}`} />
      <KPI v={brl(r.resultado)} l="Resultado operacional estimado" d="mês corrente, com parâmetros atuais" k={r.resultado < 0 ? 'warn' : 'ok'} />
    </div>
  </>
}
