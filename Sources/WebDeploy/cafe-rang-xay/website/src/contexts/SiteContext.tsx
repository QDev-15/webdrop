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

interface SiteCtx {
  settings: SiteSettings
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, loaded: false })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.get<SiteSettings>('/public/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
