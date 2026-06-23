import { createContext, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { api } from './api/client'
import './styles/template.css'

import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import About from './components/About'
import Menu from './components/Menu'
import Testimonials from './components/Testimonials'
import Reservation from './components/Reservation'
import Contact from './components/Contact'

// ── Site Context ──────────────────────────────────────────────────────────────
type Settings = Record<string, string>
interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  badge: string
  cta_text: string
  cta_url: string
}
interface SiteCtx {
  settings: Settings
  slides: Slide[]
  loading: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], loading: true })
export const useSite = () => useContext(SiteContext)

function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    }).catch(() => {/* use defaults */}).finally(() => setLoading(false))
  }, [])

  return <SiteContext.Provider value={{ settings, slides, loading }}>{children}</SiteContext.Provider>
}

// ── Global reveal observer — runs on every route change + after settings load ──
function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } }),
        { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
      )
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  )
}

// ── Pages ─────────────────────────────────────────────────────────────────────
function HomePage() {
  const { settings } = useSite()

  const zaloPhone = settings['zalo_phone'] || '0901234567'

  return (
    <>
      <HeroSlider />
      <Menu preview />
      <About />
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">La Cave à Vins</div>
            <h2 className="sec-title">Hầm rượu <em>tuyển chọn</em></h2>
            <p className="sec-sub">{settings['wine_description'] || 'Hơn 80 nhãn rượu vang từ các vùng nổi tiếng của Pháp — Bordeaux, Bourgogne, Champagne và Rhône.'}</p>
          </div>
          <div className="row g-3">
            {[
              { region: 'Bordeaux, Pháp', name: 'Château Margaux', year: 'Grand Cru Classé · 2018', desc: 'Phức tạp, đậm vị với hậu vị dài. Hoàn hảo cùng thịt đỏ.', price: 'từ 4.200.000đ / chai', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop' },
              { region: 'Bourgogne, Pháp', name: 'Pinot Noir Prestige', year: 'Premier Cru · 2020', desc: 'Mềm mại, hương anh đào đỏ, tanin thanh tao. Cùng với vịt.', price: 'từ 2.800.000đ / chai', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80&auto=format&fit=crop' },
              { region: 'Champagne, Pháp', name: 'Brut Millésimé', year: 'Vintage · 2019', desc: 'Bọt mịn, hương bánh mì nướng và đào trắng. Lý tưởng khai vị.', price: 'từ 3.500.000đ / chai', img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&q=80&auto=format&fit=crop' },
              { region: 'Alsace, Pháp', name: 'Riesling Grand Cru', year: 'Reserve · 2021', desc: 'Khô, khoáng, hương hoa trắng tinh tế. Hoàn hảo với cá và hải sản.', price: 'từ 1.850.000đ / chai', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80&auto=format&fit=crop' },
            ].map((w, i) => (
              <div className="col-md-3 col-6" key={i}>
                <div className={`wine-card reveal reveal-d${i + 1}`}>
                  <img className="wc-img" src={w.img} alt={w.name} loading="lazy" />
                  <div className="wc-body">
                    <div className="wc-region">{w.region}</div>
                    <div className="wc-name">{w.name}</div>
                    <div className="wc-year">{w.year}</div>
                    <div className="wc-desc">{w.desc}</div>
                    <div className="wc-price">{w.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Reservation preview />
      <Testimonials />
      <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0', textAlign: 'center' }}>
        <div className="wd-container reveal">
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,.25)', marginBottom: 20 }}>Nous vous attendons</div>
          <div style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: '#fff', letterSpacing: '-.5px', marginBottom: 8 }}>{settings['site_name'] || 'Le Bistro Français'}</div>
          <div style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.3)', marginBottom: 4, fontStyle: 'italic' }}>{settings['site_address'] || ''}</div>
          <div style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.3)', marginBottom: 28 }}>Thứ Ba – Chủ Nhật · 18:00 – 22:30</div>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a href="/reservation" className="btn-accent">Réserver une table</a>
            <a href="/lien-he" className="btn-outline-dark">Contact</a>
          </div>
        </div>
      </section>
      {/* Zalo float */}
      <div className="zf">
        <div className="zf-tip">Réserver via Zalo</div>
        <a href={`https://zalo.me/${zaloPhone}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
      </div>
    </>
  )
}

function MenuPage() {
  const { settings } = useSite()
  const zaloPhone = settings['zalo_phone'] || '0901234567'
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Notre Carte</div>
          <h1 className="ph-title">Thực đơn <em>mùa này</em></h1>
          <p className="ph-sub">Chúng tôi thay đổi thực đơn theo mùa để mang đến những nguyên liệu tươi ngon nhất trong từng thời điểm.</p>
        </div>
      </div>
      <Menu />
      <div className="zf">
        <div className="zf-tip">Réserver via Zalo</div>
        <a href={`https://zalo.me/${zaloPhone}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
      </div>
    </>
  )
}

function ReservationPage() {
  const { settings } = useSite()
  const zaloPhone = settings['zalo_phone'] || '0901234567'
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Réservation</div>
          <h1 className="ph-title">Đặt bàn cho <em>dịp đặc biệt</em></h1>
          <p className="ph-sub">Hãy để chúng tôi chuẩn bị một bữa tối không thể quên cho bạn và người thân.</p>
        </div>
      </div>
      <Reservation />
      <div className="zf">
        <div className="zf-tip">Đặt bàn qua Zalo</div>
        <a href={`https://zalo.me/${zaloPhone}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
      </div>
    </>
  )
}

function ContactPage() {
  const { settings } = useSite()
  const zaloPhone = settings['zalo_phone'] || '0901234567'
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Contact</div>
          <h1 className="ph-title">Nous <em>trouver</em></h1>
          <p className="ph-sub">Tìm chúng tôi tại trung tâm thành phố — nơi ẩm thực Pháp và không khí Việt Nam giao thoa.</p>
        </div>
      </div>
      <Contact />
      <div className="zf">
        <div className="zf-tip">Đặt bàn qua Zalo</div>
        <a href={`https://zalo.me/${zaloPhone}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
      </div>
    </>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AppShell />
      </SiteProvider>
    </BrowserRouter>
  )
}
