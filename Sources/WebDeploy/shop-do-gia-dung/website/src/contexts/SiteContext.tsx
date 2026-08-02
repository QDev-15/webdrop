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
  colors?: string
  description?: string
  rating?: number
  sold?: number
  stock?: boolean
  badge?: string
  image?: string
  gallery?: string
  video_url?: string
  specs?: string
  brand?: string
  skin_type?: string
  sizes?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  image?: string
  product_count?: number
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
        // Settings — PublicController trả { data: {...} }
        const settingsResponse = await fetch('/api/public/settings')
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData.data ?? settingsData)
        }

        // Products — dùng per_page=500 để preload toàn bộ cho filter client-side
        const productsResponse = await fetch('/api/public/products?per_page=500')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          const rawProducts: Record<string, unknown>[] = Array.isArray(productsData) ? productsData : (productsData as { items?: unknown[] }).items || []
          // Transform snake_case → camelCase tại 1 chỗ duy nhất — không sửa rải rác từng page
          const mapped: Product[] = rawProducts.map((p) => ({
            id: Number(p.id),
            name: String(p.name ?? ''),
            slug: String(p.slug ?? ''),
            price: Number(p.price) || 0,
            salePrice: p.price_sale ? Number(p.price_sale) : null,
            category: String(p.category_slug ?? ''),
            categoryName: String(p.category_name ?? ''),
            theme: String(p.theme ?? ''),
            material: p.material !== undefined ? String(p.material) : undefined,
            color: p.colors ? String(p.colors).split('|')[0]?.split(':')[0] : undefined,
            colorName: p.colors ? String(p.colors).split('|')[0]?.split(':')[0] : undefined,
            colorHex: p.colors ? String(p.colors).split('|')[0]?.split(':')[1] : undefined,
            colors: p.colors !== undefined ? String(p.colors) : undefined,
            description: p.description !== undefined ? String(p.description) : undefined,
            rating: p.rating != null ? Number(p.rating) : undefined,
            sold: p.sold != null ? Number(p.sold) : undefined,
            stock: p.in_stock != null ? Boolean(Number(p.in_stock)) : undefined,
            badge: p.badge !== undefined ? String(p.badge) : undefined,
            image: p.image !== undefined ? String(p.image) : undefined,
            gallery: p.gallery !== undefined ? String(p.gallery) : undefined,
            video_url: p.video_url !== undefined ? String(p.video_url) : undefined,
            specs: p.specs !== undefined ? String(p.specs) : undefined,
            brand: p.brand !== undefined ? String(p.brand) : undefined,
            skin_type: p.skin_type !== undefined ? String(p.skin_type) : undefined,
            sizes: p.sizes !== undefined ? String(p.sizes) : undefined,
          }))
          setProducts(mapped)
        }

        // Categories — ShopPublicController::categories() trả { data: [...] }
        const catsResponse = await fetch('/api/public/product-categories')
        if (catsResponse.ok) {
          const catsData = await catsResponse.json()
          setCategories(Array.isArray(catsData) ? catsData : (catsData as { data?: unknown[]; items?: unknown[] }).data || (catsData as { items?: unknown[] }).items || [])
        }
      } catch {
        setSettings({
          site_name: 'Shop Đồ Gia Dụng',
          site_slogan: 'Đồ Gia Dụng Chất Lượng Cao',
          site_phone: '0900 888 666',
          site_email: 'hello@shopgiadung.vn',
          site_address: '456 Nguyễn Huệ, Q.1, TP.HCM',
          site_description: 'Cửa hàng đồ gia dụng chất lượng cao với giá hợp lý',
          working_hours: '9:00 – 20:00 · Tất cả các ngày',
          shipping_fee: '50000',
          free_shipping_threshold: '500000',
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
  if (!context) throw new Error('useSite must be used within SiteProvider')
  return context
}
