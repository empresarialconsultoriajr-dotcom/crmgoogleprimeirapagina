/**
 * opportunities[] — condições, formações e oportunidades que a Thaynara
 * abre para a comunidade dela.
 *
 * Regra de conteúdo: NÃO fixar preços, parcelas ou percentuais aqui.
 * Valores mudam e desatualizam a página — eles vivem na página de checkout,
 * que é a fonte oficial. Use `conditionNote` para sinalizar sem afirmar número.
 */
export const opportunities = [
  {
    id: 'formacao-psicanalise',
    active: true,
    order: 1,
    highlight: true,
    label: 'Formação',
    title: 'Formação em Psicanálise Clínica',
    institution: 'VIRTUS — Instituto Veríssimo',
    description:
      'Para quem sente que entender o outro começa por entender a própria história. Uma formação clínica completa, aberta a quem acompanha o meu trabalho.',
    conditionNote:
      'As condições de matrícula e mensalidade estão descritas na página oficial da formação.',
    badge: 'Condição para a comunidade',
    cta: { label: 'Conhecer a formação', url: 'https://checkout.thebank.com.br/pt-BR/7492641994121080832' },
  },
]

export const activeOpportunities = opportunities
  .filter((o) => o.active)
  .sort((a, b) => a.order - b.order)
