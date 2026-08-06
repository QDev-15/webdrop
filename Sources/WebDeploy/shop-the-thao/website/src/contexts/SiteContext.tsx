import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../api/client'

// Khớp 1-1 với response thật của GET /public/products (ShopPublicController::products())
// — cột "colors" là chuỗi pipe-separated "Tên:#hex|Tên2:#hex2", "sizes"/"theme" là padded-pipe
// "|S|M|L|", KHÔNG có field "color"/"review_count"/"sold_count" nào ở tầng API — dùng
// parseColorNames()/rating/sold bên dưới thay vì đọc field ảo không tồn tại.
export interface Product {
  id: number
  category_id: number | null
  category_slug: string
  category_name?: string
  name: string
  slug: string
  image: string
  price: number
  price_sale: number | null
  colors?: string
  sizes?: string
  theme?: string
  brand?: string
  badge?: string | null
  rating?: number
  sold?: number
  in_stock?: number
  is_featured?: number
  is_new?: number
}

// "Xám:#8b8b8b|Đen:#000000" → ['Xám', 'Đen']
export function parseColorNames(colors?: string): string[] {
  if (!colors) return []
  return colors.split('|').map(c => c.split(':')[0].trim()).filter(Boolean)
}

// "Xám:#8b8b8b|Đen:#000000" → [{ name: 'Xám', hex: '#8b8b8b' }, { name: 'Đen', hex: '#000000' }]
export function parseColorPairs(colors?: string): { name: string; hex: string }[] {
  if (!colors) return []
  return colors.split('|').filter(Boolean).map(c => {
    const [name, hex] = c.split(':')
    return { name: (name ?? '').trim(), hex: (hex ?? '#ccc').trim() }
  }).filter(c => c.name)
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

interface Settings {
  [key: string]: string
}

interface SiteContextType {
  settings: Settings
  products: Product[]
  categories: Category[]
  loading: boolean
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Product[]>('/public/products?per_page=200'),
      api.get<Category[]>('/public/categories'),
    ]).then(([s, p, c]) => {
      setSettings(s)
      setProducts(Array.isArray(p) ? p : [])
      setCategories(Array.isArray(c) ? c : [])
    }).catch(() => {
      // Giữ nguyên state rỗng — các trang tự xử lý fallback khi settings/products/categories trống
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <SiteContext.Provider value={{ settings, products, categories, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) throw new Error('useSite must be used within SiteProvider')
  return context
}
