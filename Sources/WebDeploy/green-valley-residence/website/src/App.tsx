import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { SiteProvider, useSite } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ZaloFloat from './components/ZaloFloat'
import HomePage from './pages/HomePage'
import AboutProjectPage from './pages/AboutProjectPage'
import PricingPage from './pages/PricingPage'
import UnitDetailPage from './pages/UnitDetailPage'
import AmenitiesPage from './pages/AmenitiesPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

// Global reveal observer — IntersectionObserver + MutationObserver kết hợp để hoạt động
// đúng cả khi F5/direct URL (async data render thêm elements sau khi IO setup) lẫn khi
// navigate trong SPA (xem Rule 18 web-deploy-builder.md)
function AppShell() {
  const { settings, heroSlides } = useSite()
  const location = useLocation()

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
  }, [location.pathname, settings, heroSlides])

  // Cuộn lên đầu trang khi chuyển route (SPA không tự làm việc này như trình duyệt truyền thống)
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <>
      <div className="gvr-ambient"><span className="b1"></span><span className="b2"></span><span className="b3"></span></div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ve-chu-dau-tu" element={<AboutProjectPage />} />
        <Route path="/bang-gia" element={<PricingPage />} />
        <Route path="/loai-can-chi-tiet" element={<UnitDetailPage />} />
        <Route path="/tien-ich" element={<AmenitiesPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <ZaloFloat />
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
