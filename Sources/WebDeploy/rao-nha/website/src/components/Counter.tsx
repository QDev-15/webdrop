import { useEffect, useRef, useState } from 'react'

export default function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [cur, setCur] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const step = Math.max(1, Math.ceil(value / 60))
        let c = 0
        const t = setInterval(() => {
          c = Math.min(c + step, value)
          setCur(c)
          if (c >= value) clearInterval(t)
        }, 25)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return <span ref={ref}>{cur.toLocaleString('vi-VN')}{suffix}</span>
}
