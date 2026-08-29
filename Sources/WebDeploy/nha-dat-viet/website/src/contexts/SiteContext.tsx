import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../api/client'

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
}

interface SiteContextType {
  settings: Record<string, string>
  heroSlides: HeroSlide[]
  loading: boolean
}

const SiteContext = createContext<SiteContextType>({ settings: {}, heroSlides: [], loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ])
      .then(([s, slides]) => { setSettings(s); setHeroSlides(slides) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, heroSlides, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
