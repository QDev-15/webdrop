import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface Product {
  id: number
  category_id: number | null
  category_name: string
  category_slug: string
  name: string
  slug: string
  brand: string
  image: string
  gallery: string
  price: number
  price_sale: number | null
  badge: string
  description: string
  features: string
  specs: string
  material: string
  origin: string
  colors: string
  sizes: string
  rating: number
  review_count: number
  sold_count: number
  stock_qty: number
  in_stock: number
  is_featured: number
  is_new: number
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
  author_avatar: string
  author_role: string
  content: string
  stars: number
  product_purchased: string
}

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  btn_text: string
  btn_link: string
  sort_order: number
}

interface SiteCtx {
  settings: Record<string, string>
  products: Product[]
  categories: Category[]
  testimonials: Testimonial[]
  heroSlides: HeroSlide[]
  loading: boolean
}

const Ctx = createContext<SiteCtx>({ settings: {}, products: [], categories: [], testimonials: [], heroSlides: [], loading: true })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      // per_page cao để lấy toàn bộ catalog cho trang chủ/liên quan/giỏ hàng — ProductsPage tự gọi phân trang riêng
      api.get<Product[]>('/public/products?per_page=200'),
      api.get<Category[]>('/public/product-categories'),
      api.get<Testimonial[]>('/public/testimonials'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, p, c, t, h]) => {
      setSettings(s)
      setProducts(p)
      setCategories(c)
      setTestimonials(t)
      setHeroSlides(h)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ settings, products, categories, testimonials, heroSlides, loading }}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
