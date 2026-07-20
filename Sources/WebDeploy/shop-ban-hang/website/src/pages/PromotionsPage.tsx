import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const PROMOS = [
  {
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&auto=format&fit=crop&q=80',
    alt: 'Khuyến mãi Chào Hè — giảm giá bộ sưu tập mùa hè',
    badgeBg: 'var(--accent)',
    badge: '-25%',
    title: 'Chào Hè Rực Rỡ',
    desc: 'Giảm đến 25% cho toàn bộ bộ sưu tập mùa hè — áp dụng đến hết tháng.',
  },
  {
    img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=80',
    alt: 'Khuyến mãi Mua 2 Tặng 1 phụ kiện',
    badgeBg: 'var(--sage)',
    badge: 'Mua 2 tặng 1',
    title: 'Ưu Đãi Phụ Kiện',
    desc: 'Mua 2 sản phẩm phụ kiện bất kỳ, tặng ngay 1 sản phẩm giá trị thấp hơn.',
  },
  {
    img: 'https://images.unsplash.com/photo-1755051661952-00a7b396aaec?w=500&auto=format&fit=crop&q=80',
    alt: 'Khuyến mãi miễn phí vận chuyển đơn hàng',
    badgeBg: 'var(--accent-mid)',
    badge: 'Freeship',
    title: 'Miễn Phí Vận Chuyển',
    desc: 'Miễn phí giao hàng toàn quốc cho đơn hàng từ 300.000đ trở lên.',
  },
]

const FAQS = [
  {
    q: 'Làm sao để áp dụng mã giảm giá?',
    a: 'Nhập mã giảm giá vào ô "Mã giảm giá" ở trang giỏ hàng trước khi thanh toán, hệ thống sẽ tự động trừ giá trị ưu đãi.',
  },
  {
    q: 'Có thể dùng nhiều mã cùng lúc không?',
    a: 'Mỗi đơn hàng chỉ áp dụng được 1 mã giảm giá tại một thời điểm — hệ thống sẽ tự động áp dụng mã có giá trị ưu đãi cao nhất nếu bạn nhập nhiều mã.',
  },
]

export default function PromotionsPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  useDocumentMeta({
    title: 'Khuyến mãi | Shop Hữu Cơ',
    description: 'Cập nhật các chương trình khuyến mãi, giảm giá và ưu đãi mới nhất tại Shop Hữu Cơ.',
  })

  return (
    <>
      <div className="sb-page-header" style={{ paddingBottom: 56 }}>
        <div className="sb-container">
          <div className="sb-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span>Khuyến mãi</span>
          </div>
          <h1 className="sb-page-title">Khuyến Mãi</h1>
          <p className="sb-page-count" style={{ fontSize: 16, color: 'var(--text-2)' }}>
            Những ưu đãi đang diễn ra — đừng bỏ lỡ
          </p>
        </div>
      </div>

      <main>
        {/* PROMOTIONS — GRID-CARDS */}
        <section className="sb-sec">
          <div className="sb-container">
            <div className="row g-4">
              {PROMOS.map((promo, i) => (
                <div className="col-md-4" key={promo.title} data-reveal data-delay={i > 0 ? String(i) : undefined}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div style={{ aspectRatio: '4/3', position: 'relative' }}>
                      <img src={promo.img} alt={promo.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 14, left: 14, background: promo.badgeBg, color: '#fff', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 999 }}>
                        {promo.badge}
                      </div>
                    </div>
                    <div style={{ padding: 24 }}>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{promo.title}</h3>
                      <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 16 }}>{promo.desc}</p>
                      <Link to="/san-pham" className="sb-btn sb-btn-outline">Mua ngay <i className="bi bi-arrow-right ms-1" /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — coupon usage */}
        <section style={{ background: 'var(--surface)', padding: 'clamp(64px,8vw,100px) 0' }} aria-labelledby="faq-heading">
          <div className="sb-container-sm">
            <div className="text-center mb-5">
              <div className="sb-eyebrow justify-content-center" data-reveal>Hỏi đáp</div>
              <h2 className="sb-sec-title" id="faq-heading" data-reveal data-delay="1">Cách sử dụng <em>mã giảm giá</em></h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }} data-reveal data-delay="2">
              {FAQS.map((faq, i) => {
                const isOpen = openIdx === i
                return (
                  <div key={faq.q} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%', textAlign: 'left', padding: '20px 24px', background: 'var(--bg)', border: 'none',
                        fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500, color: 'var(--text)', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                      }}
                    >
                      {faq.q}
                      <i
                        className="bi bi-plus-lg"
                        style={{ flexShrink: 0, color: 'var(--accent)', transition: 'transform .3s', transform: isOpen ? 'rotate(45deg)' : 'none' }}
                      />
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 24px 20px', fontSize: 14, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.75 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
