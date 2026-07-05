import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import TeamPage from './pages/TeamPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/bac-si" element={<TeamPage />} />
          <Route path="/dat-lich" element={<BookingPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      {/* Zalo float button */}
      <a
        href="https://zalo.me/0281234567"
        target="_blank"
        rel="noopener noreferrer"
        className="at-zf"
        aria-label="Liên hệ Zalo"
      >
        <span className="at-zf-tip">Nhắn Zalo ngay</span>
        <span className="at-zf-btn">
          <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
            <path d="M20 4C11.16 4 4 10.84 4 19.5c0 4.62 2.07 8.77 5.35 11.65L8 36l5.18-1.64A15.92 15.92 0 0020 35c8.84 0 16-6.84 16-15.5S28.84 4 20 4z" fill="#fff"/>
            <text x="50%" y="58%" textAnchor="middle" fill="#0068FF" fontSize="12" fontWeight="700" fontFamily="sans-serif" dominantBaseline="middle">ZALO</text>
          </svg>
        </span>
      </a>
    </>
  )
}
