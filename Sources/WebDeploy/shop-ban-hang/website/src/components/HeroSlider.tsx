import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { settings, products } = useSite()
  const featured = products.filter(p => p.is_featured && p.status === 'published').slice(0, 6)

  const slogan = settings['site_slogan'] || 'Thiên nhiên trong từng sản phẩm'

  return (
    <section className="sb-hero">
      <div className="sb-container">
        <div className="sb-hero-inner">
          <div className="sb-hero-text">
            <div className="sb-hero-tag">
              <span>🌿</span>
              <span>100% Organic &amp; Handmade</span>
            </div>
            <h1 className="sb-hero-title">
              {slogan.includes(' ') ? (
                <>
                  {slogan.split(' ').slice(0, Math.ceil(slogan.split(' ').length / 2)).join(' ')}{' '}
                  <em>{slogan.split(' ').slice(Math.ceil(slogan.split(' ').length / 2)).join(' ')}</em>
                </>
              ) : <em>{slogan}</em>}
            </h1>
            <p className="sb-hero-desc">
              Khám phá bộ sưu tập sản phẩm hữu cơ, thủ công và bền vững — được chọn lọc kỹ lưỡng để mang đến cuộc sống xanh và lành mạnh hơn cho bạn.
            </p>
            <div className="sb-hero-actions">
              <Link to="/san-pham" className="sb-btn sb-btn-primary">Khám phá ngay</Link>
              <Link to="/lien-he" className="sb-btn sb-btn-ghost">Liên hệ tư vấn</Link>
            </div>
            <p className="sb-hero-note">Giao hàng toàn quốc · Đổi trả 30 ngày</p>
          </div>

          <div className="sb-hero-grid">
            {featured.length > 0 ? featured.map((p, i) => (
              <Link key={p.id} to={`/san-pham/${p.slug}`} className="sb-hero-prod">
                {p.image ? (
                  <img src={p.image} alt={p.name} loading={i === 0 ? 'eager' : 'lazy'} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--cream-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🌿</div>
                )}
                <div className="sb-hero-prod-label">{p.name}</div>
                {p.badge && <div className="sb-hero-prod-badge">{p.badge}</div>}
              </Link>
            )) : [
              { src: '', label: 'Túi vải đay', badge: 'Bán chạy' },
              { src: '', label: 'Nến thơm', badge: '' },
              { src: '', label: 'Mỹ phẩm hữu cơ', badge: 'Mới' },
              { src: '', label: 'Đồ gỗ decor', badge: '' },
              { src: '', label: 'Chăm sóc da', badge: '' },
              { src: '', label: 'Phụ kiện', badge: '-20%' },
            ].map((item, i) => (
              <div key={i} className="sb-hero-prod">
                <div style={{ width: '100%', height: '100%', background: `hsl(${25 + i * 15}, 30%, ${85 - i * 3}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🌿</div>
                <div className="sb-hero-prod-label">{item.label}</div>
                {item.badge && <div className="sb-hero-prod-badge">{item.badge}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
