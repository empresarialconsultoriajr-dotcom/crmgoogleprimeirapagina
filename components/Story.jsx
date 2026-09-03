import React from 'react'
import { Section, Eyebrow, Reveal } from './primitives.jsx'
import { story, profile } from '../data/index.js'

/**
 * Único trecho claro da página. A troca de fundo é a ideia central da
 * experiência: sai-se da luz de tela e entra-se no papel, onde a história
 * é contada por ela — e não pelo algoritmo.
 */
export default function Story() {
  return (
    <Section id="quem-sou" tone="paper" className="story">
      <div className="story__layout">
        <Reveal className="story__aside">
          <div className="story__portrait">
            <img src={profile.portrait.src} alt="" aria-hidden="true" loading="lazy" width="1290" height="1720" />
          </div>
          <ul className="story__stats">
            {profile.stats.map((stat) => (
              <li key={stat.id}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="story__copy">
          <Reveal>
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <h2 className="story__title">
              {story.title.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </Reveal>

          <Reveal delay={90}>
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="story__paragraph">
                {paragraph}
              </p>
            ))}
            <p className="story__signature">{story.signature}</p>
          </Reveal>

          <Reveal delay={150}>
            <ul className="story__values" aria-label="Temas do meu trabalho">
              {story.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
