import { useState, useEffect, createContext, useContext } from 'react'
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

interface Settings {
  site_name?: string
  site_description?: string
  site_logo?: string
  site_email?: string
  site_phone?: string
  site_phone_2?: string
  site_address?: string
  working_hours?: string
  social_facebook?: string
  social_youtube?: string
  social_instagram?: string
  social_tiktok?: string
  social_zalo?: string
  footer_copyright?: string
  footer_description?: string
  meta_title?: string
  meta_description?: string
  about_title?: string
  about_content?: string
  about_image?: string
  reservation_enabled?: string
  google_map_embed?: string
  primary_color?: string
  [key: string]: string | undefined
}

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

interface SiteData {
  settings: Settings
  slides: Slide[]
}

const SiteContext = createContext<SiteData>({ settings: {}, slides: [] })

export function useSite() {
  return useContext(SiteContext)
}

export default function App() {
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
      // Apply primary color if configured
      if (s.primary_color) {
        document.documentElement.style.setProperty('--accent', s.primary_color)
      }
    }).catch(() => {
      // Fallback silently — site still renders with empty data
    }).finally(() => setLoading(false))
  }, [])

  useDocumentMeta({
    title: settings.meta_title || settings.site_name || 'Fine Dining Cao Cap',
    description: settings.meta_description || settings.site_description,
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0906' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🍽</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', letterSpacing: 2, textTransform: 'uppercase' }}>Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <SiteContext.Provider value={{ settings, slides }}>
      <Header />
      <main>
        <HeroSlider />
        <About />
        <Menu />
        <Gallery />
        <Testimonials />
        <Reservation />
        <Contact />
      </main>
      <Footer />
      {/* Zalo float button */}
      {settings.social_zalo && (
        <div className="zf">
          <div className="zf-tip">Chat Zalo ngay</div>
          <a href={`https://zalo.me/${settings.social_zalo}`} className="zf-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
            💬
          </a>
        </div>
      )}
    </SiteContext.Provider>
  )
}
