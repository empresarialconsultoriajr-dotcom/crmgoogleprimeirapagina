// Indicadores calculados apenas a partir de registros reais.
import * as store from './store.js';
import { DAYS } from './data/days.js';
import { JOURNAL_FIELDS } from './data/content.js';

export function dayStats(date) {
  const d = store.day(date);
  const m = d.morning || {};
  const steps = m.steps || {};
  const j = d.journal || {};
  const journalFilled = JOURNAL_FIELDS.filter((f) => { const v = j[f.key]; return v !== undefined && v !== null && v !== ''; }).length;
  const ev = d.evening || {};
  return {
    started: !!m.startedAt,
    morningDone: !!m.completedAt,
    readingDone: !!(steps.reading && steps.reading.done),
    prayerDone: !!(steps.prayer && steps.prayer.done),
    morningJournalDone: !!(steps.journal && steps.journal.done),
    commitmentSet: !!(m.commitment && m.commitment.text),
    commitmentFulfilled: m.commitment ? m.commitment.fulfilled : null,
    journalFilled,
    journalTotal: JOURNAL_FIELDS.length,
    eveningDone: !!ev.completedAt,
    exerciseDone: !!(d.exercise && d.exercise.done),
    intensity: typeof j.intensity === 'number' ? j.intensity : null,
    emotion: j.emotion || '',
    reflections: [steps.reading && steps.reading.done, steps.journal && steps.journal.done, journalFilled > 0, d.exercise && d.exercise.done].filter(Boolean).length,
  };
}

export function overall() {
  const per = DAYS.map((d) => ({ ...d, stats: dayStats(d.date) }));
  const sum = (k) => per.filter((p) => p.stats[k]).length;
  const helpEpisodes = store.get('help.episodes', []);
  const fastEpisodes = store.get('fast.episodes', []);
  const urges = fastEpisodes.filter((e) => e.type === 'urge');
  const resisted = urges.filter((e) => e.outcome === 'resisti').length;
  const breaks = fastEpisodes.filter((e) => e.type === 'break').length;
  const reflections = per.reduce((a, p) => a + p.stats.reflections, 0) + store.get('relationship.reflections', []).length;
  const completedUnits = per.reduce((a, p) => a + (p.stats.started ? 1 : 0) + (p.stats.morningDone ? 1 : 0) + (p.stats.eveningDone ? 1 : 0), 0);
  return {
    per,
    started: sum('started'),
    completed: sum('eveningDone'),
    readings: sum('readingDone'),
    prayers: sum('prayerDone'),
    evenings: sum('eveningDone'),
    commitmentsKept: per.filter((p) => p.stats.commitmentFulfilled === true).length,
    commitmentsSet: sum('commitmentSet'),
    helpEpisodes: helpEpisodes.length,
    urges: urges.length,
    resisted,
    breaks,
    reflections,
    percent: Math.round((completedUnits / (DAYS.length * 3)) * 100),
  };
}
