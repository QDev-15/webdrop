import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface Product {
  id: number
  category_id: number | null
  category_name: string
  category_slug: string
  name: string
  slug: string
  image: string
  gallery: string
  price: number
  price_sale: number | null
  badge: string
  description: string
  colors: string
  rating: number
  in_stock: number
  is_featured: number
  is_new: number
  status: string
  // Field riêng shop-dong-ho (đồng hồ)
  brand: string
  material: string
  style: string
  warranty: string
  movement: string
  water_resist: string
  diameter: number
  sold: number
  limited: number
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string
  product_count: number
}

export interface Testimonial {
  id: number
  author_name: string
  author_location: string
  author_avatar: string
  content: string
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

interface SiteCtx {
  settings: Record<string, string>
  categories: Category[]
  heroSlides: HeroSlide[]
  loading: boolean
}

const Ctx = createContext<SiteCtx>({ settings: {}, categories: [], heroSlides: [], loading: true })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      api.get<Category[]>('/public/product-categories'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, c, h]) => {
      setSettings(s)
      setCategories(c)
      setHeroSlides(h)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ settings, categories, heroSlides, loading }}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
