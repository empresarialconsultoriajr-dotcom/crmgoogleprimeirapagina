'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'span'
  once?: boolean
}

/**
 * Entrada padrão da experiência: fade + translate curto.
 * Sem bounce, sem zoom, sem rotação — apenas peso e silêncio.
 *
 * Implementado com IntersectionObserver + transição CSS em vez de uma
 * biblioteca de animação: são dezenas de ocorrências por página, e a
 * coreografia é simples demais para justificar JavaScript em cada uma.
 * A preferência por menos movimento é respeitada pela regra global.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', once = true }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { rootMargin: '-12% 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--enter-delay': `${Math.round(delay * 1000)}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
