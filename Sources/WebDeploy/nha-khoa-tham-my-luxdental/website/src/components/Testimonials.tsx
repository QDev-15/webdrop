import { useEffect, useState } from 'react'
import { useSite } from '../App'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  stars: number
  is_featured: number
  sort_order: number
}

export default function Testimonials() {
  const { apiBase } = useSite()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${apiBase}/public/testimonials`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [apiBase])

  if (loading) return <div className="lx-loading">Đang tải...</div>

  const display = items.filter(t => t.is_featured || items.length <= 5)

  return (
    <div className="lx-list">
      {display.map((t, i) => (
        <div key={t.id} className="lx-list-item" data-reveal data-delay={String((i % 3) + 1)}>
          <div className="lx-list-num">{String(i + 1).padStart(2, '0')}</div>
          <div className="lx-list-body">
            <div className="lx-list-stars" aria-label={`${t.stars} sao`}>
              {'★'.repeat(Math.min(t.stars, 5))}{'☆'.repeat(Math.max(0, 5 - t.stars))}
            </div>
            <blockquote className="lx-list-quote">"{t.content}"</blockquote>
            <div className="lx-list-foot">
              {t.author_avatar
                ? <img className="lx-list-av" src={t.author_avatar} alt={t.author_name} loading="lazy" />
                : (
                  <div className="lx-list-av" style={{ background: 'var(--dark)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                    {t.author_name.charAt(0)}
                  </div>
                )
              }
              <div>
                <div className="lx-list-name">{t.author_name}</div>
                {t.author_role && <div className="lx-list-role">{t.author_role}</div>}
              </div>
            </div>
          </div>
        </div>
      ))}
      {display.length === 0 && (
        <div className="lx-list-item" style={{ justifyContent: 'center', color: 'var(--text-3)' }}>
          Chưa có đánh giá nào.
        </div>
      )}
    </div>
  )
}
