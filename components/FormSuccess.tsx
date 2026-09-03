'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

type Props = {
  title?: string
  description?: string
  onContinue: () => void
  ctaLabel?: string
}

/** Confirmação curta antes de entregar o lead ao consultor. */
export function FormSuccess({
  title = 'Preferências recebidas.',
  description = 'Agora é só enviar essas informações para um de nossos consultores.',
  onContinue,
  ctaLabel = 'Continuar no WhatsApp',
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-4 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.svg
        viewBox="0 0 44 44"
        className="mx-auto h-11 w-11"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <circle cx="22" cy="22" r="21" fill="none" stroke="rgba(207,160,96,0.35)" strokeWidth="1" />
        <motion.path
          d="M14 22.6 19.6 28.2 30.4 16.4"
          fill="none"
          stroke="#CFA060"
          strokeWidth="1.4"
          strokeLinecap="square"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>

      <h3 className="display mt-7 text-[clamp(1.35rem,5vw,1.9rem)]">{title}</h3>
      <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-bone/60">{description}</p>

      <button type="button" onClick={onContinue} className="btn btn-primary mt-9 w-full sm:w-auto">
        {ctaLabel}
        <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden />
      </button>
    </motion.div>
  )
}
