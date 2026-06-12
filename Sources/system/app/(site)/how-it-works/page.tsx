import type { Metadata } from 'next'
export const metadata: Metadata = {
  title:      'Quy trình làm website tại webdrop.vn',
  description: 'Chỉ 4 bước đơn giản: Chọn mẫu → Thanh toán → Cung cấp nội dung → Nhận website hoàn chỉnh. Bàn giao trong 3–5 ngày làm việc.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_URL || 'https://webdrop.vn'}/how-it-works` },
}

import Link from 'next/link'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import { prisma } from '@/lib/prisma'

const FALLBACK_PACKAGES = [
  {
    id: 'goi-template',
    name: 'Gói Template',
    tagline: 'Mua file, tự cài đặt theo hướng dẫn',
    icon: '📦',
    price: 'Từ 199.000đ',
    hot: false,
    steps: [
      { sortOrder: 0, title: 'Chọn mẫu',             desc: 'Duyệt thư viện 30+ mẫu, xem demo live, chọn mẫu phù hợp ngành nghề.' },
      { sortOrder: 1, title: 'Thanh toán',            desc: 'Chuyển khoản — xác nhận trong 2 giờ làm việc.' },
      { sortOrder: 2, title: 'Nhận file ZIP',         desc: 'Download file HTML/CSS/JS + hướng dẫn chỉnh nội dung chi tiết.' },
      { sortOrder: 3, title: 'Tự chỉnh & triển khai', desc: 'Thay text, ảnh theo hướng dẫn. Upload lên bất kỳ hosting nào là chạy.' },
    ],
    suitable: ['Có kinh nghiệm kỹ thuật cơ bản', 'Muốn tự kiểm soát hoàn toàn', 'Ngân sách tối ưu'],
    ctaLabel: 'Xem thư viện mẫu',
    ctaHref: '/templates',
  },
  {
    id: 'goi-web-co-ban',
    name: 'Gói Web cơ bản',
    tagline: 'Website đầy đủ — deploy xong là chạy luôn',
    icon: '🌐',
    price: 'Từ 3.000.000đ',
    hot: true,
    steps: [
      { sortOrder: 0, title: 'Chọn mẫu & đặt hàng', desc: 'Chọn template từ thư viện, điền form brief ngắn (ngành, màu sắc, nội dung chính).' },
      { sortOrder: 1, title: 'Chúng tôi cài đặt',   desc: 'Setup hosting, domain, SSL. Điền nội dung theo brief. Thường hoàn thành trong 3–5 ngày.' },
      { sortOrder: 2, title: 'Duyệt & bàn giao',    desc: 'Review website, yêu cầu chỉnh sửa (tối đa 2 lần). Bàn giao quyền truy cập đầy đủ.' },
      { sortOrder: 3, title: 'Hỗ trợ 30 ngày',      desc: 'Hỗ trợ kỹ thuật miễn phí 30 ngày đầu qua Zalo. Sau đó có gói bảo trì tháng.' },
    ],
    suitable: ['Không rành kỹ thuật', 'Muốn website nhanh — 3 đến 5 ngày', 'Cần cài đặt trọn gói'],
    ctaLabel: 'Đặt hàng ngay',
    ctaHref: '/templates',
  },
  {
    id: 'goi-theo-yeu-cau',
    name: 'Gói Theo Yêu cầu',
    tagline: 'Thiết kế độc quyền từ đầu theo yêu cầu',
    icon: '✏️',
    price: 'Từ 20.000.000đ',
    hot: false,
    steps: [
      { sortOrder: 0, title: 'Trao đổi & brief',     desc: 'Cuộc gọi / Zalo 30 phút để hiểu rõ yêu cầu, ngành nghề, đối tượng khách hàng, ngân sách.' },
      { sortOrder: 1, title: 'Wireframe & ký scope', desc: 'Phác thảo cấu trúc trang, danh sách tính năng. Ký checklist scope tránh phát sinh.' },
      { sortOrder: 2, title: 'Design UI',            desc: 'Thiết kế giao diện trên Figma. Khách duyệt, chỉnh sửa đến khi ưng ý.' },
      { sortOrder: 3, title: 'Phát triển',           desc: 'Code frontend + backend theo thiết kế đã duyệt. Báo cáo tiến độ hàng tuần.' },
      { sortOrder: 4, title: 'Test & Deploy',        desc: 'Kiểm thử kỹ trên nhiều thiết bị. Deploy lên hosting, cấu hình domain, SSL.' },
      { sortOrder: 5, title: 'Bàn giao & hỗ trợ',   desc: 'Bàn giao source code (nếu chọn) hoặc bản build. Hỗ trợ 90 ngày sau bàn giao.' },
    ],
    suitable: ['Cần thiết kế riêng biệt', 'Có tính năng đặc thù theo nghiệp vụ', 'Dự án lớn, dài hạn'],
    ctaLabel: 'Liên hệ tư vấn',
    ctaHref: '/contact',
  },
]

export default async function HowItWorksPage() {
  let packages = FALLBACK_PACKAGES as typeof FALLBACK_PACKAGES

  try {
    const dbPackages = await prisma.howItWorksPackage.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
      include: { steps: { orderBy: { sortOrder: 'asc' } } },
    })
    if (dbPackages.length > 0) {
      packages = dbPackages.map(p => ({
        id: p.slug,
        name: p.name,
        tagline: p.tagline ?? '',
        icon: p.icon ?? '📦',
        price: p.price ?? '',
        hot: p.hot,
        steps: p.steps.map(s => ({ sortOrder: s.sortOrder, title: s.title, desc: s.desc ?? '' })),
        suitable: p.suitable,
        ctaLabel: p.ctaLabel ?? 'Tìm hiểu thêm',
        ctaHref: p.ctaHref ?? '/contact',
      }))
    }
  } catch {
    // DB unavailable — use fallback
  }

  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>

        {/* Hero */}
        <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,6vw,60px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Quy trình</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 14 }}>
              Từ ý tưởng đến <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>website thật</em>
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: 500, margin: '0 auto 28px' }}>
              {packages.length} gói dịch vụ — mỗi gói có quy trình rõ ràng, minh bạch từng bước.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {packages.map(p => (
                <a key={p.id} href={`#${p.id}`}
                  style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid rgba(255,255,255,.15)', fontSize: 13, color: 'rgba(255,255,255,.65)', textDecoration: 'none', transition: 'all .15s' }}>
                  {p.icon} {p.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        {packages.map((pkg, pi) => (
          <section key={pkg.id} id={pkg.id} className="sec-pad" style={{ background: pi % 2 === 1 ? 'var(--dark2)' : 'var(--bg)' }}>
            <div className="wd-container">

              {/* Package header */}
              <div className="reveal text-center mb-5">
                {pkg.hot && (
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, background: 'var(--accent)', color: '#fff', padding: '3px 12px', borderRadius: 20, marginBottom: 12, letterSpacing: '.5px' }}>
                    PHỔ BIẾN NHẤT
                  </span>
                )}
                <div style={{ fontSize: 36, marginBottom: 10 }}>{pkg.icon}</div>
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, color: pi % 2 === 1 ? '#fff' : 'var(--text)', letterSpacing: '-.6px', marginBottom: 8 }}>
                  {pkg.name}
                </h2>
                <p style={{ fontSize: 15, fontWeight: 300, color: pi % 2 === 1 ? 'rgba(255,255,255,.5)' : 'var(--text-2)', marginBottom: 4 }}>{pkg.tagline}</p>
                {pkg.price && <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{pkg.price}</div>}
              </div>

              {/* Steps */}
              <div className="row g-3 mb-5">
                {pkg.steps.map((s, si) => (
                  <div key={si} className="col-md-6 col-lg-4 reveal">
                    <div style={{
                      background: pi % 2 === 1 ? 'rgba(255,255,255,.05)' : 'var(--surface)',
                      border: `1px solid ${pi % 2 === 1 ? 'rgba(255,255,255,.1)' : 'var(--border)'}`,
                      borderRadius: 14, padding: '22px 20px', height: '100%',
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        {si + 1}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: pi % 2 === 1 ? '#fff' : 'var(--text)', marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 13, fontWeight: 300, color: pi % 2 === 1 ? 'rgba(255,255,255,.5)' : 'var(--text-2)', lineHeight: 1.7 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suitable for + CTA */}
              {(pkg.suitable.length > 0 || pkg.ctaLabel) && (
                <div className="reveal d-flex flex-column flex-md-row align-items-center justify-content-between gap-4"
                  style={{ background: pi % 2 === 1 ? 'rgba(255,255,255,.05)' : 'var(--warm)', borderRadius: 14, padding: '20px 24px' }}>
                  <div>
                    {pkg.suitable.length > 0 && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 500, color: pi % 2 === 1 ? 'rgba(255,255,255,.4)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>Phù hợp với</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {pkg.suitable.map(s => (
                            <span key={s} style={{ fontSize: 12.5, padding: '4px 12px', borderRadius: 20, background: pi % 2 === 1 ? 'rgba(255,255,255,.08)' : 'var(--surface)', border: `1px solid ${pi % 2 === 1 ? 'rgba(255,255,255,.12)' : 'var(--border)'}`, color: pi % 2 === 1 ? 'rgba(255,255,255,.7)' : 'var(--text-2)' }}>
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {pkg.ctaLabel && (
                    <Link href={pkg.ctaHref}
                      style={{ padding: '12px 28px', borderRadius: 9, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {pkg.ctaLabel} →
                    </Link>
                  )}
                </div>
              )}

            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <section className="sec-pad" style={{ background: 'var(--surface)', textAlign: 'center' }}>
          <div className="wd-container" style={{ maxWidth: 600 }}>
            <div className="reveal">
              <h2 className="sec-title">Vẫn chưa chắc chọn gói nào?</h2>
              <p className="sec-sub">Liên hệ để được tư vấn miễn phí — chúng tôi sẽ gợi ý gói phù hợp nhất với ngân sách và yêu cầu của bạn.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <Link href="/contact" style={{ padding: '13px 32px', borderRadius: 9, background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                  Tư vấn miễn phí →
                </Link>
                <Link href="/pricing" style={{ padding: '13px 28px', borderRadius: 9, border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 14, textDecoration: 'none' }}>
                  Xem bảng giá chi tiết
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}
