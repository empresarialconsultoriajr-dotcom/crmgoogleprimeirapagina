import { ArrowUpRight, Instagram, MapPin, Star } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { GoogleLink } from '@/components/GoogleLink'
import { siteConfig, hasReputationData, mapsDirectionsUrl } from '@/config/siteConfig'
import type { AnalyticsEvent } from '@/lib/analytics'

/**
 * Reputação.
 *
 * Nada aqui é inventado. Sem nota e depoimentos reais em siteConfig, a
 * seção não simula prova social: ela entrega os canais públicos onde a
 * reputação da loja já existe e convida o visitante a conferir na fonte.
 */

type Channel = {
  label: string
  title: string
  detail: string
  href: string
  cta: string
  icon: typeof Star
  event: AnalyticsEvent
}

const CHANNELS: Channel[] = [
  {
    label: 'Google',
    title: 'Avaliações públicas',
    detail: 'Quem comprou escreve lá, sem filtro nosso.',
    href: siteConfig.googleReviewsUrl || siteConfig.googleProfileUrl || mapsDirectionsUrl,
    cta: siteConfig.googleReviewsUrl || siteConfig.googleProfileUrl ? 'Ver todas as avaliações' : 'Ver no Google',
    icon: Star,
    event: 'click_google_profile',
  },
  {
    label: 'Instagram',
    title: 'Histórico à vista',
    detail: `Entregas, veículos e bastidores em ${siteConfig.instagramHandle}.`,
    href: siteConfig.instagramUrl,
    cta: 'Abrir o perfil',
    icon: Instagram,
    event: 'click_instagram',
  },
  {
    label: 'Loja física',
    title: 'Endereço aberto',
    detail: `${siteConfig.address.street} — ${siteConfig.address.city}.`,
    href: mapsDirectionsUrl,
    cta: 'Ver no mapa',
    icon: MapPin,
    event: 'click_maps',
  },
]

export function Trust() {
  // A nota é exibida no formato brasileiro; contar estrelas exige número real.
  const rating = Number(siteConfig.googleRating.replace(',', '.'))

  return (
    <Section id="confianca" tone="soft" className="py-24 md:py-36">
      <SectionHeader
        index="08"
        eyebrow="Prova de confiança"
        title="Confiança também se constrói com experiências reais."
        lead={
          hasReputationData
            ? undefined
            : 'Não publicamos depoimentos escolhidos a dedo. Preferimos apontar onde a reputação da HS CAR’S já está — pública, datada e fora do nosso controle.'
        }
      />

      {hasReputationData && (
        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-20">
          <Reveal>
            <div className="border-t border-bone/8 pt-8">
              <div className="flex items-baseline gap-3">
                <span className="display text-[clamp(3rem,13vw,4.5rem)] leading-none tabular-nums">
                  {siteConfig.googleRating}
                </span>
                <span className="label">/ 5</span>
              </div>

              <div
                className="mt-5 flex items-center gap-2"
                role="img"
                aria-label={`${siteConfig.googleRating} de 5 estrelas, com base em ${siteConfig.googleReviewsCount} avaliações no Google`}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={15}
                    strokeWidth={1.25}
                    aria-hidden
                    className={i < Math.round(rating) ? 'fill-gold text-gold' : 'text-bone/25'}
                  />
                ))}
              </div>

              <p className="mt-5 text-[13px] text-bone/55">
                {siteConfig.googleReviewsCount} avaliações no Google
              </p>
            </div>
          </Reveal>

          {siteConfig.reviews.length > 0 && (
            <ul className="border-t border-bone/8">
              {siteConfig.reviews.slice(0, 3).map((review, i) => (
                <Reveal
                  as="li"
                  key={`${review.author}-${i}`}
                  delay={i * 0.08}
                  className="block border-b border-bone/8 py-9"
                >
                  <p className="max-w-[58ch] text-[15px] leading-[1.8] text-bone/70 md:text-[17px]">
                    “{review.text}”
                  </p>
                  <p className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-bone/50">
                    {review.author}
                    {review.date && <span className="h-px w-4 bg-bone/15" aria-hidden />}
                    {review.date && <span className="normal-case tracking-normal text-bone/50">{review.date}</span>}
                  </p>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Canais verificáveis — o convite para checar por conta própria. */}
      <div className="mt-16 grid border-t border-bone/8 md:mt-20 md:grid-cols-3">
        {CHANNELS.map((channel, i) => (
          <Reveal
            key={channel.label}
            delay={i * 0.07}
            className={`md:h-full ${i === 0 ? '' : 'md:border-l md:border-bone/8'}`}
          >
            <GoogleLink
              href={channel.href}
              event={channel.event}
              origin="trust_channels"
              className={`group flex h-full flex-col border-b border-bone/8 py-9 md:border-b-0 md:py-11 ${
                i === 0 ? 'md:pr-9' : 'md:px-9'
              }`}
            >
              <span className="flex items-center gap-3">
                <channel.icon
                  size={15}
                  strokeWidth={1.25}
                  aria-hidden
                  className="text-bone/45 transition-colors duration-500 group-hover:text-gold"
                />
                <span className="label">{channel.label}</span>
              </span>

              <span className="display mt-6 text-[clamp(1.15rem,4.4vw,1.4rem)]">{channel.title}</span>

              <span className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-bone/55">
                {channel.detail}
              </span>

              <span className="mt-7 inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-bone/70 transition-colors duration-500 group-hover:text-gold md:mt-auto md:pt-9">
                {channel.cta}
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden
                  className="transition-transform duration-700 ease-editorial group-hover:translate-x-1 group-hover:-translate-y-0.5"
                />
              </span>
            </GoogleLink>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
