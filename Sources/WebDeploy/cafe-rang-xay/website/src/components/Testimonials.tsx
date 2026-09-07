import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    api.get<Testimonial[]>('/public/testimonials').then(setItems).catch(() => {})
  }, [])

  if (items.length === 0) return null

  const delayAttr = (i: number): Record<string, string> => {
    if (i === 0) return { 'data-reveal-d1': '' }
    if (i === 1) return { 'data-reveal-d2': '' }
    return { 'data-reveal-d3': '' }
  }

  return (
    <div className="crx-testi-grid">
      {items.map((item, i) => (
        <div className="crx-rv" key={item.id} data-reveal {...delayAttr(i)}>
          <div className="crx-rv-stars">{'★'.repeat(item.rating || 5)}</div>
          <div className="crx-rv-text">&quot;{item.content}&quot;</div>
          <div className="crx-rv-foot">
            {item.author_avatar && <img className="crx-rv-av" src={item.author_avatar} alt={item.author_name} loading="lazy" />}
            <div>
              <div className="crx-rv-name">{item.author_name}</div>
              <div className="crx-rv-role">{item.author_title}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
