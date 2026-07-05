import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ArticlesPage from './pages/ArticlesPage'
import TeamPage from './pages/TeamPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'
import { api } from './api/client'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// AppShell: IntersectionObserver + MutationObserver for [data-reveal]
function useReveal() {
  const ioRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    function observeAll() {
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => {
        ioRef.current?.observe(el)
      })
    }

    ioRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            ioRef.current?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    )

    observeAll()

    const mo = new MutationObserver(() => { observeAll() })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      ioRef.current?.disconnect()
      mo.disconnect()
    }
  }, [])
}

export default function App() {
  useReveal()
  const [zaloHref, setZaloHref] = useState('https://zalo.me/0289999888')

  useEffect(() => {
    api.get<{ zalo_number?: string }>('/public/settings')
      .then(s => {
        if (s.zalo_number) {
          setZaloHref(`https://zalo.me/${s.zalo_number.replace(/\s/g, '')}`)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/cam-nang-cha-me" element={<ArticlesPage />} />
          <Route path="/bac-si" element={<TeamPage />} />
          <Route path="/dat-lich" element={<BookingPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      {/* Zalo float button */}
      <div className="ks-zf">
        <span className="ks-zf-tip">Nhắn tin Zalo</span>
        <a
          href={zaloHref}
          className="ks-zf-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Liên hệ qua Zalo"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M13 2C7.477 2 3 6.477 3 12c0 2.136.67 4.116 1.808 5.74L3 23l5.418-1.764A9.953 9.953 0 0013 22c5.523 0 10-4.477 10-10S18.523 2 13 2z" fill="white"/>
            <path d="M8.5 10h3m-3 3h2m2-3v3m2-3v3" stroke="#0068FF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </a>
      </div>
    </>
  )
}
