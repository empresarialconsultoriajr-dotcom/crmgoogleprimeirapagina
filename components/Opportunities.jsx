import React from 'react'
import { Section, Eyebrow, Reveal, OutboundLink } from './primitives.jsx'

/**
 * Oportunidades para a comunidade. Registro de convite, não de vitrine:
 * sem preço, sem contagem regressiva, sem "aproveite". A condição comercial
 * completa vive na página oficial de cada formação.
 */
export default function Opportunities({ items }) {
  if (!items.length) return null

  return (
    <Section id="oportunidades" tone="dark" className="opportunities">
      <Reveal className="section__head">
        <Eyebrow>Oportunidades para a comunidade</Eyebrow>
        <h2 className="section__title">O que eu consigo abrir para quem me acompanha.</h2>
        <p className="section__lead">
          Portas que eu negocio com quem confio, para quem quer transformar a própria história em
          caminho profissional.
        </p>
      </Reveal>

      <div className="opportunities__list">
        {items.map((item, index) => (
          <Reveal
            key={item.id}
            delay={index * 80}
            className={`card card--opportunity ${item.highlight ? 'is-highlight' : ''}`.trim()}
          >
            <div className="card__main">
              <span className="card__label">{item.label}</span>
              <h3 className="card__title card__title--lg">{item.title}</h3>
              {item.institution ? <p className="card__institution">{item.institution}</p> : null}
              <p className="card__text">{item.description}</p>
            </div>

            <div className="card__aside">
              {item.badge ? <span className="badge">{item.badge}</span> : null}
              {item.conditionNote ? <p className="card__fineprint">{item.conditionNote}</p> : null}
              <OutboundLink id={`opportunity-${item.id}`} href={item.cta.url}>
                {item.cta.label}
              </OutboundLink>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
