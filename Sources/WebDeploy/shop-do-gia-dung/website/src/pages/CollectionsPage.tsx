import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSite, Product } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23f5ede0' width='600' height='400'/%3E%3C/svg%3E"

const bentoItems = [
  {
    slug: 'nha-bep',
    label: 'Danh mục 01',
    name: 'Nhà bếp hiện đại',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
    wide: true,
  },
  {
    slug: 'den-chieu-sang',
    label: 'Danh mục 02',
    name: 'Đèn & Ánh sáng',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop&q=80',
    tall: true,
  },
  {
    slug: 'trang-tri',
    label: 'Danh mục 03',
    name: 'Trang trí nhà',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&auto=format&fit=crop&q=80',
  },
  {
    slug: 'phong-tam',
    label: 'Danh mục 04',
    name: 'Phòng tắm spa',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&auto=format&fit=crop&q=80',
  },
  {
    slug: 'noi-that-nho',
    label: 'Danh mục 05',
    name: 'Nội thất nhỏ',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    wide: true,
  },
]

function MiniCard({ product }: { product: Product }) {
  return (
    <div className="dg-card">
      <Link to={`/san-pham/${product.slug}`} className="dg-card__img-wrap">
        <img
          className="dg-card__img"
          src={product.image || ''}
          alt={product.name}
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK }}
        />
        {product.badge && (
          <span className={`dg-badge dg-badge--${product.badge === 'Sale' ? 'sale' : product.badge === 'Hot' ? 'hot' : 'new'}`}>
            {product.badge}
          </span>
        )}
      </Link>
      <div className="dg-card__body">
        <h3 className="dg-card__name">
          <Link to={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="dg-card__footer">
          <div className="dg-card__prices">
            {product.salePrice ? (
              <>
                <span className="dg-price dg-price--sale">{product.salePrice.toLocaleString('vi-VN')}đ</span>
                <span className="dg-price dg-price--old">{product.price.toLocaleString('vi-VN')}đ</span>
              </>
            ) : (
              <span className="dg-price">{product.price.toLocaleString('vi-VN')}đ</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  const { settings, products } = useSite()

  useDocumentMeta({
    title: `Bộ sưu tập – ${String(settings.site_name || 'Shop Đồ Gia Dụng')}`,
    description: 'Khám phá các bộ sưu tập đồ gia dụng theo không gian: nhà bếp, phòng tắm, trang trí, nội thất nhỏ và đèn chiếu sáng.',
  })

  const bestSellers = useMemo(() =>
    products.filter(p => p.theme?.includes('|ban-chay|')).slice(0, 8),
    [products]
  )

  const newArrivals = useMemo(() =>
    products.filter(p => p.theme?.includes('|moi-ve|')).slice(0, 8),
    [products]
  )

  return (
    <>
      {/* Page Hero */}
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Curation</p>
          <h1 className="dg-page-hero__title">Bộ sưu tập</h1>
          <p className="dg-page-hero__sub">Những bộ sưu tập được tuyển chọn theo không gian sống và phong cách riêng của bạn.</p>
        </div>
      </div>

      <main className="dg-container sec-pad" style={{ paddingTop: 40 }}>
        {/* Bento Grid Collections */}
        <section aria-label="Bộ sưu tập nổi bật">
          <div className="dg-bento">
            {bentoItems.map(col => (
              <Link
                key={col.slug}
                to={`/san-pham?category=${col.slug}`}
                className={`dg-bento__item${col.wide ? ' dg-bento__item--wide' : col.tall ? ' dg-bento__item--tall' : ''}`}
              >
                <img
                  className="dg-bento__img"
                  src={col.image}
                  alt={col.name}
                  loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK }}
                />
                <div className="dg-bento__overlay">
                  <p className="dg-bento__label">{col.label}</p>
                  <h2 className="dg-bento__title">{col.name}</h2>
                  <span className="dg-bento__cta">Khám phá ngay →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sản phẩm được ưa chuộng */}
        {bestSellers.length > 0 && (
          <section style={{ marginTop: 64 }} aria-labelledby="dg-picks-title">
            <div className="dg-section__head" style={{ marginBottom: 24 }}>
              <div>
                <p className="dg-section__label">Lựa chọn nổi bật</p>
                <h2 className="dg-section__title" id="dg-picks-title">Sản phẩm được ưa chuộng</h2>
              </div>
              <Link to="/san-pham?theme=ban-chay" className="dg-section__see-all">
                Xem tất cả
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="dg-grid dg-grid--4">
              {bestSellers.map(p => <MiniCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Hàng mới về */}
        {newArrivals.length > 0 && (
          <section
            className="dg-section dg-section--alt"
            style={{ margin: '48px -16px 0', paddingLeft: 16, paddingRight: 16 }}
            aria-labelledby="dg-new-title"
          >
            <div className="dg-container">
              <div className="dg-section__head" style={{ marginBottom: 24 }}>
                <div>
                  <p className="dg-section__label">Mới nhất</p>
                  <h2 className="dg-section__title" id="dg-new-title">Hàng mới về</h2>
                </div>
                <Link to="/san-pham?theme=moi-ve" className="dg-section__see-all">
                  Xem tất cả
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
              <div className="dg-grid dg-grid--4">
                {newArrivals.map(p => <MiniCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ marginTop: 64, textAlign: 'center' }}>
          <p className="dg-section__label" style={{ marginBottom: 12 }}>Khám phá thêm</p>
          <h2 style={{ fontSize: 'clamp(22px,4vw,34px)', marginBottom: 14 }}>Xem toàn bộ sản phẩm</h2>
          <p style={{ fontSize: 15, color: 'var(--text-2)', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
            Hơn 40 sản phẩm đồ gia dụng chất lượng cao, được phân loại theo không gian sống.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/san-pham" className="dg-btn dg-btn--primary dg-btn--lg">
              Xem tất cả sản phẩm
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/lien-he" className="dg-btn dg-btn--outline">Liên hệ tư vấn</Link>
          </div>
        </section>
      </main>
    </>
  )
}
