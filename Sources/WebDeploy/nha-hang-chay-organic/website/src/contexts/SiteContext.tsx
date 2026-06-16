import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_description?: string
  site_logo?: string
  site_email?: string
  site_phone?: string
  site_phone_2?: string
  site_address?: string
  working_hours?: string
  footer_copyright?: string
  footer_description?: string
  footer_show_social?: string
  social_facebook?: string
  social_instagram?: string
  social_youtube?: string
  social_tiktok?: string
  social_zalo?: string
  about_title?: string
  about_tagline?: string
  about_content?: string
  about_image?: string
  reservation_enabled?: string
  reservation_note?: string
  contact_form_enabled?: string
  google_map_embed?: string
  [key: string]: string | undefined
}

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

export interface MenuItem {
  id: number
  category_id: number | null
  category_name: string
  category_slug: string
  name: string
  description: string
  tags: string
  price: number | null
  calories: string
  image: string
  featured: number
  sort_order: number
}

export interface MenuCategory {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  item_count: number
}

export interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

export interface GalleryItem {
  id: number
  title: string
  image: string
  category: string
}

interface SiteData {
  settings: SiteSettings
  slides: HeroSlide[]
  menuCategories: MenuCategory[]
  menuItems: MenuItem[]
  featuredItems: MenuItem[]
  testimonials: Testimonial[]
  gallery: GalleryItem[]
  loading: boolean
}

const SiteContext = createContext<SiteData | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<MenuCategory[]>('/public/menu-categories'),
      api.get<MenuItem[]>('/public/menu-items'),
      api.get<MenuItem[]>('/public/featured-items'),
      api.get<Testimonial[]>('/public/testimonials'),
      api.get<GalleryItem[]>('/public/gallery'),
    ]).then(([s, sl, cats, allItems, items, testis, gal]) => {
      setSettings(s)
      setSlides(sl)
      setMenuCategories(cats)
      setMenuItems(allItems)
      setFeaturedItems(items)
      setTestimonials(testis)
      setGallery(gal)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, menuCategories, menuItems, featuredItems, testimonials, gallery, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
