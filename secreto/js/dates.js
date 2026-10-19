// Utilitários de data fixados no fuso de São Paulo.
export const TZ = 'America/Sao_Paulo';

const isoFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const timeFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
const longFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const shortFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit' });
const dtFmt = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export function todayISO(d = new Date()) { return isoFmt.format(d); }
export function nowTime(d = new Date()) { return timeFmt.format(d); }
export function nowISO() { return new Date().toISOString(); }

function toUTC(iso) { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d); }
export function diffDays(fromISO, toISO) { return Math.round((toUTC(toISO) - toUTC(fromISO)) / 86400000); }
export function addDays(iso, n) { const d = new Date(toUTC(iso) + n * 86400000); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`; }
export function formatLong(iso) { const s = longFmt.format(new Date(toUTC(iso))); return s.charAt(0).toUpperCase() + s.slice(1); }
export function formatShort(iso) { return shortFmt.format(new Date(toUTC(iso))); }
export function formatDateTime(isoString) { return dtFmt.format(new Date(isoString)).replace(',', ' ·'); }
export function isValidISO(iso) { return /^\d{4}-\d{2}-\d{2}$/.test(iso || '') && !Number.isNaN(toUTC(iso)); }
