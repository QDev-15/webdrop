import { useEffect, useRef, useState } from 'react'

export default function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        const step = Math.max(1, Math.ceil(target / 60))
        let cur = 0
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setValue(cur)
          if (cur >= target) clearInterval(t)
        }, 25)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <div className="mt-stat" data-reveal>
      <div className="mt-stat-num" ref={ref}><span>{value}{suffix}</span></div>
      <div className="mt-stat-label">{label}</div>
    </div>
  )
}
