import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite, renderAccentText } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Space { id: number; name: string; caption: string; description: string; image: string }
interface Amenity { id: number; icon: string; title: string }
interface GalleryItem { id: number; title: string; image: string }

export default function Gallery() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `${settings.space_page_title || 'Không gian'} — ${settings.site_name || 'MONO Coffee'}`,
    description: settings.space_page_sub,
  })

  const [spaces, setSpaces] = useState<Space[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  useEffect(() => {
    Promise.all([
      api.get<Space[]>('/public/spaces'),
      api.get<Amenity[]>('/public/content-blocks?section=amenities'),
      api.get<GalleryItem[]>('/public/gallery'),
    ]).then(([sp, am, gl]) => {
      setSpaces(sp); setAmenities(am); setGallery(gl)
    }).catch(() => {})
  }, [])

  return (
    <>
      <header className="chd-page-hero">
        <div className="chd-container">
          <div className="chd-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Không gian</span></div>
          <h1 className="chd-page-title">{settings.space_page_title || 'Không gian'}</h1>
          <p className="chd-page-sub">{settings.space_page_sub}</p>
        </div>
      </header>

      {/* KHU VỰC */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.space_area_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.space_area_title)}</h2>
            <p className="chd-sec-sub">{settings.space_area_sub}</p>
          </div>
          <div className="chd-area-grid" style={{ marginTop: 48 }}>
            {spaces.map((sp, i) => (
              <div className="chd-area-card" key={sp.id} data-reveal data-delay={String(i + 1)}>
                {sp.image && <img className="chd-area-img" src={sp.image} alt={sp.name} loading="lazy" />}
                <div className="chd-area-body">
                  <div className="chd-area-name">{sp.name}</div>
                  <div className="chd-area-cap">{sp.caption}</div>
                  <div className="chd-area-desc">{sp.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIỆN ÍCH */}
      <section className="chd-sec chd-sec-alt">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.amenity_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.amenity_title)}</h2>
          </div>
          <div className="chd-amenity-grid" style={{ marginTop: 40 }}>
            {amenities.map((a, i) => (
              <div className="chd-amenity" key={a.id} data-reveal data-delay={String(i + 1)}>
                <div className="chd-amenity-icon">{a.icon}</div>
                <span>{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="chd-sec">
        <div className="chd-container">
          <div className="chd-sec-header chd-center" data-reveal>
            <div className="chd-eyebrow">{settings.gallery_eyebrow}</div>
            <h2 className="chd-sec-title">{renderAccentText(settings.gallery_title)}</h2>
          </div>
          <div className="chd-gallery-masonry" style={{ marginTop: 44 }} data-reveal data-delay="1">
            {gallery.map(g => (
              <img key={g.id} src={g.image} alt={g.title} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="chd-cta-dark">
        <div className="chd-container">
          <div className="chd-cta-grid">
            <div className="chd-cta-content" data-reveal>
              <div className="chd-eyebrow">{settings.space_cta_eyebrow}</div>
              <h2>{renderAccentText(settings.space_cta_title)}</h2>
              <p>{settings.space_cta_text}</p>
              <Link to="/lien-he" className="chd-btn chd-btn-white">Đặt chỗ ngay</Link>
            </div>
            <div className="chd-cta-images" data-reveal data-delay="1">
              {settings.space_cta_image1 && <img src={settings.space_cta_image1} alt="Góc quán buổi sáng" />}
              {settings.space_cta_image2 && <img src={settings.space_cta_image2} alt="Pha chế pour over" />}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
