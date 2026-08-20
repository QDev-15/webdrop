import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import Services from './components/Services'
import Team from './components/Team'
import Testimonials from './components/Testimonials'
import About from './components/About'
import Booking from './components/Booking'
import Contact from './components/Contact'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import './styles/template.css'

function HomePage() {
  useDocumentMeta({ title: 'Yoga & Wellness', description: 'Yoga studio tại TP.HCM — Hatha, Vinyasa, Thiền định, Prenatal Yoga' })
  return (
    <>
      <HeroSlider />
      <Services />
      <About />
      <Team />
      <Testimonials />
    </>
  )
}

function ServicesPage() {
  useDocumentMeta({ title: 'Các lớp học — Yoga & Wellness', description: 'Tất cả các lớp yoga tại trung tâm' })
  return (
    <>
      <div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Các lớp <em>học</em></h1></div></div>
      <Services />
    </>
  )
}

function BookingPage() {
  useDocumentMeta({ title: 'Đăng ký lớp — Yoga & Wellness', description: 'Đăng ký các lớp yoga tại trung tâm' })
  return (
    <>
      <div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Đăng ký <em>lớp học</em></h1></div></div>
      <Booking />
    </>
  )
}

function ContactPage() {
  useDocumentMeta({ title: 'Liên hệ — Yoga & Wellness', description: 'Liên hệ với chúng tôi' })
  return (
    <>
      <div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Liên <em>hệ</em></h1></div></div>
      <Contact />
    </>
  )
}

function AboutPage() {
  useDocumentMeta({ title: 'Về chúng tôi — Yoga & Wellness', description: 'Tìm hiểu thêm về Yoga & Wellness' })
  return (
    <>
      <div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">Về <em>chúng tôi</em></h1></div></div>
      <About />
    </>
  )
}

function NotFoundPage() {
  useDocumentMeta({ title: '404 Not Found', description: '' })
  return <div className="yw-page-hero"><div className="wd-container"><h1 className="yw-ph-title">404 - Không tìm thấy trang</h1></div></div>
}

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const observeNew = () => {
      document.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    }

    const t = setTimeout(() => observeNew(), 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.hasAttribute('data-reveal') && !node.classList.contains('visible')) {
            io.observe(node)
          }
          node.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/dat-lich" element={<BookingPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/ve-chung-toi" element={<AboutPage />} />
          <Route path="/chinh-sach-bao-mat" element={<div className="yw-page-hero"><div className="wd-container"><h1>Chính sách bảo mật</h1></div></div>} />
          <Route path="/dieu-khoan" element={<div className="yw-page-hero"><div className="wd-container"><h1>Điều khoản dịch vụ</h1></div></div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return <AppShell />
}
