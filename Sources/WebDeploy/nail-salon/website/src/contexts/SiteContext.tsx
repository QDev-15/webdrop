import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface HeroSlide { id: number; image: string; title: string; subtitle: string; sort_order: number }
export type Settings = Record<string, string>

interface SiteContextValue {
  settings: Settings
  slides: HeroSlide[]
  ready: boolean
}

const SiteContext = createContext<SiteContextValue>({ settings: {}, slides: [], ready: false })

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
      setReady(true)
    }).catch(() => setReady(true))
  }, [])

  return <SiteContext.Provider value={{ settings, slides, ready }}>{children}</SiteContext.Provider>
}

export function useSite() { return useContext(SiteContext) }
