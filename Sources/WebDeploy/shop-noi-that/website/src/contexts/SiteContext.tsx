import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface Product {
  id: number
  category_id: number | null
  category_name: string
  category_slug: string
  collection_id: number | null
  collection_name: string
  name: string
  slug: string
  image: string
  price: number
  price_sale: number | null
  badge: string
  description: string
  colors: string
  material: string
  room: string
  rating: number
  in_stock: number
  is_featured: number
  is_new: number
  sold: number
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string
  product_count: number
}

export interface Collection {
  id: number
  name: string
  slug: string
  description: string
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

export interface Coupon {
  id: number
  code: string
  description: string
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
  collections: Collection[]
  heroSlides: HeroSlide[]
  loading: boolean
}

const Ctx = createContext<SiteCtx>({ settings: {}, categories: [], collections: [], heroSlides: [], loading: true })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      api.get<Category[]>('/public/product-categories'),
      api.get<Collection[]>('/public/collections'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, c, col, h]) => {
      setSettings(s)
      setCategories(c)
      setCollections(col)
      setHeroSlides(h)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ settings, categories, collections, heroSlides, loading }}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
