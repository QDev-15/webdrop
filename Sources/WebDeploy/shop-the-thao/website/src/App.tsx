import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CollectionsPage from './pages/CollectionsPage'
import PromotionsPage from './pages/PromotionsPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './components/Contact'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import { SiteProvider, useSite } from './contexts/SiteContext'
import './styles/template.css'

// AppShell phải nằm TRONG SiteProvider để dùng useSite() cho dependency của MutationObserver.
function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

  // IntersectionObserver + MutationObserver cho [data-reveal] — thiếu MutationObserver thì
  // nội dung render sau lần quan sát đầu (chuyển route, F5 vào thẳng URL con...) sẽ bị kẹt opacity:0.
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
    <div className="tt-app">
      <Header />
      <main className="tt-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/bo-suu-tap" element={<CollectionsPage />} />
          <Route path="/khuyen-mai" element={<PromotionsPage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
          <Route path="/dieu-khoan" element={<TermsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <AppShell />
    </SiteProvider>
  )
}
