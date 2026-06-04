import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

export interface Settings {
  site_name?: string
  site_description?: string
  site_logo?: string
  site_email?: string
  site_phone?: string
  site_address?: string
  working_hours?: string
  social_facebook?: string
  social_youtube?: string
  social_instagram?: string
  social_zalo?: string
  footer_copyright?: string
  footer_description?: string
  about_title?: string
  about_content?: string
  about_image?: string
  about_tagline?: string
  stat_projects?: string
  stat_years?: string
  stat_satisfaction?: string
  stat_clients?: string
  meta_title?: string
  meta_description?: string
  google_map_embed?: string
  [key: string]: string | undefined
}

export interface Slide {
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
  settings: Settings
  slides: Slide[]
  loading: boolean
}

const SiteContext = createContext<SiteData>({ settings: {}, slides: [], loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
    ])
      .then(([s, sl]) => {
        setSettings(s)
        setSlides(sl)
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
