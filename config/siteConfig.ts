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

/** A Vercel expõe o domínio de produção — usamos quando nada foi definido. */
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : ''

export type Review = {
  author: string
  text: string
  rating?: number
  date?: string
}

export const siteConfig = {
  brandName: "HS CAR'S",
  brandNameShort: 'HS',
  tagline: 'Excelência e Sofisticação',
  segment: 'Agência de carros novos, seminovos e usados',

  /**
   * URL canônica de produção (canonical, sitemap, OpenGraph, schema).
   * Na Vercel, o domínio de produção é detectado sozinho; defina
   * NEXT_PUBLIC_SITE_URL para fixar o domínio próprio da loja.
   */
  siteUrl: env('SITE_URL', vercelUrl || 'https://hscars.com.br'),

  /**
   * Número de WhatsApp no formato internacional, apenas dígitos.
   * ATENÇÃO: substitua o placeholder abaixo pelo número real da loja.
   * Enquanto contiver "X", a interface entra em modo degradado elegante
   * (copia a mensagem e leva o usuário ao Instagram) em vez de abrir um link quebrado.
   */
  whatsappNumber: env('WHATSAPP_NUMBER', '5511XXXXXXXXX'),

  instagramUrl: 'https://www.instagram.com/hscarsofc',
  instagramHandle: '@hscarsofc',

  /** Links que só devem existir quando forem reais. Vazio = elemento oculto. */
  stockUrl: env('STOCK_URL'),
  googleProfileUrl: env('GOOGLE_PROFILE_URL'),
  googleMapsUrl: env('GOOGLE_MAPS_URL'),
  googleReviewsUrl: env('GOOGLE_REVIEWS_URL'),

  phone: env('PHONE'),
  email: env('EMAIL'),

  address: {
    street: 'Estrada Tenente Marques, 3600A',
    district: '',
    city: 'Santana de Parnaíba',
    state: 'SP',
    postalCode: '',
    country: 'BR',
    /** Preencher para o schema LocalBusiness e para o mapa. */
    latitude: env('LATITUDE'),
    longitude: env('LONGITUDE'),
  },

  /** Horário de funcionamento — schema.org e seção de localização. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00', label: 'Segunda a sexta' },
    { days: ['Saturday'], opens: '09:00', closes: '14:00', label: 'Sábado' },
  ],

  /**
   * Reputação — NÃO inventar.
   * Preencha com os dados reais do perfil do Google.
   */
  googleRating: env('GOOGLE_RATING'),
  googleReviewsCount: env('GOOGLE_REVIEWS_COUNT'),
  reviews: [] as Review[],

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

/** Busca no Maps por endereço quando ainda não há URL/coordenadas definidas. */
export const mapsDirectionsUrl =
  siteConfig.googleMapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.brandName} ${fullAddress}`,
  )}`
