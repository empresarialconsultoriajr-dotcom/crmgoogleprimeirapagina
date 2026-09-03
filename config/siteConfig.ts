/**
 * HS CAR'S — configuração central da experiência.
 *
 * Tudo que muda com o tempo (números, links, reputação, pixels) vive aqui.
 * Nenhum dado é inventado: campos ainda não fornecidos ficam vazios e a
 * interface se adapta, escondendo o que não pode ser afirmado.
 *
 * Qualquer valor pode ser sobrescrito por variável de ambiente
 * (NEXT_PUBLIC_*) sem tocar no código.
 */

const env = (key: string, fallback = ''): string => {
  const map: Record<string, string | undefined> = {
    WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    STOCK_URL: process.env.NEXT_PUBLIC_STOCK_URL,
    GOOGLE_MAPS_URL: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL,
    GOOGLE_PROFILE_URL: process.env.NEXT_PUBLIC_GOOGLE_PROFILE_URL,
    GOOGLE_REVIEWS_URL: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL,
    GOOGLE_RATING: process.env.NEXT_PUBLIC_GOOGLE_RATING,
    GOOGLE_REVIEWS_COUNT: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_COUNT,
    PHONE: process.env.NEXT_PUBLIC_PHONE,
    EMAIL: process.env.NEXT_PUBLIC_EMAIL,
    LATITUDE: process.env.NEXT_PUBLIC_LATITUDE,
    LONGITUDE: process.env.NEXT_PUBLIC_LONGITUDE,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    LEAD_WEBHOOK_URL: process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL,
    HERO_IMAGE: process.env.NEXT_PUBLIC_HERO_IMAGE,
  }
  return (map[key] ?? '').trim() || fallback
}

/** A Netlify expõe a URL do site publicado; a Vercel, o domínio de produção. */
const platformUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : '')

export type Review = {
  author: string
  text: string
  rating?: number
  date?: string
}

export type OpeningHours = {
  days: string[]
  label: string
  opens?: string
  closes?: string
  closed?: boolean
}

export const siteConfig = {
  brandName: "HS CAR'S",
  brandNameShort: 'HS',
  tagline: 'Excelência e Sofisticação',
  segment: 'Revendedora de carros novos, seminovos e usados',

  /**
   * URL canônica de produção (canonical, sitemap, OpenGraph, schema).
   * A Netlify injeta `URL` no build, então o site já sai correto no
   * domínio *.netlify.app. Defina NEXT_PUBLIC_SITE_URL quando a loja tiver
   * um domínio próprio para esta landing page.
   */
  siteUrl: platformUrl || 'https://hscars.netlify.app',

  /** WhatsApp comercial da loja, formato internacional, apenas dígitos. */
  whatsappNumber: env('WHATSAPP_NUMBER', '5511947078010'),

  instagramUrl: 'https://www.instagram.com/hscarsofc',
  instagramHandle: '@hscarsofc',

  /** Site institucional com o estoque de veículos. */
  stockUrl: env('STOCK_URL', 'https://hscarsofc.com.br'),

  /** Perfil público no Google (Maps / Business Profile). */
  googleProfileUrl: env('GOOGLE_PROFILE_URL', 'https://share.google/yZM35KG5WBsun5csP'),
  googleReviewsUrl: env('GOOGLE_REVIEWS_URL', 'https://share.google/yZM35KG5WBsun5csP'),
  googleMapsUrl: env('GOOGLE_MAPS_URL', 'https://share.google/yZM35KG5WBsun5csP'),

  phone: env('PHONE', '+5511947078010'),
  phoneDisplay: '(11) 94707-8010',
  email: env('EMAIL'),

  address: {
    street: 'Estrada Tenente Marques, 3600A',
    district: 'Vila Poupança',
    city: 'Santana de Parnaíba',
    state: 'SP',
    postalCode: '06530-001',
    country: 'BR',
    /** Preencher para fixar o pino do mapa no schema. */
    latitude: env('LATITUDE'),
    longitude: env('LONGITUDE'),
  },

  /** Horário conforme o perfil da loja no Google. */
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      label: 'Segunda a sábado',
      opens: '08:30',
      closes: '18:00',
    },
    { days: ['Sunday'], label: 'Domingo', closed: true },
  ] as OpeningHours[],

  /**
   * Reputação — dados reais do perfil do Google.
   * As avaliações são transcrições das públicas, sem emojis e sem reescrita.
   */
  googleRating: env('GOOGLE_RATING', '4,9'),
  googleReviewsCount: env('GOOGLE_REVIEWS_COUNT', '35'),
  reviews: [
    {
      author: 'Mai Lopes',
      rating: 5,
      text: 'Quero agradecer ao Henrique e a Thamires pela super atenção, pela paciência de tirar todas as minhas dúvidas sobre modelos de carro, valores, como ficaria para mim a melhor forma de pagamento. […] Hoje o meu sonho e da minha família foi realizado através de vocês. Super recomendo, empresa íntegra, de pessoas humanas.',
    },
    {
      author: 'Josafá Multas',
      rating: 5,
      text: 'Muito bem atendido, gostei muito e já vou indicar.',
    },
    {
      author: 'Rodrigo Santos Rocha',
      rating: 5,
      text: 'Sucesso, só carro top parabéns. Deus abençoe, quando for procura uma nave ta loja certa.',
    },
  ] as Review[],

  /** Imagem de fundo do hero (opcional). Vazio = composição gráfica da marca. */
  heroImage: env('HERO_IMAGE'),

  /** Analytics / integrações futuras. Vazio = nada é carregado. */
  analytics: {
    gtmId: env('GTM_ID'),
    gaMeasurementId: env('GA_MEASUREMENT_ID'),
    metaPixelId: env('META_PIXEL_ID'),
  },

  /** Webhook opcional para CRM. Vazio = leads seguem apenas via WhatsApp. */
  leadWebhookUrl: env('LEAD_WEBHOOK_URL'),
} as const

export type SiteConfig = typeof siteConfig

export const fullAddress = [
  siteConfig.address.street,
  siteConfig.address.district,
  `${siteConfig.address.city} – ${siteConfig.address.state}`,
]
  .filter(Boolean)
  .join(', ')

/** Um número só é utilizável se tiver 12–13 dígitos e nenhum placeholder. */
export const isWhatsappConfigured = /^\d{12,13}$/.test(siteConfig.whatsappNumber)

export const hasReputationData =
  siteConfig.googleRating.length > 0 && siteConfig.googleReviewsCount.length > 0

/**
 * "Como chegar" abre a rota, não o perfil: um toque a menos para quem já
 * decidiu visitar a loja.
 */
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${siteConfig.brandName}, ${fullAddress}, ${siteConfig.address.postalCode}`,
)}`

/** O perfil público — avaliações, fotos e informações da loja. */
export const googlePlaceUrl = siteConfig.googleMapsUrl || siteConfig.googleProfileUrl
