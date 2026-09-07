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

export interface MenuCategory {
  id: number
  name: string
  slug: string
  description: string
  image: string
  sort_order: number
  status: string
}

export interface MenuItem {
  id: number
  category_id: number | null
  category_name?: string
  name: string
  slug: string
  description: string
  price: number | null
  price_sale: number | null
  image: string
  badge: string
  allergens: string
  featured: number
  sort_order: number
  status: string
}

export interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
  sort_order: number
  status: string
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

export interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
}

interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
  menuCategories: MenuCategory[]
  menuItems: MenuItem[]
  gallery: GalleryItem[]
  testimonials: Testimonial[]
  faqs: Faq[]
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({
  settings: {}, slides: [], menuCategories: [], menuItems: [], gallery: [], testimonials: [], faqs: [], loaded: false,
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings]             = useState<SiteSettings>({})
  const [slides, setSlides]                 = useState<HeroSlide[]>([])
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems]           = useState<MenuItem[]>([])
  const [gallery, setGallery]               = useState<GalleryItem[]>([])
  const [testimonials, setTestimonials]     = useState<Testimonial[]>([])
  const [faqs, setFaqs]                     = useState<Faq[]>([])
  const [loaded, setLoaded]                 = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<MenuCategory[]>('/public/menu').then(cats => {
        setMenuCategories(cats)
      }),
      api.get<MenuItem[]>('/public/menu-items'),
      api.get<GalleryItem[]>('/public/gallery'),
      api.get<Testimonial[]>('/public/testimonials'),
      api.get<Faq[]>('/public/faqs'),
    ])
      .then(([s, sl, , items, g, t, f]) => {
        setSettings(s)
        setSlides(sl)
        setMenuItems(items)
        setGallery(g)
        setTestimonials(t)
        setFaqs(f)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, menuCategories, menuItems, gallery, testimonials, faqs, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
