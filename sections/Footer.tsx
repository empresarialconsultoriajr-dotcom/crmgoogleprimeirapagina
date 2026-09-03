'use client'

import Link from 'next/link'
import { Instagram, MapPin, MessageCircle, Star } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useFlows } from '@/components/FlowsProvider'
import { siteConfig, fullAddress, mapsDirectionsUrl } from '@/config/siteConfig'
import { track } from '@/lib/analytics'
import { consultantMessage } from '@/lib/whatsapp'

export function Footer() {
  const { sendToWhatsapp } = useFlows()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-bone/8 bg-ink pb-32 pt-20 md:pb-16 md:pt-24">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-20">
          <div>
            <Logo width={150} className="h-auto w-[132px] md:w-[150px]" />
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-bone/50">{siteConfig.tagline}</p>
            <p className="mt-7 max-w-[34ch] text-[13px] leading-relaxed text-bone/50">{fullAddress}</p>
          </div>

          <nav aria-label="Canais de contato">
            <ul className="grid gap-1 sm:grid-cols-2 md:grid-cols-1">
              <li>
                <button
                  type="button"
                  onClick={() => sendToWhatsapp(consultantMessage(), 'click_whatsapp', { origin: 'footer' })}
                  className="group flex min-h-[48px] items-center gap-3.5 text-[13px] text-bone/70 transition-colors duration-500 hover:text-bone"
                >
                  <MessageCircle size={15} strokeWidth={1.25} aria-hidden className="text-bone/45 transition-colors duration-500 group-hover:text-gold" />
                  WhatsApp
                </button>
              </li>
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('click_instagram', { origin: 'footer' })}
                  className="group flex min-h-[48px] items-center gap-3.5 text-[13px] text-bone/70 transition-colors duration-500 hover:text-bone"
                >
                  <Instagram size={15} strokeWidth={1.25} aria-hidden className="text-bone/45 transition-colors duration-500 group-hover:text-gold" />
                  {siteConfig.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('click_maps', { origin: 'footer' })}
                  className="group flex min-h-[48px] items-center gap-3.5 text-[13px] text-bone/70 transition-colors duration-500 hover:text-bone"
                >
                  <MapPin size={15} strokeWidth={1.25} aria-hidden className="text-bone/45 transition-colors duration-500 group-hover:text-gold" />
                  Como chegar
                </a>
              </li>
              {(siteConfig.googleProfileUrl || siteConfig.googleReviewsUrl) && (
                <li>
                  <a
                    href={siteConfig.googleProfileUrl || siteConfig.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('click_google_profile', { origin: 'footer' })}
                    className="group flex min-h-[48px] items-center gap-3.5 text-[13px] text-bone/70 transition-colors duration-500 hover:text-bone"
                  >
                    <Star size={15} strokeWidth={1.25} aria-hidden className="text-bone/45 transition-colors duration-500 group-hover:text-gold" />
                    Perfil no Google
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bone/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] tracking-[0.12em] text-bone/50">
            © {year} {siteConfig.brandName}.
          </p>
          <Link
            href="/privacidade"
            className="-my-3 inline-flex min-h-[44px] items-center text-[11px] tracking-[0.12em] text-bone/50 underline-offset-4 transition-colors duration-500 hover:text-gold hover:underline"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
