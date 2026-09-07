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
  testimonials: Testimonial[]
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], testimonials: [], loaded: false })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings]         = useState<SiteSettings>({})
  const [slides, setSlides]             = useState<HeroSlide[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loaded, setLoaded]             = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Testimonial[]>('/public/testimonials'),
    ])
      .then(([s, sl, ts]) => {
        setSettings(s)
        setSlides(sl)
        setTestimonials(ts)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, testimonials, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}

// Parse pattern "label||description||secondaryText||secondaryLink" từ hero_slides.subtitle
export function parseSlideSubtitle(subtitle: string) {
  const [label, description, secondaryText, secondaryLink] = (subtitle || '').split('||')
  return {
    label: label ?? '',
    description: description ?? '',
    secondaryText: secondaryText ?? '',
    secondaryLink: secondaryLink ?? '',
  }
}

// Render "Text *nhấn mạnh* text" -> JSX với phần trong dấu * bọc trong <em>
export function renderAccentText(text: string | undefined): ReactNode[] {
  if (!text) return ['']
  const parts = text.split('*')
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))
}
