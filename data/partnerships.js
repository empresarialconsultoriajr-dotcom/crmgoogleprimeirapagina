/**
 * partnerships[] — marcas e serviços que a Thaynara usa e indica.
 *
 * IMPORTANTE: as URLs carregam os parâmetros de identificação da parceria
 * (ex.: ?partner=THAYNARA). Nunca remova ou reescreva a query string —
 * é ela que atribui a indicação. Para acrescentar parâmetros de campanha
 * (utm_*), acrescente ao final da URL, mantendo os existentes.
 *
 * Regra de conteúdo: não anunciar desconto, cupom ou benefício que não
 * esteja confirmado pela marca. Use `benefit` apenas com o que for oficial.
 */
export const partnerships = [
  {
    id: 'allugator',
    active: true,
    order: 1,
    brand: 'Allugator',
    category: 'Tecnologia',
    tagline: 'Tecnologia sem precisar comprar.',
    description:
      'Assinatura de eletrônicos: você assina o aparelho, usa pelo tempo que escolher e devolve ou troca ao final do período, em vez de comprar.',
    benefit: null, // preencher somente com benefício confirmado pela marca
    monogram: 'a.',
    cta: { label: 'Ver o catálogo', url: 'https://allugator.com/catalog?partner=THAYNARA&' },
    disclosure: 'Parceria oficial',
  },
]

export const activePartnerships = partnerships
  .filter((p) => p.active)
  .sort((a, b) => a.order - b.order)
