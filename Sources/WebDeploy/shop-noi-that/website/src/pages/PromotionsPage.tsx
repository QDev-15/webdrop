import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Product, Coupon } from '../contexts/SiteContext'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmtVND } from '../data/filters'

function useCountdown() {
  const [target] = useState(() => Date.now() + 5 * 24 * 60 * 60 * 1000)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
    h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
    m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
    s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
  }
}

function VoucherCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code)
    } catch { /* clipboard không khả dụng — vẫn hiện trạng thái đã chép cho khách thấy mã */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="nt-voucher-card">
      <div><div className="code">{coupon.code}</div><div className="desc">{coupon.description}</div></div>
      <button className="nt-voucher-copy" onClick={handleCopy}>{copied ? 'Đã chép ✓' : 'Sao chép'}</button>
    </div>
  )
}

export default function PromotionsPage() {
  const { addItem } = useCart()
  const cd = useCountdown()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [addedId, setAddedId] = useState<number | null>(null)

  useDocumentMeta({
    title: 'Khuyến mãi — MỘC AN',
    description: 'Khuyến mãi nội thất MỘC AN — giảm đến 40% cho sofa, bàn ghế, đèn trang trí. Áp dụng mã giảm giá và ưu đãi có thời hạn.',
  })

  useEffect(() => {
    api.get<Coupon[]>('/public/coupons').then(setCoupons).catch(() => {})
    api.get<Product[]>('/public/products?sale=1&per_page=24').then(setSaleProducts).catch(() => {})
  }, [])

  const handleAddCart = (p: Product) => {
    addItem({ product_id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price_sale ?? p.price })
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1300)
  }

  return (
    <div>
      <section className="nt-promo-hero">
        <div className="nt-eyebrow" style={{ justifyContent: 'center' }}>Ưu đãi có thời hạn</div>
        <h1>Sale cuối mùa — giảm đến <em>40%</em></h1>
        <p>Áp dụng cho sofa, bàn ghế, tủ kệ và đèn trang trí được chọn lọc. Số lượng có hạn cho từng mẫu.</p>
        <div className="nt-promo-countdown">
          <div className="nt-cd-box"><div className="num">{cd.d}</div><div className="lbl">Ngày</div></div>
          <div className="nt-cd-box"><div className="num">{cd.h}</div><div className="lbl">Giờ</div></div>
          <div className="nt-cd-box"><div className="num">{cd.m}</div><div className="lbl">Phút</div></div>
          <div className="nt-cd-box"><div className="num">{cd.s}</div><div className="lbl">Giây</div></div>
        </div>
      </section>

      <section className="nt-sec-tight">
        <div className="nt-container">
          <div className="nt-sec-head center" data-reveal>
            <div className="nt-eyebrow" style={{ justifyContent: 'center' }}>Mã giảm giá</div>
            <h2 className="nt-sec-title">Ưu đãi <em>dành riêng cho bạn</em></h2>
          </div>
          <div className="nt-voucher-row" data-reveal>
            {coupons.map(c => <VoucherCard key={c.id} coupon={c} />)}
          </div>
        </div>
      </section>

      <section className="nt-sec" style={{ paddingTop: 0 }}>
        <div className="nt-container">
          <div className="nt-sec-head between" data-reveal>
            <div>
              <div className="nt-eyebrow">Đang giảm giá</div>
              <h2 className="nt-sec-title">Sản phẩm <em>ưu đãi</em></h2>
            </div>
            <Link to="/" className="nt-link">
              Xem toàn bộ danh mục
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div className="nt-prod-grid" data-reveal>
            {saleProducts.map(p => (
              <article className="nt-prod-card" key={p.id}>
                <Link to={`/san-pham/${p.slug}`} className="nt-prod-thumb">
                  <span className="nt-prod-badge sale">-{Math.round((1 - (p.price_sale || p.price) / p.price) * 100)}%</span>
                  <img src={p.image} alt={p.name} loading="lazy" />
                </Link>
                <div className="nt-prod-cat">{p.category_name}</div>
                <Link to={`/san-pham/${p.slug}`}><h3 className="nt-prod-name">{p.name}</h3></Link>
                <div className="nt-prod-price-row">
                  <span className="nt-prod-price sale">{fmtVND(p.price_sale || p.price)}</span>
                  <span className="nt-prod-price-old">{fmtVND(p.price)}</span>
                </div>
                <button className={'nt-prod-add' + (addedId === p.id ? ' added' : '')} onClick={() => handleAddCart(p)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                  <span className="label">{addedId === p.id ? 'Đã thêm' : 'Thêm vào giỏ'}</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
