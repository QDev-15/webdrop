import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import Contact from '../components/Contact'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FAQS = [
  { q: 'Làm sao để chọn đúng size giày?', a: 'Tham khảo bảng size chi tiết ở trang sản phẩm hoặc liên hệ hotline/Zalo để được tư vấn theo số đo bàn chân thực tế của bạn.' },
  { q: 'Chính sách đổi trả như thế nào?', a: 'Đổi size miễn phí trong vòng 15 ngày kể từ ngày nhận hàng, sản phẩm phải còn nguyên hộp và chưa qua sử dụng ngoài trời.' },
  { q: 'Thời gian giao hàng là bao lâu?', a: 'Nội thành: 1–2 ngày làm việc. Tỉnh thành khác: 2–4 ngày làm việc. Có dịch vụ giao nhanh 2h nội thành.' },
  { q: 'Sản phẩm có chính hãng không?', a: 'Toàn bộ sản phẩm đều chính hãng 100%, có tem chống hàng giả và hóa đơn đầy đủ khi mua.' },
  { q: 'Các phương thức thanh toán được chấp nhận?', a: 'Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay), thẻ VISA/MasterCard.' },
]

export default function ContactPage() {
  const { settings } = useSite()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  useDocumentMeta({
    title: 'Liên hệ — Volt Kicks',
    description: 'Liên hệ Volt Kicks để được tư vấn size, đặt hàng và giải đáp thắc mắc — hotline, Zalo, email và bản đồ cửa hàng.',
  })

  return (
    <>
      <div className="gd-page-header" style={{ paddingBottom: 56 }}>
        <div className="gd-container">
          <nav className="gd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Liên hệ</span>
          </nav>
          <h1 className="gd-page-title">Liên hệ với chúng tôi</h1>
          <p className="gd-page-count" style={{ fontSize: 16 }}>{settings.contact_intro}</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', padding: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="gd-container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <a href={`tel:${settings.site_phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text)' }}>
              <div style={{ width: 40, height: 40, background: 'var(--accent-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><i className="bi bi-telephone" /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Hotline</div><div style={{ fontWeight: 600 }}>{settings.site_phone}</div></div>
            </a>
            <a href={`mailto:${settings.site_email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text)' }}>
              <div style={{ width: 40, height: 40, background: 'var(--cyan-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}><i className="bi bi-envelope" /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Email</div><div style={{ fontWeight: 600 }}>{settings.site_email}</div></div>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text)' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,59,92,.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sale)' }}><i className="bi bi-clock" /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Giờ làm việc</div><div style={{ fontWeight: 600 }}>{settings.working_hours}</div></div>
            </div>
          </div>
        </div>
      </div>

      <main>
        <Contact />

        <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: 'clamp(64px,8vw,100px) 0' }} aria-labelledby="faq-heading">
          <div className="gd-container-sm">
            <div className="text-center mb-5">
              <div className="gd-eyebrow" style={{ justifyContent: 'center' }} data-reveal>FAQ</div>
              <h2 className="gd-sec-title" id="faq-heading" data-reveal data-delay="1">Câu hỏi <em>thường gặp</em></h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }} data-reveal data-delay="2">
              {FAQS.map((item, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    style={{ width: '100%', textAlign: 'left', padding: '20px 24px', background: 'var(--bg)', border: 'none', fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600, color: 'var(--text)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
                    aria-expanded={openIdx === i}
                  >
                    {item.q}
                    <i className="bi bi-plus-lg" style={{ flexShrink: 0, color: 'var(--accent)', transition: 'transform .3s', transform: openIdx === i ? 'rotate(45deg)' : undefined }} />
                  </button>
                  {openIdx === i && (
                    <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75 }}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--dark2)', borderTop: '1px solid var(--border)', padding: 'clamp(60px,7vw,96px) 0' }}>
          <div className="gd-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="gd-contact-cta-grid">
              <div data-reveal>
                <div className="gd-eyebrow">Bắt đầu ngay</div>
                <h2 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 16 }}>
                  Tìm đôi giày <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>phù hợp với bạn</em>
                </h2>
                <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 36 }}>
                  Khám phá hàng trăm mẫu giày được chọn lọc kỹ lưỡng — từ sneaker đường phố đến giày chạy bộ chuyên nghiệp.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link to="/san-pham" className="gd-btn gd-btn-primary"><i className="bi bi-lightning-charge-fill" />Khám phá sản phẩm</Link>
                  <Link to="/gio-hang" className="gd-btn gd-btn-ghost">Xem giỏ hàng</Link>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} data-reveal data-delay="2">
                <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '1' }}><img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&auto=format&fit=crop&q=80" alt="Sản phẩm nổi bật" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .75 }} /></div>
                <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '1', marginTop: 20 }}><img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&auto=format&fit=crop&q=80" alt="Sneaker mới" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .75 }} /></div>
                <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '1', marginTop: -20 }}><img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&auto=format&fit=crop&q=80" alt="Giày chạy bộ" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .75 }} /></div>
                <div style={{ borderRadius: 4, overflow: 'hidden', aspectRatio: '1' }}><img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&auto=format&fit=crop&q=80" alt="Boot cao cấp" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .75 }} /></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
