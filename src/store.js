// Persistência local (localStorage) + ações. Camada única para facilitar troca futura por backend (Supabase/Airtable).
import { useEffect, useState, useCallback } from 'react'
import { DEFAULT_SETTINGS, sincronizarAlertas } from './engine.js'
import { gerarDemo } from './demo.js'
import { uid, today } from './dates.js'

const KEY = 'clube-gpp-v1'
const EMPTY = { version: 1, settings: DEFAULT_SETTINGS, grupos: [], empresas: [], registros: [], auditorias: [], alertas: [], pagamentos: [], reunioes: [], cancelamentos: [], treinamentos: [], pendencias: [], demo: false }

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const st = JSON.parse(raw); return { ...EMPTY, ...st, settings: deepMerge(DEFAULT_SETTINGS, st.settings || {}) } } } catch (e) { console.warn('Falha ao ler armazenamento local', e) }
  return null
}
function deepMerge(a, b) { const o = { ...a }; for (const k in b) o[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) ? deepMerge(a[k] || {}, b[k]) : b[k]; return o }
function save(st) { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { console.warn('Falha ao salvar', e) } }

let listeners = new Set()
let state = load() || (() => { const d = { ...EMPTY, ...gerarDemo(), demo: true }; d.alertas = sincronizarAlertas(d); save(d); return d })()

function setState(fn) { state = typeof fn === 'function' ? fn(state) : fn; save(state); listeners.forEach(l => l(state)) }
export function getState() { return state }
export function useStore() {
  const [st, setSt] = useState(state)
  useEffect(() => { listeners.add(setSt); return () => listeners.delete(setSt) }, [])
  return st
}

const upsert = (arr, item) => { const i = arr.findIndex(x => x.id === item.id); if (i >= 0) { const c = [...arr]; c[i] = { ...arr[i], ...item }; return c } return [...arr, item] }

export const actions = {
  salvarEmpresa(emp) { setState(s => ({ ...s, empresas: upsert(s.empresas, { id: emp.id || uid(), ...emp }) })) },
  removerEmpresa(id) { setState(s => ({ ...s, empresas: s.empresas.filter(e => e.id !== id), registros: s.registros.filter(r => r.empresaId !== id), alertas: s.alertas.filter(a => a.empresaId !== id), pagamentos: s.pagamentos.filter(p => p.empresaId !== id), pendencias: s.pendencias.filter(p => p.empresaId !== id), auditorias: s.auditorias.filter(a => a.empresaId !== id) })) },
  salvarGrupo(g) { setState(s => ({ ...s, grupos: upsert(s.grupos, { id: g.id || uid(), ...g }) })) },
  removerGrupo(id) { setState(s => ({ ...s, grupos: s.grupos.filter(g => g.id !== id), empresas: s.empresas.map(e => e.grupoId === id ? { ...e, grupoId: null } : e) })) },
  salvarRegistro(r) {
    setState(s => {
      // um registro por empresa por dia: substitui se já existir
      const existente = s.registros.find(x => x.empresaId === r.empresaId && x.data === r.data)
      const item = { id: existente?.id || uid(), criadoEm: existente?.criadoEm || new Date().toISOString(), ...r }
      item.retroativo = item.criadoEm.slice(0, 10) !== item.data
      const st = { ...s, registros: upsert(s.registros, item) }
      return { ...st, alertas: sincronizarAlertas(st) }
    })
  },
  removerRegistro(id) { setState(s => ({ ...s, registros: s.registros.filter(r => r.id !== id) })) },
  salvarAuditoria(a) { setState(s => ({ ...s, auditorias: upsert(s.auditorias, { id: a.id || uid(), ...a }) })) },
  salvarAlerta(a) { setState(s => ({ ...s, alertas: upsert(s.alertas, { id: a.id || uid(), origem: a.origem || 'manual', criadoEm: a.criadoEm || today(), status: a.status || 'aberto', ...a }) })) },
  recalcularAlertas() { setState(s => ({ ...s, alertas: sincronizarAlertas(s) })) },
  salvarPagamento(p) { setState(s => { const ex = s.pagamentos.find(x => x.empresaId === p.empresaId && x.competencia === p.competencia); const st = { ...s, pagamentos: upsert(s.pagamentos, { id: ex?.id || uid(), ...p }) }; return { ...st, alertas: sincronizarAlertas(st) } }) },
  salvarReuniao(r) { setState(s => ({ ...s, reunioes: upsert(s.reunioes, { id: r.id || uid(), ...r }) })) },
  removerReuniao(id) { setState(s => ({ ...s, reunioes: s.reunioes.filter(r => r.id !== id) })) },
  salvarCancelamento(c) { setState(s => ({ ...s, cancelamentos: upsert(s.cancelamentos, { id: c.id || uid(), ...c }) })) },
  salvarPendencia(p) { setState(s => ({ ...s, pendencias: upsert(s.pendencias, { id: p.id || uid(), status: p.status || 'aberta', criadoEm: p.criadoEm || today(), ...p }) })) },
  salvarTreinamento(t) { setState(s => ({ ...s, treinamentos: upsert(s.treinamentos, { id: t.id || uid(), ...t }) })) },
  salvarSettings(settings) { setState(s => ({ ...s, settings: deepMerge(s.settings, settings) })) },
  importar(json) { const st = { ...EMPTY, ...json, settings: deepMerge(DEFAULT_SETTINGS, json.settings || {}), demo: false }; setState(st) },
  carregarDemo() { const d = { ...EMPTY, ...gerarDemo(), demo: true }; d.alertas = sincronizarAlertas(d); setState(d) },
  limpar() { setState({ ...EMPTY, settings: state.settings, demo: false }) },
}

export function exportarJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `clube-gpp-backup-${today()}.json`; a.click(); URL.revokeObjectURL(a.href)
}
export function useAction() { return useCallback((name, ...args) => actions[name](...args), []) }
