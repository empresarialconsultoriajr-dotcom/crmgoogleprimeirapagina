import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'

/** Posicionamento. Muito respiro, pouca voz. */
export function Manifesto() {
  return (
    <Section tone="black" architecture className="py-28 md:py-44">
      <div className="max-w-4xl">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="label-gold tabular-nums">03</span>
            <span className="h-px w-6 bg-gold/40" aria-hidden />
            <span className="label">Experiência HS CAR’S</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="display mt-10 text-[clamp(1.95rem,8vw,4.2rem)]">
            <span className="block text-bone/85">Não vendemos apenas carros.</span>
            <span className="mt-1 block md:mt-2">Entregamos conquistas.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="rule-gold mt-12" aria-hidden />
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-14">
          <Reveal delay={0.2}>
            <p className="text-[15px] leading-[1.85] text-bone/60 md:text-[17px]">
              Na HS CAR’S, cada negociação começa entendendo o que você procura.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="text-[15px] leading-[1.85] text-bone/60 md:text-[17px]">
              Selecionamos oportunidades, orientamos cada etapa e entregamos uma experiência baseada em
              transparência, procedência e atendimento personalizado.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
