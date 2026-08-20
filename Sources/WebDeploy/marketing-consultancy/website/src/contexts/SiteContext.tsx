import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  [key: string]: string | undefined
}

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  button_text: string
  button_link: string
  sort_order: number
}

export interface Service {
  id: number
  icon: string
  title: string
  short_desc: string
  long_desc: string
  image: string
  sort_order: number
}

export interface TeamMember {
  id: number
  name: string
  position: string
  bio: string
  avatar: string
  tier: string
  sort_order: number
}

export interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
}

interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
  services: Service[]
  team: TeamMember[]
  testimonials: Testimonial[]
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], services: [], team: [], testimonials: [], loaded: false })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings]         = useState<SiteSettings>({})
  const [slides, setSlides]             = useState<HeroSlide[]>([])
  const [services, setServices]         = useState<Service[]>([])
  const [team, setTeam]                 = useState<TeamMember[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loaded, setLoaded]             = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Service[]>('/public/services'),
      api.get<TeamMember[]>('/public/team'),
      api.get<Testimonial[]>('/public/testimonials'),
    ])
      .then(([s, sl, sv, tm, ts]) => {
        setSettings(s)
        setSlides(sl)
        setServices(sv)
        setTeam(tm)
        setTestimonials(ts)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, services, team, testimonials, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
