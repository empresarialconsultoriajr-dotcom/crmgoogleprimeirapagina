'use client'

import { useState } from 'react'
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { useFlows } from '@/components/FlowsProvider'
import { siteConfig, fullAddress, mapsDirectionsUrl } from '@/config/siteConfig'
import { track } from '@/lib/analytics'
import { consultantMessage } from '@/lib/whatsapp'

const MAP_QUERY = encodeURIComponent(`${siteConfig.brandName}, ${fullAddress}`)
const EMBED_SRC = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`

/**
 * O mapa só é carregado quando o usuário pede.
 * Ganha-se LCP, evita-se cookie de terceiro antes do consentimento.
 */
export function Location() {
  const { sendToWhatsapp } = useFlows()
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <Section id="localizacao" tone="black" className="py-24 md:py-36">
      <SectionHeader index="09" eyebrow="Localização" title="Visite a HS CAR’S." />

      <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <div className="border-t border-bone/8 py-8">
              <span className="label">Endereço</span>
              <p className="mt-5 text-[clamp(1.15rem,4.6vw,1.5rem)] leading-snug text-bone">
                {siteConfig.address.street}
              </p>
              <p className="mt-2 text-[15px] text-bone/60">
                {siteConfig.address.district}, {siteConfig.address.city} – {siteConfig.address.state}
              </p>
              <p className="mt-1 text-[13px] tabular-nums text-bone/50">
                CEP {siteConfig.address.postalCode}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="border-t border-bone/8 py-8">
              <span className="label">Horário</span>
              <dl className="mt-5 space-y-2.5">
                {siteConfig.openingHours.map((slot) => (
                  <div key={slot.label} className="flex items-baseline justify-between gap-6">
                    <dt className="text-[14px] text-bone/70">{slot.label}</dt>
                    <dd className="text-[14px] tabular-nums text-bone/50">
                      {slot.closed ? 'Fechado' : `${slot.opens} — ${slot.closes}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('click_maps', { origin: 'location' })}
                className="btn btn-primary w-full sm:w-auto"
              >
                Abrir no Google Maps
                <Navigation size={14} strokeWidth={1.5} aria-hidden />
              </a>
              <button
                type="button"
                onClick={() => sendToWhatsapp(consultantMessage(), 'click_whatsapp', { origin: 'location' })}
                className="btn btn-ghost w-full sm:w-auto"
              >
                Falar com a loja
              </button>
            </div>
          </Reveal>

          {siteConfig.googleProfileUrl && (
            <Reveal delay={0.18}>
              <a
                href={siteConfig.googleProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('click_google_profile', { origin: 'location' })}
                className="link-quiet mt-7 inline-flex min-h-[44px] items-center py-2 text-[11px] uppercase tracking-[0.2em]"
              >
                Conhecer nosso perfil no Google
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
              </a>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-bone/8 bg-ink-soft lg:aspect-auto lg:h-full lg:min-h-[420px]">
            {mapLoaded ? (
              <iframe
                title={`Mapa — ${siteConfig.brandName}`}
                src={EMBED_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[0.35] invert-[0.92] hue-rotate-180 contrast-[0.92]"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMapLoaded(true)
                  track('click_maps', { origin: 'embed' })
                }}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-5 text-center"
                aria-label="Carregar o mapa da loja"
              >
                {/* Malha discreta: sugestão de mapa sem carregar terceiros */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '54px 54px',
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(50% 50% at 50% 50%, rgba(207,160,96,0.10), transparent 70%)',
                  }}
                />
                <MapPin
                  size={22}
                  strokeWidth={1.1}
                  aria-hidden
                  className="relative text-gold transition-transform duration-700 ease-editorial group-hover:-translate-y-1"
                />
                <span className="relative text-[11px] uppercase tracking-[0.2em] text-bone/70 transition-colors duration-500 group-hover:text-bone">
                  Carregar o mapa
                </span>
                <span className="relative max-w-[26ch] text-[12px] leading-relaxed text-bone/50">
                  Carregamos o Google Maps somente quando você pede.
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
