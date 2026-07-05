import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import BeforeAfterPage from './pages/BeforeAfterPage'
import TeamPage from './pages/TeamPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'

// ── SiteContext ──────────────────────────────────────────────
export interface SiteSettings {
  site_name: string
  site_tagline: string
  site_phone: string
  site_email: string
  site_address: string
  working_hours: string
  facebook: string
  instagram: string
  zalo: string
  hero_title_line1: string
  hero_title_line2: string
  hero_subtitle: string
  stat_cases: string
  stat_doctors: string
  stat_years: string
  stat_satisfaction: string
  [key: string]: string
}

const defaultSettings: SiteSettings = {
  site_name: 'LuxDental',
  site_tagline: 'Nha Khoa Thẩm Mỹ Cao Cấp',
  site_phone: '1800 1234',
  site_email: 'hello@luxdental.vn',
  site_address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
  working_hours: 'T2–T7: 8:00–20:00 | CN: 8:00–17:00',
  facebook: 'https://facebook.com/luxdental',
  instagram: 'https://instagram.com/luxdental',
  zalo: 'https://zalo.me/luxdental',
  hero_title_line1: 'Nụ cười',
  hero_title_line2: 'Đẳng cấp',
  hero_subtitle: 'Chuyên gia thẩm mỹ nha khoa — Veneer sứ · Bọc răng sứ · Tẩy trắng · Niềng răng. Thiết kế nụ cười hoàn hảo, chuẩn thẩm mỹ quốc tế.',
  stat_cases: '8.500+',
  stat_doctors: '12',
  stat_years: '10',
  stat_satisfaction: '99%',
}

interface SiteCtx {
  settings: SiteSettings
  loading: boolean
  apiBase: string
}

export const SiteContext = createContext<SiteCtx>({
  settings: defaultSettings,
  loading: true,
  apiBase: '',
})
export const useSite = () => useContext(SiteContext)

function getApiBase(): string {
  if (typeof window === 'undefined') return ''
  const { hostname, protocol } = window.location
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8081/api'
  }
  return `${protocol}//${hostname}/api`
}

// ── AppShell ─────────────────────────────────────────────────
function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const ioRef = useRef<IntersectionObserver | null>(null)
  const moRef = useRef<MutationObserver | null>(null)

  const attachReveal = () => {
    if (ioRef.current) ioRef.current.disconnect()
    ioRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible') }),
      { threshold: 0.08 },
    )
    document.querySelectorAll('[data-reveal]').forEach(el => ioRef.current!.observe(el))
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setTimeout(attachReveal, 50)

    const root = document.getElementById('root')
    if (root) {
      moRef.current = new MutationObserver(() => setTimeout(attachReveal, 30))
      moRef.current.observe(root, { childList: true, subtree: true })
    }
    return () => { ioRef.current?.disconnect(); moRef.current?.disconnect() }
  }, [location.pathname])

  return (
    <>
      <Header />
      <main style={{ paddingTop: 76 }}>{children}</main>
      <Footer />
    </>
  )
}

// ── SiteProvider ─────────────────────────────────────────────
function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const apiBase = getApiBase()

  useEffect(() => {
    fetch(`${apiBase}/public/settings`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const s: SiteSettings = { ...defaultSettings }
        if (Array.isArray(data.data)) {
          data.data.forEach((row: { key: string; value: string }) => {
            s[row.key] = row.value ?? ''
          })
        }
        setSettings(s)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [apiBase])

  return (
    <SiteContext.Provider value={{ settings, loading, apiBase }}>
      {children}
    </SiteContext.Provider>
  )
}

function NotFound() {
  return (
    <div className="sec-pad" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 80, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: 24, fontWeight: 800, textTransform: 'uppercase', marginTop: 16, marginBottom: 12 }}>Trang không tìm thấy</div>
      <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>Trang bạn truy cập không tồn tại.</p>
      <a href="/" className="lx-btn lx-btn-accent">Về trang chủ</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dich-vu" element={<ServicesPage />} />
            <Route path="/truoc-sau" element={<BeforeAfterPage />} />
            <Route path="/bac-si" element={<TeamPage />} />
            <Route path="/dat-lich" element={<BookingPage />} />
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </SiteProvider>
    </BrowserRouter>
  )
}
