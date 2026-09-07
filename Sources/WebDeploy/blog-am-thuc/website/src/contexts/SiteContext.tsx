import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  button_text: string
  button_link: string
  sort_order: number
}

export interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
  post_count: number
}

export interface Post {
  id: number
  title: string
  slug: string
  type: 'article' | 'recipe'
  excerpt: string
  image: string
  author_name: string
  author_avatar: string
  read_minutes: number
  tags: string
  featured: number
  difficulty: string
  prep_time: string
  cook_time: string
  servings: string
  saved_count: number
  published_at: string
  category_name: string | null
  category_slug: string | null
}

type Settings = Record<string, string>

interface SiteContextType {
  settings: Settings
  heroSlides: HeroSlide[]
  categories: Category[]
  posts: Post[]
  loading: boolean
}

const SiteContext = createContext<SiteContextType | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Category[]>('/public/categories'),
      api.get<Post[]>('/public/posts?limit=200'),
    ])
      .then(([s, h, c, p]) => {
        setSettings(s); setHeroSlides(h); setCategories(c); setPosts(p)
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, heroSlides, categories, posts, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
