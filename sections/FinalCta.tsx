'use client'

import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { BrandSilhouette } from '@/components/BrandSilhouette'
import { scrollToId, useFlows } from '@/components/FlowsProvider'
import { siteConfig } from '@/config/siteConfig'
import { consultantMessage } from '@/lib/whatsapp'
import { editorialTransition } from '@/lib/motion'

export function FinalCta() {
  const { sendToWhatsapp } = useFlows()
  const reduced = useReducedMotion() ?? false

  return (
    <section id="comecar" className="relative overflow-hidden bg-ink py-28 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 105%, rgba(207,160,96,0.15), transparent 62%), radial-gradient(90% 70% at 50% -10%, rgba(54,69,79,0.16), transparent 60%)',
        }}
      />
      {/* A silhueta da marca emerge do preto — relevo, não ilustração. */}
      <BrandSilhouette className="bottom-[2%] left-1/2 w-[200%] max-w-none -translate-x-1/2 opacity-[0.075] md:bottom-[0%] md:w-[116%]" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        initial={{ scaleX: 0.2, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={editorialTransition(reduced, 1.4)}
      />

      <div className="shell relative text-center">
        <Reveal>
          <span className="label">{siteConfig.tagline}</span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="display mx-auto mt-9 max-w-4xl text-[clamp(2rem,9vw,4.6rem)]">
            Sua próxima conquista
            <br className="hidden sm:block" /> pode começar agora
            <span className="text-gold">.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mx-auto mt-8 max-w-[38ch] text-[15px] leading-relaxed text-bone/60 md:text-base">
            Conte para nossa equipe o que você procura.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-12 flex max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <button type="button" onClick={() => scrollToId('concierge')} className="btn btn-primary w-full sm:w-auto">
              Encontrar meu carro
              <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => sendToWhatsapp(consultantMessage(), 'click_whatsapp', { origin: 'final_cta' })}
              className="btn btn-ghost w-full sm:w-auto"
            >
              Falar com um consultor
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
