import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { get } from '../api/client'

export interface Settings { [key: string]: string }
export interface NavPage { id: number; title: string; slug: string }

interface SiteCtx {
  settings: Settings
  navPages: NavPage[]
  loading: boolean
}

const Ctx = createContext<SiteCtx>({ settings: {}, navPages: [], loading: true })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({})
  const [navPages, setNavPages] = useState<NavPage[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      get<Settings>('/settings'),
      get<NavPage[]>('/pages'),
    ]).then(([s, p]) => {
      setSettings(s)
      setNavPages(p)
      // Cập nhật <title> và <meta> theo settings
      if (s.site_name) document.title = s.site_name
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc && s.site_description) metaDesc.setAttribute('content', s.site_description)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ settings, navPages, loading }}>{children}</Ctx.Provider>
}

export function useSite() { return useContext(Ctx) }
