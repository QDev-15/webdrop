import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface TeamMember {
  id: number
  name: string
  role?: string
  bio?: string
  photo?: string
  sort_order?: number
}

const fallbackPhotos = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80&auto=format&fit=crop',
]

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<TeamMember[]>('/public/team')
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="wd-container">
        <div className="st-doctor-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="st-doctor-card">
              <div className="st-doctor-photo st-skeleton" style={{ opacity: 0.5 }} />
              <div className="st-doctor-body">
                <div className="st-skeleton" style={{ height: 16, width: '70%', margin: '0 auto 8px' }} />
                <div className="st-skeleton" style={{ height: 12, width: '50%', margin: '0 auto' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (members.length === 0) return null

  return (
    <div className="wd-container">
      <div className="st-sec-header st-center" data-reveal style={{ maxWidth: 560, marginBottom: 50 }}>
        <div className="st-eyebrow">Đội ngũ</div>
        <h2 className="st-sec-title">Bác sĩ am hiểu <span className="st-grad-text">công nghệ số</span></h2>
        <p className="st-sec-sub">Được đào tạo chuyên sâu để làm chủ hệ sinh thái AI, scan 3D và phần mềm mô phỏng điều trị.</p>
      </div>
      <div className="st-doctor-grid">
        {members.map((m, i) => (
          <div key={m.id} className="st-doctor-card" data-reveal data-reveal-delay={i > 0 && i < 4 ? String(i) : undefined}>
            <div className="st-doctor-photo">
              <img
                src={m.photo || fallbackPhotos[i % fallbackPhotos.length]}
                alt={m.name}
                loading="lazy"
              />
            </div>
            <div className="st-doctor-body">
              <h3>{m.name}</h3>
              <span className="role">{m.role}</span>
              {m.bio && <p>{m.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
