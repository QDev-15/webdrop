import { Link } from 'react-router-dom'

interface PromoItem {
  image: string
  imageAlt: string
  badge: string
  badgeBg: string
  title: string
  desc: string
}

const PROMOS: PromoItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=500&auto=format&fit=crop&q=80',
    imageAlt: 'Combo rau củ tuần giảm giá',
    badge: '-20%',
    badgeBg: 'var(--accent)',
    title: 'Combo Rau Củ Tuần',
    desc: 'Giảm 20% cho combo rau củ đủ dùng 1 tuần — áp dụng cho đơn đặt trước.',
  },
  {
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=80',
    imageAlt: 'Miễn phí giao hàng đơn hàng',
    badge: 'Freeship',
    badgeBg: 'var(--accent-mid)',
    title: 'Miễn Phí Giao Hàng',
    desc: 'Miễn phí giao hàng nội thành cho đơn hàng từ 300.000đ.',
  },
  {
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    imageAlt: 'Ưu đãi khách hàng thân thiết',
    badge: 'Thành viên',
    badgeBg: '#7d7a4a',
    title: 'Khách Hàng Thân Thiết',
    desc: 'Tích điểm mỗi đơn hàng, đổi quà và nhận ưu đãi độc quyền hàng tháng.',
  },
]

export default function PromotionsPage() {
  return (
    <main>
      <div className="rx-container" style={{ paddingTop: 32 }}>
        <nav className="rx-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Khuyến mãi</span>
        </nav>
        <h1 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(30px,4.2vw,48px)', margin: '20px 0 8px' }}>Khuyến Mãi</h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 560, marginBottom: 12 }}>Những ưu đãi theo mùa đang diễn ra — đừng bỏ lỡ</p>
      </div>

      <section style={{ padding: '48px 0 80px' }}>
        <div className="rx-container">
          <div className="row g-4">
            {PROMOS.map((promo, i) => (
              <div className="col-md-4" data-reveal data-delay={String(i)} key={promo.title}>
                <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <div style={{ aspectRatio: '4/3', position: 'relative' }}>
                    <img src={promo.image} alt={promo.imageAlt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 14, left: 14, background: promo.badgeBg, color: '#fff', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 999 }}>{promo.badge}</div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 500, marginBottom: 8 }}>{promo.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>{promo.desc}</p>
                    <Link to="/san-pham" className="rx-btn rx-btn-outline">Đặt ngay <i className="bi bi-arrow-right ms-1" /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
