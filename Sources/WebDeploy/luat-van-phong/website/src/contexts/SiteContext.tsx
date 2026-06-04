import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface Settings {
  [key: string]: string
}

export interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
}

export interface Lawyer {
  id: number
  name: string
  role: string
  bio: string
  speciality: string
  avatar: string
  tags: string
  is_partner: number
}

export interface Service {
  id: number
  name: string
  slug: string
  tag: string
  description: string
  items: string[]
}

export interface Case {
  id: number
  title: string
  category: string
  summary: string
  outcome: string
  year: number
  location: string
}

export interface Testimonial {
  id: number
  author_name: string
  author_title: string
  content: string
  case_type: string
}

interface SiteData {
  settings: Settings
  slides: Slide[]
  services: Service[]
  lawyers: Lawyer[]
  cases: Case[]
  testimonials: Testimonial[]
  loading: boolean
}

const SiteContext = createContext<SiteData>({
  settings: {}, slides: [], services: [], lawyers: [], cases: [], testimonials: [], loading: true,
})

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>({
    settings: {}, slides: [], services: [], lawyers: [], cases: [], testimonials: [], loading: true,
  })

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
      api.get<Service[]>('/public/services'),
      api.get<Lawyer[]>('/public/lawyers'),
      api.get<Case[]>('/public/cases'),
      api.get<Testimonial[]>('/public/testimonials'),
    ]).then(([settings, slides, services, lawyers, cases, testimonials]) => {
      setData({ settings, slides, services, lawyers, cases, testimonials, loading: false })
      if (settings.meta_title) document.title = settings.meta_title
      if (settings.meta_description) {
        const meta = document.querySelector('meta[name="description"]')
        if (meta) meta.setAttribute('content', settings.meta_description)
      }
    }).catch(() => {
      setData(d => ({ ...d, loading: false }))
    })
  }, [])

  return <SiteContext.Provider value={data}>{children}</SiteContext.Provider>
}

export function useSite() { return useContext(SiteContext) }
