'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { buildWhatsappUrl } from '@/lib/whatsapp'
import { track, type AnalyticsEvent } from '@/lib/analytics'
import { siteConfig } from '@/config/siteConfig'

export type FlowId = 'sell' | 'trade' | null

type FlowsValue = {
  flow: FlowId
  openFlow: (flow: Exclude<FlowId, null>) => void
  closeFlow: () => void
  /** Abre o WhatsApp com a mensagem pronta. Degrada com elegância se o número não estiver configurado. */
  sendToWhatsapp: (message: string, event?: AnalyticsEvent, meta?: Record<string, unknown>) => void
  notice: string | null
  dismissNotice: () => void
}

const FlowsContext = createContext<FlowsValue | null>(null)

export function FlowsProvider({ children }: { children: ReactNode }) {
  const [flow, setFlow] = useState<FlowId>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const openFlow = useCallback((next: Exclude<FlowId, null>) => {
    setFlow(next)
    track(next === 'sell' ? 'click_sell_car' : 'click_trade_car')
  }, [])

  const closeFlow = useCallback(() => setFlow(null), [])
  const dismissNotice = useCallback(() => setNotice(null), [])

  const sendToWhatsapp = useCallback<FlowsValue['sendToWhatsapp']>((message, event, meta) => {
    if (event) track(event, meta)

    const url = buildWhatsappUrl(message)

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    // Número ainda não configurado: preserva o lead em vez de perder o usuário.
    const copy = navigator.clipboard?.writeText(message)
    const fallback = () => {
      setNotice(
        'Suas informações foram copiadas. Envie para a HS CAR’S pelo direct do Instagram — abrimos o perfil para você.',
      )
      window.open(siteConfig.instagramUrl, '_blank', 'noopener,noreferrer')
    }
    if (copy) copy.then(fallback).catch(fallback)
    else fallback()
  }, [])

  const value = useMemo(
    () => ({ flow, openFlow, closeFlow, sendToWhatsapp, notice, dismissNotice }),
    [flow, openFlow, closeFlow, sendToWhatsapp, notice, dismissNotice],
  )

  return <FlowsContext.Provider value={value}>{children}</FlowsContext.Provider>
}

export function useFlows(): FlowsValue {
  const ctx = useContext(FlowsContext)
  if (!ctx) throw new Error('useFlows precisa estar dentro de <FlowsProvider>')
  return ctx
}

/** Rolagem suave até uma âncora, respeitando reduced-motion via CSS. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ block: 'start' })
}
