import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import AmenitiesBento from '../components/AmenitiesBento'
import ExtAmenitiesList from '../components/ExtAmenitiesList'

interface Amenity { id: number; name: string; description: string; image: string }

export default function AmenitiesPage() {
  useDocumentMeta({
    title: 'Tiện ích nội khu & xung quanh | Green Valley Residence',
    description: 'Khám phá tiện ích nội khu chuẩn 5 sao và các tiện ích xung quanh Green Valley Residence — hồ bơi vô cực, gym, công viên, trường học, bệnh viện, trung tâm thương mại.',
  })

  const { settings } = useSite()
  const [amenities, setAmenities] = useState<Amenity[]>([])

  useEffect(() => {
    api.get<Amenity[]>('/public/amenities').then(setAmenities).catch(() => {})
  }, [])

  const mapSrc = `https://maps.google.com/maps?q=${settings.contact_map_lat || '10.8046'},${settings.contact_map_lng || '106.7350'}&hl=vi&z=14&output=embed`

  return (
    <>
      <header className="gvr-page-hero">
        <span className="blob blob-a"></span><span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="gvr-crumb"><Link to="/">Trang chủ</Link> / Tiện ích</div>
          <div className="eyebrow eyebrow-light">Chuẩn sống 5 sao</div>
          <h1 className="sec-title on-dark" style={{ marginBottom: 12 }}>Tiện ích nội khu &amp; xung quanh</h1>
          <p className="sec-sub on-dark">{amenities.length || 8} tiện ích nội khu chuẩn resort cùng hệ sinh thái tiện ích ngoại khu đầy đủ trong bán kính 2km quanh dự án.</p>
        </div>
      </header>

      {amenities.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="eyebrow" data-reveal>Tiện ích nội khu</div>
            <h2 className="sec-title" style={{ marginBottom: 36 }} data-reveal>{amenities.length} tiện ích <em>chuẩn resort</em></h2>
            <AmenitiesBento items={amenities} />
          </div>
        </section>
      )}

      <section className="sec-pad sec-tint">
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-6" data-reveal>
              <div className="eyebrow">Tiện ích xung quanh</div>
              <h2 className="sec-title" style={{ marginBottom: 20 }}>Kết nối <em>trọn vẹn</em> mọi nhu cầu</h2>
              <p className="sec-sub" style={{ marginBottom: 24 }}>{settings.content_amenities_intro}</p>
              <ExtAmenitiesList />
            </div>
            <div className="col-lg-6" data-reveal data-reveal-d1>
              <div className="gvr-footer-maps" style={{ margin: 0, height: '100%', minHeight: 340 }}>
                <iframe src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ tiện ích xung quanh"></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec-dark sec-pad-sm">
        <div className="wd-container text-center">
          <h2 className="sec-title on-dark" style={{ marginBottom: 14 }} data-reveal>Trải nghiệm tiện ích <em>tận mắt tại nhà mẫu</em></h2>
          <p className="sec-sub on-dark" style={{ margin: '0 auto 28px' }} data-reveal>Đăng ký lịch tham quan nhà mẫu và khu tiện ích nội khu ngay hôm nay.</p>
          <Link to="/lien-he" className="gvr-btn gvr-btn-gold" data-reveal>Đăng ký tham quan →</Link>
        </div>
      </section>
    </>
  )
}
