import type { ReactNode } from 'react'

type Props = {
  id?: string
  children: ReactNode
  className?: string
  /** Malha de colunas finas ao fundo, só no desktop. */
  architecture?: boolean
  tone?: 'black' | 'soft' | 'raised'
  bleed?: boolean
}

const tones = {
  black: 'bg-ink',
  soft: 'bg-ink-soft',
  raised: 'bg-ink-raised',
} as const

export function Section({ id, children, className = '', architecture = false, tone = 'black', bleed = false }: Props) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${tones[tone]} ${className}`}
      style={id ? { scrollMarginTop: '8px' } : undefined}
    >
      {architecture && <div className="architecture" aria-hidden />}
      <div className={bleed ? 'relative' : 'shell relative'}>{children}</div>
    </section>
  )
}
