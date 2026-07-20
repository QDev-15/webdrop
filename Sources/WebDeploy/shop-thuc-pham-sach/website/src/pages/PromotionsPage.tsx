import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const PROMOS = [
  {
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=500&auto=format&fit=crop&q=80',
    alt: 'Combo thực phẩm sạch giảm giá',
    badge: '-20%',
    badgeBg: 'var(--accent)',
    title: 'Combo Gia Đình Tuần',
    desc: 'Giảm 20% cho combo thực phẩm đủ dùng 1 tuần — rau củ, thịt cá, gạo.',
  },
  {
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=80',
    alt: 'Miễn phí giao hàng đơn hàng',
    badge: 'Freeship',
    badgeBg: '#dd8f3a',
    title: 'Miễn Phí Giao Hàng Lạnh',
    desc: 'Miễn phí giao hàng chuỗi lạnh cho đơn hàng từ 350.000đ.',
  },
  {
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    alt: 'Ưu đãi khách hàng thân thiết',
    badge: 'Thành viên',
    badgeBg: 'var(--text)',
    title: 'Khách Hàng Thân Thiết',
    desc: 'Tích điểm mỗi đơn hàng, đổi quà và nhận ưu đãi độc quyền hàng tháng.',
  },
]

export default function PromotionsPage() {
  useDocumentMeta({
    title: 'Khuyến Mãi — Tươi Mỗi Ngày',
    description: 'Ưu đãi theo mùa, combo tiết kiệm, freeship và chương trình khách hàng thân thiết tại Tươi Mỗi Ngày.',
  })
  return (
    <>
      <div className="tp-container tp-contact-wrap">
        <div className="tp-breadcrumb" style={{ marginBottom: 24 }}>
          <Link to="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <span>Khuyến mãi</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, marginBottom: 12 }}>Khuyến Mãi</h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 560 }}>Những ưu đãi theo mùa đang diễn ra — đừng bỏ lỡ.</p>
      </div>

      <main>
        <section className="tp-sec" style={{ paddingTop: 24 }}>
          <div className="tp-container">
            <div className="row g-4">
              {PROMOS.map((p, i) => (
                <div className="col-md-4" data-reveal data-delay={i > 0 ? String(i) : undefined} key={p.title}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div style={{ aspectRatio: '4/3', position: 'relative' }}>
                      <img src={p.image} alt={p.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 14, left: 14, background: p.badgeBg, color: '#fff', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 999 }}>
                        {p.badge}
                      </div>
                    </div>
                    <div style={{ padding: 24 }}>
                      <h3 style={{ fontSize: 19, fontWeight: 600, marginBottom: 8 }}>{p.title}</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>{p.desc}</p>
                      <Link to="/san-pham" className="tp-btn tp-btn-outline">Mua ngay <i className="bi bi-arrow-right ms-1" /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
