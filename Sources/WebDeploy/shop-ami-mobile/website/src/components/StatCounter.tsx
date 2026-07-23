import { useEffect, useRef, useState } from 'react'

// Số đếm chạy khi cuộn vào khung nhìn — dùng chung cho Stat Bar trang chủ + Về chúng tôi
// (port từ 2 đoạn animate counter khác nhau trong template gốc, gộp lại 1 component).
export default function StatCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
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
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target)
          setValue(cur)
          if (cur >= target) clearInterval(timer)
        }, 25)
        io.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return <div ref={ref}>{value.toLocaleString('vi-VN')}{suffix}</div>
}
