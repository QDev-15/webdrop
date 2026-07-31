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
  gallery?: string // JSON array: ["url1","url2","url3"]
  video_url?: string // YouTube URL
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
          // PublicController::settings() trả về { data: {...} } (bọc trong key "data") —
          // trước đây gán thẳng cả object bọc vào state khiến settings.site_name/... luôn
          // undefined toàn site (mọi nơi hiển thị đều rơi về fallback mặc định). Unwrap tại đây.
          setSettings(settingsData.data ?? settingsData)
        } else {
          throw new Error('Failed to fetch settings')
        }

        // Fetch products
        const productsResponse = await fetch('/api/public/products?per_page=500')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          const rawProducts: any[] = Array.isArray(productsData) ? productsData : productsData.items || []
          // API PHP trả field snake_case theo đúng cột DB (price_sale, category_slug, category_name...)
          // — transform 1 chỗ duy nhất ở đây sang camelCase mà toàn bộ page component đang đọc,
          // thay vì sửa lại từng page (HomePage/ProductsPage/ProductDetailPage/CartPage).
          const mapped: Product[] = rawProducts.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price) || 0,
            salePrice: p.price_sale ? Number(p.price_sale) : null,
            category: p.category_slug || '',
            categoryName: p.category_name || '',
            theme: p.theme || '',
            material: p.material,
            color: p.colors ? String(p.colors).split('|')[0]?.split(':')[0] : undefined,
            colorName: p.colors ? String(p.colors).split('|')[0]?.split(':')[0] : undefined,
            colorHex: p.colors ? String(p.colors).split('|')[0]?.split(':')[1] : undefined,
            colors: p.colors,
            description: p.description,
            rating: p.rating !== undefined && p.rating !== null ? Number(p.rating) : undefined,
            sold: p.sold !== undefined && p.sold !== null ? Number(p.sold) : undefined,
            stock: p.in_stock === undefined ? undefined : Boolean(Number(p.in_stock)),
            badge: p.badge,
            image: p.image,
            gallery: p.gallery,
            video_url: p.video_url,
            specs: p.specs,
            brand: p.brand,
            skin_type: p.skin_type,
            sizes: p.sizes,
          }))
          setProducts(mapped)
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/public/product-categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          // ShopPublicController::categories() trả về { data: [...] } (bọc trong key "data") —
          // trước đây chỉ check .items nên luôn rơi về [] (categories luôn rỗng toàn site).
          setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || categoriesData.items || [])
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
