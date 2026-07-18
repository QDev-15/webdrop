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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import CollectionPage from './pages/CollectionPage'
import AboutPage from './pages/AboutPage'

function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.zalo_number
  if (!zalo) return null
  return (
    <a href={`https://zalo.me/${zalo}`} className="st-zalo-float" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" />
    </a>
  )
}

function AppShell() {
  const { settings } = useSite()
  const location = useLocation()
  const ioRef = useRef<IntersectionObserver | null>(null)
  const moRef = useRef<MutationObserver | null>(null)

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
    ioRef.current = io

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
    moRef.current = mo
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="san-pham" element={<ProductsPage />} />
          <Route path="san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="bo-suu-tap" element={<CollectionPage />} />
          <Route path="ve-chung-toi" element={<AboutPage />} />
          <Route path="gio-hang" element={<CartPage />} />
          <Route path="thanh-toan" element={<CheckoutPage />} />
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
