import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider, useSite } from './contexts/SiteContext'
import { AccountProvider } from './contexts/AccountContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import PostListingPage from './pages/PostListingPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import TopupPage from './pages/TopupPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.social_zalo || 'https://zalo.me/19006789'
  return <a href={zalo} target="_blank" rel="noopener noreferrer" className="rn-zalo-float">Zalo</a>
}

// AppShell — global reveal observer (IntersectionObserver + MutationObserver) — xem rule 18 CLAUDE.md
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

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bat-dong-san" element={<PropertiesPage />} />
        <Route path="/chi-tiet-bds" element={<PropertyDetailPage />} />
        <Route path="/dang-tin" element={<PostListingPage />} />
        <Route path="/tin-tuc" element={<NewsPage />} />
        <Route path="/tin-tuc-chi-tiet" element={<NewsDetailPage />} />
        <Route path="/ve-chung-toi" element={<AboutPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/dang-nhap" element={<LoginPage />} />
        <Route path="/dang-ky" element={<RegisterPage />} />
        <Route path="/tai-khoan" element={<AccountPage />} />
        <Route path="/nap-tien" element={<TopupPage />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
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
        <AccountProvider>
          <AppShell />
        </AccountProvider>
      </SiteProvider>
    </BrowserRouter>
  )
}
