import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteProvider, useSite } from './contexts/SiteContext'
import { useScrollToTop } from './hooks/useScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ReviewsPage from './pages/ReviewsPage'
import PostDetailPage from './pages/PostDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

  useScrollToTop()

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('bcn-visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    )

    const observeNew = (root: ParentNode = document) => {
      root.querySelectorAll<Element>('[data-reveal]:not(.bcn-visible)').forEach(el => io.observe(el))
    }

    const t = setTimeout(() => observeNew(), 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.hasAttribute('data-reveal') && !node.classList.contains('bcn-visible')) {
            io.observe(node)
          }
          node.querySelectorAll<Element>('[data-reveal]:not(.bcn-visible)').forEach(el => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname, settings])

  const zaloHref = settings.zalo || 'https://zalo.me/'

  return (
    <>
      <Header />
      <Routes>
        <Route path="/"                     element={<HomePage />} />
        <Route path="/chuyen-muc"           element={<CategoryPage />} />
        <Route path="/danh-gia-san-pham"    element={<ReviewsPage />} />
        <Route path="/bai-viet/:slug"       element={<PostDetailPage />} />
        <Route path="/ve-toi"               element={<AboutPage />} />
        <Route path="/lien-he"              element={<ContactPage />} />
        <Route path="/chinh-sach-bao-mat"   element={<PrivacyPage />} />
        <Route path="/dieu-khoan"           element={<TermsPage />} />
      </Routes>
      <Footer />
      <a href={zaloHref} target="_blank" rel="noopener noreferrer" className="bcn-zalo-float" aria-label="Chat Zalo">
        <i className="bi bi-chat-dots-fill"></i>
      </a>
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
