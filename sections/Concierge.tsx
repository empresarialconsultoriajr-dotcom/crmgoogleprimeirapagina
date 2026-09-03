import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { ConciergeForm } from '@/forms/ConciergeForm'

/**
 * A principal ferramenta de captação.
 * Composição em duas colunas: argumento à esquerda, condução à direita.
 */
export function Concierge() {
  return (
    <Section id="concierge" tone="black" className="relative py-24 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: 'radial-gradient(58% 100% at 50% 0%, rgba(207,160,96,0.07), transparent 70%)' }}
      />

      <div className="relative grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="label-gold tabular-nums">05</span>
              <span className="h-px w-6 bg-gold/40" aria-hidden />
              <span className="label">Concierge HS CAR’S</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="display mt-9 text-[clamp(1.85rem,7vw,3.1rem)]">
              Conte o que você procura.
              <br />
              Nós fazemos a curadoria.
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-7 max-w-[42ch] text-[15px] leading-relaxed text-bone/60 md:text-base">
              Leva menos de 60 segundos. A partir das suas respostas, um consultor seleciona as opções
              compatíveis e envia diretamente no seu WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 hidden border-t border-bone/8 lg:block">
              {[
                ['Sem cadastro', 'Nenhuma senha, nenhuma conta.'],
                ['Sem robô', 'Quem responde é um consultor.'],
                ['Sem compromisso', 'Você decide o próximo passo.'],
              ].map(([term, detail]) => (
                <div key={term} className="flex items-baseline gap-6 border-b border-bone/8 py-5">
                  <dt className="w-[9.5rem] shrink-0 text-[11px] uppercase tracking-[0.18em] text-bone/70">
                    {term}
                  </dt>
                  <dd className="text-[13px] text-bone/50">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="panel px-6 py-9 md:px-10 md:py-12">
            <ConciergeForm />
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
