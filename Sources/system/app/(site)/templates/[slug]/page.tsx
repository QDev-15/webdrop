export const revalidate = 60

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { templates as mockTemplates } from '@/data/templates'
import type { Template } from '@/data/templates'
import TemplateDetailClient from './TemplateDetailClient'

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.vn'

// Read first 1024 bytes of an image URL and return its pixel width.
// For Unsplash, reads the ?w= param directly — no network call needed.
async function measureImageWidth(url: string): Promise<number> {
  if (url.includes('unsplash.com')) {
    const m = url.match(/[?&]w=(\d+)/)
    return m ? parseInt(m[1]) : 1200
  }
  try {
    const res = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(3000),
    })
    const b = new Uint8Array(await res.arrayBuffer())
    // PNG: width at bytes 16-19
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47 && b.length >= 24) {
      return (b[16] << 24 | b[17] << 16 | b[18] << 8 | b[19]) >>> 0
    }
    // JPEG: scan for SOF0–SOF3 marker → width at offset +7/+8 from marker
    for (let i = 2; i + 9 < b.length; i++) {
      if (b[i] === 0xFF && b[i + 1] >= 0xC0 && b[i + 1] <= 0xC3) {
        return (b[i + 7] << 8) | b[i + 8]
      }
    }
  } catch { /* ignore */ }
  return 0
}

// Fetch HTML from demoUrl, extract all <img src/data-src>, filter w >= 400, return 5.
// Results cached 24h by Next.js fetch cache.
async function extractDemoImages(demoUrl: string): Promise<string[]> {
  try {
    const res = await fetch(demoUrl, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return []
    const html = await res.text()
    const base = new URL(demoUrl)
    const seen = new Set<string>()
    const candidates: string[] = []

    const re = /(?:src|data-src)=["']([^"'\s]+)["']/gi
    let m: RegExpExecArray | null
    while ((m = re.exec(html)) !== null) {
      const raw = m[1]
      if (!raw || raw.startsWith('data:') || raw.startsWith('#')) continue
      try {
        const abs = new URL(raw, base).href
        if (
          /\.(jpe?g|png|webp)(\?|$)/i.test(abs) ||
          abs.includes('unsplash.com') ||
          abs.includes('images.pexels.com')
        ) {
          if (/favicon|logo-sm|icon-\d{2}\./.test(abs)) continue
          if (!seen.has(abs)) { seen.add(abs); candidates.push(abs) }
        }
      } catch { /* skip invalid URLs */ }
    }

    // Check widths in parallel, filter w >= 400, return first 5
    const results = await Promise.all(
      candidates.map(async url => ({ url, w: await measureImageWidth(url) }))
    )
    return results
      .filter(({ w }) => w >= 400)
      .map(({ url }) => url)
      .slice(0, 5)
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const t = await prisma.template.findFirst({
      where: { slug, status: 'published' },
      select: { name: true, thumbnail: true, category: true, industry: { select: { name: true } } },
    })
    if (t) {
      const category = t.industry?.name || t.category
      const title    = `${t.name} — Mẫu website ${category}`
      const desc     = `Tải về hoặc triển khai website ${t.name} — mẫu ${category} Bootstrap 5, responsive 100%, không cần build. Bàn giao trong 3–5 ngày.`
      const img      = t.thumbnail || '/og-default.jpg'
      return {
        title,
        description: desc,
        alternates: { canonical: `${BASE}/templates/${slug}` },
        openGraph: { title, description: desc, images: [{ url: img, width: 1200, height: 630 }], type: 'website' },
        twitter:   { card: 'summary_large_image', title, description: desc, images: [img] },
      }
    }
  } catch { /* fallback */ }
  const mock = mockTemplates.find(t => t.slug === slug)
  const name = mock?.name || 'Template website'
  return {
    title: `${name} — webdrop.vn`,
    alternates: { canonical: `${BASE}/templates/${slug}` },
  }
}

export async function generateStaticParams() {
  try {
    const rows = await prisma.template.findMany({ where: { status: 'published' }, select: { slug: true } })
    return rows.map((t: { slug: string }) => ({ slug: t.slug }))
  } catch {
    return mockTemplates.map(t => ({ slug: t.slug }))
  }
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let template: Template | undefined
  let websitePrice: number | undefined
  let customPrice: number | undefined
  let dbError = false

  try {
    const row = await prisma.template.findFirst({
      where: { slug, status: 'published' },
      include: { industry: { select: { name: true } } },
    })
    if (row) {
      const n = typeof row.price === 'number' ? row.price : (row.price as { toNumber(): number }).toNumber()

      // Extract gallery images from the live demo URL at render time (cached 24h).
      let screenshots: string[] | undefined
      if (row.demoUrl) {
        const extracted = await extractDemoImages(row.demoUrl)
        if (extracted.length > 0) screenshots = extracted
      }

      template = {
        slug:        row.slug,
        name:        row.name,
        category:    row.industry?.name || row.category,
        price:       n.toLocaleString('vi-VN') + 'đ',
        image:       row.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop',
        badge:       row.salesCount >= 30 ? 'Bán chạy' : undefined,
        demoUrl:     row.demoUrl || undefined,
        hasWebsite:  row.hasWebsite,
        description: row.description || undefined,
        salesCount:  row.salesCount,
        screenshots,
      }
      if (row.hasWebsite && row.websitePrice) {
        websitePrice = Number(row.websitePrice)
      }
      if (row.customPrice) {
        customPrice = Number(row.customPrice)
      }
    }
  } catch {
    dbError = true
    template = mockTemplates.find(t => t.slug === slug)
  }

  if (!template) {
    if (dbError) {
      return (
        <div style={{ paddingTop: 62 }}>
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ maxWidth: 420 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
              <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>Đang kết nối cơ sở dữ liệu</h1>
              <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 24 }}>
                Hệ thống đang khởi động, vui lòng thử lại sau vài giây.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/templates" style={{ padding: '10px 22px', borderRadius: 9, border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 13, textDecoration: 'none' }}>
                  ← Quay lại
                </Link>
                <a href={`/templates/${slug}`} style={{ padding: '10px 22px', borderRadius: 9, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                  Thử lại
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }
    notFound()
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type':    'Product',
    name:       template.name,
    image:      template.image,
    url:        `${BASE}/templates/${template.slug}`,
    description: `Mẫu website ${template.category} Bootstrap 5, responsive 100%, không cần build, mở file là chạy.`,
    brand:      { '@type': 'Brand', name: 'webdrop.vn' },
    offers: {
      '@type':       'Offer',
      priceCurrency: 'VND',
      price:         template.price.replace(/[^\d]/g, ''),
      availability:  'https://schema.org/InStock',
      url:           `${BASE}/checkout?slug=${template.slug}`,
      seller:        { '@type': 'Organization', name: 'webdrop.vn' },
    },
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    <div style={{ paddingTop: 62 }}>
      <div style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--surface)' }}>
        <div className="wd-container" style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
            <Link href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Trang chủ</Link>
            <span>›</span>
            <Link href="/templates" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Thư viện mẫu</Link>
            <span>›</span>
            <span style={{ color: 'var(--text-2)' }}>{template.name}</span>
          </div>
          <Link href={`/checkout?slug=${template.slug}`} className="btn-primary-wd" style={{ fontSize: 12, padding: '7px 16px' }}>
            Đặt mua →
          </Link>
        </div>
      </div>

      <TemplateDetailClient template={template} websitePrice={websitePrice} customPrice={customPrice} />
    </div>
    </>
  )
}
