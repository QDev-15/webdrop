import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CollectionPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `${settings.coll_hero_title || 'Bộ sưu tập'} — ${settings.site_name || 'OFFICEHUB'}`,
    description: settings.coll_hero_sub || 'Khám phá các bộ sưu tập văn phòng phẩm được chọn lọc kỹ lưỡng.',
  })

  const collections = [1, 2, 3, 4].map(i => ({
    image: settings[`coll${i}_image`] || '',
    tag: settings[`coll${i}_tag`] || '',
    title: settings[`coll${i}_title`] || '',
    desc: settings[`coll${i}_desc`] || '',
    link: settings[`coll${i}_link`] || '/',
  })).filter(c => c.title)

  const featureItems = [1, 2, 3, 4].map(i => settings[`coll_feature_item${i}`]).filter(Boolean)

  return (
    <>
      <div className="vp-page-header">
        <div className="vp-container">
          <nav aria-label="Breadcrumb" className="vp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span aria-current="page">Bộ sưu tập</span>
          </nav>
          <h1>{settings.coll_hero_title || 'Bộ sưu tập'}</h1>
          <p>{settings.coll_hero_sub || 'Những bộ sưu tập được chọn lọc theo phong cách và nhu cầu làm việc'}</p>
        </div>
      </div>

      <section className="vp-section">
        <div className="vp-container">
          <div className="vp-collections-grid">
            {collections.map((c, i) => (
              <article className="vp-collection-card" data-reveal key={i}>
                <Link to={c.link} className="vp-col-img-wrap" aria-label={`Xem bộ sưu tập ${c.title}`}>
                  <img src={c.image} alt={c.title} loading="lazy" />
                  <div className="vp-col-overlay">
                    <span className="vp-col-tag">{c.tag}</span>
                    <h2 className="vp-col-name">{c.title}</h2>
                    <p className="vp-col-desc">{c.desc}</p>
                    <span className="vp-col-cta">Khám phá ngay →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {(settings.coll_feature_title1 || settings.coll_feature_title2) && (
            <div className="vp-col-feature" data-reveal>
              <div className="vp-col-feature-text">
                {settings.coll_feature_eyebrow && <div className="vp-eyebrow">{settings.coll_feature_eyebrow}</div>}
                <h2 className="vp-sec-title">{settings.coll_feature_title1} <em>{settings.coll_feature_title2}</em></h2>
                <p className="vp-sec-sub">{settings.coll_feature_desc}</p>
                {featureItems.length > 0 && (
                  <ul className="vp-col-feature-list">
                    {featureItems.map((item, i) => <li key={i}>✓ {item}</li>)}
                  </ul>
                )}
                <Link to="/lien-he" className="vp-btn vp-btn-primary">Liên hệ báo giá bộ trọn gói</Link>
              </div>
              {settings.coll_feature_image && (
                <div className="vp-col-feature-img">
                  <img src={settings.coll_feature_image} alt="Bộ văn phòng phẩm trọn gói" loading="lazy" />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="vp-cta-bar" aria-label="Xem tất cả sản phẩm">
        <div className="vp-container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, marginBottom: 12 }}>Chưa tìm thấy thứ bạn cần?</h2>
          <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: 24 }}>Khám phá hơn 500 sản phẩm văn phòng phẩm trong danh mục đầy đủ</p>
          <Link to="/" className="vp-btn vp-btn-white">Xem tất cả sản phẩm →</Link>
        </div>
      </section>
    </>
  )
}
