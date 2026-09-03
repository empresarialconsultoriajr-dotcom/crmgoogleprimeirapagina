'use client'

import { Car, MapPin, MessageCircle, Instagram, Star, type LucideIcon } from 'lucide-react'
import { siteConfig, mapsDirectionsUrl } from '@/config/siteConfig'
import { scrollToId, useFlows } from '@/components/FlowsProvider'
import { track } from '@/lib/analytics'
import { consultantMessage } from '@/lib/whatsapp'

type Shortcut = {
  label: string
  icon: LucideIcon
  onClick: () => void
  href?: string
}

/**
 * Atalhos essenciais logo abaixo do hero.
 * Uma faixa contínua dividida por fios — não um menu de aplicativo.
 */
export function ActionBar() {
  const { sendToWhatsapp } = useFlows()

  const items: Shortcut[] = [
    {
      label: 'Estoque',
      icon: Car,
      href: siteConfig.stockUrl || undefined,
      onClick: () => {
        track('click_inventory', { origin: 'action_bar' })
        if (!siteConfig.stockUrl) scrollToId('concierge')
      },
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      onClick: () => sendToWhatsapp(consultantMessage(), 'click_whatsapp', { origin: 'action_bar' }),
    },
    {
      label: 'Como chegar',
      icon: MapPin,
      href: mapsDirectionsUrl,
      onClick: () => track('click_maps', { origin: 'action_bar' }),
    },
    {
      label: 'Avaliações',
      icon: Star,
      href: siteConfig.googleReviewsUrl || siteConfig.googleProfileUrl || undefined,
      onClick: () => {
        track('click_google_profile', { origin: 'action_bar' })
        if (!siteConfig.googleReviewsUrl && !siteConfig.googleProfileUrl) scrollToId('confianca')
      },
    },
    {
      label: 'Instagram',
      icon: Instagram,
      href: siteConfig.instagramUrl,
      onClick: () => track('click_instagram', { origin: 'action_bar' }),
    },
  ]

  return (
    <section id="atalhos" aria-label="Atalhos" className="relative border-y border-bone/8 bg-ink-soft">
      <div className="shell">
        <ul className="no-scrollbar edge-fade -mx-[var(--shell-x)] flex overflow-x-auto px-[var(--shell-x)] md:mx-0 md:justify-between md:overflow-visible md:px-0 md:[-webkit-mask-image:none] md:[mask-image:none]">
          {items.map(({ label, icon: Icon, href, onClick }) => {
            const content = (
              <>
                <Icon
                  size={16}
                  strokeWidth={1.25}
                  aria-hidden
                  className="text-bone/55 transition-colors duration-500 group-hover:text-gold"
                />
                <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-bone/70 transition-colors duration-500 group-hover:text-bone">
                  {label}
                </span>
              </>
            )

            return (
              <li key={label} className="relative flex-1 border-r border-bone/8 last:border-r-0">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClick}
                    className="group flex min-h-[76px] items-center justify-center gap-2.5 px-5 md:px-3"
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onClick}
                    className="group flex min-h-[76px] w-full items-center justify-center gap-2.5 px-5 md:px-3"
                  >
                    {content}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
