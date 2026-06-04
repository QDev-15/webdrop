import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name: string
  site_tagline: string
  site_description: string
  site_email: string
  site_phone: string
  site_phone_2: string
  site_address: string
  working_hours: string
  social_facebook: string
  social_linkedin: string
  social_youtube: string
  social_twitter: string
  social_zalo: string
  footer_copyright: string
  footer_description: string
  footer_show_social: string
  hero_badge: string
  hero_heading: string
  hero_sub: string
  stat_customers: string
  stat_uptime: string
  stat_integrations: string
  stat_support: string
  trusted_by: string
  meta_title: string
  meta_description: string
  [key: string]: string
}

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
}

interface SiteContextType {
  settings: SiteSettings
  slides: HeroSlide[]
  loading: boolean
}

const defaults: SiteSettings = {
  site_name: 'TechFlow',
  site_tagline: 'Nền tảng tự động hóa thông minh',
  site_description: '',
  site_email: 'hello@techflow.vn',
  site_phone: '1900 1234',
  site_phone_2: '',
  site_address: 'TP. Hồ Chí Minh',
  working_hours: 'Thứ Hai – Thứ Sáu: 8:00 – 18:00',
  social_facebook: '',
  social_linkedin: '',
  social_youtube: '',
  social_twitter: '',
  social_zalo: '',
  footer_copyright: '© 2024 TechFlow.',
  footer_description: '',
  footer_show_social: '1',
  hero_badge: 'Ra mắt v2.0 — Thử nghiệm miễn phí 14 ngày',
  hero_heading: 'Giải pháp tự động hóa cho doanh nghiệp Việt Nam.',
  hero_sub: 'TechFlow giúp đội ngũ tự động hóa quy trình và phân tích dữ liệu real-time.',
  stat_customers: '500+',
  stat_uptime: '99.9%',
  stat_integrations: '100+',
  stat_support: '24/7',
  trusted_by: 'Shopee,Grab,Tiki,MoMo,VNG Corp,Zalo',
  meta_title: 'TechFlow',
  meta_description: '',
}

const SiteContext = createContext<SiteContextType>({ settings: defaults, slides: [], loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults)
  const [slides, setSlides]     = useState<HeroSlide[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings({ ...defaults, ...s })
      setSlides(sl)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() { return useContext(SiteContext) }
