import { home } from './home.js';
import { journey, dayView } from './journey.js';
import { morning } from './morning.js';
import { evening } from './evening.js';
import { help, helpHistory } from './help.js';
import { fast } from './fast.js';
import { relationship } from './relationship.js';
import { work } from './work.js';
import { journal } from './journal.js';
import { progressView } from './progress.js';
import { closing } from './closing.js';
import { more, settings } from './more.js';

export const routes = {
  home,
  jornada: journey,
  dia: dayView,
  manha: morning,
  noite: evening,
  ajuda: (ctx, params) => (params[0] === 'historico' ? helpHistory(ctx) : help(ctx)),
  jejum: fast,
  dani: relationship,
  trabalho: work,
  diario: journal,
  progresso: progressView,
  encerramento: closing,
  mais: more,
  ajustes: settings,
};
