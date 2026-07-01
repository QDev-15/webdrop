import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const statics: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/templates`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/cvs`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/lich-bong-da`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  let templatePages: MetadataRoute.Sitemap = []
  try {
    const rows = await prisma.template.findMany({
      where: { status: 'published' }, select: { slug: true, createdAt: true },
    })
    templatePages = rows.map(t => ({
      url: `${BASE}/templates/${t.slug}`, lastModified: t.createdAt,
      changeFrequency: 'weekly' as const, priority: 0.8,
    }))
  } catch { /* DB offline */ }

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const rows = await prisma.post.findMany({
      where: { status: 'published' }, select: { slug: true, updatedAt: true },
    })
    blogPages = rows.map(p => ({
      url: `${BASE}/blog/${p.slug}`, lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const, priority: 0.6,
    }))
  } catch { /* DB offline */ }

  return [...statics, ...templatePages, ...blogPages]
}
