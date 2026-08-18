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

export interface Service {
  id: number
  icon: string
  title: string
  description: string
  sort_order: number
}

interface SiteCtx {
  settings: SiteSettings
  slides: HeroSlide[]
  services: Service[]
  loaded: boolean
}

const SiteContext = createContext<SiteCtx>({ settings: {}, slides: [], services: [], loaded: false })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides]     = useState<HeroSlide[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loaded, setLoaded]     = useState(false)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<HeroSlide[]>('/public/hero-slides'),
      api.get<Service[]>('/public/services'),
    ])
      .then(([s, sl, sv]) => {
        setSettings(s)
        setSlides(sl)
        setServices(sv)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, slides, services, loaded }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
