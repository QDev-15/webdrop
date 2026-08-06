import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import ProductCard from '../components/ProductCard'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function PromotionsPage() {
  const { settings } = useSite()
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')
  const [countdown, setCountdown] = useState({ h: '00', m: '00', s: '00' })
  const endTimeRef = useRef(Date.now() + 6 * 60 * 60 * 1000)

  useDocumentMeta({
    title: `${settings.promo_hero_title || 'Khuyến mãi'} — ${settings.site_name || 'OFFICEHUB'}`,
    description: settings.promo_hero_sub || 'Ưu đãi hôm nay — giảm giá đến 35%, freeship toàn quốc.',
  })

  useEffect(() => {
    api.get<Product[]>('/public/products?sale=1&per_page=100')
      .then(setSaleProducts)
      .catch(() => setSaleProducts([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTimeRef.current - Date.now())
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown({ h: pad(h), m: pad(m), s: pad(s) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const promoCodes = [1, 2, 3]
    .map(i => ({ code: settings[`promo_code${i}`], desc: settings[`promo_code${i}_desc`] }))
    .filter(p => p.code)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(''), 2000)
    }).catch(() => {})
  }

  return (
    <>
      <div className="vp-page-header">
        <div className="vp-container">
          <nav aria-label="Breadcrumb" className="vp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span aria-current="page">Khuyến mãi</span>
          </nav>
          <h1>{settings.promo_hero_title || 'Khuyến mãi hôm nay'}</h1>
          <p>{settings.promo_hero_sub || 'Ưu đãi độc quyền — giảm giá đến 35%, freeship toàn quốc'}</p>
        </div>
      </div>

      <section className="vp-promo-banner-wrap" aria-labelledby="promo-heading">
        <div className="vp-container">
          <div className="vp-promo-banner" data-reveal>
            <div>
              <div className="vp-eyebrow" style={{ color: 'rgba(255,255,255,.7)' }}>Flash Sale kết thúc sau</div>
              <div className="vp-countdown" aria-live="polite">
                <div className="vp-countdown-block"><span>{countdown.h}</span><small>GIỜ</small></div>
                <div className="vp-countdown-sep">:</div>
                <div className="vp-countdown-block"><span>{countdown.m}</span><small>PHÚT</small></div>
                <div className="vp-countdown-sep">:</div>
                <div className="vp-countdown-block"><span>{countdown.s}</span><small>GIÂY</small></div>
              </div>
            </div>
            <div className="vp-promo-codes-wrap">
              {promoCodes.map(p => (
                <div className="vp-promo-code-item" key={p.code}>
                  <span className="vp-promo-code-badge">{p.code}</span>
                  <span className="vp-promo-code-desc">{p.desc}</span>
                  <button className="vp-copy-btn" aria-label={`Sao chép mã ${p.code}`} onClick={() => copyCode(p.code)}>
                    {copiedCode === p.code ? '✓ Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="vp-section" aria-labelledby="sale-heading">
        <div className="vp-container">
          <div style={{ marginBottom: 32 }} data-reveal>
            <div className="vp-eyebrow">Đang giảm giá</div>
            <h2 className="vp-sec-title" id="sale-heading">Sản phẩm <em>Flash Sale</em></h2>
            <p className="vp-sec-sub">Giá ưu đãi có giới hạn — còn hàng đến khi hết</p>
          </div>
          {!loading && saleProducts.length === 0 ? (
            <p style={{ color: 'var(--text-2)' }}>Hiện chưa có sản phẩm khuyến mãi.</p>
          ) : (
            <div className="vp-promo-grid">
              {saleProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }} data-reveal>
            <Link to="/?sort=price-asc" className="vp-btn vp-btn-outline">Xem tất cả sản phẩm →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
