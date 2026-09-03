/**
 * Envia o clique de saída para a camada de dados, quando existir
 * (Google Tag Manager / GA4). Sem ferramenta instalada, não faz nada —
 * a navegação nunca depende desta função.
 */
export function trackOutbound(id, url) {
  try {
    if (typeof window === 'undefined') return
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'outbound_click', link_id: id, link_url: url })
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'outbound_click', { link_id: id, link_url: url })
    }
  } catch (error) {
    /* medição nunca pode quebrar a página */
  }
}
