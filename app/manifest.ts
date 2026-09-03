import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/siteConfig'

/** Export estático: este arquivo é gerado no build, não em requisição. */
export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.brandName} — ${siteConfig.tagline}`,
    short_name: siteConfig.brandName,
    description: siteConfig.segment,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    lang: 'pt-BR',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
