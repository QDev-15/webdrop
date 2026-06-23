import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function HeroSlider() {
  const { settings } = useSite()
  const s = settings
  const sectionRef = useRef<HTMLElement>(null)

  const stats = [
    { num: s.stat_meats || '60', suffix: '+', label: 'Loại thịt & hải sản' },
    { num: s.stat_seats || '200', suffix: '+', label: 'Chỗ ngồi thoải mái' },
    { num: s.stat_years || '8', suffix: '+', label: 'Năm kinh nghiệm' },
    { num: s.stat_rating || '4.9', suffix: '★', label: 'Đánh giá trên Google' },
  ]

  useEffect(() => {
    const counters = sectionRef.current?.querySelectorAll<HTMLElement>('.counter-num')
    if (!counters) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = parseFloat(el.dataset.target || '0')
        const isDecimal = String(target).includes('.')
        let current = 0
        const step = Math.max(target / 60, 0.1)
        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          el.textContent = isDecimal ? current.toFixed(1) : String(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, 25)
        observer.unobserve(el)
      })
    }, { threshold: 0.5 })
    counters.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [s.stat_meats])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [s])

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-end', paddingBottom: 'clamp(48px,7vw,96px)', paddingTop: 64, position: 'relative', overflow: 'hidden', background: 'var(--dark2)' }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76538977abd?w=1600&q=60&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: .4 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(28,18,9,.98) 0%,rgba(28,18,9,.7) 50%,rgba(28,18,9,.25) 100%)' }} />

      <div className="wd-container" style={{ position: 'relative', zIndex: 2, width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,.5)', border: '1px solid rgba(251,146,60,.25)', padding: '7px 16px', borderRadius: 8, marginBottom: 22, background: 'rgba(251,146,60,.07)' }}>
          🔥 {s.hero_badge || 'Than hoa thật — Hương vị thật'}
        </div>

        <h1 style={{ fontSize: 'clamp(44px,6.5vw,88px)', fontWeight: 700, color: '#fff', lineHeight: 1.04, letterSpacing: '-2.5px', marginBottom: 18 }}>
          Nướng cùng<br /><em style={{ color: '#fb923c', fontStyle: 'italic', fontWeight: 300 }}>lửa hồng</em>,<br />no cùng bạn bè.
        </h1>

        <p style={{ fontSize: 'clamp(14px,1.5vw,17px)', fontWeight: 300, color: 'rgba(255,255,255,.45)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 32px' }}>
          {s.hero_sub || 'Thịt tươi chọn lọc mỗi sáng, than hoa âm ỉ, gia vị ướp bí truyền — mỗi bữa BBQ là một buổi tụ họp đáng nhớ.'}
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap mb-0">
          <Link to="/dat-ban" className="btn-accent">Đặt bàn ngay 🔥</Link>
          <Link to="/thuc-don" className="btn-white">Xem thực đơn</Link>
        </div>

        <div className="counter-bar" data-reveal style={{ maxWidth: 780, marginLeft: 'auto', marginRight: 'auto' }}>
          {stats.map((stat, i) => (
            <div key={i} className="counter-item">
              <div>
                <span className="counter-num" data-target={stat.num}>{stat.num}</span>
                <span className="counter-suffix">{stat.suffix}</span>
              </div>
              <div className="counter-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
