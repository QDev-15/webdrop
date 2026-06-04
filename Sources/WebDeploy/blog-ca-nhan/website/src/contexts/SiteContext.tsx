import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_description?: string
  site_logo?: string
  site_email?: string
  site_phone?: string
  site_address?: string
  author_name?: string
  author_title?: string
  author_bio?: string
  author_avatar?: string
  footer_copyright?: string
  footer_description?: string
  social_facebook?: string
  social_youtube?: string
  social_instagram?: string
  social_tiktok?: string
  social_zalo?: string
  meta_title?: string
  meta_description?: string
  newsletter_enabled?: string
  [key: string]: string | undefined
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  post_count?: number
}

interface SiteContextType {
  settings: SiteSettings
  categories: Category[]
  loading: boolean
}

const SiteContext = createContext<SiteContextType>({
  settings: {},
  categories: [],
  loading: true,
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<Category[]>('/public/categories'),
    ])
      .then(([s, c]) => {
        setSettings(s)
        setCategories(c)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, categories, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
