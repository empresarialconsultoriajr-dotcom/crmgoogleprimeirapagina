// Utilidades de data (sem dependências). Datas em formato ISO 'YYYY-MM-DD'.
export const pad = (n) => String(n).padStart(2, '0')
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fromISO = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const today = () => toISO(new Date())
export const addDays = (iso, n) => { const d = fromISO(iso); d.setDate(d.getDate() + n); return toISO(d) }
export const isWeekend = (iso) => { const w = fromISO(iso).getDay(); return w === 0 || w === 6 }
export const monthKey = (iso) => iso.slice(0, 7)
export const monthLabel = (ym) => { const [y, m] = ym.split('-'); return ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][Number(m) - 1] + '/' + y.slice(2) }
export const fmtDate = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}` }
export const daysBetween = (a, b) => Math.round((fromISO(b) - fromISO(a)) / 86400000)
export function businessDaysBetween(a, b) { // dias úteis em [a, b] inclusive
  let n = 0; let d = a
  while (d <= b) { if (!isWeekend(d)) n++; d = addDays(d, 1) }
  return n
}
export function businessDaysBack(iso, n) { // n-ésimo dia útil antes de iso
  let d = iso; let k = 0
  while (k < n) { d = addDays(d, -1); if (!isWeekend(d)) k++ }
  return d
}
export const monthStart = (iso) => iso.slice(0, 8) + '01'
export function monthEnd(iso) { const d = fromISO(iso); return toISO(new Date(d.getFullYear(), d.getMonth() + 1, 0)) }
export function addMonths(ym, n) { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}` }
export function weekKey(iso) { // ISO week 'YYYY-Www'
  const d = fromISO(iso); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day)
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  const w = Math.ceil(((t - y0) / 86400000 + 1) / 7)
  return `${t.getUTCFullYear()}-W${pad(w)}`
}
export function weekRange(iso) { // segunda a domingo da semana de iso
  const d = fromISO(iso); const day = d.getDay() || 7
  const mon = addDays(iso, 1 - day); return [mon, addDays(mon, 6)]
}
export const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4)
export const brl = (v) => (v < 0 ? '–' : '') + 'R$ ' + Math.abs(Math.round(v)).toLocaleString('pt-BR')
export const pct = (v, d = 0) => (v * 100).toFixed(d).replace('.', ',') + '%'
export const num = (v, d = 0) => Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })
