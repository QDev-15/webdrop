'use client'
import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    // Phần tử đã nằm trong viewport ngay khi mount → hiện luôn, không chờ observer.
    // Tránh khoảng trắng khi hydrate chậm hơn network/CPU của người dùng (nội dung SSR
    // có sẵn nhưng CSS .reveal{opacity:0} chỉ được gỡ sau khi observer chạy lần đầu).
    const pending: Element[] = []
    document.querySelectorAll('.reveal').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible')
      else pending.push(el)
    })

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    )
    pending.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
