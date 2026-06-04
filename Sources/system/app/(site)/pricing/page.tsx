import Link from 'next/link'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Bảng giá — webdrop.vn' }

// ── Fallback data ─────────────────────────────────────────────
const FALLBACK_GROUPS = [
  {
    id: 1, slug: 'goi-template', eyebrow: 'Gói Template',
    title: 'Template', titleEm: 'thuần HTML/CSS',
    subtitle: 'Mở thẳng trên trình duyệt, không cần build, không cần server. Bàn giao file ZIP + demo live.',
    footnote: 'Bundle 5 template: Tiết kiệm 30–40% so với mua lẻ',
    bg: 'light' as const, type: 'cards' as const,
    description: '', tags: [], ctaLabel: '', ctaHref: '', status: 'published',
    plans: [
      { id: 1, name: 'Template 1 trang', price: '199.000 – 499.000đ', features: ['File HTML/CSS/JS nguồn', 'Responsive mobile-first', 'Hướng dẫn chỉnh nội dung', 'Bootstrap 5.3'], hot: false, ctaLabel: 'Xem mẫu', ctaHref: '/templates', sortOrder: 0 },
      { id: 2, name: 'Template multi-page', price: '499.000 – 999.000đ', features: ['4–6 trang HTML', 'Responsive hoàn toàn', 'Demo live link', 'Hướng dẫn chi tiết'], hot: true, ctaLabel: 'Xem mẫu', ctaHref: '/templates', sortOrder: 1 },
      { id: 3, name: 'Admin Template', price: '699.000 – 1.499.000đ', features: ['Dashboard + CRUD pages', 'Mobile responsive sidebar', 'Dark sidebar design', 'Bootstrap 5.3'], hot: false, ctaLabel: 'Xem mẫu', ctaHref: '/templates', sortOrder: 2 },
    ],
  },
  {
    id: 2, slug: 'goi-web-co-ban', eyebrow: 'Gói Web cơ bản',
    title: 'Website', titleEm: 'chuẩn, deploy nhanh',
    subtitle: 'React SPA + PHP + SQLite. Upload lên hosting là chạy. Không cần config gì thêm.',
    footnote: 'Cài đặt hosting + domain: +500.000 – 1.000.000đ (tính riêng 1 lần)',
    bg: 'warm' as const, type: 'cards' as const,
    description: '', tags: [], ctaLabel: '', ctaHref: '', status: 'published',
    plans: [
      { id: 4, name: 'Basic', price: '3.000.000 – 5.000.000đ', features: ['Landing 1 trang', 'Form liên hệ', 'Admin xem form', 'Hosting PHP + SQLite'], hot: false, ctaLabel: 'Đặt hàng ngay', ctaHref: '/checkout', sortOrder: 0 },
      { id: 5, name: 'Standard', price: '7.000.000 – 12.000.000đ', features: ['5–7 trang', 'Blog/tin tức', 'Admin quản lý nội dung', 'SEO cơ bản'], hot: true, ctaLabel: 'Đặt hàng ngay', ctaHref: '/checkout', sortOrder: 1 },
      { id: 6, name: 'Pro', price: '15.000.000 – 22.000.000đ', features: ['10+ trang', 'Đa ngôn ngữ', 'Admin đầy đủ', 'SEO nâng cao + Analytics'], hot: false, ctaLabel: 'Đặt hàng ngay', ctaHref: '/checkout', sortOrder: 2 },
    ],
  },
  {
    id: 3, slug: 'goi-theo-yeu-cau', eyebrow: 'Gói Theo Yêu cầu',
    title: 'Website + Admin', titleEm: 'full custom',
    subtitle: '', footnote: '',
    bg: 'light' as const, type: 'banner' as const,
    description: 'Thiết kế theo yêu cầu, 2 phase rõ ràng. Từ 20.000.000đ tùy scope.',
    tags: ['Wireframe → Design', 'Duyệt rồi mới dev', 'Bàn giao source code', 'Bảo trì tháng'],
    ctaLabel: 'Liên hệ tư vấn →', ctaHref: '/contact', status: 'published',
    plans: [],
  },
]

const FALLBACK_FAQS = [
  { id: 1, question: 'Cài đặt hosting tính riêng không?', answer: 'Có, cài đặt hosting + domain tính phí dịch vụ riêng 500.000 – 1.000.000đ/lần.', sortOrder: 0 },
  { id: 2, question: 'Giá có bao gồm hosting hàng năm không?', answer: 'Không. Giá trên chỉ là phí thiết kế/bàn giao. Hosting và domain là chi phí hàng năm bạn tự trả với nhà cung cấp.', sortOrder: 1 },
  { id: 3, question: 'Có thể mua source code Gói Theo Yêu cầu không?', answer: 'Có. Source code tính thêm 20–30% giá trị dự án.', sortOrder: 2 },
  { id: 4, question: 'Bảo hành bao lâu?', answer: 'Hỗ trợ sửa lỗi miễn phí trong 30 ngày sau bàn giao. Sau đó có gói bảo trì hàng tháng từ 1.000.000đ.', sortOrder: 3 },
]

const BG_MAP: Record<string, string> = {
  light: 'var(--bg)',
  warm:  'var(--warm)',
  dark:  'var(--dark2)',
}

function PricingCard({ name, price, features, hot, ctaLabel, ctaHref }: {
  name: string; price: string; features: string[]; hot: boolean; ctaLabel: string; ctaHref: string
}) {
  return (
    <div style={{
      background: hot ? 'linear-gradient(160deg, var(--accent-light) 0%, #fff 55%)' : 'var(--surface)',
      border: `1.5px solid ${hot ? 'var(--accent-mid)' : 'var(--border)'}`,
      borderRadius: 14, padding: '28px 24px', position: 'relative', height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {hot && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>Phổ biến nhất</div>}
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{name}</div>
      <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, marginBottom: 20 }}>{price}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', gap: 9, fontSize: 13, color: 'var(--text-2)' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, fontWeight: 600 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <Link href={ctaHref || '/templates'} style={{ display: 'block', padding: '11px', background: hot ? 'var(--accent)' : 'transparent', color: hot ? '#fff' : 'var(--accent)', border: '1.5px solid var(--accent)', borderRadius: 9, textAlign: 'center', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
        {ctaLabel || 'Xem mẫu'}
      </Link>
    </div>
  )
}

export default async function PricingPage() {
  let groups = FALLBACK_GROUPS as typeof FALLBACK_GROUPS
  let faqs = FALLBACK_FAQS as typeof FALLBACK_FAQS

  try {
    const [dbGroups, dbFaqs] = await Promise.all([
      prisma.pricingGroup.findMany({
        where: { status: 'published' },
        orderBy: { sortOrder: 'asc' },
        include: { plans: { orderBy: { sortOrder: 'asc' } } },
      }),
      prisma.pricingFaq.findMany({
        where: { status: 'published' },
        orderBy: { sortOrder: 'asc' },
      }),
    ])
    if (dbGroups.length > 0) groups = dbGroups as unknown as typeof FALLBACK_GROUPS
    if (dbFaqs.length > 0) faqs = dbFaqs as unknown as typeof FALLBACK_FAQS
  } catch {
    // DB unavailable — use fallback
  }

  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>

        {/* Hero */}
        <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,5vw,60px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Bảng giá</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
              Giá <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>minh bạch</em>, không ẩn phí
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.4)', maxWidth: 480, margin: '0 auto' }}>
              {groups.length} nhóm sản phẩm với mức giá phù hợp mọi nhu cầu và ngân sách.
            </p>
          </div>
        </section>

        {/* Groups */}
        {groups.map(g => (
          <section key={g.id} id={g.slug} className="sec-pad" style={{ background: BG_MAP[g.bg] ?? 'var(--bg)' }}>
            <div className="wd-container">

              {g.type === 'banner' ? (
                /* ── Banner layout ── */
                <div className="reveal" style={{ background: 'var(--dark2)', borderRadius: 20, padding: 'clamp(32px,5vw,56px)', display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {g.eyebrow && <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>{g.eyebrow}</div>}
                    <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 600, color: '#fff', letterSpacing: '-.5px', marginBottom: 12 }}>
                      {g.title}{g.titleEm && <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}> {g.titleEm}</em>}
                    </h2>
                    {g.description && <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: 420, lineHeight: 1.75, marginBottom: 20 }}>{g.description}</p>}
                    {g.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {g.tags.map(t => (
                          <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.15)', padding: '4px 12px', borderRadius: 20 }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {g.ctaLabel && (
                    <Link href={g.ctaHref || '/contact'} style={{ padding: '14px 32px', background: '#fff', color: 'var(--dark)', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {g.ctaLabel}
                    </Link>
                  )}
                </div>
              ) : (
                /* ── Cards layout ── */
                <>
                  <div className="text-center reveal mb-5">
                    {g.eyebrow && <div className="eyebrow">{g.eyebrow}</div>}
                    <h2 className="sec-title">
                      {g.title}{g.titleEm && <em> {g.titleEm}</em>}
                    </h2>
                    {g.subtitle && <p className="sec-sub">{g.subtitle}</p>}
                  </div>
                  <div className="row g-3">
                    {g.plans.map((p, i) => (
                      <div key={p.id} className="col-md-4">
                        <div className={`reveal reveal-d${Math.min(i + 1, 3)}`} style={{ height: '100%' }}>
                          <PricingCard
                            name={p.name} price={p.price} features={p.features}
                            hot={p.hot} ctaLabel={p.ctaLabel ?? ''} ctaHref={p.ctaHref ?? ''}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {g.footnote && (
                    <p className="text-center reveal" style={{ marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
                      {g.footnote}
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        ))}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section id="faq" className="sec-pad" style={{ background: 'var(--warm)' }}>
            <div className="wd-container" style={{ maxWidth: 720 }}>
              <div className="text-center reveal mb-5">
                <div className="eyebrow">Câu hỏi thường gặp</div>
                <h2 className="sec-title">Giải đáp <em>thắc mắc</em></h2>
              </div>
              <div className="reveal">
                {faqs.map(f => (
                  <div key={f.id} style={{ borderBottom: '1px solid var(--border-light)', padding: '16px 0' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.question}</div>
                    <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75 }}>{f.answer}</p>
                  </div>
                ))}
              </div>
              <div className="text-center reveal" style={{ marginTop: 36 }}>
                <Link href="/contact" style={{ padding: '12px 28px', background: 'var(--accent)', color: '#fff', borderRadius: 9, fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                  Còn thắc mắc? Liên hệ ngay →
                </Link>
              </div>
            </div>
          </section>
        )}

      </div>
      <Footer />
    </>
  )
}
