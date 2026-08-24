import { createContext, useContext, useEffect, useState } from 'react'
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

interface SiteCtx {
  settings: Record<string, string>
  heroSlides: HeroSlide[]
  loading: boolean
}

const Ctx = createContext<SiteCtx>({ settings: {}, heroSlides: [], loading: true })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, h]) => {
      setSettings(s)
      setHeroSlides(h)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ settings, heroSlides, loading }}>{children}</Ctx.Provider>
}

export const useSite = () => useContext(Ctx)
