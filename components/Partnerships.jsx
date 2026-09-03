import React from 'react'
import { Section, Eyebrow, Reveal, OutboundLink } from './primitives.jsx'

/**
 * Indicações: marcas que ela usa e recomenda. Fica depois das oportunidades
 * porque é o registro mais leve da página — recomendação, não formação.
 */
export default function Partnerships({ items }) {
  if (!items.length) return null

  return (
    <Section id="indicacoes" tone="dark" className="partners">
      <Reveal className="section__head">
        <Eyebrow>Indicações</Eyebrow>
        <h2 className="section__title">O que eu uso e indico.</h2>
        <p className="section__lead">
          Marcas com as quais eu tenho parceria oficial e que fazem sentido para a rotina de quem me
          acompanha.
        </p>
      </Reveal>

      <div className={`partners__grid ${items.length === 1 ? 'is-single' : ''}`.trim()}>
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 80} className="card card--partner">
            <div className="card__top">
              <span className="partner__monogram" aria-hidden="true">
                {item.monogram}
              </span>
              <span className="card__note">{item.category}</span>
            </div>
            <h3 className="card__title">{item.brand}</h3>
            <p className="partner__tagline">{item.tagline}</p>
            <p className="card__text">{item.description}</p>
            {item.benefit ? <p className="partner__benefit">{item.benefit}</p> : null}
            <OutboundLink id={`partner-${item.id}`} href={item.cta.url} variant="ghost">
              {item.cta.label}
            </OutboundLink>
            {item.disclosure ? <p className="card__fineprint">{item.disclosure}</p> : null}
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
