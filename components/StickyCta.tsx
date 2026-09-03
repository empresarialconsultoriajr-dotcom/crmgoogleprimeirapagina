'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFlows } from './FlowsProvider'
import { consultantMessage } from '@/lib/whatsapp'

/** Ícone do WhatsApp desenhado em traço fino — nada de bolha verde. */
function WhatsappGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.6-5.25A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.9 8.4c.25-.6.5-.6.8-.6h.6c.2 0 .45 0 .65.5l.7 1.7c.1.25.05.4-.1.6l-.35.45c-.15.2-.3.35-.15.65a6 6 0 0 0 2.75 2.5c.3.15.5.1.68-.08l.5-.55c.2-.2.4-.15.65-.05l1.6.8c.3.15.35.35.35.6a2 2 0 0 1-1.4 1.5c-.6.2-2.05.3-4.4-1.35a9.2 9.2 0 0 1-3.4-4.1c-.5-1.35-.15-2.3.1-2.7Z" />
    </svg>
  )
}

/**
 * Barra de contato persistente.
 * Mobile: faixa inferior integrada ao preto. Desktop: pílula discreta.
 * Só aparece depois do hero, e some quando o CTA final entra em cena.
 */
export function StickyCta() {
  const { sendToWhatsapp, flow } = useFlows()
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion() ?? false

  useEffect(() => {
    // Some onde competiria com um CTA próprio: o concierge e o fechamento.
    const quietZones = ['concierge', 'comecar']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.85
      const inQuietZone = quietZones.some((el) => {
        const { top, bottom } = el.getBoundingClientRect()
        return top < window.innerHeight * 0.92 && bottom > window.innerHeight * 0.08
      })
      setVisible(pastHero && !inQuietZone)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && flow === null && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 md:inset-x-auto md:bottom-8 md:right-8"
        >
          <div className="border-t border-bone/10 bg-black/88 backdrop-blur-md md:border md:border-bone/12 md:bg-black/80">
            <button
              type="button"
              onClick={() => sendToWhatsapp(consultantMessage(), 'click_whatsapp', { origin: 'sticky' })}
              className="group flex min-h-[58px] w-full items-center justify-center gap-3 px-6 text-[11px] uppercase tracking-[0.2em] text-bone/85 transition-colors duration-500 hover:text-gold md:min-h-[52px] md:px-7"
            >
              <span className="text-gold transition-transform duration-700 ease-editorial group-hover:-translate-y-px">
                <WhatsappGlyph />
              </span>
              Falar com um consultor
            </button>
          </div>
          {/* respiro para o home indicator do iOS */}
          <div className="h-[env(safe-area-inset-bottom)] bg-black/88 md:hidden" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
