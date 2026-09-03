import { siteConfig } from '@/config/siteConfig'

/**
 * Espelha o lead para um CRM/webhook quando configurado.
 * Nunca bloqueia a jornada do usuário: falhas são silenciosas e o
 * WhatsApp continua sendo o canal principal.
 */
export function mirrorLead(kind: 'concierge' | 'sell' | 'trade', data: Record<string, unknown>): void {
  const url = siteConfig.leadWebhookUrl
  if (!url || typeof navigator === 'undefined') return

  const body = JSON.stringify({
    kind,
    source: 'biolink-instagram',
    submittedAt: new Date().toISOString(),
    data,
  })

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }))
      return
    }
    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined)
  } catch {
    /* o lead segue pelo WhatsApp de qualquer forma */
  }
}
