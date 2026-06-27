import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'

interface Settings {
  stat1_num?: string
  stat1_label?: string
  stat2_num?: string
  stat2_label?: string
  stat3_num?: string
  stat3_label?: string
  stat4_num?: string
  stat4_label?: string
  [key: string]: string | undefined
}

interface GalleryItem {
  id: number
  name: string
  description: string
  image: string
}

function useCountUp(target: string, active: boolean, delay = 0) {
  const [display, setDisplay] = useState('—')

  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => {
      const match = target.match(/^(\d+(?:\.\d+)?)(.*)?$/)
      if (!match) {
        setDisplay(target)
        return
      }
      const end = parseFloat(match[1])
      const suffix = match[2] || ''
      const duration = 1600
      const start = performance.now()

      function step(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        const value = Math.round(end * ease)
        setDisplay(value + suffix)
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(t)
  }, [active, target, delay])

  return display
}

const ICONS = ['🏆', '✨', '💎', '⭐']
const COLORS = [
  'var(--accent)',
  'var(--accent-mid)',
  'var(--accent)',
  'var(--accent-mid)',
]

export default function About() {
  const [settings, setSettings] = useState<Settings>({})
  const [gallery, setGallery]   = useState<GalleryItem[]>([])
  const [active, setActive]     = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    Promise.all([
      api.get<Settings>('/public/settings'),
      api.get<GalleryItem[]>('/public/gallery'),
    ]).then(([s, g]) => {
      setSettings(s)
      setGallery(g)
    }).catch(() => {})
  }, [])

  // Trigger counters when stats section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Re-trigger reveal after gallery loads
  useEffect(() => {
    if (!gallery.length) return
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible')
              observer.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
      )
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => observer.observe(el))
      return () => observer.disconnect()
    }, 80)
    return () => clearTimeout(t)
  }, [gallery])

  const stats = [
    { num: settings.stat1_num || '2000+', label: settings.stat1_label || 'Khách hài lòng',     icon: ICONS[0] },
    { num: settings.stat2_num || '8',     label: settings.stat2_label || 'Năm kinh nghiệm',    icon: ICONS[1] },
    { num: settings.stat3_num || '12',    label: settings.stat3_label || 'Liệu trình cao cấp', icon: ICONS[2] },
    { num: settings.stat4_num || '98%',   label: settings.stat4_label || 'Đánh giá 5 sao',    icon: ICONS[3] },
  ]

  const display0 = useCountUp(stats[0].num, active, 0)
  const display1 = useCountUp(stats[1].num, active, 150)
  const display2 = useCountUp(stats[2].num, active, 300)
  const display3 = useCountUp(stats[3].num, active, 450)
  const displays = [display0, display1, display2, display3]

  const spaceItems = gallery.slice(0, 5)

  return (
    <>
      {/* ── Stats counter section ── */}
      <section className="sl-stat-bg" ref={sectionRef}>
        <div className="sl-container">
          <div className="sl-stat-grid">
            {stats.map((s, i) => (
              <div key={i} className="sl-counter-item">
                <div className="sl-counter-icon" style={{ color: COLORS[i] }}>{s.icon}</div>
                <span className="sl-counter-num">{displays[i]}</span>
                <span className="sl-counter-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Space / Gallery section ── */}
      {spaceItems.length > 0 && (
        <section className="sl-space-bg sl-section">
          <div className="sl-container">
            <div className="sl-sec-head" data-reveal>
              <p className="sl-eyebrow">Không gian</p>
              <h2 className="sl-sec-title">Trải nghiệm <em>thiên đường</em></h2>
              <p className="sl-sec-sub">
                Mỗi góc không gian đều được chăm chút tỉ mỉ — thiên nhiên, ánh sáng và sự yên tĩnh hòa quyện hoàn hảo.
              </p>
            </div>

            <div className="sl-space-grid">
              {spaceItems.map((item) => (
                <div key={item.id} className="sl-space-item" data-reveal>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="sl-space-item-overlay" />
                  <div className="sl-space-item-label">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
