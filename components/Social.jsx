import React from 'react'
import { Section, Eyebrow, Reveal } from './primitives.jsx'
import { trackOutbound } from '../lib/track.js'

/** Redes oficiais — fechamento do percurso, de volta ao ponto de partida. */
export default function Social({ items }) {
  if (!items.length) return null

  return (
    <Section id="redes" tone="dark" className="social">
      <Reveal className="section__head section__head--center">
        <Eyebrow>Onde me encontrar</Eyebrow>
        <h2 className="section__title">De volta às redes — agora com a história inteira.</h2>
      </Reveal>

      <Reveal className="social__list">
        {items.map((item) => (
          <a
            key={item.id}
            className="social__item"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound(`social-${item.id}`, item.url)}
          >
            <span className="social__name">{item.name}</span>
            <span className="social__handle">{item.handle}</span>
          </a>
        ))}
      </Reveal>
    </Section>
  )
}
