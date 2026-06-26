import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../api/client'

export interface Settings {
  site_name: string
  site_tagline: string
  site_description: string
  site_phone: string
  site_email: string
  site_address: string
  working_hours: string
  footer_description: string
  social_facebook: string
  social_instagram: string
  social_youtube: string
  social_zalo: string
  google_maps_url: string
  meta_title: string
  meta_description: string
  [key: string]: string
}

const defaultSettings: Settings = {
  site_name: 'Balance Pilates Studio',
  site_tagline: 'Studio Pilates & Fitness Hiện Đại',
  site_description: '',
  site_phone: '0901 234 567',
  site_email: 'info@balancepilates.vn',
  site_address: '123 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
  working_hours: 'T2–T7: 6:30 – 21:00 | CN: 7:00 – 17:00',
  footer_description: 'Studio pilates chuyên nghiệp — nơi sức khỏe, sự cân bằng và vẻ đẹp gặp nhau.',
  social_facebook: '',
  social_instagram: '',
  social_youtube: '',
  social_zalo: '',
  google_maps_url: '',
  meta_title: '',
  meta_description: '',
}

interface SiteContextType {
  settings: Settings
  loading: boolean
}

const SiteContext = createContext<SiteContextType>({ settings: defaultSettings, loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get<Record<string, string>>('/public/settings')
      .then(data => setSettings({ ...defaultSettings, ...data }))
      .catch(() => {/* use defaults */})
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
