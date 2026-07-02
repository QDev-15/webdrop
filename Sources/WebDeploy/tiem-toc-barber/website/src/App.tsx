import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SiteProvider, useSite } from './contexts/SiteContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DichVuPage from './pages/DichVuPage'
import DatLichPage from './pages/DatLichPage'
import LienHePage from './pages/LienHePage'

function ZaloFloat() {
  const { settings } = useSite()
  const zalo = settings.zalo_number || ''
  const zaloUrl = settings.zalo_url || (zalo ? `https://zalo.me/${zalo.replace(/\s+/g, '')}` : '')
  if (!zaloUrl) return null
  return (
    <a href={zaloUrl} className="tb-zalo-float" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
      <svg width="26" height="26" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text y="38" fontSize="38" fill="#fff">💬</text>
      </svg>
    </a>
  )
}

// AppShell — reveal observer toàn cục (Rule 31): IntersectionObserver + MutationObserver
// kết hợp để đảm bảo hoạt động cả khi F5 / load URL trực tiếp / navigate bằng Link
function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

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
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dich-vu" element={<DichVuPage />} />
        <Route path="/dat-lich" element={<DatLichPage />} />
        <Route path="/lien-he" element={<LienHePage />} />
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
