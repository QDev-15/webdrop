import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

interface SiteSettings {
  [key: string]: string
}

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

interface Service {
  id: number
  name: string
  slug: string
  description: string
  content: string
  icon: string
  image: string
  price: string
  featured: number
  sort_order: number
  status: string
}

interface TeamMember {
  id: number
  name: string
  position: string
  bio: string
  experience: string
  avatar: string
  certificates: string
  sort_order: number
  is_leader: number
  status: string
}

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
}

interface SiteData {
  settings: SiteSettings
  slides: HeroSlide[]
  services: Service[]
  team: TeamMember[]
  testimonials: Testimonial[]
  loading: boolean
}

const SiteContext = createContext<SiteData>({
  settings: {},
  slides: [],
  services: [],
  team: [],
  testimonials: [],
  loading: true,
})

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Service[]>('/public/services'),
      api.get<TeamMember[]>('/public/team'),
      api.get<Testimonial[]>('/public/testimonials'),
    ]).then(([s, sl, sv, tm, te]) => {
      setSettings(s)
      setSlides(sl)
      setServices(sv)
      setTeam(tm)
      setTestimonials(te)
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
    <SiteContext.Provider value={{ settings, slides, services, team, testimonials, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}

export type { SiteSettings, HeroSlide, Service, TeamMember, Testimonial }

