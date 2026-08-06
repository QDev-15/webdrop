'use client'
import { useEffect, useRef, useState } from 'react'

// Chỉ mount <iframe> khi card sắp cuộn vào viewport — tránh tải hàng chục
// live-preview cùng lúc (mỗi iframe là 1 lượt tải trang demo đầy đủ).
export default function DemoIframePreview({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [failed, setFailed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { setInView(true); io.disconnect() } }),
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (failed) return null

  return (
    <div ref={ref} className={`tc-iframe-wrap ${isLoaded ? 'loaded' : ''}`}>
      {inView && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          onError={() => setFailed(true)}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}
