import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PromotionsPage() {
  const { products, categories } = useSite()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [hours, setHours] = useState(0)
  const [mins, setMins] = useState(0)
  const [secs, setSecs] = useState(0)
  const [addedProduct, setAddedProduct] = useState<number | null>(null)

  useDocumentMeta({
    title: 'Khuyến mãi',
    description: 'Các chương trình khuyến mãi hot từ Shop Thể Thao'
  })

  // Countdown timer (fake 8-hour deadline)
  useEffect(() => {
    const end = Date.now() + 8 * 60 * 60 * 1000
    const timer = setInterval(() => {
      const diff = Math.max(0, end - Date.now())
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setHours(h)
      setMins(m)
      setSecs(s)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const saleProducts = products.filter((p: any) => p.price_sale && p.price_sale < p.price).slice(0, 8)
  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  const handleQuickAdd = (product: any) => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price_sale || product.price,
    })
    setAddedProduct(product.id)
    setTimeout(() => setAddedProduct(null), 1500)
  }

  return (
    <div className="tt-page-wrap">
      {/* Promo Banner */}
      <div className="tt-promo-hero" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--dark2) 100%)', color: 'white', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="tt-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div className="tt-promo-hero-inner">
            <div className="tt-promo-tag" style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, opacity: 0.9 }}>⚡ Flash Sale hôm nay</div>
            <h1 className="tt-promo-title" style={{ fontSize: 42, fontWeight: 600, marginBottom: 16, lineHeight: 1.2 }}>
              Giảm đến <span style={{ fontSize: '1.2em', fontWeight: 700 }}>40%</span><br />đồ thể thao chính hãng
            </h1>
            <p className="tt-promo-sub" style={{ fontSize: 16, opacity: 0.9, marginBottom: 28 }}>
              Cập nhật hàng tuần · Số lượng có hạn · Áp dụng đến hết ngày 31/12/2025
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all .2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            >
              Xem tất cả sản phẩm giảm giá
            </Link>
          </div>

          <div className="tt-promo-countdown" id="ttCountdown" style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            <div className="tt-countdown-item" style={{ textAlign: 'center' }}>
              <span id="ttCdHours" style={{ display: 'block', fontSize: 32, fontWeight: 700, minWidth: 60 }}>
                {String(hours).padStart(2, '0')}
              </span>
              <small style={{ fontSize: 12, opacity: 0.8 }}>giờ</small>
            </div>
            <div className="tt-countdown-sep" style={{ fontSize: 28, opacity: 0.6 }}>:</div>
            <div className="tt-countdown-item" style={{ textAlign: 'center' }}>
              <span id="ttCdMins" style={{ display: 'block', fontSize: 32, fontWeight: 700, minWidth: 60 }}>
                {String(mins).padStart(2, '0')}
              </span>
              <small style={{ fontSize: 12, opacity: 0.8 }}>phút</small>
            </div>
            <div className="tt-countdown-sep" style={{ fontSize: 28, opacity: 0.6 }}>:</div>
            <div className="tt-countdown-item" style={{ textAlign: 'center' }}>
              <span id="ttCdSecs" style={{ display: 'block', fontSize: 32, fontWeight: 700, minWidth: 60 }}>
                {String(secs).padStart(2, '0')}
              </span>
              <small style={{ fontSize: 12, opacity: 0.8 }}>giây</small>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Strips */}
      <section style={{ background: 'var(--surface)', padding: '28px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="tt-container">
          <div className="tt-promo-strips" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { pct: '-25%', title: 'Giày chạy bộ', desc: 'Toàn bộ dòng giày chạy bộ — áp dụng tự động khi thêm vào giỏ', color: 'var(--accent)' },
              { pct: '-30%', title: 'Dụng cụ gym', desc: 'Tạ tay, dây kháng lực, thảm tập — số lượng có hạn', color: '#3b82f6' },
              { pct: '-40%', title: 'Quần áo thể thao', desc: 'Chỉ áp dụng cho sản phẩm có nhãn Sale · hết hàng là hết deal', color: '#4ade80' },
            ].map((strip, i) => (
              <div
                key={i}
                className="tt-promo-strip"
                style={{
                  padding: '20px',
                  borderLeft: `4px solid ${strip.color}`,
                  background: 'white',
                  borderRadius: 6,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <div className="tt-strip-pct" style={{ fontSize: 24, fontWeight: 700, color: strip.color, minWidth: 60 }}>
                  {strip.pct}
                </div>
                <div>
                  <strong style={{ fontSize: 15 }}>{strip.title}</strong>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', margin: '4px 0 0' }}>{strip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Products */}
      <section className="tt-sec" style={{ padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-sec-header" style={{ marginBottom: 36 }} data-reveal>
            <div className="tt-eyebrow" style={{ marginBottom: 8 }}>Flash Sale</div>
            <h2 className="tt-sec-title">Sản phẩm đang giảm giá</h2>
          </div>

          <div className="tt-prod-grid" id="ttSaleGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
            {saleProducts.length > 0 ? (
              saleProducts.map((prod: any) => {
                const pct = Math.round((1 - (prod.price_sale || prod.price) / prod.price) * 100)
                return (
                  <div
                    key={prod.id}
                    className="tt-prod-card"
                    style={{
                      transition: 'all .2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      const img = e.currentTarget.querySelector('img') as HTMLImageElement
                      if (img) img.style.transform = 'scale(1.08)'
                    }}
                    onMouseLeave={e => {
                      const img = e.currentTarget.querySelector('img') as HTMLImageElement
                      if (img) img.style.transform = 'scale(1)'
                    }}
                  >
                    <Link
                      to={`/san-pham/${prod.slug}`}
                      className="tt-prod-img-wrap"
                      style={{
                        position: 'relative',
                        display: 'block',
                        overflow: 'hidden',
                        borderRadius: 8,
                        marginBottom: 12,
                        aspectRatio: '4/5',
                      }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform .3s',
                        }}
                        onError={(e) => (e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22800%22%3E%3Crect width=%22600%22 height=%22800%22 fill=%22%231c1c22%22/%3E%3C/svg%3E')}
                      />
                      <span
                        className="tt-badge tt-badge-sale"
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'var(--accent)',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: 4,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        -{pct}%
                      </span>
                    </Link>

                    <div className="tt-prod-body">
                      <div className="tt-prod-cat" style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>
                        {categories.find((c: any) => c.id === prod.category_id)?.name || 'Thể thao'}
                      </div>
                      <h3 className="tt-prod-name" style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>
                        <Link to={`/san-pham/${prod.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {prod.name}
                        </Link>
                      </h3>

                      <div className="tt-prod-price" style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                        <span className="tt-price sale" style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>
                          {fmt(prod.price_sale || prod.price)}
                        </span>
                        {prod.price_sale && (
                          <span className="tt-price-orig" style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'line-through' }}>
                            {fmt(prod.price)}
                          </span>
                        )}
                      </div>

                      <div className="tt-prod-actions" style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="tt-btn-cart"
                          onClick={() => handleQuickAdd(prod)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: addedProduct === prod.id ? '#22c55e' : 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all .2s',
                          }}
                          onMouseEnter={e => {
                            if (addedProduct !== prod.id) {
                              e.currentTarget.style.background = 'var(--accent-h)'
                            }
                          }}
                          onMouseLeave={e => {
                            if (addedProduct !== prod.id) {
                              e.currentTarget.style.background = 'var(--accent)'
                            }
                          }}
                        >
                          {addedProduct === prod.id ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
                        </button>
                        <Link
                          to={`/san-pham/${prod.slug}`}
                          className="tt-btn-detail"
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            textDecoration: 'none',
                            color: 'var(--accent)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all .2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--warm)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-2)' }}>
                Hiện không có sản phẩm giảm giá. Quay lại sau!
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }} data-reveal>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                textDecoration: 'none',
                borderRadius: 8,
                fontWeight: 600,
                transition: 'all .2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--warm)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Xem toàn bộ 40 sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* Policy Row */}
      <section style={{ background: 'var(--surface-2)', padding: '40px 0' }}>
        <div className="tt-container">
          <div className="tt-policy-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[
              { icon: '🔄', title: 'Miễn phí đổi size', desc: 'Đổi size miễn phí trong 30 ngày nếu không vừa' },
              { icon: '🛡️', title: 'Bảo hành 12 tháng', desc: 'Tất cả sản phẩm được bảo hành lỗi nhà sản xuất' },
              { icon: '🚚', title: 'Giao hàng toàn quốc', desc: 'Miễn phí ship đơn từ 500K · giao nhanh nội thành' },
              { icon: '🎁', title: 'Hàng chính hãng', desc: '100% sản phẩm chính hãng có tem phân phối chính thức' },
            ].map((policy, i) => (
              <div key={i} className="tt-policy-item" data-reveal style={{ padding: '20px 0' }}>
                <div className="tt-policy-icon" style={{ fontSize: 32, marginBottom: 8 }}>
                  {policy.icon}
                </div>
                <strong style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>{policy.title}</strong>
                <p style={{ color: 'var(--text-2)', fontSize: 13, margin: 0 }}>{policy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
