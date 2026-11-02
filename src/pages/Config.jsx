import React, { useRef, useState } from 'react'
import { useStore, actions, exportarJSON } from '../store.js'
import { Top, F, useForm } from '../ui/common.jsx'
import { brl } from '../dates.js'

export default function Config() {
  const st = useStore()
  const [v, set, setV] = useForm(JSON.parse(JSON.stringify(st.settings)))
  const [msg, setMsg] = useState('')
  const file = useRef()
  const n = (x) => Number(String(x).replace(',', '.'))
  const salvar = () => {
    const s = JSON.parse(JSON.stringify(v))
    for (const k in s.pesos) s.pesos[k] = n(s.pesos[k])
    const soma = Object.values(s.pesos).reduce((a, b) => a + b, 0)
    if (soma !== 100) return setMsg(`Os pesos do índice somam ${soma}; precisam somar 100.`)
    s.niveis.A = n(s.niveis.A); s.niveis.B = n(s.niveis.B); s.conversaoRef = n(s.conversaoRef) / (n(s.conversaoRef) > 1 ? 100 : 1); s.elegiveis = n(s.elegiveis) / (n(s.elegiveis) > 1 ? 100 : 1); s.diasUteisMes = n(s.diasUteisMes)
    for (const k in s.alertas) s.alertas[k] = n(s.alertas[k])
    for (const k in s.financeiro) s.financeiro[k] = n(s.financeiro[k]); for (const k of ['imposto', 'taxa', 'inadimplencia']) if (s.financeiro[k] > 1) s.financeiro[k] /= 100
    s.coerencia.convMin = n(s.coerencia.convMin) / (n(s.coerencia.convMin) > 1 ? 100 : 1); s.coerencia.convMax = n(s.coerencia.convMax) / (n(s.coerencia.convMax) > 1 ? 100 : 1)
    actions.salvarSettings(s); actions.recalcularAlertas(); setV(s); setMsg('Configurações salvas e alertas recalculados.')
  }
  const importar = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const j = JSON.parse(r.result); if (!j.empresas) throw new Error('arquivo inválido'); if (confirm(`Importar ${j.empresas.length} empresas e ${j.registros?.length || 0} registros? Os dados atuais serão substituídos.`)) { actions.importar(j); setMsg('Backup importado.') } } catch (err) { setMsg('Falha ao importar: ' + err.message) } }; r.readAsText(f); e.target.value = '' }
  const contrib = v.financeiro.preco * (1 - v.financeiro.imposto - v.financeiro.taxa - v.financeiro.inadimplencia)
  return <>
    <Top eyebrow="Gestão" title="Configurações" sub="Parâmetros do índice, dos alertas e do modelo financeiro; backup e dados de demonstração.">
      <button className="btn primary" onClick={salvar}>Salvar parâmetros</button>
    </Top>
    {msg && <div className="callout">{msg}</div>}
    <div className="grid g2">
      <div className="card">
        <h3>Índice de Execução (pesos, somam 100)</h3>
        <div className="form">
          <F label="Participação operacional" hint="dias com registro no dia ÷ dias úteis"><input value={v.pesos.participacao} onChange={set('pesos.participacao')} /></F>
          <F label="Solicitações vs. meta" hint="informado pelo colaborador"><input value={v.pesos.solicitacoes} onChange={set('pesos.solicitacoes')} /></F>
          <F label="Avaliações vs. meta individual" hint="comprovado pelo perfil"><input value={v.pesos.avaliacoes} onChange={set('pesos.avaliacoes')} /></F>
          <F label="Resposta às avaliações"><input value={v.pesos.resposta} onChange={set('pesos.resposta')} /></F>
          <F label="Qualidade e conformidade" hint="–5 por pendência de treinamento ou inconsistência; –15 por violação"><input value={v.pesos.qualidade} onChange={set('pesos.qualidade')} /></F>
          <F label="Nível A a partir de"><input value={v.niveis.A} onChange={set('niveis.A')} /></F>
          <F label="Nível B a partir de"><input value={v.niveis.B} onChange={set('niveis.B')} /></F>
        </div>
        <h3 style={{ marginTop: 14 }}>Meta individual</h3>
        <div className="form c3">
          <F label="Conversão de referência" hint="ex.: 0,35 (cenário intermediário)"><input value={v.conversaoRef} onChange={set('conversaoRef')} /></F>
          <F label="Clientes elegíveis" hint="ex.: 0,8"><input value={v.elegiveis} onChange={set('elegiveis')} /></F>
          <F label="Dias úteis por mês"><input value={v.diasUteisMes} onChange={set('diasUteisMes')} /></F>
        </div>
        <p className="small muted">Meta mensal = clientes/dia × dias úteis × elegíveis × conversão. Alterar a conversão de referência recalcula as metas que usam a fórmula (metas fixadas manualmente não mudam).</p>
        <h3 style={{ marginTop: 14 }}>Teste de coerência</h3>
        <div className="form"><F label="Conversão mínima aceitável"><input value={v.coerencia.convMin} onChange={set('coerencia.convMin')} /></F><F label="Conversão máxima aceitável"><input value={v.coerencia.convMax} onChange={set('coerencia.convMax')} /></F></div>
      </div>
      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <h3>Alertas automáticos</h3>
          <div className="form c3">
            <F label="Sem registro · amarelo (dias úteis)"><input value={v.alertas.semRegistroAmarelo} onChange={set('alertas.semRegistroAmarelo')} /></F>
            <F label="Sem registro · vermelho (dias úteis)"><input value={v.alertas.semRegistroVermelho} onChange={set('alertas.semRegistroVermelho')} /></F>
            <F label="Queda de avaliações (%)"><input value={v.alertas.quedaAvaliacoesPct} onChange={set('alertas.quedaAvaliacoesPct')} /></F>
            <F label="Queda de nota (pontos)"><input value={v.alertas.quedaNota} onChange={set('alertas.quedaNota')} /></F>
            <F label="Índice baixo (abaixo de)"><input value={v.alertas.indiceBaixo} onChange={set('alertas.indiceBaixo')} /></F>
            <F label="Atraso de pagamento (dias)"><input value={v.alertas.atrasoPagamentoDias} onChange={set('alertas.atrasoPagamentoDias')} /></F>
            <F label="Pico (× a média)"><input value={v.alertas.picoFator} onChange={set('alertas.picoFator')} /></F>
            <F label="Onboarding (dias úteis)"><input value={v.alertas.onboardingDiasUteis} onChange={set('alertas.onboardingDiasUteis')} /></F>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 14 }}>
          <h3>Modelo financeiro</h3>
          <div className="form c3">
            <F label="Mensalidade (R$)"><input value={v.financeiro.preco} onChange={set('financeiro.preco')} /></F>
            <F label="Impostos (fração do faturado)"><input value={v.financeiro.imposto} onChange={set('financeiro.imposto')} /></F>
            <F label="Taxas de pagamento"><input value={v.financeiro.taxa} onChange={set('financeiro.taxa')} /></F>
            <F label="Inadimplência"><input value={v.financeiro.inadimplencia} onChange={set('financeiro.inadimplencia')} /></F>
            <F label="Custo fixo mensal (R$)"><input value={v.financeiro.custoFixo} onChange={set('financeiro.custoFixo')} /></F>
            <F label="Aquisição mensal (R$)"><input value={v.financeiro.cac} onChange={set('financeiro.cac')} /></F>
          </div>
          <p className="small muted">Contribuição por empresa com estes parâmetros: <b>{brl(contrib)}</b> · ponto de equilíbrio: <b>{Math.ceil((n(v.financeiro.custoFixo) + n(v.financeiro.cac)) / contrib)} empresas</b>.</p>
        </div>
        <div className="card">
          <h3>Dados e backup</h3>
          <p className="small muted">Os dados ficam salvos neste navegador (armazenamento local). Exporte um backup semanalmente e guarde em nuvem. Para operação multiusuário (vários colaboradores registrando de seus próprios celulares), conecte um backend conforme o README do projeto.</p>
          <div className="actions">
            <button className="btn" onClick={exportarJSON}>Exportar backup (JSON)</button>
            <button className="btn" onClick={() => file.current.click()}>Importar backup</button><input ref={file} type="file" accept="application/json" style={{ display: 'none' }} onChange={importar} />
            <button className="btn" onClick={() => { if (confirm('Substituir os dados atuais pelos dados de demonstração?')) { actions.carregarDemo(); setMsg('Dados de demonstração carregados.') } }}>Carregar demonstração</button>
            <button className="btn danger" onClick={() => { if (confirm('Apagar TODOS os dados (empresas, registros, alertas, pagamentos)? Exporte um backup antes.')) { actions.limpar(); setMsg('Dados apagados. Comece cadastrando grupos e empresas.') } }}>Limpar tudo</button>
          </div>
          <p className="small muted" style={{ marginTop: 10 }}>{st.empresas.length} empresas · {st.registros.length} registros · {st.alertas.length} alertas · {st.auditorias.length} auditorias · {st.pagamentos.length} pagamentos{st.demo ? ' · dados de demonstração' : ''}</p>
        </div>
      </div>
    </div>
  </>
}
