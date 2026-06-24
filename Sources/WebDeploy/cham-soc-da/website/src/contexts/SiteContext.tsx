import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  badge_text: string
  btn_label: string
  btn_url: string
  sort_order: number
}

export type Settings = Record<string, string>

interface SiteContextValue {
  settings: Settings
  slides: HeroSlide[]
  loading: boolean
}

const SiteContext = createContext<SiteContextValue>({ settings: {}, slides: [], loading: true })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ])
      .then(([s, sl]) => {
        setSettings(s)
        setSlides(sl)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
