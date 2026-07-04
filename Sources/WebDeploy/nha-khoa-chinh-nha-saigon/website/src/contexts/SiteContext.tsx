import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_tagline?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  zalo_number?: string
  hero_badge?: string
  hero_title_1?: string
  hero_title_em?: string
  hero_subtitle?: string
  stat_cases?: string
  stat_doctors?: string
  stat_years?: string
  stat_satisfaction?: string
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  tiktok_url?: string
  map_embed?: string
}

interface SiteCtx {
  settings: SiteSettings
}

const SiteContext = createContext<SiteCtx>({ settings: {} })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    api.get<SiteSettings>('/public/settings').then(setSettings).catch(() => {})
  }, [])

  return <SiteContext.Provider value={{ settings }}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
