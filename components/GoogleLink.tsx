'use client'

import type { ReactNode } from 'react'
import { track, type AnalyticsEvent } from '@/lib/analytics'

/** Link externo com rastreio — mantém as seções como Server Components. */
export function GoogleLink({
  href,
  event,
  origin,
  className,
  children,
  ariaLabel,
}: {
  href: string
  event: AnalyticsEvent
  origin: string
  className?: string
  children: ReactNode
  ariaLabel?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={() => track(event, { origin })}
      className={className}
    >
      {children}
    </a>
  )
}
