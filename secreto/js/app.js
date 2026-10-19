// Ponto de entrada: carrega o estado, monta a casca e roteia as telas.
import * as store from './store.js';
import { h, icon, toast } from './ui.js';
import { todayISO, diffDays, nowTime } from './dates.js';
import { DAYS, START_DATE } from './data/days.js';
import { APP_NAME, APP_SUB } from './data/content.js';
import { routes } from './views/index.js';

const app = document.getElementById('app');
app.innerHTML = '';
app.append(h('div', { class: 'loading', text: 'Carregando' }));

const ctx = {
  store,
  today: () => todayISO(),
  startDate: () => store.get('settings.startDate', START_DATE),
  // Índice do dia (1..10) para uma data; fora do período retorna <1 ou >10.
  dayIndex: (date) => diffDays(ctx.startDate(), date) + 1,
  dateForIndex: (n) => DAYS[n - 1] ? DAYS[n - 1].date : null,
  // Data "ativa": a de hoje se estiver no período; antes do início, o Dia 1; depois do fim, o Dia 10.
  activeDate: () => {
    const t = todayISO(); const i = ctx.dayIndex(t);
    if (i < 1) return DAYS[0].date; if (i > DAYS.length) return DAYS[DAYS.length - 1].date; return DAYS[i - 1].date;
  },
  navigate: (hash) => { location.hash = hash; },
  rerender: () => window.dispatchEvent(new HashChangeEvent('hashchange')),
  toast,
};

function parseHash() {
  const raw = (location.hash || '#/').replace(/^#\/?/, '');
  const [name, ...rest] = raw.split('/');
  return { name: name || 'home', params: rest.filter(Boolean) };
}

const TABS = [
  { name: 'home', label: 'Início', icon: 'home', match: ['home'] },
  { name: 'jornada', label: 'Jornada', icon: 'compass', match: ['jornada', 'manha', 'noite', 'dia'] },
  { name: 'diario', label: 'Diário', icon: 'pen', match: ['diario'] },
  { name: 'trabalho', label: 'Trabalho', icon: 'briefcase', match: ['trabalho'] },
  { name: 'mais', label: 'Mais', icon: 'menu', match: ['mais', 'jejum', 'dani', 'progresso', 'encerramento', 'ajustes', 'ajuda'] },
];

let shellBuilt = false;
let saveEl;
function buildShell() {
  app.innerHTML = '';
  saveEl = h('div', { class: 'save-status', text: '' });
  const top = h('header', { class: 'topbar' }, h('a', { class: 'brand', href: '#/' }, h('span', { class: 'brand-name', text: APP_NAME }), h('span', { class: 'brand-sub', text: APP_SUB })), saveEl);
  const main = h('main', { class: 'main', id: 'main' });
  const tabbar = h('nav', { class: 'tabbar', 'aria-label': 'Navegação principal' }, TABS.map((t) => h('a', { class: 'tab', href: `#/${t.name === 'home' ? '' : t.name}`, dataset: { tab: t.name } }, icon(t.icon, 20), h('span', { text: t.label }))));
  const fab = h('button', { class: 'fab', type: 'button', onClick: () => ctx.navigate('#/ajuda'), 'aria-label': 'Preciso de ajuda agora' }, icon('lifebuoy', 18), h('span', { text: 'Preciso de ajuda agora' }));
  app.append(top, main, fab, tabbar);
  shellBuilt = true;
  store.onStatus((s) => {
    saveEl.classList.toggle('error', s.kind === 'error');
    if (s.kind === 'saving') saveEl.textContent = 'Salvando…';
    else if (s.kind === 'saved') saveEl.textContent = `Salvo ${nowTime()}`;
    else if (s.kind === 'error') { saveEl.textContent = 'Erro ao salvar'; toast(s.message, 'error'); }
  });
}

function render() {
  if (!shellBuilt) buildShell();
  const { name, params } = parseHash();
  const main = document.getElementById('main');
  document.querySelectorAll('.modal-back').forEach((m) => m.remove());
  document.body.classList.remove('no-scroll');
  const view = routes[name] || routes.home;
  main.innerHTML = '';
  document.querySelectorAll('.tab').forEach((t) => {
    const tab = TABS.find((x) => x.name === t.dataset.tab);
    t.classList.toggle('active', tab.match.includes(name));
  });
  document.querySelector('.fab').hidden = name === 'ajuda';
  try {
    const el = view(ctx, params);
    main.append(el);
  } catch (e) {
    console.error(e);
    main.append(h('div', { class: 'banner' }, 'Ocorreu um erro ao abrir esta tela. Seus dados continuam salvos. ', h('a', { href: '#/', text: 'Voltar ao início' })));
  }
  window.scrollTo({ top: 0 });
}

function boot() {
  const result = store.load();
  const available = store.storageAvailable();
  buildShell();
  if (!available) {
    document.getElementById('main').before(h('div', { class: 'banner', style: { margin: '12px 16px 0' } }, 'O armazenamento deste navegador está indisponível (modo privado ou bloqueado). Você pode usar o sistema, mas os registros não serão mantidos ao fechar. Exporte seus dados antes de sair.'));
  } else if (!result.ok) {
    document.getElementById('main').before(h('div', { class: 'banner', style: { margin: '12px 16px 0' } }, 'Não foi possível ler os registros salvos anteriormente. O sistema foi iniciado vazio. Se você tem um backup, importe-o em Ajustes.'));
  }
  window.addEventListener('hashchange', render);
  render();
  window.addEventListener('beforeunload', () => store.saveNow());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') store.saveNow(); });
}

boot();
