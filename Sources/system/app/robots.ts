import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
