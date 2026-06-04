import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_tagline?: string
  site_description?: string
  site_email?: string
  site_phone?: string
  site_phone_2?: string
  site_address?: string
  working_hours?: string
  site_zalo?: string
  site_mst?: string
  hero_badge?: string
  hero_line1?: string
  hero_line2?: string
  hero_line3?: string
  hero_sub?: string
  hero_image?: string
  hero_btn1_text?: string
  hero_btn2_text?: string
  stat1_num?: string
  stat1_suffix?: string
  stat1_label?: string
  stat2_num?: string
  stat2_suffix?: string
  stat2_label?: string
  stat3_num?: string
  stat3_suffix?: string
  stat3_label?: string
  stat4_num?: string
  stat4_suffix?: string
  stat4_label?: string
  footer_copyright?: string
  footer_description?: string
  social_facebook?: string
  social_youtube?: string
  social_instagram?: string
  social_zalo?: string
  google_map_embed?: string
  meta_title?: string
  meta_description?: string
  primary_color?: string
  [key: string]: string | undefined
}

interface SiteContextType {
  settings: SiteSettings
  loading: boolean
}

const SiteContext = createContext<SiteContextType>({ settings: {}, loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<SiteSettings>('/public/settings')
      .then(s => setSettings(s))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
