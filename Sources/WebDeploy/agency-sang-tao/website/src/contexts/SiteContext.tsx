import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

export interface SiteSettings {
  site_name: string
  site_tagline: string
  site_description: string
  site_email: string
  site_phone: string
  site_address: string
  working_hours: string
  site_established: string
  site_city: string
  hero_line1: string
  hero_line2: string
  hero_line3: string
  hero_tagline: string
  hero_tagline_right: string
  hero_stat1_num: string
  hero_stat1_suffix: string
  hero_stat1_label: string
  hero_stat2_num: string
  hero_stat2_suffix: string
  hero_stat2_label: string
  hero_stat3_num: string
  hero_stat3_suffix: string
  hero_stat3_label: string
  stats_projects: string
  stats_clients: string
  stats_years: string
  stats_awards: string
  cta_label: string
  cta_title: string
  cta_desc: string
  footer_copyright: string
  footer_description: string
  social_facebook: string
  social_instagram: string
  social_behance: string
  social_linkedin: string
  social_zalo: string
  google_map_embed: string
  [key: string]: string
}

interface SiteService {
  id: number
  name: string
  slug: string
  number: string
  description: string
  tags: string
  featured: number
  sort_order: number
}

interface SiteProject {
  id: number
  title: string
  slug: string
  category: string
  description: string
  image: string
  client: string
  tags: string
  featured: number
}

interface SiteTeamMember {
  id: number
  name: string
  position: string
  experience: string
  avatar: string
  sort_order: number
}

interface SiteTestimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

interface ProcessStep {
  id: number
  number: string
  name: string
  description: string
  sort_order: number
}

interface SiteData {
  settings: SiteSettings
  services: SiteService[]
  projects: SiteProject[]
  team: SiteTeamMember[]
  testimonials: SiteTestimonial[]
  processSteps: ProcessStep[]
  loading: boolean
}

const defaultSettings: SiteSettings = {
  site_name: 'NOVA.',
  site_tagline: 'Agency Sáng Tạo · Hồ Chí Minh · Est. 2016',
  site_description: 'Agency sáng tạo chuyên branding, thiết kế và digital marketing.',
  site_email: 'hello@nova.vn',
  site_phone: '0909 123 456',
  site_address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  working_hours: 'Thứ 2 – Thứ 6, 8:00 – 18:00',
  site_established: '2016',
  site_city: 'Hồ Chí Minh',
  hero_line1: 'WE BUILD',
  hero_line2: 'BRANDS',
  hero_line3: '& STORIES',
  hero_tagline: 'Agency Sáng Tạo · Hồ Chí Minh · Est. 2016',
  hero_tagline_right: 'Branding · Design · Digital',
  hero_stat1_num: '120',
  hero_stat1_suffix: '+',
  hero_stat1_label: 'Dự án hoàn thành',
  hero_stat2_num: '80',
  hero_stat2_suffix: '+',
  hero_stat2_label: 'Khách hàng tin tưởng',
  hero_stat3_num: '8',
  hero_stat3_suffix: '',
  hero_stat3_label: 'Năm kinh nghiệm',
  stats_projects: '120+',
  stats_clients: '80+',
  stats_years: '8',
  stats_awards: '15',
  cta_label: 'Sẵn sàng chưa?',
  cta_title: "LET'S START YOUR\nNEXT PROJECT",
  cta_desc: 'Kể cho chúng tôi nghe về thương hiệu và mục tiêu của bạn. Chúng tôi sẽ lên kế hoạch sáng tạo phù hợp nhất trong vòng 24 giờ.',
  footer_copyright: '© 2026 NOVA. Agency. All rights reserved.',
  footer_description: 'Agency sáng tạo chuyên branding, thiết kế và digital marketing.',
  social_facebook: '',
  social_instagram: '',
  social_behance: '',
  social_linkedin: '',
  social_zalo: '',
  google_map_embed: '',
}

const SiteContext = createContext<SiteData>({
  settings: defaultSettings,
  services: [],
  projects: [],
  team: [],
  testimonials: [],
  processSteps: [],
  loading: true,
})

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [services, setServices] = useState<SiteService[]>([])
  const [projects, setProjects] = useState<SiteProject[]>([])
  const [team, setTeam] = useState<SiteTeamMember[]>([])
  const [testimonials, setTestimonials] = useState<SiteTestimonial[]>([])
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get<SiteSettings>('/public/settings'),
      api.get<SiteService[]>('/public/services'),
      api.get<SiteProject[]>('/public/projects'),
      api.get<SiteTeamMember[]>('/public/team'),
      api.get<SiteTestimonial[]>('/public/testimonials'),
      api.get<ProcessStep[]>('/public/process'),
    ]).then(([s, sv, pr, tm, te, ps]) => {
      if (s.status === 'fulfilled') setSettings(s.value as SiteSettings)
      if (sv.status === 'fulfilled') setServices(sv.value as SiteService[])
      if (pr.status === 'fulfilled') setProjects(pr.value as SiteProject[])
      if (tm.status === 'fulfilled') setTeam(tm.value as SiteTeamMember[])
      if (te.status === 'fulfilled') setTestimonials(te.value as SiteTestimonial[])
      if (ps.status === 'fulfilled') setProcessSteps(ps.value as ProcessStep[])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <SiteContext.Provider value={{ settings, services, projects, team, testimonials, processSteps, loading }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  return useContext(SiteContext)
}
