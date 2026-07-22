import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import Services from './components/Services'
import About from './components/About'
import Booking from './components/Booking'
import Contact from './components/Contact'
import Testimonials from './components/Testimonials'
import Team from './components/Team'
import { useDocumentMeta } from './hooks/useDocumentMeta'

const SITE_NAME = 'Luxury Spa Resort'

// ─── Reveal observer (global, re-runs on every route change) ──
function useRevealObserver(dep: unknown) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    )

    function observeAll() {
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach((el) => {
        observer.observe(el)
      })
    }

    // Observe after a tick so newly rendered DOM is ready
    const tid = setTimeout(observeAll, 50)

    // MutationObserver: pick up elements added after initial render (lazy-loaded sections)
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach((el) => {
        observer.observe(el)
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(tid)
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [dep])
}

// ─── Home Page ────────────────────────────────────────────────
function HomePage() {
  const location = useLocation()
  useRevealObserver(location.pathname)
  useDocumentMeta({
    title: `${SITE_NAME} — Resort Spa Cao Cấp 5 Sao`,
    description:
      'Trải nghiệm nghỉ dưỡng thư giãn toàn diện — liệu trình cao cấp, không gian thiên nhiên và dịch vụ 5 sao dành riêng cho bạn.',
  })

  return (
    <>
      <HeroSlider />
      <Services page="home" />
      <About />
      <Testimonials />
      <CTASection />
    </>
  )
}

// ─── CTA Section ─────────────────────────────────────────────
function CTASection() {
  return (
    <section className="sl-cta-bg">
      <div className="sl-container">
        <div data-reveal>
          <p className="sl-eyebrow">Đặt lịch ngay</p>
          <h2 className="sl-cta-title">Dành thời gian cho bản thân</h2>
          <p className="sl-cta-sub">
            Liên hệ ngay để nhận tư vấn gói phù hợp và ưu đãi đặt sớm dành riêng cho bạn.
          </p>
          <div className="sl-cta-actions">
            <a href="/dat-lich" className="sl-btn sl-btn-gold sl-btn-lg">
              Đặt gói trải nghiệm
            </a>
            <a href="/lien-he" className="sl-btn sl-btn-ghost sl-btn-lg">
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Services Page ────────────────────────────────────────────
function ServicesPage() {
  const location = useLocation()
  useRevealObserver(location.pathname)
  useDocumentMeta({
    title: `Dịch vụ — ${SITE_NAME}`,
    description:
      'Khám phá bộ sưu tập liệu trình spa cao cấp được thiết kế riêng cho từng nhu cầu thư giãn và phục hồi.',
  })

  return (
    <>
      <section className="sl-page-hero">
        <div className="sl-container">
          <p className="sl-page-hero-eyebrow">Dịch vụ</p>
          <h1 className="sl-page-hero-title">
            Trải nghiệm <em>cao cấp</em>
          </h1>
          <p className="sl-page-hero-sub">
            Khám phá bộ sưu tập liệu trình được thiết kế riêng cho từng nhu cầu thư giãn và phục hồi.
          </p>
        </div>
      </section>
      <Services page="services" />
      <CTASection />
    </>
  )
}

// ─── Booking Page ─────────────────────────────────────────────
function BookingPage() {
  const location = useLocation()
  useRevealObserver(location.pathname)
  useDocumentMeta({
    title: `Đặt lịch — ${SITE_NAME}`,
    description:
      'Đặt gói trải nghiệm spa cao cấp ngay hôm nay — đội ngũ Luxury Spa Resort liên hệ xác nhận trong vòng 2 giờ.',
  })

  return (
    <>
      <section className="sl-page-hero">
        <div className="sl-container">
          <p className="sl-page-hero-eyebrow">Đặt lịch</p>
          <h1 className="sl-page-hero-title">
            Đặt gói <em>trải nghiệm</em>
          </h1>
          <p className="sl-page-hero-sub">
            Điền thông tin bên dưới, đội ngũ của chúng tôi sẽ liên hệ xác nhận trong vòng 2 giờ.
          </p>
        </div>
      </section>
      <Booking />
    </>
  )
}

// ─── Contact Page ─────────────────────────────────────────────
function ContactPage() {
  const location = useLocation()
  useRevealObserver(location.pathname)
  useDocumentMeta({
    title: `Liên hệ — ${SITE_NAME}`,
    description:
      'Liên hệ Luxury Spa Resort để được tư vấn gói dịch vụ phù hợp nhất — hotline, email và địa chỉ resort.',
  })

  return (
    <>
      <section className="sl-page-hero">
        <div className="sl-container">
          <p className="sl-page-hero-eyebrow">Liên hệ</p>
          <h1 className="sl-page-hero-title">
            Liên hệ <em>với chúng tôi</em>
          </h1>
          <p className="sl-page-hero-sub">
            Chúng tôi luôn sẵn sàng lắng nghe và tư vấn gói dịch vụ phù hợp nhất cho bạn.
          </p>
        </div>
      </section>
      <Contact />
    </>
  )
}

// ─── Team Page ────────────────────────────────────────────────
function TeamPage() {
  const location = useLocation()
  useRevealObserver(location.pathname)
  useDocumentMeta({
    title: `Đội ngũ — ${SITE_NAME}`,
    description:
      'Đội ngũ chuyên viên spa được đào tạo chuyên nghiệp, tận tâm trong từng liệu trình tại Luxury Spa Resort.',
  })

  return (
    <>
      <section className="sl-page-hero">
        <div className="sl-container">
          <p className="sl-page-hero-eyebrow">Đội ngũ</p>
          <h1 className="sl-page-hero-title">
            Chuyên gia <em>của chúng tôi</em>
          </h1>
          <p className="sl-page-hero-sub">
            Đội ngũ chuyên viên được đào tạo chuyên nghiệp, tận tâm trong từng liệu trình.
          </p>
        </div>
      </section>
      <Team />
    </>
  )
}

// ─── Scroll to top on route change ────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// ─── App Root ─────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/dich-vu"  element={<ServicesPage />} />
          <Route path="/dat-lich" element={<BookingPage />} />
          <Route path="/lien-he"  element={<ContactPage />} />
          <Route path="/doi-ngu"  element={<TeamPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
