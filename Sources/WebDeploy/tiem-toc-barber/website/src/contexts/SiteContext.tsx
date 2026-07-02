import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_tagline?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  working_hours_1?: string
  working_hours_2?: string
  working_hours_3?: string
  zalo_number?: string
  stat_customers?: string
  stat_years?: string
  stat_stylists?: string
  stat_satisfaction?: string
  hero_badge?: string
  hero_title_1?: string
  hero_title_em?: string
  hero_subtitle?: string
  hero_image?: string
  booking_confirm_note?: string
  booking_promo_code?: string
  booking_promo_percent?: string
  booking_promo_desc?: string
  facebook_url?: string
  instagram_url?: string
  tiktok_url?: string
  zalo_url?: string
  footer_tagline?: string
  map_embed?: string
  map_embed_url?: string
  [key: string]: string | undefined
}

interface SiteCtx {
  settings: SiteSettings
  loading: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SiteSettings>('/public/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return <SiteContext.Provider value={{ settings, loading }}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
