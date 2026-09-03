import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'

const STEPS = [
  { index: '01', title: 'Conte o que procura', detail: 'Suas preferências chegam direto a um consultor.' },
  { index: '02', title: 'Selecionamos as oportunidades', detail: 'A equipe filtra o que faz sentido para o seu perfil.' },
  { index: '03', title: 'Você analisa as opções', detail: 'Informações completas antes de qualquer decisão.' },
  { index: '04', title: 'Cuidamos da negociação', detail: 'Documentação, condições e prazos acompanhados de perto.' },
  { index: '05', title: 'Você recebe seu próximo carro', detail: 'A entrega fecha a experiência do jeito que ela começou.' },
] as const

/**
 * Linha do tempo.
 * No celular ela desce; a partir de lg ela deita e atravessa a página —
 * a régua horizontal marca o percurso inteiro em um só olhar.
 */
export function Process() {
  return (
    <Section id="processo" tone="soft" architecture className="py-24 md:py-36">
      <SectionHeader
        index="06"
        eyebrow="Processo HS CAR’S"
        title={
          <>
            Uma experiência simples.
            <br className="hidden sm:block" /> Do primeiro contato à entrega.
          </>
        }
      />

      {/* Vertical — celular e tablet */}
      <ol className="relative mt-14 lg:hidden">
        <span
          aria-hidden
          className="absolute bottom-6 left-[7px] top-3 w-px bg-gradient-to-b from-gold/45 via-bone/10 to-transparent"
        />

        {STEPS.map((step, i) => (
          <Reveal as="li" key={step.index} delay={i * 0.06} className="relative block pl-9">
            <span aria-hidden className="absolute left-0 top-[7px] flex h-[15px] w-[15px] items-center justify-center">
              <span className="h-[5px] w-[5px] rounded-full bg-gold" />
              <span className="absolute inset-0 rounded-full border border-gold/25" />
            </span>

            <div className="border-b border-bone/8 pb-9">
              <span className="label-gold tabular-nums">{step.index}</span>
              <h3 className="display mt-4 text-[clamp(1.15rem,4.6vw,1.5rem)]">{step.title}</h3>
              <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-bone/55">{step.detail}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      {/* Horizontal — desktop */}
      <div className="relative mt-24 hidden lg:block">
        <span aria-hidden className="absolute left-0 right-0 top-0 h-px bg-bone/8" />
        <span
          aria-hidden
          className="absolute left-0 top-0 h-px w-3/5 bg-gradient-to-r from-gold/60 via-gold/25 to-transparent"
        />

        <ol className="grid grid-cols-5">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.index}
              delay={i * 0.07}
              className={`relative block pt-11 ${i === 0 ? 'pr-8' : 'border-l border-bone/8 px-8'}`}
            >
              <span aria-hidden className="absolute -top-[7px] left-0 flex h-[15px] w-[15px] items-center justify-center">
                <span className="h-[5px] w-[5px] rounded-full bg-gold" />
                <span className="absolute inset-0 rounded-full border border-gold/25" />
              </span>

              <span className="label-gold tabular-nums">{step.index}</span>
              <h3 className="display mt-6 text-[1.15rem] leading-snug xl:text-[1.3rem]">{step.title}</h3>
              <p className="mt-4 text-[13.5px] leading-relaxed text-bone/55">{step.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
