import React, { useEffect, useState } from 'react'
import { NIVEL_LABEL } from '../engine.js'

export function useHash() {
  const read = () => { const h = (location.hash || '#/').replace(/^#\/?/, ''); return h.split('/').filter(Boolean) }
  const [parts, setParts] = useState(read)
  useEffect(() => { const f = () => setParts(read()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  return { parts, go: (p) => { location.hash = p } }
}
export const go = (p) => { location.hash = p }

export const Tag = ({ k = 'gray', children, title }) => <span className={'tag ' + k} title={title}>{children}</span>
export const Nivel = ({ n }) => <Tag k={n}>{n} · {NIVEL_LABEL[n]}</Tag>
export const Natureza = ({ comprovado }) => comprovado ? <Tag k="comp" title="Coletado do perfil ou do sistema">Comprovado</Tag> : <Tag k="info" title="Declarado pelo colaborador">Informado</Tag>

export function KPI({ v, l, d, k = '' }) { return <div className={'kpi ' + k}><div className="v">{v}</div><div className="l">{l}</div>{d && <div className="d">{d}</div>}</div> }

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => { const f = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', f); return () => removeEventListener('keydown', f) }, [onClose])
  return <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal" style={wide ? { width: 'min(1100px,100%)' } : undefined}>
      <header><h2 style={{ margin: 0 }}>{title}</h2><button className="btn sm" onClick={onClose}>Fechar</button></header>
      {children}
      {footer && <div className="actions" style={{ justifyContent: 'flex-end', marginTop: 16 }}>{footer}</div>}
    </div>
  </div>
}

export const F = ({ label, hint, children, full }) => <label className={'f' + (full ? ' full' : '')}><span>{label}</span>{children}{hint && <span className="hint">{hint}</span>}</label>

export function Top({ eyebrow, title, sub, children }) {
  return <div className="topbar"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{sub && <p className="muted" style={{ margin: 0 }}>{sub}</p>}</div>{children && <div className="actions">{children}</div>}</div>
}

export const Empty = ({ children }) => <div className="empty">{children}</div>

export function Bar({ v, max = 100 }) { return <div className="bar"><i style={{ width: Math.max(0, Math.min(100, v / max * 100)) + '%' }} /></div> }

export function useForm(init) {
  const [v, setV] = useState(init)
  const set = (k) => (e) => { const t = e && e.target ? e.target : null; const val = t ? (t.type === 'checkbox' ? t.checked : t.value) : e; setV(s => setPath(s, k, val)) }
  return [v, set, setV]
}
function setPath(obj, path, val) { const keys = path.split('.'); const o = { ...obj }; let cur = o; for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = { ...(cur[keys[i]] || {}) }; cur = cur[keys[i]] } cur[keys[keys.length - 1]] = val; return o }
export const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)

export function copiar(texto) { return navigator.clipboard?.writeText(texto).then(() => true).catch(() => false) || Promise.resolve(false) }
export const Sev = ({ g }) => <span className={'dot s' + g} title={['', 'Atenção', 'Importante', 'Grave'][g]} />
