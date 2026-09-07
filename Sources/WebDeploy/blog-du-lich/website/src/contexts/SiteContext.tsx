import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  [key: string]: string | undefined
}

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  button_text: string
  button_link: string
  sort_order: number
}

export interface PostCategory {
  id: number
  name: string
  slug: string
  icon: string
  tag_class: string
  sort_order: number
  post_count: number
}

interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
  categories: PostCategory[]
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], categories: [], loaded: false })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings]     = useState<SiteSettings>({})
  const [slides, setSlides]         = useState<HeroSlide[]>([])
  const [categories, setCategories] = useState<PostCategory[]>([])
  const [loaded, setLoaded]         = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<PostCategory[]>('/public/post-categories'),
    ])
      .then(([s, sl, cats]) => {
        setSettings(s)
        setSlides(sl)
        setCategories(cats)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, categories, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
