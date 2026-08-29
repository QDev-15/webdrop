import { useEffect, useRef, useState } from 'react'

interface StatItem { value: number; suffix: string; label: string }

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        const step = Math.max(1, Math.ceil(value / 60))
        let cur = 0
        const t = setInterval(() => {
          cur = Math.min(cur + step, value)
          setDisplay(cur)
          if (cur >= value) clearInterval(t)
        }, 25)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return <span ref={ref}>{display.toLocaleString('vi-VN')}{suffix}</span>
}

export default function StatBar({ items }: { items: StatItem[] }) {
  return (
    <section className="ndv-sec ndv-bg-dark">
      <div className="ndv-container">
        <div className="ndv-stats-grid">
          {items.map((s, i) => (
            <div key={s.label} data-reveal="" data-delay={i > 0 ? Math.min(i, 3) : undefined}>
              <div className="ndv-stat-num"><Counter value={s.value} suffix={s.suffix} /></div>
              <div className="ndv-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
