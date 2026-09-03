/**
 * Camada de analytics agnóstica de fornecedor.
 * Empurra tudo para o dataLayer — GTM, GA4 e Meta Pixel podem ser
 * plugados depois sem alterar uma linha de componente.
 */

export type AnalyticsEvent =
  | 'page_view_biolink'
  | 'click_whatsapp'
  | 'click_instagram'
  | 'click_google_profile'
  | 'click_maps'
  | 'click_inventory'
  | 'start_car_finder'
  | 'car_finder_step_01'
  | 'car_finder_step_02'
  | 'car_finder_step_03'
  | 'car_finder_step_04'
  | 'car_finder_step_05'
  | 'car_finder_step_06'
  | 'car_finder_completed'
  | 'click_sell_car'
  | 'sell_car_completed'
  | 'click_trade_car'
  | 'trade_car_completed'

type Payload = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: Payload[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...payload })

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, payload)
  }
}

export const stepEvent = (step: number): AnalyticsEvent =>
  `car_finder_step_0${Math.min(Math.max(step, 1), 6)}` as AnalyticsEvent
