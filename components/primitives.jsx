import React from 'react'
import { useReveal } from '../lib/useReveal.js'
import { trackOutbound } from '../lib/track.js'

/** Bloco que sobe suavemente ao entrar na tela. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Linha superior de cada seção: categoria em caixa alta. */
export function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>
}

/**
 * Casca padrão de seção. `tone` controla o registro visual da faixa:
 * 'dark' (redes), 'paper' (história), 'warm' (projeto autoral).
 */
export function Section({ id, tone = 'dark', className = '', children, ...rest }) {
  return (
    <section id={id} className={`section section--${tone} ${className}`.trim()} {...rest}>
      <div className="section__inner">{children}</div>
    </section>
  )
}

/** Link externo com atribuição de clique e segurança de target. */
export function OutboundLink({ id, href, variant = 'primary', className = '', children, ...rest }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--${variant} ${className}`.trim()}
      onClick={() => trackOutbound(id, href)}
      {...rest}
    >
      <span>{children}</span>
      <svg className="btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
