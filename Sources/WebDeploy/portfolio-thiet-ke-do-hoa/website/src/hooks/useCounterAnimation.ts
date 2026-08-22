import { useEffect } from 'react'

// Đếm số khi scroll tới — khớp hành vi gốc template (index.html script "Counter animation").
// Gọi trong component sau khi data đã render (dependency là mảng data, không phải []).
export function useCounterAnimation(deps: unknown[]) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>('[data-counter]:not([data-counted])')
      const cro = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.setAttribute('data-counted', '1')
          const target = +(el.dataset.counter || 0)
          if (!Number.isFinite(target)) { cro.unobserve(el); return }
          const suffix = el.dataset.suffix || ''
          let cur = 0
          const step = Math.ceil(target / 60) || 1
          const t = setInterval(() => {
            cur = Math.min(cur + step, target)
            el.textContent = cur + suffix
            if (cur >= target) clearInterval(t)
          }, 25)
          cro.unobserve(el)
        })
      }, { threshold: 0.5 })
      els.forEach(el => cro.observe(el))
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
