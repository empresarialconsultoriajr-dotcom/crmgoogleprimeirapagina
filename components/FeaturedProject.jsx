import React from 'react'
import { Section, Eyebrow, Reveal, OutboundLink } from './primitives.jsx'
import { profile } from '../data/index.js'

/**
 * Destaque editorial do projeto autoral em evidência (hoje, "Além das Redes").
 * É a primeira parada depois do hero de propósito: é a ponte entre o perfil
 * que trouxe a pessoa até aqui e a história que ela ainda não conhece.
 *
 * O objeto-livro é construído em CSS — assim o destaque não depende de um
 * mockup em imagem e continua nítido em qualquer tela.
 */
export default function FeaturedProject({ project }) {
  if (!project) return null

  return (
    <Section id={project.id} tone="warm" className="feature">
      <div className="feature__glow" aria-hidden="true" />

      <div className="feature__layout">
        <Reveal className="feature__object">
          {project.cover.image ? (
            <img
              className="book book--photo"
              src={project.cover.image}
              alt={`Capa do livro ${project.title}, de ${project.cover.author}`}
              loading="lazy"
            />
          ) : (
          <div className="book" role="img" aria-label={`Capa do livro ${project.title}, de ${project.cover.author}`}>
            <div className="book__spine" aria-hidden="true" />
            <div className="book__face">
              <p className="book__author">{project.cover.author}</p>
              <p className="book__title">
                {project.cover.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <span className="book__rule" aria-hidden="true" />
              <p className="book__kicker">{project.tagline}</p>
            </div>
            <div className="book__shine" aria-hidden="true" />
          </div>
          )}
          <p className="feature__caption">{project.kind}</p>
        </Reveal>

        <div className="feature__copy">
          <Reveal>
            <Eyebrow>{project.eyebrow}</Eyebrow>
            <p className="feature__bridge">
              Você chegou pelas redes. Isto é o que existia antes delas.
            </p>
            <h2 className="feature__title">{project.title}</h2>
            <p className="feature__tagline">{project.tagline}</p>
          </Reveal>

          <Reveal delay={90}>
            <p className="feature__lead">{project.lead}</p>
            {project.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="feature__body">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={160}>
            <ul className="themes" aria-label="Temas do livro">
              {project.themes.map((theme) => (
                <li key={theme}>{theme}</li>
              ))}
            </ul>

            <div className="feature__actions">
              <OutboundLink id={`project-${project.id}`} href={project.cta.url}>
                {project.cta.label}
              </OutboundLink>
              <span className="feature__url">{project.urlLabel}</span>
            </div>
            <p className="feature__byline">Um projeto de {profile.name}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
