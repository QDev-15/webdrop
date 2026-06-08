import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_description?: string
  site_logo?: string
  site_email?: string
  site_phone?: string
  site_address?: string
  footer_copyright?: string
  footer_description?: string
  footer_show_social?: string
  social_facebook?: string
  social_youtube?: string
  social_instagram?: string
  social_tiktok?: string
  social_zalo?: string
  forum_tagline?: string
  forum_description?: string
  forum_rules_url?: string
  forum_stat_members?: string
  forum_stat_threads?: string
  forum_stat_posts?: string
  meta_title?: string
  meta_description?: string
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

export interface ForumCategory {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  sort_order: number
  thread_count: number
}

export interface ForumThread {
  id: number
  title: string
  slug: string
  content: string
  author_name: string
  author_avatar: string
  category_name: string
  category_slug: string
  category_icon: string
  reply_count: number
  is_pinned: number
  is_hot: number
  created_at: string
  updated_at: string
}

export interface ForumTag {
  id: number
  name: string
  slug: string
  usage_count: number
}

interface SettingsResponse {
  general?: SiteSettings
  forum?: SiteSettings
  seo?: SiteSettings
  social?: SiteSettings
  footer?: SiteSettings
  contact?: SiteSettings
}

interface SiteContextType {
  settings: SiteSettings
  slides: HeroSlide[]
  categories: ForumCategory[]
  threads: ForumThread[]
  tags: ForumTag[]
  loading: boolean
  refetchThreads: (params?: Record<string, string>) => Promise<void>
}

const SiteContext = createContext<SiteContextType>({
  settings: {},
  slides: [],
  categories: [],
  threads: [],
  tags: [],
  loading: true,
  refetchThreads: async () => {},
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [tags, setTags] = useState<ForumTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SettingsResponse>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<ForumCategory[]>('/public/forum-categories'),
      api.get<ForumThread[]>('/public/forum-threads?limit=20'),
      api.get<ForumTag[]>('/public/forum-tags'),
    ])
      .then(([s, sl, cats, thr, t]) => {
        const flat: SiteSettings = {
          ...s.general,
          ...s.forum,
          ...s.seo,
          ...s.social,
          ...s.footer,
          ...s.contact,
        }
        setSettings(flat)
        setSlides(sl)
        setCategories(cats)
        setThreads(thr)
        setTags(t)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function refetchThreads(params: Record<string, string> = {}) {
    const qs = new URLSearchParams({ limit: '20', ...params }).toString()
    const data = await api.get<ForumThread[]>(`/public/forum-threads?${qs}`)
    setThreads(data)
  }

  return (
    <SiteContext.Provider value={{ settings, slides, categories, threads, tags, loading, refetchThreads }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
