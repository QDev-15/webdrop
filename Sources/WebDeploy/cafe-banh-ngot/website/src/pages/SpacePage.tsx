import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderTitle } from '../utils/text'
import Gallery from '../components/Gallery'

export default function SpacePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Không Gian — Rosette Bakery & Cafe',
    description: 'Khám phá không gian hồng pastel ấm cúng của Rosette Bakery & Cafe — quầy bày bánh, góc check-in tường hoa, ban công nhỏ ngoài trời.',
  })

  const areas = [1, 2, 3].map(i => ({
    name: settings[`area${i}_name`],
    caption: settings[`area${i}_caption`],
    desc: settings[`area${i}_desc`],
    image: settings[`area${i}_image`],
  }))

  return (
    <>
      <section className="cbn-page-hero">
        <div className="cbn-container">
          <div className="cbn-ph-eyebrow">Không gian quán</div>
          <h1 className="cbn-ph-title">{renderTitle(settings.space_hero_title)}</h1>
          <p className="cbn-ph-sub">{settings.space_hero_desc}</p>
        </div>
      </section>

      {/* BA KHU VỰC CHÍNH */}
      <section className="cbn-sec-pad" style={{ background: 'var(--bg)', paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.space_areas_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.space_areas_title)}</h2>
            <p className="cbn-sec-sub mx-auto">{settings.space_areas_desc}</p>
          </div>
          <div className="row g-4">
            {areas.map((a, i) => (
              <div className="col-md-4" key={i}>
                <div className={`cbn-area-card cbn-reveal cbn-reveal-d${i + 1}`}>
                  {a.image && <img className="cbn-ac-img" src={a.image} alt={a.name} loading="lazy" />}
                  <div className="cbn-ac-body">
                    <div className="cbn-ac-name">{a.name}</div>
                    <div className="cbn-ac-cap">{a.caption}</div>
                    <div className="cbn-ac-desc">{a.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY MASONRY */}
      <section className="cbn-sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="cbn-container">
          <div className="text-center cbn-reveal mb-5">
            <div className="cbn-eyebrow">{settings.gallery_eyebrow}</div>
            <h2 className="cbn-sec-title">{renderTitle(settings.gallery_title)}</h2>
            <p className="cbn-sec-sub mx-auto">{settings.gallery_desc}</p>
          </div>
          <div className="cbn-reveal">
            <Gallery />
          </div>
        </div>
      </section>

      {/* ĐẶT BÀN NHÓM */}
      <section className="cbn-cta-sec">
        <div className="cbn-container">
          <div className="cbn-eyebrow" style={{ color: 'rgba(255,255,255,.85)' }}>Đặt bàn nhóm</div>
          <h2 className="cbn-cta-title">{renderTitle(settings.space_cta_title)}</h2>
          <p className="cbn-cta-sub">{settings.space_cta_desc}</p>
          <Link to="/lien-he" className="cbn-btn-white">Đặt bàn ngay →</Link>
        </div>
      </section>
    </>
  )
}
