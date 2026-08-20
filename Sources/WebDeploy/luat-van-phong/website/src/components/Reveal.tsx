import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
  tag?: 'div' | 'section' | 'article' | 'span' | 'h1' | 'h2' | 'p'
  // Khi truyền `to`, Reveal render dưới dạng <Link> thay vì `tag` — dùng cho card có thể bấm
  // vào (vd case card trỏ tới trang chi tiết vụ việc) mà vẫn giữ nguyên hiệu ứng reveal.
  to?: string
}

export default function Reveal({ children, delay = 0, className = '', style, tag: Tag = 'div', to }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLDivElement>(null)

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

  if (to) {
    return (
      <Link
        to={to}
        ref={ref}
        data-reveal=""
        className={className}
        style={combinedStyle}
      >
        {children}
      </Link>
    )
  }

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
