import { useEffect, useRef } from 'react'
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
import AboutPage from './pages/AboutPage'
import PromotionsPage from './pages/PromotionsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'

function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings['zalo_number']
  if (!zalo) return null
  return (
    <div className="sb-zalo-float">
      <a
        href={`https://zalo.me/${zalo}`}
        className="sb-zalo-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Zalo"
      >
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <path d="M20 3C10.6 3 3 10.6 3 20c0 3.7 1.1 7.2 3 10.1L3 37l7.1-3c2.8 1.7 6 2.7 9.9 2.7 9.4 0 17-7.6 17-17S29.4 3 20 3z" fill="#fff"/>
        </svg>
      </a>
      <div className="sb-zalo-tooltip">Chat Zalo</div>
    </div>
  )
}

function AppShell() {
  const ioRef = useRef<IntersectionObserver | null>(null)
  const moRef = useRef<MutationObserver | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const observe = () => {
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => {
        ioRef.current?.observe(el)
      })
    }

    ioRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ioRef.current?.unobserve(e.target) } }),
      { threshold: 0.1 }
    )

    moRef.current = new MutationObserver(observe)
    moRef.current.observe(document.body, { childList: true, subtree: true })
    observe()

    return () => { ioRef.current?.disconnect(); moRef.current?.disconnect() }
  }, [pathname])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="san-pham" element={<ProductsPage />} />
          <Route path="san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="gio-hang" element={<CartPage />} />
          <Route path="thanh-toan" element={<CheckoutPage />} />
          <Route path="ve-chung-toi" element={<AboutPage />} />
          <Route path="khuyen-mai" element={<PromotionsPage />} />
          <Route path="lien-he" element={<ContactPage />} />
          <Route path="chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
          <Route path="dieu-khoan" element={<TermsPage />} />
        </Routes>
      </main>
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
