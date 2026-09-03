import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = {
  index?: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Cabeçalho editorial: índice, olho, título e chamada — sempre no mesmo ritmo. */
export function SectionHeader({ index, eyebrow, title, lead, align = 'left', className = '' }: Props) {
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-4xl'} ${className}`}>
      <Reveal>
        <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
          {index && <span className="label-gold tabular-nums">{index}</span>}
          <span className={`h-px w-6 ${index ? 'bg-gold/40' : 'hidden'}`} aria-hidden />
          <span className="label">{eyebrow}</span>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="display mt-7 text-[clamp(1.9rem,7vw,3.6rem)]">{title}</h2>
      </Reveal>

      {lead && (
        <Reveal delay={0.12}>
          <p
            className={`mt-6 max-w-prose text-[15px] leading-relaxed text-bone/60 md:text-base ${
              centered ? 'mx-auto' : ''
            }`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  )
}
