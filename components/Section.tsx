import type { ReactNode } from 'react'

type Props = {
  id?: string
  children: ReactNode
  className?: string
  /** Malha de colunas finas ao fundo, só no desktop. */
  architecture?: boolean
  tone?: 'black' | 'soft' | 'raised'
  bleed?: boolean
  /**
   * Recorta o que passa das bordas. Ligado por padrão para conter os
   * elementos decorativos — mas desligue quando a seção tiver algo grudado
   * (sticky) dentro: `overflow: hidden` vira um contêiner de rolagem e
   * impede que o sticky funcione.
   */
  clip?: boolean
}

const tones = {
  black: 'bg-ink',
  soft: 'bg-ink-soft',
  raised: 'bg-ink-raised',
} as const

export function Section({
  id,
  children,
  className = '',
  architecture = false,
  tone = 'black',
  bleed = false,
  clip = true,
}: Props) {
  return (
    <section
      id={id}
      className={`relative ${clip ? 'overflow-hidden' : ''} ${tones[tone]} ${className}`}
      style={id ? { scrollMarginTop: '8px' } : undefined}
    >
      {architecture && <div className="architecture" aria-hidden />}
      <div className={bleed ? 'relative' : 'shell relative'}>{children}</div>
    </section>
  )
}
