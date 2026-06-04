import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
  tag?: 'div' | 'section' | 'article' | 'span'
}

export default function Reveal({ children, delay = 0, className = '', style, tag: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const combinedStyle = delay
    ? { transitionDelay: `${delay * 0.1}s`, ...style }
    : style

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal=""
      className={className}
      style={combinedStyle}
    >
      {children}
    </Tag>
  )
}
