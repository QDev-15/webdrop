import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { SiteProvider } from './contexts/SiteContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Contact from './components/Contact'
import LoginPage from './pages/LoginPage'
import PosPage from './pages/PosPage'
import InvoicePage from './pages/InvoicePage'
import ReturnsPage from './pages/ReturnsPage'
import ShiftPage from './pages/ShiftPage'
import IntroPage from './pages/IntroPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="bp-page-content"><p>Đang tải...</p></div>
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

const MARKETING_PATHS = ['/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan']

function AppShell() {
  const location = useLocation()

  // Chuyển trang qua <Link> không tự cuộn lên đầu như full page load —
  // reset scroll mỗi khi đổi route để không giữ nguyên vị trí cuộn trang cũ.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
  }, [location.pathname])

  // Trang đăng nhập ("/") và in hóa đơn có layout riêng, không dùng navbar chuẩn
  // (khớp đúng index.html/in-hoa-don.html bản tĩnh — không có <nav class="bp-navbar">)
  const noHeaderPaths = location.pathname === '/' || location.pathname.startsWith('/pos/in-hoa-don')
  const showFooter = MARKETING_PATHS.includes(location.pathname)

  return (
    <>
      {!noHeaderPaths && <Header />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/pos" element={<RequireAuth><PosPage /></RequireAuth>} />
        <Route path="/pos/in-hoa-don/:code" element={<RequireAuth><InvoicePage /></RequireAuth>} />
        <Route path="/tra-hang" element={<RequireAuth><ReturnsPage /></RequireAuth>} />
        <Route path="/ca-lam-viec" element={<RequireAuth><ShiftPage /></RequireAuth>} />
        <Route path="/gioi-thieu" element={<IntroPage />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </SiteProvider>
  )
}
