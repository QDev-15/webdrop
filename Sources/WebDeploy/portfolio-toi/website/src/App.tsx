import { useEffect, useState } from 'react'
import { api } from './api/client'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useDocumentMeta } from './hooks/useDocumentMeta'

export interface Settings {
  [key: string]: string
}

export interface Project {
  id: number
  title: string
  category: string
  description: string
  image: string
  tags: string
  project_url: string
  github_url: string
  featured: number
  sort_order: number
  status: string
}

export interface SkillGroup {
  id: number
  name: string
  sort_order: number
  skills: { id: number; name: string; sort_order: number }[]
}

export interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

export default function App() {
  const [settings, setSettings] = useState<Settings>({})
  const [projects, setProjects] = useState<Project[]>([])
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<Project[]>('/public/projects'),
      api.get<SkillGroup[]>('/public/skills'),
      api.get<Testimonial[]>('/public/testimonials'),
    ]).then(([s, p, sg, t]) => {
      setSettings(s)
      setProjects(p)
      setSkillGroups(sg)
      setTestimonials(t)
    }).finally(() => setLoading(false))
  }, [])

  useDocumentMeta({ title: settings.meta_title || settings.site_name || 'Portfolio Tôi', description: settings.meta_description })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'rgba(255,255,255,.3)', fontSize: 14 }}>
        Đang tải...
      </div>
    )
  }

  return (
    <>
      <Header settings={settings} />
      <Hero settings={settings} />
      <About settings={settings} />
      <Projects projects={projects} settings={settings} />
      <Skills skillGroups={skillGroups} />
      <Testimonials testimonials={testimonials} />
      <Contact settings={settings} />
      <Footer settings={settings} />
      {settings.social_zalo && (
        <div className="zf">
          <div className="zf-tip">Nhắn Zalo</div>
          <a href={`https://zalo.me/${settings.social_zalo}`} target="_blank" rel="noopener noreferrer" className="zf-btn" aria-label="Zalo">💬</a>
        </div>
      )}
    </>
  )
}
