import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider, useSite } from './contexts/SiteContext'
import { CartProvider } from './contexts/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import AboutPage from './pages/AboutPage'
import PromotionsPage from './pages/PromotionsPage'

function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.zalo_number
  if (!zalo) return null
  return (
    <div className="rx-zalo-float" aria-label="Chat Zalo">
      <div className="rx-zalo-tooltip">Chat Zalo đặt rau</div>
      <a href={`https://zalo.me/${zalo}`} className="rx-zalo-btn" target="_blank" rel="noopener noreferrer" aria-label="Liên hệ qua Zalo">
        <i className="bi bi-chat-fill" />
      </a>
    </div>
  )
}

// AppShell đặt global reveal observer — KHÔNG đặt observer trong từng component riêng lẻ.
// IntersectionObserver + MutationObserver kết hợp để hoạt động đúng cả khi F5 lẫn navigate SPA
// (component fetch API render thêm [data-reveal] elements SAU khi IO setup lần đầu).
function AppShell() {
  const { settings } = useSite()
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
          if (node.hasAttribute('data-reveal') && !node.classList.contains('visible')) io.observe(node)
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
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
        <Route path="/ve-chung-toi" element={<AboutPage />} />
        <Route path="/khuyen-mai" element={<PromotionsPage />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/thanh-toan" element={<CheckoutPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
      </Routes>
      <Footer />
      <ZaloFloat />
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </SiteProvider>
  )
}
