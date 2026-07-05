import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name?: string
  site_tagline?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  hero_badge?: string
  hero_title?: string
  hero_subtitle?: string
  hero_lead?: string
  hero_image?: string
  hero_cta_primary?: string
  hero_cta_secondary?: string
  stat_branches?: string
  stat_branches_label?: string
  stat_doctors?: string
  stat_doctors_label?: string
  stat_patients?: string
  stat_patients_label?: string
  stat_satisfaction?: string
  stat_satisfaction_label?: string
  facebook?: string
  youtube?: string
  zalo?: string
  map_embed?: string
  footer_copy?: string
  footer_cert?: string
  branch_hcm_address?: string
  branch_hcm_phone?: string
  branch_hn_address?: string
  branch_hn_phone?: string
  branch_dn_address?: string
  branch_dn_phone?: string
  branch_ct_address?: string
  branch_ct_phone?: string
  branch_nt_address?: string
  branch_nt_phone?: string
  [key: string]: string | undefined
}

interface SiteCtx { settings: SiteSettings }

const SiteContext = createContext<SiteCtx>({ settings: {} })

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    api.get<SiteSettings>('/public/settings').then(setSettings).catch(() => {})
  }, [])

  return <SiteContext.Provider value={{ settings }}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
