import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider, useSite } from './contexts/SiteContext'
import Header      from './components/Header'
import Footer      from './components/Footer'
import HomePage    from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import BookingPage  from './pages/BookingPage'
import ContactPage  from './pages/ContactPage'
import './styles/template.css'

function AppShell() {
  const { settings } = useSite()
  const location     = useLocation()

  // Global reveal observer — must be here (not per-component) to cover Footer + all sections
  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -36px 0px' },
      )
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/dat-lich" element={<BookingPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          {/* 404 fallback */}
          <Route path="*" element={
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>✨</div>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Trang không tồn tại</h1>
              <p style={{ color: 'var(--text-2)', marginBottom: 28 }}>Đường dẫn bạn truy cập không tồn tại.</p>
              <a href="/" className="bst-btn-primary">Về trang chủ</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell />
      </SiteProvider>
    </BrowserRouter>
  )
}
