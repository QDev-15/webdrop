import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import Services from '../components/Services'
import About from '../components/About'
import Team from '../components/Team'
import Testimonials from '../components/Testimonials'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ServicePackage {
  id: number
  name: string
  tagline: string
  price: number
  price_original: number
  items: string
  featured: number
  active: number
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'k'
}

function Packages() {
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<ServicePackage[]>('/public/service-packages')
      .then(data => setPackages(data.filter(p => p.active)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (packages.length === 0) return
    const t = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [packages])

  if (loading || packages.length === 0) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="mrt-label">
            <span className="mrt-label-line" />
            Gói trị liệu
            <span className="mrt-label-line" />
          </div>
          <h2 className="mrt-heading">Combo tiết kiệm <em>toàn diện</em></h2>
          <p className="mrt-subtext mx-auto">
            Tiết kiệm hơn khi chọn gói — trải nghiệm nhiều liệu trình kết hợp cho kết quả phục hồi tối ưu.
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          {packages.map(pkg => {
            const pkgItems = pkg.items ? pkg.items.split('\n').filter(Boolean) : []
            return (
              <div key={pkg.id} className="col-md-6 col-lg-4" data-reveal>
                <div className={`mrt-combo-card${pkg.featured ? ' featured' : ''}`}>
                  {pkg.featured ? <div className="mrt-combo-badge">Phổ biến nhất</div> : null}
                  <div className="mrt-combo-name">{pkg.name}</div>
                  <div className="mrt-combo-tagline">{pkg.tagline}</div>
                  <div className="mrt-combo-price-wrap">
                    <div className="mrt-combo-price">{formatPrice(pkg.price)}<small>/goi</small></div>
                    {pkg.price_original > pkg.price && (
                      <div className="mrt-combo-original">Giá gốc: {formatPrice(pkg.price_original)}</div>
                    )}
                  </div>
                  {pkgItems.length > 0 && (
                    <ul className="mrt-combo-items">
                      {pkgItems.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  )}
                  <Link to="/dat-lich" className="mrt-btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                    Đặt gói ngay
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="mrt-cta-sec">
      <div className="wd-container">
        <h2 className="mrt-cta-title" data-reveal>Bạn xứng đáng được nghỉ ngơi<br />và phục hồi hôm nay.</h2>
        <p className="mrt-cta-sub" data-reveal>Đặt lịch ngay — chúng tôi có mặt 7 ngày trong tuần từ 8:00 đến 22:00.</p>
        <div className="mrt-cta-actions" data-reveal>
          <Link to="/dat-lich" className="mrt-btn-white">Đặt lịch trải nghiệm →</Link>
          <Link to="/dich-vu" className="mrt-btn-outline" style={{ borderColor: 'rgba(255,255,255,.3)', color: 'rgba(255,255,255,.8)' }}>Xem dịch vụ &amp; bảng giá</Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: settings.meta_title || 'Tâm Thư Massage - Trị Liệu Chuyên Nghiệp TP.HCM',
    description: settings.meta_description || 'Trung tâm massage trị liệu Tâm Thư - Massage Thái, Đá Nóng, Bấm Huyệt. Đội ngũ 12 chuyên viên, 8 năm kinh nghiệm.',
  })

  return (
    <>
      <HeroSlider />
      <Services limit={6} showViewAll={true} />
      <About />
      <Packages />
      <Team />
      <Testimonials />
      <CTASection />
    </>
  )
}
