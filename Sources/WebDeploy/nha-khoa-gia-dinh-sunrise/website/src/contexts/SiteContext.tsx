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
  hero_image?: string
  hero_float_years?: string
  hero_float_label?: string
  hero_meta_families?: string
  hero_meta_rating?: string
  stat_years?: string
  stat_years_label?: string
  stat_families?: string
  stat_families_label?: string
  stat_staff?: string
  stat_staff_label?: string
  stat_satisfaction?: string
  stat_satisfaction_label?: string
  about_strip1_title?: string
  about_strip1_text?: string
  about_strip1_badge_num?: string
  about_strip1_badge_label?: string
  about_strip1_image?: string
  about_strip2_title?: string
  about_strip2_text?: string
  about_strip2_badge_num?: string
  about_strip2_badge_label?: string
  about_strip2_image?: string
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
