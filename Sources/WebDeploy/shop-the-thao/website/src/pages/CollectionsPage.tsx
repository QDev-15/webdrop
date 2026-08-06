import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CollectionsPage() {
  useDocumentMeta({
    title: 'Bộ sưu tập',
    description: 'Khám phá các bộ sưu tập sản phẩm thể thao được lựa chọn kỹ lưỡng'
  })

  const collections = [
    { id: 1, name: 'Chạy bộ', desc: 'Giày chạy bộ & đồ thể thao chuyên nghiệp cho mọi cự ly', category: 'giay', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', tag: 'Running' },
    { id: 2, name: 'Tập gym', desc: 'Dụng cụ tập gym cao cấp — từ tạ tay đến thảm tập đầy đủ', category: 'dung-cu', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80', tag: 'Gym Training' },
    { id: 3, name: 'Yoga & Pilates', desc: 'Thảm yoga, dụng cụ pilates và đồ tập thiền định cao cấp', category: 'yoga', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&auto=format&fit=crop&q=80', tag: 'Wellness' },
    { id: 4, name: 'Thể thao ngoài trời', desc: 'Quần áo thể thao cho hoạt động ngoài trời — chống nắng, thoáng khí', category: 'quan-ao', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80', tag: 'Outdoor' },
  ]

  return (
    <div className="tt-page-wrap">
      {/* Page Hero */}
      <div className="tt-page-hero" style={{ background: 'var(--dark2)', color: 'white', padding: '60px 0' }}>
        <div className="tt-container">
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>Bộ sưu tập</h1>
          <p style={{ fontSize: 16, opacity: 0.8 }}>Khám phá các dòng sản phẩm được thiết kế cho từng mục tiêu thể thao của bạn</p>
        </div>
      </div>

      {/* Collections Grid */}
      <section className="tt-sec" style={{ padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-collection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {collections.map(col => (
              <Link
                key={col.id}
                to={`/?category=${col.category}`}
                className="tt-collection-card"
                data-reveal
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 12,
                  aspectRatio: '4/3',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all .3s',
                  cursor: 'pointer',
                } as React.CSSProperties}
                onMouseEnter={e => {
                  const img = e.currentTarget.querySelector('img') as HTMLImageElement
                  if (img) img.style.transform = 'scale(1.08)'
                }}
                onMouseLeave={e => {
                  const img = e.currentTarget.querySelector('img') as HTMLImageElement
                  if (img) img.style.transform = 'scale(1)'
                }}
              >
                <img
                  src={col.image}
                  alt={col.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transition: 'transform .3s',
                  }}
                  onError={(e) => (e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22%3E%3Crect width=%22800%22 height=%22600%22 fill=%22%231c1c22%22/%3E%3C/svg%3E')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                  }}
                />
                <div
                  className="tt-coll-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div className="tt-coll-tag" style={{ fontSize: 12, opacity: 0.8, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {col.tag}
                  </div>
                  <div className="tt-coll-name" style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
                    {col.name}
                  </div>
                  <p className="tt-coll-desc" style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>
                    {col.desc}
                  </p>
                  <span className="tt-coll-cta" style={{ fontSize: 14, fontWeight: 600 }}>
                    Xem bộ sưu tập →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories Section */}
      <section className="tt-sec-sm" style={{ background: 'var(--surface)', padding: '80px 0' }}>
        <div className="tt-container">
          <div className="tt-sec-header" style={{ textAlign: 'center', marginBottom: 40 }} data-reveal>
            <div className="tt-eyebrow" style={{ marginBottom: 12 }}>Tất cả danh mục</div>
            <h2 className="tt-sec-title">Tìm đúng sản phẩm bạn cần</h2>
          </div>

          <div className="tt-cat-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
            {[
              { icon: '👕', name: 'Quần áo thể thao', count: '12 sản phẩm', slug: 'quan-ao' },
              { icon: '👟', name: 'Giày chạy bộ & gym', count: '8 sản phẩm', slug: 'giay' },
              { icon: '🏋️', name: 'Dụng cụ tập gym', count: '8 sản phẩm', slug: 'dung-cu' },
              { icon: '🎽', name: 'Phụ kiện thể thao', count: '6 sản phẩm', slug: 'phu-kien' },
              { icon: '🧘', name: 'Yoga & Pilates', count: '6 sản phẩm', slug: 'yoga' },
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/?category=${cat.slug}`}
                className="tt-cat-card"
                data-reveal
                style={{
                  padding: 20,
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'inherit',
                  textAlign: 'center',
                  transition: 'all .2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="tt-cat-card-icon" style={{ fontSize: 32, marginBottom: 12 }}>
                  {cat.icon}
                </div>
                <div className="tt-cat-card-name" style={{ fontWeight: 600, marginBottom: 6 }}>
                  {cat.name}
                </div>
                <div className="tt-cat-card-count" style={{ color: 'var(--text-2)', fontSize: 13 }}>
                  {cat.count}
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }} data-reveal>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 8,
                fontWeight: 600,
                transition: 'all .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Xem tất cả 40 sản phẩm →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
