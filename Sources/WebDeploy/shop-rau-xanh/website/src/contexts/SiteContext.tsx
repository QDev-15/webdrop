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
  price: number
  price_sale: number | null
  badge: string
  description: string
  colors: string
  rating: number
  in_stock: number
  is_featured: number
  is_new: number
  unit: string
  gallery: string
  tags: string
  nutrition: string
  sold_count: number
  stock_qty: number
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string
  product_count: number
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
  products: Product[]
  categories: Category[]
  heroSlides: HeroSlide[]
  loading: boolean
}

const Ctx = createContext<SiteCtx>({ settings: {}, products: [], categories: [], heroSlides: [], loading: true })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      // per_page cao để lấy toàn bộ catalog cho trang chủ/liên quan/giỏ hàng — ProductsPage tự gọi phân trang riêng
      api.get<Product[]>('/public/products?per_page=200'),
      api.get<Category[]>('/public/product-categories'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, p, c, h]) => {
      setSettings(s)
      setProducts(p)
      setCategories(c)
      setHeroSlides(h)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ settings, products, categories, heroSlides, loading }}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
