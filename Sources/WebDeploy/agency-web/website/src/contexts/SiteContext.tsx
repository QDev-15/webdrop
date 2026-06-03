import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

export interface Settings {
  site_name?: string
  site_tagline?: string
  site_description?: string
  site_email?: string
  site_phone?: string
  site_address?: string
  working_hours?: string
  footer_copyright?: string
  footer_description?: string
  social_facebook?: string
  social_youtube?: string
  social_instagram?: string
  social_tiktok?: string
  social_zalo?: string
  social_linkedin?: string
  google_map_embed?: string
  stats_projects?: string
  stats_clients?: string
  stats_years?: string
  stats_rating?: string
  cta_title?: string
  cta_subtitle?: string
  [key: string]: string | undefined
}

export interface HeroSlide {
  id: number
  title: string
  subtitle?: string
  badge_text?: string
  button_text?: string
  button_link?: string
  button2_text?: string
  button2_link?: string
  image?: string
  stat1_num?: string
  stat1_label?: string
  stat2_num?: string
  stat2_label?: string
  stat3_num?: string
  stat3_label?: string
  sort_order: number
  status: string
}

interface SiteData {
  settings: Settings
  slides: HeroSlide[]
  loading: boolean
}

const SiteContext = createContext<SiteData>({ settings: {}, slides: [], loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides]     = useState<HeroSlide[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ])
      .then(([s, sl]) => {
        setSettings(s)
        setSlides(sl)
        // Update document title
        const title = s.meta_title || s.site_name
        if (title) {
          document.title = title
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
