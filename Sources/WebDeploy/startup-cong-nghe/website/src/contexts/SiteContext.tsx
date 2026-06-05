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
  site_tagline: 'Ná»n táº£ng tá»± Ä‘á»™ng hÃ³a thÃ´ng minh',
  site_description: '',
  site_email: 'hello@techflow.vn',
  site_phone: '1900 1234',
  site_phone_2: '',
  site_address: 'TP. Há»“ ChÃ­ Minh',
  working_hours: 'Thá»© Hai â€“ Thá»© SÃ¡u: 8:00 â€“ 18:00',
  social_facebook: '',
  social_linkedin: '',
  social_youtube: '',
  social_twitter: '',
  social_zalo: '',
  footer_copyright: 'Â© 2024 TechFlow.',
  footer_description: '',
  footer_show_social: '1',
  hero_badge: 'Ra máº¯t v2.0 â€” Thá»­ nghiá»‡m miá»…n phÃ­ 14 ngÃ y',
  hero_heading: 'Giáº£i phÃ¡p tá»± Ä‘á»™ng hÃ³a cho doanh nghiá»‡p Viá»‡t Nam.',
  hero_sub: 'TechFlow giÃºp Ä‘á»™i ngÅ© tá»± Ä‘á»™ng hÃ³a quy trÃ¬nh vÃ  phÃ¢n tÃ­ch dá»¯ liá»‡u real-time.',
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

export function useSite() { return useContext(SiteContext) }

