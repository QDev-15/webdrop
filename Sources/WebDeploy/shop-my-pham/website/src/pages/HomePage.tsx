import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { parsePadded } from '../lib/format'
import HeroSlider from '../components/HeroSlider'
import ProductCard from '../components/ProductCard'

// Section sản phẩm trang chủ — mỗi section có ô tìm kiếm cục bộ riêng (không ảnh hưởng
// URL/trang Sản phẩm), port từ homeSections trong <script> của index.html gốc.
function HomeSection({ id, eyebrow, title, items, viewAllHref, alt }: {
  id: string
  eyebrow: string
  title: string
  items: Product[]
  viewAllHref: string
  alt?: boolean
}) {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const filtered = needle
    ? items.filter(p => p.name.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle))
    : items

  return (
    <section className={'mp-home-section' + (alt ? ' mp-home-section--alt' : '')} aria-labelledby={`mpSec${id}Title`} data-reveal>
      <div className="wd-container">
        <div className="mp-sec-header">
          <div className="mp-sec-header-left">
            <div className="mp-eyebrow">{eyebrow}</div>
            <h2 id={`mpSec${id}Title`} className="mp-sec-title">{title}</h2>
          </div>
          <div className="mp-sec-header-right">
            <div className="mp-section-search-wrap">
              <input
                type="text"
                className="mp-section-search"
                placeholder="Tìm trong mục này..."
                aria-label={`Tìm trong ${title}`}
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
            <Link to={viewAllHref} className="mp-sec-viewall" aria-label={`Xem tất cả ${title}`}>Xem tất cả →</Link>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="mp-sec-empty" aria-live="polite">Không tìm thấy sản phẩm phù hợp.</div>
        ) : (
          <div className="mp-grid" role="list" aria-live="polite">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { settings, products } = useSite()

  useDocumentMeta({
    title: settings.meta_title || `${settings.site_name || 'LUMIÈRE Beauty'} — ${settings.site_slogan || 'Mỹ phẩm cao cấp, thành phần an toàn'}`,
    description: settings.meta_description || settings.site_description,
  })

  const banChay = useMemo(
    () => products.filter(p => parsePadded(p.theme).includes('ban-chay')).slice(0, 8),
    [products]
  )
  const chamSocDa = useMemo(
    () => products.filter(p => p.category_slug === 'cham-soc-da').slice(0, 8),
    [products]
  )
  const hangMoi = useMemo(
    () => products.filter(p => parsePadded(p.theme).includes('hang-moi')).slice(0, 8),
    [products]
  )
  const giamGia = useMemo(
    () => products.filter(p => p.price_sale != null).slice(0, 8),
    [products]
  )

  return (
    <main id="mp-main">
      <HeroSlider />

      <HomeSection id="BanChay" eyebrow="Bestsellers" title="Bán Chạy Nhất" items={banChay} viewAllHref="/san-pham?theme=ban-chay" />
      <HomeSection id="ChamSocDa" eyebrow="Skincare" title="Chăm Sóc Da" items={chamSocDa} viewAllHref="/san-pham?category=cham-soc-da" alt />
      <HomeSection id="HangMoi" eyebrow="New Arrivals" title="Hàng Mới Về" items={hangMoi} viewAllHref="/san-pham?theme=hang-moi" />
      <HomeSection id="GiamGia" eyebrow="Sale" title="Đang Giảm Giá" items={giamGia} viewAllHref="/san-pham?theme=giam-gia" alt />
    </main>
  )
}
