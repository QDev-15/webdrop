import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteProvider, useSite } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import CamNangPage from './pages/CamNangPage'
import PostDetail from './components/PostDetail'
import About from './components/About'
import Contact from './components/Contact'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function AppShell() {
  const { settings } = useSite()
  const location = useLocation()
  const zaloDigits = (settings.zalo_phone || '').replace(/\D/g, '')

  // Chuyển trang qua <Link> không tự cuộn lên đầu như full page load —
  // reset scroll mỗi khi đổi route (trừ khi có #hash — cuộn tới section đó, vd /#newsletter)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
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
        <Route path="/chuyen-muc"          element={<CategoryPage />} />
        <Route path="/cam-nang"            element={<CamNangPage />} />
        <Route path="/bai-viet/:slug"      element={<PostDetail />} />
        <Route path="/ve-toi"              element={<About />} />
        <Route path="/lien-he"             element={<Contact />} />
        <Route path="/chinh-sach-bao-mat"  element={<PrivacyPage />} />
        <Route path="/dieu-khoan"          element={<TermsPage />} />
      </Routes>
      <Footer />
      {zaloDigits && (
        <a href={`https://zalo.me/${zaloDigits}`} className="bmb-zalo-float" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
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
