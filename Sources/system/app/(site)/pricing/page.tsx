import Link from 'next/link'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'

export const metadata = { title: 'Bảng giá — webdrop.vn' }

const goiA = [
  { name: 'Template 1 trang', price: '199.000 – 499.000đ', features: ['File HTML/CSS/JS nguồn', 'Responsive mobile-first', 'Hướng dẫn chỉnh nội dung', 'Bootstrap 5.3'] },
  { name: 'Template multi-page', price: '499.000 – 999.000đ', features: ['4–6 trang HTML', 'Responsive hoàn toàn', 'Demo live link', 'Hướng dẫn chi tiết'], hot: true },
  { name: 'Admin Template', price: '699.000 – 1.499.000đ', features: ['Dashboard + CRUD pages', 'Mobile responsive sidebar', 'Dark sidebar design', 'Bootstrap 5.3'] },
]

const goiB = [
  { name: 'Basic', price: '3.000.000 – 5.000.000đ', features: ['Landing 1 trang', 'Form liên hệ', 'Admin xem form', 'Hosting PHP + SQLite'] },
  { name: 'Standard', price: '7.000.000 – 12.000.000đ', features: ['5–7 trang', 'Blog/tin tức', 'Admin quản lý nội dung', 'SEO cơ bản'], hot: true },
  { name: 'Pro', price: '15.000.000 – 22.000.000đ', features: ['10+ trang', 'Đa ngôn ngữ', 'Admin đầy đủ', 'SEO nâng cao + Analytics'] },
]

const faqs = [
  { q: 'Cài đặt hosting tính riêng không?', a: 'Có, cài đặt hosting + domain tính phí dịch vụ riêng 500.000 – 1.000.000đ/lần.' },
  { q: 'Giá có bao gồm hosting hàng năm không?', a: 'Không. Giá trên chỉ là phí thiết kế/bàn giao. Hosting và domain là chi phí hàng năm bạn tự trả với nhà cung cấp.' },
  { q: 'Có thể mua source code Gói Theo Yêu cầu không?', a: 'Có. Source code tính thêm 20–30% giá trị dự án.' },
  { q: 'Bảo hành bao lâu?', a: 'Hỗ trợ sửa lỗi miễn phí trong 30 ngày sau bàn giao. Sau đó có gói bảo trì hàng tháng từ 1.000.000đ.' },
]

function PricingCard({ name, price, features, hot, cta, ctaHref }: {
  name: string; price: string; features: string[]; hot?: boolean; cta: string; ctaHref: string
}) {
  return (
    <div style={{
      background: hot ? 'linear-gradient(160deg, var(--accent-light) 0%, #fff 55%)' : 'var(--surface)',
      border: `1.5px solid ${hot ? 'var(--accent-mid)' : 'var(--border)'}`,
      borderRadius: 14, padding: '28px 24px', position: 'relative', height: '100%',
      transition: 'box-shadow .2s, transform .2s',
    }}>
      {hot && <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>Phổ biến nhất</div>}
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{name}</div>
      <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, marginBottom: 20 }}>{price}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', gap: 9, fontSize: 13, color: 'var(--text-2)' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, fontWeight: 600 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <Link href={ctaHref} style={{ display: 'block', padding: '11px', background: hot ? 'var(--accent)' : 'transparent', color: hot ? '#fff' : 'var(--accent)', border: `1.5px solid var(--accent)`, borderRadius: 9, textAlign: 'center', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'all .2s' }}>
        {cta}
      </Link>
    </div>
  )
}

export default function PricingPage() {
  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62 }}>
        <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,5vw,60px)', textAlign: 'center' }}>
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Bảng giá</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
              Giá <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>minh bạch</em>, không ẩn phí
            </h1>
            <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.4)', maxWidth: 480, margin: '0 auto' }}>
              3 nhóm sản phẩm với mức giá phù hợp mọi nhu cầu và ngân sách.
            </p>
          </div>
        </section>

        {/* Gói Template */}
        <section id="goi-template" className="sec-pad">
          <div className="wd-container">
            <div className="text-center reveal mb-5">
              <div className="eyebrow">Gói Template</div>
              <h2 className="sec-title">Template <em>thuần HTML/CSS</em></h2>
              <p className="sec-sub">Mở thẳng trên trình duyệt, không cần build, không cần server. Bàn giao file ZIP + demo live.</p>
            </div>
            <div className="row g-3">
              {goiA.map((p, i) => (
                <div key={p.name} className="col-md-4">
                  <div className={`reveal reveal-d${i + 1}`} style={{ height: '100%' }}>
                    <PricingCard {...p} cta="Xem mẫu" ctaHref="/templates" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center reveal" style={{ marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
              Bundle 5 template: Tiết kiệm 30–40% so với mua lẻ
            </p>
          </div>
        </section>

        {/* Gói Web cơ bản */}
        <section id="goi-web-co-ban" className="sec-pad" style={{ background: 'var(--warm)' }}>
          <div className="wd-container">
            <div className="text-center reveal mb-5">
              <div className="eyebrow">Gói Web cơ bản</div>
              <h2 className="sec-title">Website <em>chuẩn, deploy nhanh</em></h2>
              <p className="sec-sub">React SPA + PHP + SQLite. Upload lên hosting là chạy. Không cần config gì thêm.</p>
            </div>
            <div className="row g-3">
              {goiB.map((p, i) => (
                <div key={p.name} className="col-md-4">
                  <div className={`reveal reveal-d${i + 1}`} style={{ height: '100%' }}>
                    <PricingCard {...p} cta="Đặt hàng ngay" ctaHref="/checkout" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center reveal" style={{ marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
              Cài đặt hosting + domain: +500.000 – 1.000.000đ (tính riêng 1 lần)
            </p>
          </div>
        </section>

        {/* Gói Theo Yêu cầu */}
        <section id="goi-theo-yeu-cau" className="sec-pad">
          <div className="wd-container">
            <div className="reveal" style={{ background: 'var(--dark2)', borderRadius: 20, padding: 'clamp(32px,5vw,56px)', display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>Gói Theo Yêu cầu</div>
                <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 600, color: '#fff', letterSpacing: '-.5px', marginBottom: 12 }}>
                  Website + Admin <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>full custom</em>
                </h2>
                <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,.45)', maxWidth: 420, lineHeight: 1.75, marginBottom: 20 }}>
                  Thiết kế theo yêu cầu, 2 phase rõ ràng. Từ 20.000.000đ tùy scope.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Wireframe → Design', 'Duyệt rồi mới dev', 'Bàn giao source code', 'Bảo trì tháng'].map(t => (
                    <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.15)', padding: '4px 12px', borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
              </div>
              <Link href="/contact" style={{ padding: '14px 32px', background: '#fff', color: 'var(--dark)', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Liên hệ tư vấn →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="duy-tri" className="sec-pad" style={{ background: 'var(--warm)' }}>
          <div className="wd-container" style={{ maxWidth: 720 }}>
            <div className="text-center reveal mb-5">
              <div className="eyebrow">Câu hỏi thường gặp</div>
              <h2 className="sec-title">Giải đáp <em>thắc mắc</em></h2>
            </div>
            <div className="reveal">
              {faqs.map((f, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border-light)', padding: '16px 0' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.q}</div>
                  <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75 }}>{f.a}</p>
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
      </div>
      <Footer />
    </>
  )
}
