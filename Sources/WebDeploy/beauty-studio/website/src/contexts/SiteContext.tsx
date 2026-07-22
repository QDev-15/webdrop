import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  cta_text: string
  cta_link: string
  sort_order: number
}

interface SiteSettings {
  site_name: string
  site_tagline: string
  site_email: string
  site_phone: string
  site_address: string
  working_hours: string
  facebook: string
  instagram: string
  tiktok: string
  zalo: string
  youtube: string
  footer_about: string
  about_title: string
  about_content: string
  about_image: string
  stat_clients: string
  stat_years: string
  stat_artists: string
  stat_rating: string
  booking_title: string
  booking_subtitle: string
  meta_title: string
  meta_description: string
  [key: string]: string
}

interface SiteContextValue {
  settings: SiteSettings
  slides: HeroSlide[]
  loading: boolean
}

const defaults: SiteSettings = {
  site_name: 'Glow Beauty Studio',
  site_tagline: 'Tóc · Nail · Makeup · Skincare',
  site_email: 'hello@glowbeauty.vn',
  site_phone: '0901 234 567',
  site_address: '123 Đường Đỗ Quang Đẩu, Q.1, TP.HCM',
  working_hours: 'Thứ 2 – Chủ Nhật: 9:00 – 20:00',
  facebook: '', instagram: '', tiktok: '', zalo: '', youtube: '',
  footer_about: 'Không gian làm đẹp tổng hợp – nơi mọi phong cách được tôn vinh.',
  about_title: 'Nghệ thuật làm đẹp — đến từ tâm huyết',
  about_content: 'Glow Beauty Studio là studio tổng hợp với đội ngũ nghệ nhân chuyên nghiệp.',
  about_image: '',
  stat_clients: '5.000+', stat_years: '7+', stat_artists: '12+', stat_rating: '4.9',
  booking_title: 'Đặt lịch ngay hôm nay',
  booking_subtitle: 'Chỉ mất 30 giây — nhận xác nhận trong vòng 1 giờ.',
  meta_title: 'Glow Beauty Studio — Tóc, Nail, Makeup, Skincare tại TP.HCM',
  meta_description: 'Beauty Studio tổng hợp: Tóc, Nail, Makeup, Skincare chuyên nghiệp. Phong cách trendy, Instagram-worthy tại TP. Hồ Chí Minh.',
}

const SiteContext = createContext<SiteContextValue>({ settings: defaults, slides: [], loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults)
  const [slides, setSlides]     = useState<HeroSlide[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings({ ...defaults, ...s })
      setSlides(sl)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <SiteContext.Provider value={{ settings, slides, loading }}>{children}</SiteContext.Provider>
}

export function useSite() { return useContext(SiteContext) }
