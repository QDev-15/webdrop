import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_description?: string
  site_logo?: string
  site_email?: string
  site_phone?: string
  site_phone_2?: string
  site_address?: string
  working_hours?: string
  footer_copyright?: string
  footer_description?: string
  footer_show_social?: string
  social_facebook?: string
  social_instagram?: string
  social_tiktok?: string
  social_zalo?: string
  social_youtube?: string
  about_title?: string
  about_content?: string
  about_tagline?: string
  about_image?: string
  stat_regions?: string
  stat_years?: string
  stat_cups_day?: string
  meta_title?: string
  meta_description?: string
  google_map_embed?: string
  contact_form_enabled?: string
  reservation_note?: string
  [key: string]: string | undefined
}

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
}

interface SiteData {
  settings: SiteSettings
  slides: HeroSlide[]
  loading: boolean
}

const SiteContext = createContext<SiteData>({
  settings: {},
  slides: [],
  loading: true,
})

export function SiteProvider({ children }: { children: ReactNode }) {
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
    }).catch(console.error)
     .finally(() => setLoading(false))
  }, [])
  // Cập nhật favicon từ settings
  useEffect(() => {
    if (!settings.site_favicon) return
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = settings.site_favicon
  }, [settings.site_favicon])


  return (
    <SiteContext.Provider value={{ settings, slides, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}

