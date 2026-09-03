import React from 'react'
import { Section, Eyebrow, Reveal, OutboundLink } from './primitives.jsx'
import { business } from '../data/index.js'

/** Contato comercial — a única seção da página que fala com marcas, não com a audiência. */
export default function Business() {
  return (
    <Section id="publicidade" tone="dark" className="business">
      <Reveal className="business__panel">
        <div className="business__copy">
          <Eyebrow>{business.eyebrow}</Eyebrow>
          <h2 className="section__title">{business.title}</h2>
          <p className="section__lead">{business.description}</p>
        </div>

        <div className="business__side">
          <ul className="business__reach">
            {business.reach.map((item) => (
              <li key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <OutboundLink id="business-whatsapp" href={business.cta.url}>
            {business.cta.label}
          </OutboundLink>
          <p className="card__fineprint">{business.ctaNote}</p>
        </div>
      </Reveal>
    </Section>
  )
}
