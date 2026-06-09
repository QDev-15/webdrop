export const revalidate = 60

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { templates as mockTemplates } from '@/data/templates'
import type { Template } from '@/data/templates'
import TemplateDetailClient from './TemplateDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const t = await prisma.template.findFirst({ where: { slug, status: 'published' }, select: { name: true } })
    if (t) return { title: `${t.name} — webdrop.vn` }
  } catch { /* fallback */ }
  const mock = mockTemplates.find(t => t.slug === slug)
  return { title: mock ? `${mock.name} — webdrop.vn` : 'Chi tiết template — webdrop.vn' }
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
  let dbError = false

  try {
    const [row, goiB] = await Promise.all([
      prisma.template.findFirst({
        where: { slug, status: 'published' },
        include: { industry: { select: { name: true } } },
      }),
      prisma.servicePackage.findFirst({ where: { code: 'GOI_B' }, select: { priceFrom: true } }),
    ])
    if (row) {
      const n = typeof row.price === 'number' ? row.price : (row.price as { toNumber(): number }).toNumber()
      template = {
        slug: row.slug,
        name: row.name,
        category: row.industry?.name || row.category,
        price: n.toLocaleString('vi-VN') + 'đ',
        image: row.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop',
        badge: row.salesCount >= 30 ? 'Bán chạy' : undefined,
        demoUrl: row.demoUrl || undefined,
        hasWebsite: row.hasWebsite,
      }
      if (row.hasWebsite && goiB?.priceFrom) {
        websitePrice = Number(goiB.priceFrom)
      }
    }
  } catch {
    dbError = true
    template = mockTemplates.find(t => t.slug === slug)
  }

  // DB lỗi và không có mock → hiện trang lỗi thân thiện thay vì blank
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

  return (
    <div style={{ paddingTop: 62 }}>
      {/* Breadcrumb — nằm trong page flow thay vì wd-nav bị NavBar che */}
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

      <TemplateDetailClient template={template} websitePrice={websitePrice} />
    </div>
  )
}
