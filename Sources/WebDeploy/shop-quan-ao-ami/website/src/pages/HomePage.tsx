import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, type Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { parsePadded, catLabel } from '../lib/format'
import HeroSlider from '../components/HeroSlider'
import ProductCard from '../components/ProductCard'

// Section sản phẩm trang chủ — mỗi section có ô tìm kiếm cục bộ riêng (không ảnh hưởng
// URL/trang Sản phẩm), port từ document.querySelectorAll('.am-local-search') trong template gốc.
function HomeSection({ id, eyebrow, title, items, viewAllHref, viewAllLabel }: {
  id: string
  eyebrow: string
  title: string
  items: Product[]
  viewAllHref: string
  viewAllLabel: string
}) {
  const [q, setQ] = useState('')
  const filtered = q.trim()
    ? items.filter(p => {
        const needle = q.trim().toLowerCase()
        return p.name.toLowerCase().includes(needle) || catLabel(p.category_slug).toLowerCase().includes(needle)
      })
    : items

  return (
    <section className="am-home-section" aria-labelledby={`sec-${id}`}>
      <div className="am-container">
        <div className="am-sec-head">
          <div className="am-sec-head-left">
            <span className="am-eyebrow">{eyebrow}</span>
            <h2 className="am-sec-title" id={`sec-${id}`}><em>{title}</em></h2>
          </div>
          <div className="am-sec-head-right">
            <input
              type="text"
              className="am-local-search"
              placeholder="Tìm trong mục này..."
              aria-label={`Tìm trong ${title}`}
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <Link to={viewAllHref} className="am-view-all">{viewAllLabel}</Link>
          </div>
        </div>
        <div className="am-prod-grid am-prod-grid-4" role="list" aria-label={title}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { settings, products } = useSite()

  useDocumentMeta({
    title: settings.meta_title || `${settings.site_name || 'AMI Fashion'} — ${settings.site_slogan || 'Thời trang tối giản, chất liệu chuẩn'}`,
    description: settings.meta_description || settings.site_description,
  })

  const hangMoi = useMemo(
    () => products.filter(p => parsePadded(p.theme).includes('hang-moi')).slice(0, 8),
    [products]
  )
  const banChay = useMemo(
    () => products.filter(p => parsePadded(p.theme).includes('ban-chay')).sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 8),
    [products]
  )
  const giamGia = useMemo(
    () => products.filter(p => p.price_sale != null).slice(0, 8),
    [products]
  )
  const aoTops = useMemo(
    () => products.filter(p => ['ao-thun', 'ao-so-mi'].includes(p.category_slug)).sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4),
    [products]
  )

  return (
    <main className="am-page-body">
      <HeroSlider />

      <HomeSection
        id="hang-moi"
        eyebrow="Mới nhất"
        title="Hàng mới về"
        items={hangMoi}
        viewAllHref="/san-pham?theme=hang-moi"
        viewAllLabel="Xem tất cả →"
      />

      <HomeSection
        id="ban-chay"
        eyebrow="Yêu thích nhất"
        title="Bán chạy nhất"
        items={banChay}
        viewAllHref="/san-pham?theme=ban-chay"
        viewAllLabel="Xem tất cả →"
      />

      <HomeSection
        id="giam-gia"
        eyebrow="Khuyến mãi"
        title="Đang giảm giá"
        items={giamGia}
        viewAllHref="/san-pham?theme=giam-gia"
        viewAllLabel="Xem tất cả →"
      />

      <section className="am-home-section" style={{ paddingBottom: 'clamp(56px, 8vw, 96px)' }} aria-labelledby="sec-ao-tops">
        <div className="am-container">
          <div className="am-sec-head">
            <div className="am-sec-head-left">
              <span className="am-eyebrow">Danh mục nổi bật</span>
              <h2 className="am-sec-title" id="sec-ao-tops"><em>Áo &amp; Tops</em></h2>
            </div>
            <div className="am-sec-head-right">
              <Link to="/san-pham?category=ao-thun,ao-so-mi" className="am-view-all">Xem tất cả →</Link>
            </div>
          </div>
          <div className="am-prod-grid am-prod-grid-4" role="list" aria-label="Áo & Tops">
            {aoTops.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
