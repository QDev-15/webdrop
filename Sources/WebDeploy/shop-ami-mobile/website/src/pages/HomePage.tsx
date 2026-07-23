import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import HeroSlider from '../components/HeroSlider'
import ProductCard from '../components/ProductCard'
import StatCounter from '../components/StatCounter'

// Icon SVG cố định theo từng danh mục (yếu tố trang trí, không phải nội dung nghiệp vụ cần quản lý qua admin)
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  'dien-thoai': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
  'tai-nghe': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" /></svg>,
  'sac-cap': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  'op-lung': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="7" y="1" width="10" height="22" rx="2" /><path d="M11 5h2" /></svg>,
}

const BRAND_PILLS = [
  { slug: 'apple', label: 'Apple' },
  { slug: 'samsung', label: 'Samsung' },
]

export default function HomePage() {
  const { settings, products, categories } = useSite()
  useDocumentMeta({
    title: settings.meta_title || `${settings.site_name || 'AMI Mobile'} — ${settings.site_slogan || 'Điện Thoại & Phụ Kiện Chính Hãng'}`,
    description: settings.meta_description || settings.site_description,
  })

  const [noiBatSearch, setNoiBatSearch] = useState('')
  const [noiBatBrand, setNoiBatBrand] = useState('')
  const [moiVeSearch, setMoiVeSearch] = useState('')
  const [moiVeBrand, setMoiVeBrand] = useState('')

  const noiBatItems = useMemo(() => products.filter(p => p.theme.split(',').includes('noi-bat')), [products])
  const phuKienItems = useMemo(() => products.filter(p => p.theme.split(',').includes('phu-kien')).slice(0, 8), [products])
  const moiVeItems = useMemo(() => products.filter(p => p.theme.split(',').includes('moi-ve')).slice(0, 8), [products])
  const giamGiaItems = useMemo(() => products.filter(p => p.theme.split(',').includes('giam-gia')), [products])

  const noiBatFiltered = noiBatItems.filter(p =>
    (!noiBatBrand || p.brand === noiBatBrand) &&
    (!noiBatSearch || p.name.toLowerCase().includes(noiBatSearch.toLowerCase()))
  )
  const moiVeFiltered = moiVeItems.filter(p =>
    (!moiVeBrand || p.brand === moiVeBrand) &&
    (!moiVeSearch || p.name.toLowerCase().includes(moiVeSearch.toLowerCase()))
  )

  const hstats = [1, 2, 3, 4].map(i => ({
    num: Number(settings[`hstat${i}_num`] || 0),
    suffix: settings[`hstat${i}_suffix`] ?? '',
    label: settings[`hstat${i}_label`] || '',
  }))

  return (
    <>
      <HeroSlider />

      {/* Danh mục (FEATURE-ICON-ROW) */}
      <section className="mb-sec mb-sec-sm">
        <div className="mb-container">
          <div className="mb-cat-pills" role="navigation" aria-label="Danh mục sản phẩm">
            {categories.map((c, i) => (
              <Link key={c.id} to={`/san-pham?category=${c.slug}`} className="mb-cat-pill" data-reveal data-delay={String(i + 1)}>
                <div className="mb-cat-pill-icon">{CATEGORY_ICONS[c.slug] ?? CATEGORY_ICONS['dien-thoai']}</div>
                {c.name}
              </Link>
            ))}
            {BRAND_PILLS.map((b, i) => (
              <Link key={b.slug} to={`/san-pham?brand=${b.slug}`} className="mb-cat-pill" data-reveal data-delay={String(categories.length + i + 1)}>
                <div className="mb-cat-pill-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                </div>
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Điện thoại nổi bật (HORIZONTAL-SCROLL + local search) */}
      {noiBatItems.length > 0 && (
        <section className="mb-sec mb-sec-border">
          <div className="mb-container">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3 flex-wrap" data-reveal>
              <div>
                <div className="mb-label">Đang hot</div>
                <h2 className="mb-sec-title">Điện thoại <span>nổi bật</span></h2>
              </div>
            </div>
            <div className="mb-sec-toolbar" data-reveal>
              <div className="mb-sec-search-wrap">
                <input type="text" className="mb-sec-search" placeholder="Tìm trong mục này..." aria-label="Tìm trong điện thoại nổi bật" value={noiBatSearch} onChange={e => setNoiBatSearch(e.target.value)} />
                <span className="mb-sec-search-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg></span>
              </div>
              {['', 'apple', 'samsung', 'xiaomi'].map(b => (
                <button key={b || 'all'} className={'mb-quick-chip' + (noiBatBrand === b ? ' active' : '')} onClick={() => setNoiBatBrand(b)}>
                  {b ? b.charAt(0).toUpperCase() + b.slice(1) : 'Tất cả'}
                </button>
              ))}
              <Link to="/san-pham?theme=noi-bat" className="mb-sec-all">
                Xem tất cả <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="mb-scroll-row">
              {noiBatFiltered.map(p => (
                <div className="mb-card-wrap" key={p.id}><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Phụ kiện hot (GRID-CARDS) */}
      {phuKienItems.length > 0 && (
        <section className="mb-sec mb-sec-cream">
          <div className="mb-container">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3 flex-wrap" data-reveal>
              <div>
                <div className="mb-label">Bán chạy</div>
                <h2 className="mb-sec-title">Phụ kiện <span>hot</span></h2>
              </div>
              <Link to="/san-pham?theme=phu-kien" className="mb-sec-all" style={{ alignSelf: 'flex-end' }}>
                Xem tất cả <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="mb-prod-grid">
              {phuKienItems.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Hàng mới về (GRID-CARDS + local search) */}
      {moiVeItems.length > 0 && (
        <section className="mb-sec">
          <div className="mb-container">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3 flex-wrap" data-reveal>
              <div>
                <div className="mb-label">Vừa cập bến</div>
                <h2 className="mb-sec-title">Hàng <span>mới về</span></h2>
              </div>
            </div>
            <div className="mb-sec-toolbar" data-reveal>
              <div className="mb-sec-search-wrap">
                <input type="text" className="mb-sec-search" placeholder="Tìm sản phẩm mới..." aria-label="Tìm trong hàng mới về" value={moiVeSearch} onChange={e => setMoiVeSearch(e.target.value)} />
                <span className="mb-sec-search-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg></span>
              </div>
              {['', 'apple', 'samsung'].map(b => (
                <button key={b || 'all'} className={'mb-quick-chip' + (moiVeBrand === b ? ' active' : '')} onClick={() => setMoiVeBrand(b)}>
                  {b ? b.charAt(0).toUpperCase() + b.slice(1) : 'Tất cả'}
                </button>
              ))}
              <Link to="/san-pham?theme=moi-ve" className="mb-sec-all">
                Xem tất cả <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="row g-3">
              {moiVeFiltered.map(p => (
                <div className="col-6 col-md-4 col-lg-3" key={p.id}><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Đang giảm giá (HORIZONTAL-SCROLL, dark) */}
      {giamGiaItems.length > 0 && (
        <section className="mb-sec mb-sec-dark">
          <div className="mb-container">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3 flex-wrap" data-reveal>
              <div>
                <div className="mb-label" style={{ color: 'var(--mustard)' }}>Tiết kiệm ngay</div>
                <h2 className="mb-sec-title is-white">Đang <span>giảm giá</span></h2>
              </div>
              <Link to="/san-pham?theme=giam-gia" className="mb-sec-all" style={{ alignSelf: 'flex-end', color: '#fff' }}>
                Xem tất cả <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="mb-scroll-row">
              {giamGiaItems.map(p => (
                <div className="mb-card-wrap" key={p.id}><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stat Bar */}
      <div className="mb-stat-bar">
        <div className="mb-container">
          <div className="mb-stat-grid">
            {hstats.map((s, i) => (
              <div data-reveal data-delay={String(i)} key={i}>
                <div className="mb-stat-num"><StatCounter target={s.num} suffix={s.suffix} /></div>
                <div className="mb-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
