export const revalidate = 60 // ISR: refresh cache sau mỗi 60 giây

import HeroSlider from '@/components/site/HeroSlider'
import HowItWorks from '@/components/site/HowItWorks'
import TemplateGrid from '@/components/site/TemplateGrid'
import WhyUs from '@/components/site/WhyUs'
import PricingSection from '@/components/site/PricingSection'
import Reviews from '@/components/site/Reviews'
import CTASection from '@/components/site/CTASection'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import { prisma } from '@/lib/prisma'
import type { Template } from '@/data/templates'

function formatPrice(amount: number | { toNumber(): number }): string {
  const n = typeof amount === 'number' ? amount : amount.toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}

function toBadge(salesCount: number, createdAt: Date): string | undefined {
  const daysSince = (Date.now() - new Date(createdAt).getTime()) / 86400000
  if (salesCount >= 30) return 'Bán chạy'
  if (daysSince < 30) return 'Mới'
  return undefined
}

async function getZaloPhone(): Promise<string> {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['social_zalo', 'site_phone'] } },
    })
    const map = Object.fromEntries(rows.map(r => [r.key, r.value ?? '']))
    return (map['social_zalo'] || map['site_phone'] || '').replace(/\s/g, '')
  } catch {
    return ''
  }
}

async function getSlides() {
  try {
    return await prisma.heroSlide.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
    })
  } catch {
    return []
  }
}

async function getTemplates(): Promise<Template[]> {
  try {
    const rows = await prisma.template.findMany({
      where: { status: 'published' },
      include: { industry: { select: { name: true } } },
      orderBy: { salesCount: 'desc' },
    })
    return rows.map((t) => ({
      slug: t.slug,
      name: t.name,
      category: t.industry?.name || t.category,
      price: formatPrice(t.price as Parameters<typeof formatPrice>[0]),
      image: t.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop',
      badge: toBadge(t.salesCount, t.createdAt),
      demoUrl: t.demoUrl || undefined,
    }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [dbTemplates, dbSlides, zaloPhone] = await Promise.all([getTemplates(), getSlides(), getZaloPhone()])
  return (
    <>
      <RevealObserver />
      <HeroSlider slides={dbSlides} />
      <HowItWorks />
      <TemplateGrid templates={dbTemplates.length > 0 ? dbTemplates : undefined} homepage />
      <WhyUs />
      <PricingSection />
      <Reviews />

      {/* Clients strip */}
      <section className="py-5" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="wd-container">
          <p className="text-center reveal mb-4" style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Tin tưởng bởi các doanh nghiệp
          </p>
          <div className="d-flex gap-3 justify-content-center align-items-center flex-wrap reveal">
            {[
              { name: 'Spa Lavender',      icon: '💆' },
              { name: 'Nhà hàng Phú Quý', icon: '🍜' },
              { name: 'Beauty Studio',     icon: '💄' },
              { name: 'Coffee House',      icon: '☕' },
              { name: 'Luật Minh Tâm',    icon: '⚖️' },
              { name: 'Kiến trúc ARC',    icon: '🏛️' },
            ].map(c => (
              <div key={c.name} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 16px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--warm)',
                fontSize: 13, fontWeight: 500, color: 'var(--text-2)',
              }}>
                <span style={{ fontSize: 16 }}>{c.icon}</span>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer image banner */}
      <div style={{ height: 280, position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop"
          alt="Office workspace" className="w-100 h-100 object-fit-cover d-block" loading="lazy"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(26,107,82,.08) 0%,rgba(12,11,9,.85) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', letterSpacing: '.4px' }}>READY TO START?</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: '-.5px', marginTop: 6 }}>Website đẹp, bàn giao trong 3–5 ngày</div>
        </div>
      </div>

      <CTASection />
      <Footer />

      {/* Zalo float */}
      {zaloPhone && (
        <div className="zf">
          <div className="zf-tip">Chat Zalo ngay</div>
          <a href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noopener noreferrer" className="zf-btn" aria-label="Chat Zalo">💬</a>
        </div>
      )}
    </>
  )
}
