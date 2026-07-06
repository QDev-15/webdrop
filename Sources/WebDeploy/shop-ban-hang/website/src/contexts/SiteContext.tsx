import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { api } from '../api/client'
import { THEMES, DEFAULT_THEME_SLUG } from '../data/themes'

const THEME_CACHE_KEY = 'sb_theme_slug'

function applyTheme(slug: string | undefined): void {
  const theme = THEMES.find(t => t.slug === slug) ?? THEMES.find(t => t.slug === DEFAULT_THEME_SLUG)
  if (!theme) return
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([key, value]) => root.style.setProperty(key, value))
}

// localStorage có thể ném lỗi ở private mode Safari / iframe sandbox / policy chặn storage —
// không được để crash cả trang chỉ vì tính năng chống-flash theme.
function readCachedTheme(): string | null {
  try { return localStorage.getItem(THEME_CACHE_KEY) } catch { return null }
}
function writeCachedTheme(slug: string): void {
  try { localStorage.setItem(THEME_CACHE_KEY, slug) } catch { /* ignore — không có cache thì lần sau chỉ bị flash, không sao */ }
}

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

  // Áp theme đã cache từ lần load trước NGAY trước khi trình duyệt vẽ khung hình đầu tiên —
  // tránh flash màu mặc định rồi mới đổi sang theme thật khi /public/settings trả về (đặc biệt rõ với theme tối).
  useLayoutEffect(() => {
    const cached = readCachedTheme()
    if (cached) applyTheme(cached)
  }, [])

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

  // Áp theme thật từ settings đã fetch (chỉ override biến màu CSS, không đổi layout/font) + lưu cache cho lần load sau
  useEffect(() => {
    if (!settings.site_theme) return
    applyTheme(settings.site_theme)
    writeCachedTheme(settings.site_theme)
  }, [settings.site_theme])

  return <Ctx.Provider value={{ settings, products, categories, testimonials, loading }}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
