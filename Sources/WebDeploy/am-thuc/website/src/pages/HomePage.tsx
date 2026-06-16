import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSlider from '../components/HeroSlider'
import Menu from '../components/Menu'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Gallery from '../components/Gallery'
import { Link } from 'react-router-dom'

export default function HomePage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Header />
      <HeroSlider />
      <Menu />
      <About />
      <Gallery />
      <Testimonials />

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container reveal">
          <h2 className="cta-title">Đặt bàn hôm nay</h2>
          <p className="cta-sub">Đặt trước để có bàn đẹp nhất — đặc biệt vào cuối tuần và ngày lễ.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/dat-ban" className="btn-white">Đặt bàn ngay →</Link>
            <Link to="/thuc-don" style={{ fontSize: 14, background: 'transparent', color: 'rgba(255,255,255,.7)', padding: '12px 26px', borderRadius: 9, border: '1px solid rgba(255,255,255,.3)', textDecoration: 'none' }}>Xem thực đơn</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
