import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { templates as mockTemplates } from '@/data/templates'
import type { Template } from '@/data/templates'
import TemplateDetailClient from './TemplateDetailClient'

export async function generateStaticParams() {
  try {
    const rows = await prisma.template.findMany({ where: { status: 'published' }, select: { slug: true } })
    return rows.map((t: { slug: any }) => ({ slug: t.slug }))
  } catch {
    return mockTemplates.map(t => ({ slug: t.slug }))
  }
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let template: Template | undefined
  try {
    const row = await prisma.template.findUnique({
      where: { slug, status: 'published' },
      include: { industry: { select: { name: true } } },
    })
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
      }
    }
  } catch {
    template = mockTemplates.find(t => t.slug === slug)
  }

  if (!template) notFound()

  return (
    <>
      <nav className="wd-nav">
        <div className="wd-container nav-inner">
          <Link href="/" className="logo">web<span>drop</span>.vn</Link>
          <div className="breadcrumb-wd d-none d-md-flex">
            <Link href="/">Trang chủ</Link>
            <span className="bc-sep">›</span>
            <Link href="/#templates">Mẫu thiết kế</Link>
            <span className="bc-sep">›</span>
            <span style={{ color: 'var(--text)' }}>{template.name}</span>
          </div>
          <Link href={`/checkout?slug=${template.slug}`} className="btn-primary-wd">Đặt mua →</Link>
        </div>
      </nav>
      <TemplateDetailClient template={template} />
    </>
  )
}
