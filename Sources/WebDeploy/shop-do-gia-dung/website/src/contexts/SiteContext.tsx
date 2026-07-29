import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface Product {
  id: number
  name: string
  slug: string
  price: number
  salePrice?: number | null
  category: string
  categoryName: string
  theme: string
  material?: string
  color?: string
  colorName?: string
  colorHex?: string
  description?: string
  rating?: number
  sold?: number
  stock?: boolean
  badge?: string
  image?: string
  gallery?: string[]
  specs?: string
  brand?: string
  skin_type?: string
  sizes?: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

interface SiteSettings {
  [key: string]: string | number | boolean
}

interface SiteContextType {
  settings: SiteSettings
  products: Product[]
  categories: Category[]
  loading: boolean
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings
        const settingsResponse = await fetch('/api/public/settings')
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
        } else {
          throw new Error('Failed to fetch settings')
        }

        // Fetch products
        const productsResponse = await fetch('/api/public/products?limit=500')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(Array.isArray(productsData) ? productsData : productsData.items || [])
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/public/product-categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.items || [])
        }
      } catch (error) {
        // Fallback defaults
        setSettings({
          site_name: 'Nhà Đẹp Store',
          site_slogan: 'Đồ Gia Dụng Chất Lượng Cao',
          site_phone: '[SỐ_ĐIỆN_THOẠI]',
          site_email: '[EMAIL]',
          site_address: '[ĐỊA CHỈ]',
          site_description: 'Shop đồ gia dụng chất lượng cao',
          meta_title: 'Nhà Đẹp Store — Đồ Gia Dụng Chất Lượng Cao',
          meta_description: 'Shop đồ gia dụng, trang trí nhà cửa, nội thất nhỏ chất lượng cao',
          working_hours: '[GIỜ LÀM VIỆC]',
          shipping_fee: 30000,
          free_shipping_threshold: 500000,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <SiteContext.Provider value={{ settings, products, categories, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite(): SiteContextType {
  const context = useContext(SiteContext)
  if (!context) {
    throw new Error('useSite must be used within SiteProvider')
  }
  return context
}
