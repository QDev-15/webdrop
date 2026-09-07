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

export interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
  post_count: number
}

export interface Testimonial {
  id: number
  author_name: string
  author_avatar: string
  author_meta: string
  content: string
  sort_order: number
}

export interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
}

interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
  categories: Category[]
  testimonials: Testimonial[]
  faqs: Faq[]
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], categories: [], testimonials: [], faqs: [], loaded: false })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings]         = useState<SiteSettings>({})
  const [slides, setSlides]             = useState<HeroSlide[]>([])
  const [categories, setCategories]     = useState<Category[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs]                 = useState<Faq[]>([])
  const [loaded, setLoaded]             = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Category[]>('/public/categories'),
      api.get<Testimonial[]>('/public/testimonials'),
      api.get<Faq[]>('/public/faqs'),
    ])
      .then(([s, sl, cats, ts, fs]) => {
        setSettings(s)
        setSlides(sl)
        setCategories(cats)
        setTestimonials(ts)
        setFaqs(fs)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, categories, testimonials, faqs, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
