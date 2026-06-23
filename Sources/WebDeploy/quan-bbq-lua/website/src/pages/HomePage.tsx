import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import About from '../components/About'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import { useSite } from '../contexts/SiteContext'

export default function HomePage() {
  const { settings } = useSite()
  const s = settings

  // Global reveal for this page
  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <HeroSlider />
      <About />
      <Gallery />
      <Testimonials />

      {/* CTA Section */}
      <section className="cta-sec">
        <div className="wd-container" data-reveal>
          <h2 className="cta-title">{s.cta_title || 'Sẵn sàng cho bữa BBQ hoàn hảo?'}</h2>
          <p className="cta-sub">{s.cta_sub || 'Đặt bàn ngay hôm nay — đặc biệt cuối tuần và ngày lễ nên đặt sớm để có bàn đẹp nhất.'}</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/dat-ban" className="btn-white">Đặt bàn ngay →</Link>
            <Link to="/thuc-don" style={{ fontSize: 14, background: 'transparent', color: 'rgba(255,255,255,.7)', padding: '12px 26px', borderRadius: 9, border: '1px solid rgba(255,255,255,.3)', display: 'inline-block' }}>Xem thực đơn</Link>
          </div>
        </div>
      </section>
    </>
  )
}
