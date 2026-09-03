import React, { useEffect, useState } from 'react'
import { profile, navigation } from '../data/index.js'

/**
 * Abertura. Registro "redes": luz fria de tela, retrato em recorte alto,
 * nenhum botão de oferta. A primeira coisa que a pessoa encontra é a pessoa.
 */
export default function Hero() {
  const [entered, setEntered] = useState(false)
  const { hero, portrait, name, role, handle } = profile

  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 80)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <header className={`hero ${entered ? 'is-entered' : ''}`}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__portrait">
          <img src={portrait.src} alt={portrait.alt} width="1290" height="1720" fetchpriority="high" />
          <div className="hero__portrait-fade" aria-hidden="true" />
        </div>

        <div className="hero__text">
          <p className="hero__handle">{handle}</p>
          <h1 className="hero__name">{name}</h1>
          <p className="hero__role">{role}</p>

          <p className="hero__statement">
            <span>{hero.line1}</span>
            <span>{hero.line2}</span>
            <span className="hero__statement-turn">{hero.line3}</span>
            <span className="hero__statement-turn">{hero.line4}</span>
          </p>

          <p className="hero__lead">{hero.lead}</p>

          <nav className="shortcuts" aria-label="Atalhos da página">
            {navigation.map((item) => (
              <a key={item.id} className="shortcuts__link" href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <a className="hero__cue" href="#alem-das-redes">
        <span>{hero.scrollCue}</span>
        <span className="hero__cue-line" aria-hidden="true" />
      </a>
    </header>
  )
}
