import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../contexts/CartContext'
import { useSite, type Coupon, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }
function volumeLabel(p: Product) { return p.category_slug === 'qua-tang-set' ? `Bộ ${p.volume / 750} chai` : `${p.volume}ml` }
const ORIGIN_LABEL: Record<string, string> = {
  phap: 'Pháp', y: 'Ý', chile: 'Chile', 'tay-ban-nha': 'Tây Ban Nha',
  argentina: 'Argentina', uc: 'Úc', my: 'Mỹ', duc: 'Đức', 'nam-phi': 'Nam Phi',
}

function useCountdown(endDate: string) {
  const [remaining, setRemaining] = useState({ d: '00', h: '00', m: '00', s: '00', ended: false })
  useEffect(() => {
    const end = new Date(endDate).getTime()
    if (Number.isNaN(end)) return
    const tick = () => {
      const diff = end - Date.now()
      if (diff <= 0) { setRemaining({ d: '00', h: '00', m: '00', s: '00', ended: true }); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining({
        d: String(d).padStart(2, '0'), h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0'), ended: false,
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [endDate])
  return remaining
}

function SaleCard({ p, onQuickAdd }: { p: Product; onQuickAdd: (p: Product) => void }) {
  const discount = p.price_sale ? Math.round((1 - p.price_sale / p.price) * 100) : 0
  return (
    <div className="rv-card" data-reveal>
      <div className="rv-card-thumb">
        <div className="rv-card-badges"><span className="rv-badge sale">-{discount}%</span></div>
        <Link to={`/san-pham/${p.slug}`} aria-label={`Xem chi tiết ${p.name}`}><img src={p.image} alt={p.name} loading="lazy" /></Link>
        <button className="rv-quick-add" onClick={() => onQuickAdd(p)} aria-label={`Thêm ${p.name} vào giỏ`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
        </button>
      </div>
      <Link to={`/san-pham/${p.slug}`} className="rv-card-body-link">
        <div className="rv-card-body">
          <span className="rv-card-origin">{ORIGIN_LABEL[p.origin] ?? p.origin} · {volumeLabel(p)}</span>
          <h3 className="rv-card-name">{p.name}</h3>
          <div className="rv-card-meta"><span className="rv-star">★</span> {p.rating.toFixed(1)} · Đã bán {p.sold}</div>
          <div className="rv-card-price">
            <span className="rv-price-now">{formatVND(p.price_sale!)}</span>
            <span className="rv-price-old">{formatVND(p.price)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function SalePage() {
  const { settings } = useSite()
  const { addItem } = useCart()
  useDocumentMeta({
    title: 'Khuyến mãi — Mộc Vang',
    description: 'Chương trình khuyến mãi rượu vang tại Mộc Vang — giảm giá đến 15%, mã voucher & set quà tặng ưu đãi.',
  })

  const [products, setProducts] = useState<Product[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [sort, setSort] = useState<'discount' | 'price-asc' | 'price-desc'>('discount')

  const countdown = useCountdown(settings.sale_countdown_end || '2026-12-31T23:59:59')

  useEffect(() => {
    api.getPaged<Product[]>('/public/products?sale=1&per_page=100').then(({ data }) => setProducts(data)).catch(() => {})
    api.get<Coupon[]>('/public/coupons').then(setCoupons).catch(() => {})
  }, [])

  const sorted = useMemo(() => {
    const arr = [...products]
    if (sort === 'price-asc') arr.sort((a, b) => (a.price_sale ?? a.price) - (b.price_sale ?? b.price))
    else if (sort === 'price-desc') arr.sort((a, b) => (b.price_sale ?? b.price) - (a.price_sale ?? a.price))
    else arr.sort((a, b) => (1 - (b.price_sale ?? b.price) / b.price) - (1 - (a.price_sale ?? a.price) / a.price))
    return arr
  }, [products, sort])

  return (
    <>
      <section className="rv-page-hero" style={{ paddingBottom: 0 }}>
        <div className="rv-page-hero-bg"><img src="https://images.unsplash.com/photo-1464638681273-0962e9b53566?w=1600&auto=format&fit=crop&q=80" alt="" /></div>
        <div className="wd-container rv-page-hero-content" style={{ paddingBottom: 40 }}>
          <div className="rv-eyebrow">Ưu đãi có hạn</div>
          <h1>Khuyến mãi rượu vang</h1>
          <p>Giảm đến 15% cho hơn 10 nhãn hiệu vang đỏ, trắng, sủi &amp; rosé — áp dụng đến khi hết chương trình hoặc hết hàng.</p>
        </div>
      </section>

      <div className="rv-countdown-bar">
        <div className="wd-container rv-countdown-inner">
          <div className="rv-countdown-title">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6" /></svg>
            Ưu đãi kết thúc sau
          </div>
          {countdown.ended ? (
            <div className="rv-countdown-timer"><div><strong>Đã kết thúc</strong></div></div>
          ) : (
            <div className="rv-countdown-timer">
              <div><strong>{countdown.d}</strong><span>Ngày</span></div>
              <div><strong>{countdown.h}</strong><span>Giờ</span></div>
              <div><strong>{countdown.m}</strong><span>Phút</span></div>
              <div><strong>{countdown.s}</strong><span>Giây</span></div>
            </div>
          )}
        </div>
      </div>

      <section className="sec-pad">
        <div className="wd-container">
          {coupons.length > 0 && (
            <div className="rv-voucher-strip" data-reveal>
              {coupons.map(c => (
                <div className="rv-voucher-card" key={c.id}>
                  <div className="rv-voucher-code">{c.code}</div>
                  <div className="rv-voucher-desc">{c.description}</div>
                </div>
              ))}
            </div>
          )}

          <div className="rv-catalog-head">
            <div>
              <div className="rv-eyebrow">Đang giảm giá</div>
              <h2 className="rv-sec-title">Sản phẩm <span>khuyến mãi</span></h2>
            </div>
            <select className="rv-sort-select" value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
              <option value="discount">Giảm nhiều nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          <div className="rv-grid">
            {sorted.map(p => <SaleCard key={p.id} p={p} onQuickAdd={pp => addItem({ product_id: pp.id, name: pp.name, slug: pp.slug, image: pp.image, price: pp.price_sale ?? pp.price })} />)}
          </div>
        </div>
      </section>
    </>
  )
}
