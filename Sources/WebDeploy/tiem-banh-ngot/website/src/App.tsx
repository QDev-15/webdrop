import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { api } from './api/client'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Reservation from './components/Reservation'
import Contact from './components/Contact'
import './styles/template.css'

// ── Types ──────────────────────────────────────────────────────────────────────
export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

export interface SiteSettings {
  site_name?: string
  site_description?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  site_logo?: string
  working_hours?: string
  social_facebook?: string
  social_instagram?: string
  social_tiktok?: string
  social_youtube?: string
  social_zalo?: string
  footer_copyright?: string
  footer_description?: string
  google_map_embed?: string
  meta_title?: string
  about_title?: string
  about_content?: string
  about_image?: string
  about_tagline?: string
  about_stat_years?: string
  about_stat_products?: string
  about_stat_orders?: string
  order_enabled?: string
  order_note?: string
}

// ── Site Context ───────────────────────────────────────────────────────────────
interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
  loading: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], loading: true })

export function useSite() {
  return useContext(SiteContext)
}

function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

// ── Reveal animation — MutationObserver pattern ────────────────────────────────
function RevealObserver() {
  useEffect(() => {
    function observeAll() {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      if (els.length === 0) return
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => io.observe(el))
      return io
    }

    let ioRef: IntersectionObserver | undefined

    // Initial observe
    const timer = setTimeout(() => {
      ioRef = observeAll()
    }, 0)

    // Watch for new DOM nodes (async-loaded sections: products, gallery, testimonials)
    const mo = new MutationObserver(() => {
      if (ioRef) ioRef.disconnect()
      ioRef = observeAll()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      mo.disconnect()
      ioRef?.disconnect()
    }
  }, [])

  return null
}

// ── Home Page ──────────────────────────────────────────────────────────────────
function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'La Douceur Patisserie — Bánh Ngọt Thủ Công Cao Cấp',
    description: settings.site_description || 'Tiệm bánh thủ công cao cấp tại TP.HCM. Bánh kem sinh nhật, macaron Pháp, croissant bơ — làm tươi mỗi ngày từ nguyên liệu nhập khẩu.',
  })
  return (
    <>
      <HeroSlider />
      <About />
      <Menu />
      <Gallery />
      <Testimonials />
    </>
  )
}

// ── Products Page (full-page Menu wrapper) ──────────────────────────────────────
function ProductsPage() {
  useDocumentMeta({
    title: 'Sản phẩm — La Douceur Patisserie',
    description: 'Hơn 200 loại bánh thủ công cao cấp — bánh kem sinh nhật, macaron Pháp, croissant bơ, tart & muffin — làm tươi mỗi ngày tại La Douceur Patisserie.',
  })
  return <Menu fullPage />
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <RevealObserver />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/san-pham" element={<ProductsPage />} />
          <Route path="/dat-hang" element={<Reservation />} />
          <Route path="/lien-he" element={<Contact />} />
        </Routes>
        <Footer />
        {/* Zalo float */}
        <div className="zf">
          <div className="zf-tip">Chat Zalo</div>
          <a href="#" className="zf-btn" title="Zalo">💬</a>
        </div>
      </SiteProvider>
    </BrowserRouter>
  )
}
