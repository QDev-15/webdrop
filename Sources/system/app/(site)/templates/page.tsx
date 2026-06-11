export const revalidate = 60

import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Thư viện mẫu website — webdrop.vn' }

import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { templates as mockTemplates } from '@/data/templates'
import type { Template } from '@/data/templates'
import TemplateGrid from '@/components/site/TemplateGrid'
import NavBar from '@/components/site/NavBar'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'

type PageType = 'starter' | 'standard' | undefined

function fmtPrice(amount: unknown): string {
  const n = typeof amount === 'number' ? amount : (amount as { toNumber(): number }).toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}

async function getTemplates(type: PageType): Promise<Template[]> {
  try {
    const where: Record<string, unknown> = { status: 'published' }
    if (type === 'starter')  where.hasWebsite = false
    if (type === 'standard') where.hasWebsite = true

    const rows = await prisma.template.findMany({
      where,
      include: { industry: { select: { name: true } } },
      orderBy: { salesCount: 'desc' },
    })
    return rows.map(t => ({
      slug:       t.slug,
      name:       t.name,
      category:   t.industry?.name || t.category,
      price:      fmtPrice(t.price),
      image:      t.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80',
      badge:      t.salesCount >= 30 ? 'Bán chạy' : undefined,
      demoUrl:    t.demoUrl || undefined,
      hasWebsite: t.hasWebsite,
    }))
  } catch {
    return mockTemplates
  }
}

const TYPE_META: Record<NonNullable<PageType>, { label: string; desc: string; badge: string; badgeBg: string }> = {
  starter: {
    label:   'Gói Template',
    desc:    'File HTML/CSS/Bootstrap — tự cài đặt theo hướng dẫn, không cần server.',
    badge:   '📦 Chỉ file template',
    badgeBg: 'var(--accent-light)',
  },
  standard: {
    label:   'Gói Web cơ bản',
    desc:    'Website đầy đủ React + PHP + Admin — chúng tôi setup trọn gói trong 3–5 ngày.',
    badge:   '🌐 Web + Admin panel',
    badgeBg: '#eff6ff',
  },
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type: rawType } = await searchParams
  const type: PageType = rawType === 'starter' || rawType === 'standard' ? rawType : undefined

  const templates = await getTemplates(type)
  const meta = type ? TYPE_META[type] : null

  return (
    <>
      <RevealObserver />
      <NavBar />
      <div style={{ paddingTop: 62 }}>

        {/* Hero */}
        <div style={{ background: 'var(--dark2)', padding: 'clamp(48px,8vw,80px) 0 clamp(36px,6vw,56px)', textAlign: 'center' }}>
          <div className="wd-container">
            {meta && (
              <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, background: meta.badgeBg, color: 'var(--accent)', padding: '4px 14px', borderRadius: 20, marginBottom: 14, letterSpacing: '.3px' }}>
                {meta.badge}
              </span>
            )}
            {!meta && (
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Thư viện mẫu</div>
            )}
            <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.1 }}>
              {meta
                ? <>{meta.label} — <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>{templates.length} mẫu</em></>
                : <>{templates.length}+ mẫu website <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>chuyên nghiệp</em></>
              }
            </h1>
            <p style={{ fontSize: 'clamp(14px,1.4vw,16px)', fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: 520, margin: '0 auto' }}>
              {meta ? meta.desc : 'Responsive hoàn toàn, Bootstrap 5.3, không cần build — mở file là chạy.'}
            </p>
          </div>
        </div>

        <Suspense>
          <TemplateGrid templates={templates.length > 0 ? templates : undefined} pageType={type} />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
