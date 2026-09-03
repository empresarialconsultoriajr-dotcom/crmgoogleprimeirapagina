import React from 'react'
import { Section, Eyebrow, Reveal, OutboundLink } from './primitives.jsx'

/**
 * Universo Thaynara: onde acompanhar o trabalho no dia a dia.
 * Renderiza featuredContent[] — novos canais (podcast, YouTube, newsletter)
 * aparecem aqui automaticamente.
 */
export default function Universe({ items }) {
  if (!items.length) return null

  return (
    <Section id="universo" tone="dark" className="universe">
      <Reveal className="section__head">
        <Eyebrow>Universo Thaynara</Eyebrow>
        <h2 className="section__title">Onde a conversa continua.</h2>
        <p className="section__lead">
          Depois da história, o convívio. Estes são os lugares em que eu apareço todos os dias.
        </p>
      </Reveal>

      <div className="universe__grid">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 80} className="card card--content">
            <div className="card__top">
              <span className="card__label">{item.label}</span>
              {item.note ? <span className="card__note">{item.note}</span> : null}
            </div>
            <h3 className="card__title">{item.title}</h3>
            <p className="card__text">{item.description}</p>
            <OutboundLink id={`content-${item.id}`} href={item.cta.url} variant="ghost">
              {item.cta.label}
            </OutboundLink>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
