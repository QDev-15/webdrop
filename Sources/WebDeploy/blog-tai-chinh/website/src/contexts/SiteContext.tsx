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
  show_on_home: number
  sort_order: number
  post_count: number
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  author_name: string
  author_avatar: string
  read_time: number
  home_section: string
  home_order: number
  trending_order: number
  published_at: string
  category_name: string | null
  category_slug: string | null
}

export interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  sort_order: number
}

export interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
}

export interface TimelineItem {
  id: number
  year: string
  title: string
  description: string
  sort_order: number
}

interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
  categories: Category[]
  posts: Post[]
  testimonials: Testimonial[]
  faqs: Faq[]
  timeline: TimelineItem[]
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({
  settings: {}, slides: [], categories: [], posts: [], testimonials: [], faqs: [], timeline: [], loaded: false,
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings]         = useState<SiteSettings>({})
  const [slides, setSlides]             = useState<HeroSlide[]>([])
  const [categories, setCategories]     = useState<Category[]>([])
  const [posts, setPosts]               = useState<Post[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs]                 = useState<Faq[]>([])
  const [timeline, setTimeline]         = useState<TimelineItem[]>([])
  const [loaded, setLoaded]             = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Category[]>('/public/categories'),
      api.get<Post[]>('/public/posts'),
      api.get<Testimonial[]>('/public/testimonials'),
      api.get<Faq[]>('/public/faqs'),
      api.get<TimelineItem[]>('/public/timeline'),
    ])
      .then(([s, sl, cats, ps, ts, fs, tl]) => {
        setSettings(s)
        setSlides(sl)
        setCategories(cats)
        setPosts(ps)
        setTestimonials(ts)
        setFaqs(fs)
        setTimeline(tl)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, categories, posts, testimonials, faqs, timeline, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
