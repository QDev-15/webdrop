import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface Product {
  id: number
  category_id: number | null
  category_slug: string
  name: string
  slug: string
  image: string
  price: number
  price_sale: number | null
  color?: string
  sizes?: string[]
  brand?: string
  review_count?: number
  sold_count?: number
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
      api.get<Category[]>('/public/product-categories'),
    ]).then(([s, p, c]) => {
      setSettings(s)
      setProducts(p)
      setCategories(c)
    }).catch(err => {
      console.error('Failed to fetch site data:', err)
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
