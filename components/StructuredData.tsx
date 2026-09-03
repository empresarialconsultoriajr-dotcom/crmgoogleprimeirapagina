import { siteConfig, fullAddress } from '@/config/siteConfig'

/**
 * Schema.org — AutoDealer + LocalBusiness.
 * Só emite o que existe de fato: campos não configurados são omitidos.
 */
export function StructuredData() {
  const { address, openingHours } = siteConfig

  const geo =
    address.latitude && address.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: Number(address.latitude),
            longitude: Number(address.longitude),
          },
        }
      : {}

  const rating =
    siteConfig.googleRating && siteConfig.googleReviewsCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            // o schema exige ponto decimal; a interface mostra vírgula
            ratingValue: siteConfig.googleRating.replace(',', '.'),
            reviewCount: siteConfig.googleReviewsCount,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}

  const reviews =
    siteConfig.reviews.length > 0
      ? {
          review: siteConfig.reviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.author },
            reviewBody: r.text,
            ...(r.rating
              ? {
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: String(r.rating),
                    bestRating: '5',
                    worstRating: '1',
                  },
                }
              : {}),
          })),
        }
      : {}

  const sameAs = [siteConfig.instagramUrl, siteConfig.googleProfileUrl].filter(Boolean)

  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${siteConfig.siteUrl}/#autodealer`,
    name: siteConfig.brandName,
    description: siteConfig.segment,
    slogan: siteConfig.tagline,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/opengraph-image.png`,
    logo: `${siteConfig.siteUrl}/icon-512.png`,
    priceRange: '$$',
    currenciesAccepted: 'BRL',
    paymentAccepted: 'À vista, Financiamento, Troca com veículo',
    areaServed: [
      { '@type': 'City', name: 'Santana de Parnaíba' },
      { '@type': 'City', name: 'Barueri' },
      { '@type': 'City', name: 'Alphaville' },
      { '@type': 'State', name: 'São Paulo' },
    ],
    address: {
      '@type': 'PostalAddress',
      // Schema.org não tem campo de bairro: a convenção é anexá-lo ao logradouro.
      streetAddress: address.district ? `${address.street} - ${address.district}` : address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      addressCountry: address.country,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
    },
    ...geo,
    ...rating,
    ...reviews,
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    openingHoursSpecification: openingHours
      .filter((slot) => !slot.closed && slot.opens && slot.closes)
      .map((slot) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: slot.days,
        opens: slot.opens,
        closes: slot.closes,
      })),
    knowsAbout: ['Carros seminovos', 'Carros usados', 'Avaliação de veículos', 'Troca de veículos'],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brandName,
    url: siteConfig.siteUrl,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${siteConfig.siteUrl}/#autodealer` },
    about: fullAddress,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
