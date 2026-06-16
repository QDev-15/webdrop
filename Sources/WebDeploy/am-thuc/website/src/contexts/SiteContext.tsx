import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../api/client'

interface Settings {
  [key: string]: string
}

interface Slide {
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
  settings: Settings
  slides: Slide[]
  loading: boolean
}

const SiteContext = createContext<SiteContextType>({
  settings: {},
  slides: [],
  loading: true,
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
    ])
      .then(([s, sl]) => {
        setSettings(s)
        setSlides(sl)
      })
      .catch(() => {})
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
