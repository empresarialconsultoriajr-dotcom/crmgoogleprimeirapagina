import React from 'react'
import './src/styles.css'
import { useStore, actions } from './src/store.js'
import { useHash } from './src/ui/common.jsx'
import Dashboard from './src/pages/Dashboard.jsx'
import Empresas from './src/pages/Empresas.jsx'
import Empresa from './src/pages/Empresa.jsx'
import Registro from './src/pages/Registro.jsx'
import Auditoria from './src/pages/Auditoria.jsx'
import Alertas from './src/pages/Alertas.jsx'
import Financeiro from './src/pages/Financeiro.jsx'
import Grupos from './src/pages/Grupos.jsx'
import Relatorios from './src/pages/Relatorios.jsx'
import Config from './src/pages/Config.jsx'

const NAV = [
  { sec: 'Operação' },
  { to: '/', label: 'Visão geral' },
  { to: '/empresas', label: 'Empresas' },
  { to: '/registro', label: 'Registro diário' },
  { to: '/alertas', label: 'Alertas', badge: 'alertas' },
  { sec: 'Auditoria' },
  { to: '/auditoria', label: 'Auditoria semanal' },
  { to: '/relatorios', label: 'Relatórios' },
  { sec: 'Gestão' },
  { to: '/grupos', label: 'Grupos e reuniões' },
  { to: '/financeiro', label: 'Financeiro' },
  { to: '/config', label: 'Configurações' },
]

export default function App() {
  const st = useStore()
  const { parts } = useHash()
  React.useEffect(() => { actions.recalcularAlertas() }, [])
  const [root, arg] = parts
  // rota pública do colaborador: #/registro/CODIGO
  if (root === 'registro' && arg) return <Registro codigo={arg} publico />
  const abertos = st.alertas.filter(a => a.status !== 'resolvido')
  const graves = abertos.filter(a => a.gravidade >= 3).length
  let page
  switch (root) {
    case undefined: case '': page = <Dashboard />; break
    case 'empresas': page = <Empresas />; break
    case 'empresa': page = <Empresa id={arg} />; break
    case 'registro': page = <Registro />; break
    case 'auditoria': page = <Auditoria />; break
    case 'alertas': page = <Alertas />; break
    case 'financeiro': page = <Financeiro />; break
    case 'grupos': page = <Grupos />; break
    case 'relatorios': page = <Relatorios id={arg} />; break
    case 'config': page = <Config />; break
    default: page = <div className="empty">Página não encontrada.</div>
  }
  return (
    <div className="layout">
      <aside className="side">
        <div className="brand"><small>Google Primeira Página</small>Clube Google Primeira Página<div className="small" style={{ color: '#94A3B8', fontWeight: 400, marginTop: 2 }}>Controle e auditoria</div></div>
        <nav>
          {NAV.map((n, i) => n.sec ? <div key={i} className="sec">{n.sec}</div> :
            <a key={n.to} href={'#' + n.to} className={('/' + (root || '')) === n.to || (n.to === '/empresas' && root === 'empresa') ? 'on' : ''}>
              {n.label}{n.badge === 'alertas' && abertos.length > 0 && <span className={'pill' + (graves ? ' bad' : '')}>{abertos.length}</span>}
            </a>)}
        </nav>
        {st.demo && <div className="callout warn small" style={{ marginTop: 18, color: '#92400E' }}>Dados de demonstração carregados. Em Configurações você pode limpar e começar do zero.</div>}
      </aside>
      <main className="main">{page}</main>
    </div>
  )
}
