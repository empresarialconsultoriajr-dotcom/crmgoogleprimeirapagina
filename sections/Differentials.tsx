import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'

const ITEMS = [
  { index: '01', title: 'Curadoria', text: 'Veículos escolhidos pensando em qualidade e oportunidade.' },
  { index: '02', title: 'Transparência', text: 'Informações claras em todas as etapas.' },
  { index: '03', title: 'Atendimento', text: 'Negociação acompanhada por uma equipe preparada.' },
  { index: '04', title: 'Experiência', text: 'Da escolha à entrega, queremos tornar sua próxima conquista memorável.' },
] as const

/** Quatro diferenciais em malha de fios — sem cards. */
export function Differentials() {
  return (
    <Section id="diferenciais" tone="black" className="py-24 md:py-36">
      <SectionHeader index="07" eyebrow="Por que HS CAR’S" title="Cada detalhe importa." />

      <div className="mt-16 grid border-t border-bone/8 sm:grid-cols-2 md:mt-24">
        {ITEMS.map((item, i) => (
          <Reveal
            key={item.index}
            delay={i * 0.07}
            className="group border-b border-bone/8 py-10 sm:odd:pr-10 sm:even:border-l sm:even:border-l-bone/8 sm:even:pl-10 md:py-14 lg:sm:odd:pr-16 lg:even:pl-16"
          >
            <span className="label-gold tabular-nums">{item.index}</span>
            <h3 className="display mt-6 text-[clamp(1.3rem,5vw,1.85rem)]">{item.title}</h3>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-bone/60 md:text-[15px]">
              {item.text}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
