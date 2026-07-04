import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title?: string
  author_avatar?: string
  content: string
  rating: number
}

const fallbackAvatars = [
  'https://i.pravatar.cc/88?img=1',
  'https://i.pravatar.cc/88?img=5',
  'https://i.pravatar.cc/88?img=9',
  'https://i.pravatar.cc/88?img=14',
]

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || items.length === 0) return null

  return (
    <section className="st-sec-pad">
      <div className="wd-container">
        <div className="st-sec-header st-center" data-reveal style={{ maxWidth: 560, marginBottom: 50 }}>
          <div className="st-eyebrow">Đánh giá</div>
          <h2 className="st-sec-title">Bệnh nhân nói về <span className="st-grad-text">SmileTech</span></h2>
          <p className="st-sec-sub">Trải nghiệm thực tế từ những bệnh nhân đã tin tưởng lựa chọn công nghệ nha khoa số.</p>
        </div>
        <div className="st-testi-grid">
          {items.map((t, i) => (
            <div key={t.id} className="st-testi-card" data-reveal data-reveal-delay={i > 0 && i < 4 ? String(i) : undefined}>
              <div className="st-testi-stars">{'★'.repeat(Math.min(5, Math.max(1, t.rating)))}</div>
              <p>"{t.content}"</p>
              <div className="st-testi-user">
                <img
                  src={t.author_avatar || fallbackAvatars[i % fallbackAvatars.length]}
                  alt={t.author_name}
                  loading="lazy"
                />
                <div>
                  <strong>{t.author_name}</strong>
                  <span>{t.author_title || 'Bệnh nhân'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
