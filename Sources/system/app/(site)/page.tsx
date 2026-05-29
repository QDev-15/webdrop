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

async function getTemplates(): Promise<Template[]> {
  try {
    const rows = await prisma.template.findMany({
      where: { status: 'published' },
      include: { industry: { select: { name: true } } },
      orderBy: { salesCount: 'desc' },
    })
    return rows.map((t: { slug: any; name: any; industry: { name: any }; category: any; price: number | { toNumber(): number }; thumbnail: any; salesCount: number; createdAt: Date; demoUrl: any }) => ({
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
  const dbTemplates = await getTemplates()
  return (
    <>
      <RevealObserver />
      <HeroSlider />
      <HowItWorks />
      <TemplateGrid templates={dbTemplates.length > 0 ? dbTemplates : undefined} />
      <WhyUs />
      <PricingSection />
      <Reviews />

      {/* Clients strip */}
      <section className="py-5" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="wd-container">
          <p className="text-center reveal mb-4" style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Tin tưởng bởi các doanh nghiệp
          </p>
          <div className="d-flex gap-4 justify-content-center align-items-center flex-wrap reveal" style={{ opacity: .45, filter: 'grayscale(100%)' }}>
            {[
              'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=40&q=80&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=40&q=80&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=120&h=40&q=80&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1611532736573-418f2ab09c32?w=120&h=40&q=80&auto=format&fit=crop',
            ].map((src, i) => (
              <img key={i} src={src} alt="client" style={{ height: 28, objectFit: 'contain' }} loading="lazy" />
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
      <div className="zf">
        <div className="zf-tip">Chat Zalo ngay</div>
        <button className="zf-btn" aria-label="Chat Zalo">💬</button>
      </div>
    </>
  )
}
