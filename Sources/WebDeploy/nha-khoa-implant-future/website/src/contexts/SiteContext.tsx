import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_tagline?: string
  meta_title?: string
  meta_description?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  zalo_number?: string
  hero_title_main?: string
  hero_subtitle?: string
  stat_cases?: string
  stat_doctors?: string
  stat_years?: string
  stat_satisfaction?: string
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  tiktok_url?: string
  zalo_url?: string
  map_embed?: string
  footer_copy?: string
}

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  button_text: string
  button_link: string
  sort_order: number
}

interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [] })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings').catch(() => ({} as SiteSettings)),
      api.get<HeroSlide[]>('/public/hero-slides').catch(() => [] as HeroSlide[]),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    })
  }, [])

  return <SiteContext.Provider value={{ settings, slides }}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
