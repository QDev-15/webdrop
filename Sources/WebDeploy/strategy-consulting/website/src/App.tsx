import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteProvider, useSite } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function AppShell() {
  const { settings } = useSite()
  const location = useLocation()
  const zaloDigits = (settings.zalo || '').replace(/\D/g, '')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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

    const observeNew = (root: ParentNode = document) => {
      root.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
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
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/ve-chung-toi"        element={<AboutPage />} />
        <Route path="/dich-vu"             element={<ServicesPage />} />
        <Route path="/lien-he"             element={<ContactPage />} />
        <Route path="/chinh-sach-bao-mat"  element={<PrivacyPage />} />
        <Route path="/dieu-khoan"          element={<TermsPage />} />
      </Routes>
      <Footer />
      {zaloDigits && (
        <a href={`https://zalo.me/${zaloDigits}`} target="_blank" rel="noopener noreferrer" className="zalo-float" title="Chat Zalo">
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M24 2C12.97 2 4 10.97 4 22c0 5.05 1.78 9.69 4.73 13.37l-2.46 8.85 9.03-4.97c2.92.68 6.02 1.06 9.7 1.06 11.03 0 20-8.97 20-20S35.03 2 24 2z"/>
          </svg>
        </a>
      )}
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <AppShell />
    </SiteProvider>
  )
}
