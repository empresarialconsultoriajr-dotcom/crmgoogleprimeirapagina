import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/siteConfig'

/** Export estático: este arquivo é gerado no build, não em requisição. */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  }
}
