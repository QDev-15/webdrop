import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CollectionsPage from './pages/CollectionsPage'
import PromotionsPage from './pages/PromotionsPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './components/Contact'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import { SiteProvider } from './contexts/SiteContext'
import './styles/template.css'

export default function App() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  return (
    <SiteProvider>
      <div className="tt-app">
        <Header />
        <main className="tt-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
            <Route path="/gio-hang" element={<CartPage />} />
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
    </SiteProvider>
  )
}
