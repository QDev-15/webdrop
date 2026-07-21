import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteProvider, useSite } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ProcessPage from './pages/ProcessPage'
import TeamPage from './pages/TeamPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'

function AppShell() {
  const { settings } = useSite()
  const location = useLocation()
  const zalo = settings.zalo_number || ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const observeNew = () => {
      document.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    }
    const t = setTimeout(observeNew, 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.hasAttribute('data-reveal') && !node.classList.contains('visible')) io.observe(node)
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
          <Route path="/quy-trinh-nieng" element={<ProcessPage />} />
          <Route path="/bac-si" element={<TeamPage />} />
          <Route path="/dat-lich" element={<BookingPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      {zalo && (
        <a
          href={`https://zalo.me/${zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cn-zalo-float"
          aria-label="Chat qua Zalo"
        >
          <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
            <rect width="48" height="48" rx="10" fill="#0068FF"/>
            <path d="M14 30V18h3.2v9.3L22.5 18h3.6l-5.4 9.4L26.4 30h-3.7l-4.5-7.4V30H14z" fill="#fff"/>
            <path d="M28 30V18h3v12h-3z" fill="#fff"/>
            <path d="M33.5 30V18h6.8v2.6h-4v2.2h3.6v2.5h-3.6v2.1h4.1V30h-6.9z" fill="#fff"/>
          </svg>
        </a>
      )}
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
