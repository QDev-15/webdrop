import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'

function AppShell() {
  const location = useLocation()

  // Global IntersectionObserver + MutationObserver for [data-reveal]
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' })

    function observeAll() {
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    }

    // Initial observe — remove 'visible' then re-observe on route change
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.remove('visible')
      io.observe(el)
    })

    // MutationObserver — pick up elements added dynamically (after API fetch)
    const mo = new MutationObserver(() => observeAll())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { io.disconnect(); mo.disconnect() }
  }, [location.pathname])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/dich-vu"  element={<ServicesPage />} />
        <Route path="/dat-lich" element={<BookingPage />} />
        <Route path="/lien-he"  element={<ContactPage />} />
      </Routes>
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
