import { useEffect, useRef } from 'react'
import { useSite } from '../contexts/SiteContext'

function useCounter(target: number, ref: React.RefObject<HTMLDivElement | null>, suffix: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let cur = 0
      const step = Math.ceil(target / 60) || 1
      const t = setInterval(() => {
        cur = Math.min(cur + step, target)
        el.textContent = cur + suffix
        if (cur >= target) clearInterval(t)
      }, 25)
      io.disconnect()
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, suffix, ref])
}

function StatItem({ value, suffix, label, border }: { value: number; suffix: string; label: string; border?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useCounter(value, ref, suffix)
  return (
    <div className="col-6 col-md-3">
      <div className="tb-stat-item" style={border ? { borderRight: '1px solid rgba(184,144,42,.15)' } : undefined}>
        <div className="tb-stat-num" ref={ref}>0{suffix}</div>
        <div className="tb-stat-label">{label}</div>
      </div>
    </div>
  )
}

export default function About() {
  const { settings } = useSite()

  const customers = parseInt(settings.stat_customers || '3000', 10)
  const years = parseInt(settings.stat_years || '8', 10)
  const stylists = parseInt(settings.stat_stylists || '5', 10)
  const satisfaction = parseInt(settings.stat_satisfaction || '98', 10)

  return (
    <section className="tb-stat-bar">
      <div className="wd-container">
        <div className="row g-0">
          <StatItem value={customers} suffix="+" label="Khách hàng" border />
          <StatItem value={years} suffix=" năm" label="Kinh nghiệm" border />
          <StatItem value={stylists} suffix="" label="Stylist chuyên nghiệp" border />
          <StatItem value={satisfaction} suffix="%" label="Khách hài lòng" />
        </div>
      </div>
    </section>
  )
}
