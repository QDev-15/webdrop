import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

interface SiteData {
  settings: Record<string, string>
  slides: Slide[]
}

const SiteContext = createContext<SiteData>({ settings: {}, slides: [] })

export function useSite() {
  return useContext(SiteContext)
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [slides, setSlides] = useState<Slide[]>([])

  useEffect(() => {
    Promise.all([
      api.get<Record<string, string>>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    }).catch(() => {})
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides }}>
      {children}
    </SiteContext.Provider>
  )
}
