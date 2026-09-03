import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/siteConfig'

/** Export estático: este arquivo é gerado no build, não em requisição. */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: siteConfig.siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.siteUrl}/privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
