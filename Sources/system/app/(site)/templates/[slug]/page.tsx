export const revalidate = 60

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { templates as mockTemplates } from '@/data/templates'
import type { Template } from '@/data/templates'
import TemplateDetailClient from './TemplateDetailClient'

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'


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
    title: `${name} — webdrop.store`,
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

      template = {
        slug:        row.slug,
        name:        row.name,
        category:    row.industry?.name || row.category,
        price:       n.toLocaleString('vi-VN') + 'đ',
        image:       row.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop',
        badge:       row.salesCount >= 30 ? 'Bán chạy' : undefined,
        demoUrl:     row.demoUrl || undefined,
        deployUrl:   row.deployUrl || undefined,
        hasWebsite:  row.hasWebsite,
        description: row.description || undefined,
        salesCount:  row.salesCount,
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
    brand:      { '@type': 'Brand', name: 'webdrop.store' },
    offers: {
      '@type':       'Offer',
      priceCurrency: 'VND',
      price:         template.price.replace(/[^\d]/g, ''),
      availability:  'https://schema.org/InStock',
      url:           `${BASE}/checkout?slug=${template.slug}`,
      seller:        { '@type': 'Organization', name: 'webdrop.store' },
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
