'use client'

import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Modal } from './Modal'
import { useFlows } from './FlowsProvider'

// Os fluxos secundários só existem quando alguém os abre: ficam fora do
// bundle inicial e não pesam no primeiro carregamento do link da bio.
const SellForm = dynamic(() => import('@/forms/SellForm').then((m) => m.SellForm), { ssr: false })
const TradeForm = dynamic(() => import('@/forms/TradeForm').then((m) => m.TradeForm), { ssr: false })

/** Hospeda os fluxos secundários e o aviso de contingência do WhatsApp. */
export function FlowModals() {
  const { flow, closeFlow, notice, dismissNotice } = useFlows()

  return (
    <>
      <Modal open={flow === 'sell'} onClose={closeFlow} eyebrow="Avaliação" title="Quer vender seu carro?">
        <SellForm />
      </Modal>

      <Modal open={flow === 'trade'} onClose={closeFlow} eyebrow="Troca" title="Vamos simular sua troca.">
        <TradeForm />
      </Modal>

      <AnimatePresence>
        {notice && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-24 z-[80] mx-auto max-w-md border border-gold/25 bg-ink-soft px-5 py-4 md:bottom-8 md:right-8 md:left-auto md:mx-0"
          >
            <p className="text-[13px] leading-relaxed text-bone/70">{notice}</p>
            <button
              type="button"
              onClick={dismissNotice}
              className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold"
            >
              Entendi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
