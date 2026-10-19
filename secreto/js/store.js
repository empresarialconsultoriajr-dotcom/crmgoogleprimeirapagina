// Persistência local com salvamento automático.
// Os dados ficam apenas neste navegador (localStorage). Veja README para limitações e backup.
import { nowISO } from './dates.js';

const KEY = 'secreto10.v1';
const listeners = new Set();
let state = null;
let saveTimer = null;
let status = { kind: 'idle', at: null, message: '' };

export function defaultState() {
  return {
    version: 1,
    createdAt: nowISO(),
    settings: { startDate: '2026-10-19', wakeTime: '03:00', workoutTime: '05:00' },
    days: {},
    fast: { episodes: [] },
    help: { episodes: [] },
    relationship: { reflections: [], messages: [], futureTalk: {} },
    closing: { report: {}, plan: { habits: [], reviews: {}, notes: {} } },
    log: [],
  };
}

export function storageAvailable() {
  try {
    const k = '__secreto_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch (e) { return false; }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { state = defaultState(); return { ok: true, fresh: true }; }
    const parsed = JSON.parse(raw);
    state = migrate(parsed);
    return { ok: true, fresh: false };
  } catch (e) {
    state = defaultState();
    return { ok: false, error: e };
  }
}

function migrate(s) {
  const d = defaultState();
  return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) }, fast: { ...d.fast, ...(s.fast || {}) }, help: { ...d.help, ...(s.help || {}) }, relationship: { ...d.relationship, ...(s.relationship || {}) }, closing: { ...d.closing, ...(s.closing || {}), plan: { ...d.closing.plan, ...((s.closing || {}).plan || {}) } } };
}

export function getState() { return state; }

function setStatus(kind, message = '') {
  status = { kind, at: nowISO(), message };
  listeners.forEach((fn) => { try { fn(status); } catch (e) { /* ignore */ } });
}
export function getStatus() { return status; }
export function onStatus(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export function saveNow() {
  clearTimeout(saveTimer);
  saveTimer = null;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    setStatus('saved');
    return true;
  } catch (e) {
    setStatus('error', 'Não foi possível salvar. O armazenamento do navegador pode estar cheio ou bloqueado.');
    return false;
  }
}

function scheduleSave() {
  setStatus('saving');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 400);
}

function toPath(path) { return Array.isArray(path) ? path : String(path).split('.'); }

export function get(path, fallback) {
  let cur = state;
  for (const k of toPath(path)) {
    if (cur == null || typeof cur !== 'object' || !(k in cur)) return fallback;
    cur = cur[k];
  }
  return cur === undefined ? fallback : cur;
}

export function set(path, value, { immediate = false } = {}) {
  const keys = toPath(path);
  let cur = state;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = /^\d+$/.test(String(keys[i + 1])) ? [] : {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  if (immediate) saveNow(); else scheduleSave();
  return value;
}

export function update(path, fn, opts) { return set(path, fn(get(path)), opts); }

export function push(path, item, opts) {
  const arr = get(path, []);
  const next = Array.isArray(arr) ? arr.slice() : [];
  next.push(item);
  return set(path, next, opts);
}

export function logActivity(label, meta = {}) {
  const entry = { at: nowISO(), label, ...meta };
  push('log', entry, { immediate: true });
  return entry;
}

export function lastActivity() {
  const log = get('log', []);
  return log.length ? log[log.length - 1] : null;
}

export function day(date) { return get(['days', date], {}); }
export function setDay(date, path, value, opts) { return set(['days', date, ...toPath(path)], value, opts); }
export function getDay(date, path, fallback) { return get(['days', date, ...toPath(path)], fallback); }

export function exportJSON() { return JSON.stringify(state, null, 2); }

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || parsed.version !== 1 || typeof parsed.days !== 'object') {
    throw new Error('Arquivo inválido: não parece um backup deste sistema.');
  }
  state = migrate(parsed);
  return saveNow();
}

export function resetAll() {
  state = defaultState();
  return saveNow();
}

export function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
