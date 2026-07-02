import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface TeamMember {
  id: number
  name: string
  role: string
  specialty: string
  image: string
}

export default function Team() {
  const [items, setItems] = useState<TeamMember[]>([])

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setItems).catch(() => {})
  }, [])

  return (
    <section className="sec-pad tb-sec-light">
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="tb-eyebrow-dk">Đội ngũ</div>
          <h2 className="tb-title-dk">Gặp gỡ <em>các stylist</em></h2>
          <p className="tb-sub-dk mx-auto">Những nghệ nhân đứng sau từng tác phẩm — đam mê, kỹ thuật và cá tính riêng biệt.</p>
        </div>
        <div className="row g-4">
          {items.map((m, i) => (
            <div className="col-6 col-md-3" data-reveal data-delay={String(Math.min(i + 1, 3))} key={m.id}>
              <div className="tb-stylist-card" style={{ background: '#fff', borderColor: '#e0dbd2' }}>
                <div className="tb-stylist-img">
                  <img src={m.image} alt={`Stylist ${m.name}`} />
                </div>
                <div className="tb-stylist-info">
                  <div className="tb-stylist-name" style={{ color: 'var(--text-dark)' }}>{m.name}</div>
                  <div className="tb-stylist-role">{m.role}</div>
                  <div className="tb-stylist-spec" style={{ color: 'var(--text-dark-2)' }}>{m.specialty}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
