export const revalidate = 60 // ISR

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'webdrop.store — Mẫu web đẹp, triển khai trọn gói',
  description: 'Hơn 30 mẫu thiết kế hiện đại cho mọi ngành nghề. Thanh toán xong — website hoàn chỉnh trong 3–5 ngày làm việc.',
}

import { Suspense } from 'react'
import HeroSlider from '@/components/site/HeroSlider'
import HowItWorks from '@/components/site/HowItWorks'
import TemplateShowcase, { type TemplateSection } from '@/components/site/TemplateShowcase'
import WhyUs from '@/components/site/WhyUs'
import PricingSection from '@/components/site/PricingSection'
import Reviews from '@/components/site/Reviews'
import CTASection from '@/components/site/CTASection'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// ── Helpers ───────────────────────────────────────────────────
function formatPrice(amount: number | { toNumber(): number }): string {
  const n = typeof amount === 'number' ? amount : amount.toNumber()
  return n.toLocaleString('vi-VN') + 'đ'
}
function toBadge(salesCount: number, createdAt: Date): string | undefined {
  const days = (Date.now() - new Date(createdAt).getTime()) / 86400000
  if (salesCount >= 30) return 'Bán chạy'
  if (days < 30) return 'Mới'
  return undefined
}
function parseJSON<T>(str: string | undefined, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) as T } catch { return fallback }
}

const HP_KEYS = [
  'social_zalo', 'site_phone',
  'hp_show_howitworks', 'hp_show_whyus', 'hp_show_pricing',
  'hp_show_reviews', 'hp_show_clients', 'hp_show_cta',
  'hp_show_banner', 'hp_show_templates',
  'hp_howitworks_eyebrow', 'hp_howitworks_title', 'hp_howitworks_title_em',
  'hp_howitworks_subtitle', 'hp_howitworks_image', 'hp_howitworks_steps',
  'hp_whyus_eyebrow', 'hp_whyus_title', 'hp_whyus_title_em',
  'hp_whyus_subtitle', 'hp_whyus_image', 'hp_whyus_caption', 'hp_whyus_caption_sub', 'hp_whyus_items',
  'hp_reviews_eyebrow', 'hp_reviews_title', 'hp_reviews_title_em',
  'hp_reviews_subtitle', 'hp_reviews_items',
  'hp_clients_title', 'hp_clients_items',
  'hp_cta_title', 'hp_cta_subtitle',
  'hp_cta_btn1_label', 'hp_cta_btn1_target',
  'hp_cta_btn2_label', 'hp_cta_btn2_target',
  'hp_banner_image', 'hp_banner_subtitle', 'hp_banner_title',
]

async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany({ where: { key: { in: HP_KEYS } } })
    return Object.fromEntries(rows.map(r => [r.key, r.value ?? '']))
  } catch { return {} }
}
async function getSlides() {
  try { return await prisma.heroSlide.findMany({ where: { status: 'published' }, orderBy: { sortOrder: 'asc' } }) }
  catch { return [] }
}
// Gom template theo ngành (industry) — "Shop bán hàng" luôn lên đầu (sản phẩm chủ đạo),
// các ngành còn lại xếp theo số lượng template giảm dần.
async function getTemplateSections(): Promise<TemplateSection[]> {
  try {
    const rows = await prisma.template.findMany({
      where: { status: 'published', category: 'web' },
      include: { industry: { select: { name: true, slug: true } } },
      orderBy: { salesCount: 'desc' },
    })

    type Row = typeof rows[number]
    const groups = new Map<string, { category: string; rows: Row[] }>()
    for (const t of rows) {
      const slug = t.industry?.slug || t.category
      const category = t.industry?.name || t.category
      const g = groups.get(slug)
      if (g) g.rows.push(t)
      else groups.set(slug, { category, rows: [t] })
    }

    const ordered = Array.from(groups.entries()).sort(([slugA, a], [slugB, b]) => {
      if (slugA === 'shop') return -1
      if (slugB === 'shop') return 1
      return b.rows.length - a.rows.length
    })

    return ordered.map(([, g]) => ({
      category: g.category,
      templates: g.rows.map(t => ({
        slug: t.slug,
        name: t.name,
        category: g.category,
        price: formatPrice(t.price as Parameters<typeof formatPrice>[0]),
        priceNum: Number(t.price),
        websitePriceNum: t.hasWebsite && t.websitePrice ? Number(t.websitePrice) : undefined,
        image: t.thumbnail || 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop',
        badge: toBadge(t.salesCount, t.createdAt),
        demoUrl: t.demoUrl || undefined,
        deployUrl: t.deployUrl || undefined,
        hasWebsite: t.hasWebsite,
      })),
    }))
  } catch { return [] }
}

// show helper — undefined / empty / "true" → show; "false" → hide
function show(v: string | undefined) { return v !== 'false' }

export default async function HomePage() {
  const [hp, dbSlides, templateSections] = await Promise.all([getSettings(), getSlides(), getTemplateSections()])

  const zalo = (hp['social_zalo'] || hp['site_phone'] || '').replace(/\s/g, '')

  // ── Section visibility ────────────────────────────────────
  const showHiw       = show(hp['hp_show_howitworks'])
  const showWhyUs     = show(hp['hp_show_whyus'])
  const showPricing   = show(hp['hp_show_pricing'])
  const showReviews   = show(hp['hp_show_reviews'])
  const showClients   = show(hp['hp_show_clients'])
  const showCta       = show(hp['hp_show_cta'])
  const showBanner    = show(hp['hp_show_banner'])
  const showTemplates = show(hp['hp_show_templates'])

  // ── Parse data ───────────────────────────────────────────
  type Step    = { num: string; title: string; desc: string }
  type WhyItem = { num: string; icon: string; title: string; desc: string }
  type Review  = { text: string; name: string; role: string; avatar: string }
  type Client  = { name: string; icon: string }

  const hiwSteps   = parseJSON<Step[]>   (hp['hp_howitworks_steps'], [])
  const whyItems   = parseJSON<WhyItem[]>(hp['hp_whyus_items'],      [])
  const reviewItems = parseJSON<Review[]>(hp['hp_reviews_items'],     [])
  const clientItems = parseJSON<Client[]>(hp['hp_clients_items'],     [])

  const hiwData = {
    eyebrow:  hp['hp_howitworks_eyebrow']  || 'Quy trình',
    title:    hp['hp_howitworks_title']    || 'Đơn giản từ',
    titleEm:  hp['hp_howitworks_title_em'] || 'đầu đến cuối',
    subtitle: hp['hp_howitworks_subtitle'] || 'Bạn chỉ cần cung cấp nội dung. Chúng tôi lo toàn bộ phần kỹ thuật còn lại.',
    image:    hp['hp_howitworks_image']    || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format&fit=crop',
    steps:    hiwSteps,
  }
  const whyData = {
    eyebrow:    hp['hp_whyus_eyebrow']     || 'Tại sao chọn chúng tôi',
    title:      hp['hp_whyus_title']       || 'Không cần biết',
    titleEm:    hp['hp_whyus_title_em']    || 'kỹ thuật',
    subtitle:   hp['hp_whyus_subtitle']    || 'Chúng tôi lo toàn bộ. Bạn chỉ cần cung cấp nội dung và nhận website.',
    image:      hp['hp_whyus_image']       || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop',
    caption:    hp['hp_whyus_caption']     || 'Đội ngũ chuyên nghiệp, tận tâm',
    captionSub: hp['hp_whyus_caption_sub'] || 'Hỗ trợ trực tiếp qua Zalo — không chatbot',
    items:      whyItems,
  }
  const reviewData = {
    eyebrow:  hp['hp_reviews_eyebrow']   || 'Khách hàng nói gì',
    title:    hp['hp_reviews_title']     || '127 khách hàng',
    titleEm:  hp['hp_reviews_title_em']  || 'đã tin tưởng',
    subtitle: hp['hp_reviews_subtitle']  || 'Không phải lời quảng cáo — đây là trải nghiệm thật từ khách hàng thật.',
    items:    reviewItems,
  }
  const ctaData = {
    title:      hp['hp_cta_title']       || 'Sẵn sàng có website đẹp?',
    subtitle:   hp['hp_cta_subtitle']    || 'Bắt đầu ngay hôm nay. Bàn giao trong 3–5 ngày làm việc.',
    btn1Label:  hp['hp_cta_btn1_label']  || 'Xem mẫu thiết kế →',
    btn1Target: hp['hp_cta_btn1_target'] || 'templates',
    btn2Label:  hp['hp_cta_btn2_label']  || 'Tư vấn miễn phí',
    btn2Target: hp['hp_cta_btn2_target'] || 'pricing',
  }
  const bannerData = {
    image:    hp['hp_banner_image']    || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop',
    subtitle: hp['hp_banner_subtitle'] || 'READY TO START?',
    title:    hp['hp_banner_title']    || 'Website đẹp, bàn giao trong 3–5 ngày',
  }
  const clientsData = {
    title: hp['hp_clients_title'] || 'Tin tưởng bởi các doanh nghiệp',
    items: clientItems,
  }

  return (
    <>
      <RevealObserver />
      <HeroSlider slides={dbSlides} />

      {showHiw      && <HowItWorks {...hiwData} />}
      {showTemplates && <Suspense><TemplateShowcase sections={templateSections} /></Suspense>}
      {showWhyUs    && <WhyUs {...whyData} />}
      {showPricing  && <PricingSection />}
      {showReviews  && <Reviews {...reviewData} />}

      {/* Clients strip */}
      {showClients && (
        <section className="py-5" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          <div className="wd-container">
            <p className="text-center reveal mb-4" style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              {clientsData.title}
            </p>
            <div className="d-flex gap-3 justify-content-center align-items-center flex-wrap reveal">
              {(clientsData.items.length > 0
                ? clientsData.items
                : [{ name: 'Spa Lavender', icon: '💆' }, { name: 'Nhà hàng Phú Quý', icon: '🍜' }, { name: 'Beauty Studio', icon: '💄' }, { name: 'Coffee House', icon: '☕' }, { name: 'Luật Minh Tâm', icon: '⚖️' }, { name: 'Kiến trúc ARC', icon: '🏛️' }]
              ).map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--warm)', fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>
                  <span style={{ fontSize: 16 }}>{c.icon}</span>{c.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer image banner */}
      {showBanner && (
        <div style={{ height: 280, position: 'relative', overflow: 'hidden' }}>
          <img src={bannerData.image} alt="Banner" className="w-100 h-100 object-fit-cover d-block" loading="lazy" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(26,107,82,.08) 0%,rgba(12,11,9,.85) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', letterSpacing: '.4px' }}>{bannerData.subtitle}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: '-.5px', marginTop: 6 }}>{bannerData.title}</div>
          </div>
        </div>
      )}

      {showCta && <CTASection {...ctaData} />}
      <Footer />

      {zalo && (
        <div className="zf">
          <div className="zf-tip">Chat Zalo ngay</div>
          <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" className="zf-btn" aria-label="Chat Zalo">💬</a>
        </div>
      )}
    </>
  )
}
