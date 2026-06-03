import { useEffect } from 'react'

/** Activates .reveal → .visible on scroll */
export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    )

    const els = document.querySelectorAll('.reveal:not(.visible)')
    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  })

  return null
}
