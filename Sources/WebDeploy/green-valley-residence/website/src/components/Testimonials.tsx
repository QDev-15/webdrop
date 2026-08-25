import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  avatar: string
  content: string
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div className="eyebrow" data-reveal>Khách hàng nói gì</div>
        <h2 className="sec-title" style={{ marginBottom: 36 }} data-reveal>Cư dân &amp; khách đặt chỗ <em>tin tưởng lựa chọn</em></h2>
        <div className="gvr-hscroll" data-reveal>
          {items.map(t => (
            <div className="gvr-card gvr-card-solid p-4" key={t.id}>
              <span className="gvr-quote-mark">"</span>
              <p className="gvr-quote-text">{t.content}</p>
              <div className="gvr-quote-author">
                <img className="gvr-quote-avatar" src={t.avatar} alt={`Khách hàng ${t.author_name}`} />
                <div>
                  <div className="gvr-quote-name">{t.author_name}</div>
                  <div className="gvr-quote-role">{t.author_role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
