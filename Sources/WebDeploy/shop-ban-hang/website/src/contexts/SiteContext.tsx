import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

interface Product {
  id: number
  name: string
  slug: string
  category_name: string
  image: string
  price: number
  price_sale: number
  badge: string
  is_featured: number
  is_new: number
  status: string
}

interface Category {
  id: number
  name: string
  slug: string
  image: string
  product_count: number
}

interface Testimonial {
  id: number
  author_name: string
  author_avatar: string
  author_location: string
  content: string
  stars: number
  product_purchased: string
}

interface SiteCtx {
  settings: Record<string, string>
  products: Product[]
  categories: Category[]
  testimonials: Testimonial[]
  loading: boolean
}

const Ctx = createContext<SiteCtx>({ settings: {}, products: [], categories: [], testimonials: [], loading: true })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      // per_page cao để lấy toàn bộ catalog cho homepage/related/giỏ hàng — ProductsPage tự gọi phân trang riêng
      api.get<Product[]>('/public/products?per_page=200'),
      api.get<Category[]>('/public/product-categories'),
      api.get<Testimonial[]>('/public/testimonials'),
    ]).then(([s, p, c, t]) => {
      setSettings(s)
      setProducts(p)
      setCategories(c)
      setTestimonials(t)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ settings, products, categories, testimonials, loading }}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
