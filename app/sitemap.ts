import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: siteConfig.siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteConfig.siteUrl}/privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
