export const revalidate = 60

import { prisma } from '@/lib/prisma'
import { templates as mockTemplates } from '@/data/templates'
import type { Template } from '@/data/templates'
import TemplateGrid from '@/components/site/TemplateGrid'
import NavBar from '@/components/site/NavBar'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'

function fmtPrice(amount: unknown): string {
  const n = typeof amount === 'number' ? amount : (amount as { toNumber(): number }).toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}

async function getTemplates(): Promise<Template[]> {
  try {
    const rows = await prisma.template.findMany({
      where: { status: 'published' },
      include: { industry: { select: { name: true } } },
      orderBy: { salesCount: 'desc' },
    })
    return rows.map(t => ({
      slug: t.slug,
      name: t.name,
      category: t.industry?.name || t.category,
      price: fmtPrice(t.price),
      image: t.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80',
      badge: t.salesCount >= 30 ? 'Bán chạy' : undefined,
      demoUrl: t.demoUrl || undefined,
    }))
  } catch {
    return mockTemplates
  }
}

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <>
      <RevealObserver />
      <NavBar />
      <div style={{ paddingTop: 62 }}>
        <div style={{ background: 'var(--dark2)', padding: 'clamp(48px,8vw,80px) 0 clamp(36px,6vw,56px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Thư viện mẫu</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.1 }}>
              {templates.length}+ mẫu website <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>chuyên nghiệp</em>
            </h1>
            <p style={{ fontSize: 'clamp(14px,1.4vw,16px)', fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: 520, margin: '0 auto' }}>
              Responsive hoàn toàn, Bootstrap 5.3, không cần build — mở file là chạy.
            </p>
          </div>
        </div>
        <TemplateGrid templates={templates.length > 0 ? templates : undefined} />
      </div>
      <Footer />
    </>
  )
}
