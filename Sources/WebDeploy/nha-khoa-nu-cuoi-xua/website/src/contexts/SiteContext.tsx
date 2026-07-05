import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_tagline?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  zalo?: string
  zalo_number?: string
  hero_badge?: string
  hero_title?: string
  hero_subtitle?: string
  hero_lead?: string
  hero_image?: string
  stat_cases?: string
  stat_cases_label?: string
  stat_doctors?: string
  stat_doctors_label?: string
  stat_years?: string
  stat_years_label?: string
  stat_satisfaction?: string
  stat_satisfaction_label?: string
  story_year?: string
  story_title?: string
  story_text?: string
  story_image?: string
  facebook?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  map_embed?: string
  footer_copy?: string
  footer_cert?: string
}

interface SiteCtx { settings: SiteSettings }

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
