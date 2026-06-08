import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'

interface SiteSettings {
  [key: string]: string
}

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

interface SiteData {
  settings: SiteSettings
  slides: HeroSlide[]
  loading: boolean
}

const SiteContext = createContext<SiteData>({ settings: {}, slides: [], loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides]     = useState<HeroSlide[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
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
