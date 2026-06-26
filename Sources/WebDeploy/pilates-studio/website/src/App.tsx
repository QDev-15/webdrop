import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteProvider } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'

// AppShell wraps all pages — handles reveal animation re-observe on route change
function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)

    // Re-observe reveal elements after route change + data load
    const timer = setTimeout(() => {
      const ro = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            ro.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })

      document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
        el.classList.remove('visible')
        ro.observe(el)
      })

      return () => ro.disconnect()
    }, 0)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return <>{children}</>
}

export default function App() {
  return (
    <SiteProvider>
      <AppShell>
        <Header />
        <main>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/dich-vu"   element={<ServicesPage />} />
            <Route path="/dat-lich"  element={<BookingPage />} />
            <Route path="/lien-he"   element={<ContactPage />} />
            <Route path="*"          element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </AppShell>
    </SiteProvider>
  )
}
