import { useEffect, useState } from 'react'
import { api } from '../api/client'
import HeroMosaic from '../components/HeroSlider'
import Services from '../components/Services'
import About from '../components/About'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import BookingCTA from '../components/Booking'
import { useSite } from '../contexts/SiteContext'

interface GalleryItem { id: number; image: string; title: string }

function StatsBar() {
  const { settings } = useSite()
  const s = (k: string, fb = '') => settings[k] || fb
  return (
    <section className="ns-stat-bar">
      <div className="wd-container">
        <div className="row justify-content-center" style={{ alignItems: 'center' }}>
          {[
            { num: s('stat_customers', '2.000') + '+', label: 'Khách hàng hài lòng' },
            { num: s('stat_years', '5') + '+', label: 'Năm kinh nghiệm' },
            { num: s('stat_patterns', '500') + '+', label: 'Mẫu nail độc quyền' },
            { num: s('stat_rating', '4.9') + '★', label: 'Đánh giá trung bình' },
          ].map((item, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="ns-stat-item">
                <div className="ns-stat-num"><strong>{item.num}</strong></div>
                <div className="ns-stat-label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then(setItems).catch(() => {})
  }, [])
  if (!items.length) return null
  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center mb-4" data-reveal>
          <div className="ns-eyebrow">Bộ sưu tập</div>
          <h2 className="ns-title">Gallery <strong>Nail Đẹp</strong></h2>
        </div>
        <div className="ns-gallery-grid mt-3">
          {items.map((item, i) => (
            <div key={item.id} className="ns-gallery-item" data-reveal data-reveal-d={`d${i % 4}`}>
              <img src={item.image} alt={item.title || `Gallery ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroMosaic />
      <Services />
      <StatsBar />
      <Gallery />
      <About />
      <Team />
      <Testimonials />
      <BookingCTA />
    </>
  )
}
