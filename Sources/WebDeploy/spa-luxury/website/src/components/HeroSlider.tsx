import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Settings {
  hero_title?: string
  hero_subtitle?: string
  hero_badge?: string
  hero_bg_image?: string
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

const FALLBACK_BG = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1800&q=70&auto=format&fit=crop'

function useCountUp(target: string, active: boolean) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!active) return

    // Extract numeric value and suffix
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
  }, [active, target])

  return display
}

interface StatItemProps {
  num: string
  label: string
  active: boolean
  delay?: number
}

function StatItem({ num, label, active, delay = 0 }: StatItemProps) {
  const [started, setStarted] = useState(false)
  const display = useCountUp(num, started)

  useEffect(() => {
    if (active && !started) {
      const t = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(t)
    }
  }, [active, started, delay])

  return (
    <div className="sl-stat-item">
      <span className="sl-stat-num">{started ? display : '0'}</span>
      <span className="sl-stat-label">{label}</span>
    </div>
  )
}

export default function HeroSlider() {
  const [settings, setSettings] = useState<Settings>({})
  const [loaded, setLoaded] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<Settings>('/public/settings')
      .then(setSettings)
      .catch(() => {})
    // Ken burns: trigger after mount
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Stats counter trigger via IntersectionObserver
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const title    = settings.hero_title    || 'Nơi thời gian dừng lại'
  const subtitle = settings.hero_subtitle || 'Trải nghiệm nghỉ dưỡng thư giãn toàn diện — liệu trình cao cấp, không gian thiên nhiên và dịch vụ 5 sao dành riêng cho bạn.'
  const badge    = settings.hero_badge    || 'Resort Spa 5 Sao'
  const bgImage  = settings.hero_bg_image || FALLBACK_BG

  const stats = [
    { num: settings.stat1_num || '2000+', label: settings.stat1_label || 'Khách hài lòng' },
    { num: settings.stat2_num || '8',     label: settings.stat2_label || 'Năm kinh nghiệm' },
    { num: settings.stat3_num || '12',    label: settings.stat3_label || 'Liệu trình cao cấp' },
    { num: settings.stat4_num || '98%',   label: settings.stat4_label || 'Đánh giá 5 sao' },
  ]

  return (
    <section className="sl-hero" id="hero">
      {/* Background with ken burns */}
      <div
        className={`sl-hero-bg${loaded ? ' loaded' : ''}`}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="sl-hero-overlay" />

      {/* Content */}
      <div className="sl-hero-content">
        <div className="sl-container">
          <div className="sl-hero-badge">{badge}</div>
          <h1 className="sl-hero-title">
            {title.includes(' ') ? (
              <>
                {title.split(' ').slice(0, -2).join(' ')}{' '}
                <em>{title.split(' ').slice(-2).join(' ')}</em>
              </>
            ) : (
              <em>{title}</em>
            )}
          </h1>
          <p className="sl-hero-sub">{subtitle}</p>
          <div className="sl-hero-cta">
            <Link to="/dat-lich" className="sl-btn sl-btn-gold sl-btn-lg">
              Đặt gói trải nghiệm
            </Link>
            <Link to="/dich-vu" className="sl-btn sl-btn-ghost sl-btn-lg">
              Xem liệu trình
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="sl-hero-scroll" aria-hidden="true">
        <div className="sl-scroll-line" />
        <span>Cuộn xuống</span>
      </div>

      {/* Stats bar */}
      <div className="sl-stats-bar">
        <div className="sl-container">
          <div className="sl-stats-inner" ref={statsRef}>
            {stats.map((s, i) => (
              <StatItem
                key={i}
                num={s.num}
                label={s.label}
                active={statsVisible}
                delay={i * 150}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
