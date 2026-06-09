import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../api/client'

interface SiteData {
  settings: Record<string, string>
  slides: Slide[]
  services: Service[]
  projects: Project[]
  testimonials: Testimonial[]
}

export interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
}

export interface Service {
  id: number
  name: string
  description: string
  icon: string
  image: string
}

export interface Project {
  id: number
  name: string
  slug: string
  category: string
  description: string
  location: string
  year_completed: string
  area: string
  floors: string
  duration: string
  value: string
  image: string
  featured: number
}

export interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

const SiteContext = createContext<SiteData | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [slides, setSlides] = useState<Slide[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
      api.get<Service[]>('/public/services'),
      api.get<Project[]>('/public/projects'),
      api.get<Testimonial[]>('/public/testimonials'),
    ]).then(([s, sl, sv, pr, te]) => {
      setSettings(s)
      setSlides(sl)
      setServices(sv)
      setProjects(pr)
      setTestimonials(te)
    }).catch(console.error)
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, services, projects, testimonials }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
