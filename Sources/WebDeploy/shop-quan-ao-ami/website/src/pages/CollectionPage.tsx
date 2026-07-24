import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import ProductCard from '../components/ProductCard'
import { onImgError } from '../lib/format'

export default function CollectionPage() {
  const { settings, products } = useSite()

  useDocumentMeta({
    title: `Bộ sưu tập — ${settings.site_name || 'AMI Fashion'}`,
    description: `Khám phá các bộ sưu tập thời trang ${settings.site_name || 'AMI Fashion'} — từ Hè rực rỡ đến Thu Đông tinh tế.`,
  })

  const featured = useMemo(
    () => products.filter(p => p.badge === 'hot').sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 3),
    [products]
  )

  const collections = [1, 2, 3].map(i => ({
    image: settings[`c${i}_image`],
    label: settings[`c${i}_label`] || `Bộ sưu tập ${String(i).padStart(2, '0')}`,
    title: settings[`c${i}_title`],
    p1: settings[`c${i}_p1`],
    p2: settings[`c${i}_p2`],
    link: settings[`c${i}_link`] || '/san-pham',
    linkLabel: settings[`c${i}_link_label`] || 'Khám phá bộ sưu tập →',
  }))

  return (
    <main className="am-page-body">
      <div className="am-coll-hero" style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="am-container">
          <span className="am-eyebrow">{settings.coll_eyebrow || 'AMI Fashion 2025'}</span>
          <h1 className="am-coll-hero-title"><em>{settings.coll_hero_title || 'Bộ sưu tập'}</em></h1>
          <p className="am-coll-hero-sub">{settings.coll_hero_sub}</p>
        </div>
      </div>

      {collections.map((c, i) => (
        <section
          key={i}
          className={'am-coll-item am-sec' + (i === 1 ? ' reverse' : '')}
          style={i > 0 ? { borderTop: '1px solid var(--border-light)' } : undefined}
          aria-labelledby={`coll-${i + 1}`}
          data-reveal
        >
          <div className="am-coll-img-wrap">
            <img src={c.image} alt={c.title} onError={onImgError} />
          </div>
          <div className="am-coll-content">
            <span className="am-eyebrow">{c.label}</span>
            <h2 id={`coll-${i + 1}`}><em>{c.title}</em></h2>
            <p>{c.p1}</p>
            <p>{c.p2}</p>
            <Link to={c.link} className="am-link-btn">{c.linkLabel}</Link>
          </div>
        </section>
      ))}

      <section className="am-sec" style={{ borderTop: '1px solid var(--border-light)' }} aria-labelledby="featured-heading">
        <div className="am-container">
          <div className="am-sec-head" style={{ marginBottom: 32 }} data-reveal>
            <div>
              <span className="am-eyebrow">Nổi bật</span>
              <h2 className="am-sec-title" id="featured-heading"><em>Sản phẩm tiêu biểu</em></h2>
            </div>
            <Link to="/san-pham" className="am-view-all">Xem tất cả →</Link>
          </div>
          <div className="am-prod-grid am-prod-grid-3" role="list" data-reveal>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
