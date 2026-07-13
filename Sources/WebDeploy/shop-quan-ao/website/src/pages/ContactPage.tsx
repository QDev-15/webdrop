import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import Contact from '../components/Contact'

const FAQS = [
  { q: 'Làm sao để chọn đúng size?', a: 'Tham khảo bảng size chi tiết ở mỗi trang sản phẩm hoặc liên hệ hotline/Zalo để được tư vấn theo số đo cơ thể thực tế.' },
  { q: 'Chính sách đổi trả như thế nào?', a: 'Đổi size/mẫu miễn phí trong vòng 15 ngày kể từ ngày nhận hàng, sản phẩm phải còn nguyên tem mác và chưa qua sử dụng.' },
  { q: 'Thời gian giao hàng là bao lâu?', a: 'Nội thành: 1–2 ngày làm việc. Tỉnh thành khác: 2–4 ngày làm việc.' },
  { q: 'Tôi có thể mua sỉ không?', a: 'Chúng tôi có chính sách mua sỉ cho đại lý và nhà phân phối. Liên hệ qua email hoặc Zalo với tiêu đề "Hợp tác đại lý".' },
  { q: 'Các phương thức thanh toán được chấp nhận?', a: 'Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng qua SePay (quét mã QR, xác nhận tự động).' },
]

export default function ContactPage() {
  const { settings } = useSite()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <>
      <div className="qa-page-header" style={{ paddingBottom: 52 }}>
        <div className="qa-container">
          <nav className="qa-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Liên hệ</span>
          </nav>
          <h1 className="qa-page-title">Liên hệ với chúng tôi</h1>
          <p className="qa-page-count" style={{ fontSize: 16 }}>{settings.contact_intro}</p>
        </div>
      </div>

      <div style={{ background: 'var(--blush-light)', padding: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="qa-container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <a href={`tel:${settings.site_phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text)' }}>
              <div style={{ width: 40, height: 40, background: 'var(--accent-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><i className="bi bi-telephone" /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Hotline</div><div style={{ fontWeight: 700 }}>{settings.site_phone}</div></div>
            </a>
            <a href={`mailto:${settings.site_email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text)' }}>
              <div style={{ width: 40, height: 40, background: 'var(--butter-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#946f19' }}><i className="bi bi-envelope" /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Email</div><div style={{ fontWeight: 700 }}>{settings.site_email}</div></div>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text)' }}>
              <div style={{ width: 40, height: 40, background: 'var(--surface)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sale)' }}><i className="bi bi-clock" /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Giờ làm việc</div><div style={{ fontWeight: 700 }}>{settings.working_hours}</div></div>
            </div>
          </div>
        </div>
      </div>

      <main>
        <Contact />

        <section style={{ background: 'var(--surface)', padding: 'clamp(64px,8vw,100px) 0' }} aria-labelledby="faq-heading">
          <div className="qa-container-sm">
            <div className="text-center mb-5">
              <div className="qa-eyebrow" style={{ justifyContent: 'center' }} data-reveal>FAQ</div>
              <h2 className="qa-sec-title" id="faq-heading" data-reveal data-delay="1">Câu hỏi <strong>thường gặp</strong></h2>
            </div>
            <div data-reveal data-delay="2">
              {FAQS.map((item, i) => (
                <div className={`qa-faq-item${openIdx === i ? ' open' : ''}`} key={i}>
                  <button className="qa-faq-q" type="button" onClick={() => setOpenIdx(openIdx === i ? null : i)} aria-expanded={openIdx === i}>
                    {item.q}
                    <i className="bi bi-plus-lg" />
                  </button>
                  <div className="qa-faq-a">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: 'var(--dark2)', padding: 'clamp(60px,7vw,96px) 0' }}>
          <div className="qa-container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6" data-reveal>
                <div className="qa-eyebrow" style={{ color: 'var(--accent-mid)' }}>Bắt đầu ngay</div>
                <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 300, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
                  Tìm phong cách <strong style={{ color: 'var(--butter)', fontWeight: 400 }}>của riêng bạn</strong>
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,.62)', lineHeight: 1.7, marginBottom: 36 }}>
                  Khám phá hàng trăm mẫu thời trang được chọn lọc kỹ lưỡng — từ nhẹ nhàng nữ tính đến năng động hiện đại.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/san-pham" className="qa-btn qa-btn-primary"><i className="bi bi-bag-heart" />Khám phá sản phẩm</Link>
                  <Link to="/gio-hang" className="qa-btn" style={{ background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.75)' }}>Xem giỏ hàng</Link>
                </div>
              </div>
              <div className="col-lg-6" data-reveal data-delay="2">
                <div className="row g-3">
                  <div className="col-6"><div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '1' }}><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&auto=format&fit=crop&q=80" alt="Sản phẩm nổi bật" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .8 }} /></div></div>
                  <div className="col-6"><div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '1', marginTop: 20 }}><img src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=300&auto=format&fit=crop&q=80" alt="Áo mới" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .8 }} /></div></div>
                  <div className="col-6"><div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '1', marginTop: -20 }}><img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&auto=format&fit=crop&q=80" alt="Váy đầm" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .8 }} /></div></div>
                  <div className="col-6"><div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '1' }}><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=80" alt="Phụ kiện" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .8 }} /></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
