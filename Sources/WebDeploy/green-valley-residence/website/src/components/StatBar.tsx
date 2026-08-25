import { useEffect, useRef, useState } from 'react'

interface StatItem { value: number; suffix?: string; label: string }

function Counter({ target, suffix }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let cur = 0
        const step = Math.ceil(target / 60)
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setDisplay(cur)
          if (cur >= target) clearInterval(t)
        }, 25)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <div className="gvr-stat-num" ref={ref}>{display}{suffix ?? ''}</div>
}

const DELAY_ATTRS = ['', 'data-reveal-d1', 'data-reveal-d2', 'data-reveal-d3'] as const

export default function StatBar({ items }: { items: StatItem[] }) {
  return (
    <div className="gvr-stats-grid">
      {items.map((item, i) => {
        const delayAttr = DELAY_ATTRS[Math.min(i, 3)]
        const extraProps = delayAttr ? { [delayAttr]: true } : {}
        return (
          <div data-reveal {...extraProps} key={item.label}>
            <Counter target={item.value} suffix={item.suffix} />
            <div className="gvr-stat-label">{item.label}</div>
          </div>
        )
      })}
    </div>
  )
}
