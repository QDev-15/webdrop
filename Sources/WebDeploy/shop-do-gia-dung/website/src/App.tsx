import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import { CartProvider } from './contexts/CartContext'
import { useSite } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import CollectionsPage from './pages/CollectionsPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'

// AppShell phải nằm TRONG SiteProvider để dùng useSite() cho dependency MutationObserver
function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

  // Rule 18: IntersectionObserver + MutationObserver — thiếu MO thì F5 / direct URL bị ẩn
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

  const zaloNumber = String(settings.zalo_number || '')

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/san-pham" element={<ProductsPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/bo-suu-tap" element={<CollectionsPage />} />
          <Route path="/ve-chung-toi" element={<AboutPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
          <Route path="/dieu-khoan" element={<TermsPage />} />
        </Routes>
      </main>
      <Footer />
      {zaloNumber && (
        <a
          href={`https://zalo.me/${zaloNumber.replace(/\s/g, '')}`}
          className="dg-zalo-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
        >
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
            <rect width="64" height="64" rx="14" fill="white" fillOpacity="0"/>
            <path d="M32 4C16.536 4 4 16.536 4 32C4 38.08 5.96 43.7 9.28 48.24L4.8 59.2L16.32 55.04C20.64 57.84 25.64 59.44 31.04 59.92C31.36 59.96 31.68 59.96 32 59.96C47.464 59.96 60 47.424 60 31.96C60 16.536 47.464 4 32 4Z" fill="#0068FF"/>
            <path d="M18.56 37.36C18.56 37.36 28.8 26.68 34.36 24.76C34.36 24.76 26.88 37.96 24.96 40.28C24.16 41.28 22.92 41.76 21.72 41.32C20.08 40.72 18.56 39.16 18.56 37.36Z" fill="white"/>
            <path d="M34.76 39.64C34.76 39.64 24.52 28.96 18.96 27.04C18.96 27.04 26.44 40.24 28.36 42.56C29.16 43.56 30.4 44.04 31.6 43.6C33.24 43 34.76 41.44 34.76 39.64Z" fill="white"/>
            <path d="M45 29.2C45 32.44 42.76 35.08 39.96 35.08C37.16 35.08 34.92 32.44 34.92 29.2C34.92 25.96 37.16 23.32 39.96 23.32C42.76 23.32 45 25.96 45 29.2Z" fill="white"/>
          </svg>
        </a>
      )}
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <CartProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppShell />
        </div>
      </CartProvider>
    </SiteProvider>
  )
}
