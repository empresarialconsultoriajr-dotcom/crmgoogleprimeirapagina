'use client'

import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { HeroBackdrop } from '@/components/HeroBackdrop'
import { scrollToId, useFlows } from '@/components/FlowsProvider'
import { siteConfig } from '@/config/siteConfig'
import { consultantMessage } from '@/lib/whatsapp'

const PROMISE = [
  { index: '01', title: 'Curadoria', detail: 'Selecionamos antes de oferecer.' },
  { index: '02', title: 'Negociação', detail: 'Cada etapa acompanhada de perto.' },
  { index: '03', title: 'Entrega', detail: 'A conquista, concluída.' },
] as const

/**
 * A entrada do hero é feita em CSS, não em JavaScript.
 *
 * Uma sequência controlada por Framer Motion só começaria depois da
 * hidratação — o que empurraria o LCP para depois de todo o bundle. Em CSS,
 * a mesma coreografia começa na primeira pintura. O respeito a
 * prefers-reduced-motion continua vindo da regra global.
 */
const enter = (delayMs: number): CSSProperties => ({ '--enter-delay': `${delayMs}ms` } as CSSProperties)

export function Hero() {
  const { sendToWhatsapp } = useFlows()

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pb-10 pt-28 md:pb-12 md:pt-36"
    >
      <HeroBackdrop />
      <div className="architecture" aria-hidden />

      <div className="shell relative lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <div>
          <div className="enter flex items-center gap-3" style={enter(60)}>
            <span className="h-px w-7 bg-gold/50" aria-hidden />
            <span className="label">
              {siteConfig.address.city} — {siteConfig.address.state}
            </span>
          </div>

          <h1 className="mt-7 md:mt-9">
            <span className="sr-only">Seu próximo carro começa aqui.</span>
            <span aria-hidden className="block">
              <span
                className="display enter block text-[clamp(2.1rem,10.5vw,5.6rem)] text-bone/85"
                style={enter(140)}
              >
                Seu próximo
              </span>
              <span className="display enter block text-[clamp(2.1rem,10.5vw,5.6rem)]" style={enter(230)}>
                carro começa
              </span>
              <span className="display enter block text-[clamp(2.1rem,10.5vw,5.6rem)]" style={enter(320)}>
                aqui<span className="text-gold">.</span>
              </span>
            </span>
          </h1>

          <p
            className="enter mt-7 max-w-[34ch] text-[15px] leading-relaxed text-bone/60 md:mt-9 md:max-w-[46ch] md:text-[17px]"
            style={enter(410)}
          >
            Seminovos selecionados, atendimento personalizado e uma experiência à altura da sua próxima
            conquista.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-12">
            <button
              type="button"
              onClick={() => scrollToId('concierge')}
              className="btn btn-primary enter w-full sm:w-auto"
              style={enter(500)}
            >
              Encontrar meu carro
              <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => sendToWhatsapp(consultantMessage(), 'click_whatsapp', { origin: 'hero' })}
              className="btn btn-ghost enter w-full sm:w-auto"
              style={enter(580)}
            >
              Falar com um consultor
            </button>
          </div>
        </div>

        {/* Coluna de promessa — o que a loja faz, em três tempos. */}
        <ol className="enter hidden w-[268px] border-t border-bone/8 lg:block" style={enter(680)} aria-label="O que fazemos">
          {PROMISE.map((item) => (
            <li key={item.index} className="flex items-baseline gap-5 border-b border-bone/8 py-4">
              <span className="label-gold tabular-nums">{item.index}</span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-bone/75">{item.title}</span>
                <span className="mt-1.5 block text-[12px] leading-relaxed text-bone/50">{item.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="shell relative">
        <div
          className="enter mt-12 flex items-end justify-between gap-6 border-t border-bone/8 pt-6 md:mt-16"
          style={enter(740)}
        >
          <div>
            <p className="text-[11px] uppercase tracking-wordmark text-bone/70">{siteConfig.brandName}</p>
            <p className="mt-1.5 text-[11px] tracking-[0.14em] text-bone/50">{siteConfig.tagline}</p>
          </div>

          <button
            type="button"
            onClick={() => scrollToId('atalhos')}
            aria-label="Avançar para os atalhos"
            className="group -mb-2 flex min-h-[44px] items-center gap-3 pb-2 pl-4 text-bone/50 transition-colors duration-500 hover:text-gold"
          >
            <span className="hidden text-[10px] uppercase tracking-label sm:inline">Continuar</span>
            <span className="relative block h-9 w-px overflow-hidden bg-bone/12">
              <span className="absolute inset-x-0 top-0 block h-4 animate-cue-fall bg-gold" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
