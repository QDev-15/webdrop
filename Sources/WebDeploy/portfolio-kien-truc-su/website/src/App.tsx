import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteProvider, useSite } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ServicesPage from './pages/ServicesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

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
        <Route path="/du-an"               element={<ProjectsPage />} />
        <Route path="/du-an/:slug"         element={<ProjectDetailPage />} />
        <Route path="/dich-vu"             element={<ServicesPage />} />
        <Route path="/ve-toi"              element={<AboutPage />} />
        <Route path="/lien-he"             element={<ContactPage />} />
        <Route path="/chinh-sach-bao-mat"  element={<PrivacyPage />} />
        <Route path="/dieu-khoan"          element={<TermsPage />} />
      </Routes>
      <Footer />
      <div className="pkt-zalo">
        <span className="pkt-zalo-tip">Chat Zalo tư vấn nhanh</span>
        <a
          href={`https://zalo.me/${(settings.zalo_phone || '0912345678').replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pkt-zalo-btn"
          aria-label="Chat Zalo"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z" /></svg>
        </a>
      </div>
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
