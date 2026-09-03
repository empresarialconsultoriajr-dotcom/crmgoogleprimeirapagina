import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { GoogleLink } from '@/components/GoogleLink'
import { siteConfig } from '@/config/siteConfig'

/**
 * Instagram.
 * Sem API oficial conectada, nenhum post é simulado — a seção entrega o
 * convite e a assinatura da marca, não um mosaico falso.
 */
export function InstagramSection() {
  return (
    <Section id="instagram" tone="soft" architecture className="py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-20">
        <div>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="label-gold tabular-nums">10</span>
              <span className="h-px w-6 bg-gold/40" aria-hidden />
              <span className="label">Instagram</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="display mt-9 text-[clamp(1.85rem,7.5vw,3.4rem)]">Acompanhe a HS CAR’S.</h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-bone/60 md:text-base">
              Novidades, veículos, oportunidades e entregas.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-10 text-[clamp(1.4rem,6vw,2.1rem)] tracking-[0.02em] text-bone/85">
              {siteConfig.instagramHandle}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <GoogleLink
            href={siteConfig.instagramUrl}
            event="click_instagram"
            origin="instagram_section"
            className="btn btn-primary w-full lg:w-auto"
          >
            Seguir no Instagram
            <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
          </GoogleLink>
        </Reveal>
      </div>
    </Section>
  )
}
