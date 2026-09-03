import type { ReactNode } from 'react'

/** Bloco titulado de campos — dá arquitetura a formulários longos. */
export function FieldGroup({
  index,
  title,
  children,
  columns = 2,
}: {
  index: string
  title: string
  children: ReactNode
  columns?: 1 | 2
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="label-gold tabular-nums">{index}</span>
        <span className="h-px w-5 bg-gold/40" aria-hidden />
        <span className="label">{title}</span>
      </div>
      <div className={`mt-6 grid gap-5 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>{children}</div>
    </div>
  )
}
