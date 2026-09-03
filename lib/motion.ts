import type { Transition } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Transição editorial.
 *
 * Importante: a preferência por menos movimento nunca altera a MARCAÇÃO —
 * apenas a duração. Se o markup mudasse entre servidor e cliente, a
 * hidratação quebraria; e se o elemento deixasse de animar, ele ficaria preso
 * em opacity: 0. Aqui o destino é sempre o mesmo, só o caminho é instantâneo.
 */
export function editorialTransition(reduced: boolean, duration: number, delay = 0): Transition {
  return reduced
    ? { duration: 0, delay: 0 }
    : { duration, delay, ease: EASE }
}
