import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export type Settings = Record<string, string>

export interface HeroSlide { id: number; image: string; alt: string; sort_order: number }
export interface Service {
  id: number; category_id: number | null; name: string; tag: string
  description: string; price: string; duration: string; image: string
  featured: number; sort_order: number; category_name?: string; category_icon?: string
}
export interface Testimonial {
  id: number; author_name: string; author_location: string; author_avatar: string
  content: string; rating: number; sort_order: number
}
export interface TeamMember {
  id: number; name: string; role: string; image: string
  experience: string; specialty1: string; specialty2: string; sort_order: number
}
export interface ServiceCategory { id: number; name: string; icon: string; sort_order: number }

interface SiteContextValue {
  settings: Settings
  slides: HeroSlide[]
  services: Service[]
  testimonials: Testimonial[]
  team: TeamMember[]
  serviceCategories: ServiceCategory[]
  ready: boolean
}

const SiteContext = createContext<SiteContextValue>({
  settings: {}, slides: [], services: [], testimonials: [], team: [], serviceCategories: [], ready: false
})

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Service[]>('/public/services'),
      api.get<Testimonial[]>('/public/testimonials'),
      api.get<TeamMember[]>('/public/team'),
      api.get<ServiceCategory[]>('/public/service-categories'),
    ]).then(([s, sl, sv, t, tm, sc]) => {
      setSettings(s); setSlides(sl); setServices(sv)
      setTestimonials(t); setTeam(tm); setServiceCategories(sc)
      setReady(true)
    }).catch(() => setReady(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, services, testimonials, team, serviceCategories, ready }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() { return useContext(SiteContext) }
