'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { scrollToId, useFlows } from '@/components/FlowsProvider'

type Path = {
  index: string
  title: string
  description: string
  cta: string
  action: () => void
}

/**
 * Os três caminhos.
 * Colunas verticais separadas por fios — a luz sobe na coluna ativa.
 * Nada de cards flutuantes.
 */
export function Paths() {
  const { openFlow } = useFlows()

  const paths: Path[] = [
    {
      index: '01',
      title: 'Quero comprar',
      description: 'Estou procurando meu próximo veículo.',
      cta: 'Encontrar meu carro',
      action: () => scrollToId('concierge'),
    },
    {
      index: '02',
      title: 'Quero vender',
      description: 'Quero apresentar meu veículo para avaliação.',
      cta: 'Avaliar meu carro',
      action: () => openFlow('sell'),
    },
    {
      index: '03',
      title: 'Quero trocar',
      description: 'Tenho um veículo e quero utilizá-lo na negociação.',
      cta: 'Simular troca',
      action: () => openFlow('trade'),
    },
  ]

  return (
    <Section id="experiencia" tone="soft" className="py-24 md:py-36">
      <SectionHeader
        index="04"
        eyebrow="Escolha seu caminho"
        title={
          <>
            Cada intenção pede
            <br className="hidden sm:block" /> uma conversa diferente.
          </>
        }
      />

      <div className="mt-14 border-t border-bone/8 md:mt-20 md:grid md:grid-cols-3">
        {paths.map((path, i) => (
          <Reveal
            key={path.index}
            delay={i * 0.08}
            className={`md:h-full ${i === 0 ? '' : 'md:border-l md:border-bone/8'}`}
          >
            <button
              type="button"
              onClick={path.action}
              className={`group relative flex w-full flex-col items-start border-b border-bone/8 py-11 text-left md:h-full md:border-b-0 md:py-14 lg:py-16 ${
                i === 0 ? 'md:pr-9 lg:pr-12' : 'md:px-9 lg:px-12'
              }`}
            >
              {/* luz que sobe da base ao passar o cursor */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-gold/[0.07] to-transparent transition-transform duration-[900ms] ease-editorial group-hover:scale-y-100"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold/60 transition-transform duration-[900ms] ease-editorial group-hover:scale-x-100 md:bottom-auto md:top-0"
              />

              <span className="label-gold relative tabular-nums">{path.index}</span>

              <span className="display relative mt-7 text-[clamp(1.5rem,6vw,2.05rem)]">{path.title}</span>

              <span className="relative mt-4 max-w-[30ch] text-[14px] leading-relaxed text-bone/60 md:text-[15px]">
                {path.description}
              </span>

              <span className="relative mt-9 inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-bone/70 transition-colors duration-500 group-hover:text-gold md:mt-auto md:pt-14">
                {path.cta}
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden
                  className="transition-transform duration-700 ease-editorial group-hover:translate-x-1.5"
                />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
