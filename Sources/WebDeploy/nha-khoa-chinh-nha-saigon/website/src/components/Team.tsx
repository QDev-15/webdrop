import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  description: string
  experience_years: number
  specialties: string
  tag: string
  sort_order: number
}

interface Props {
  limit?: number
}

export default function Team({ limit }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors')
      .then(data => setDoctors(limit ? data.slice(0, limit) : data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) return null

  return (
    <div className="cn-team-grid">
      {doctors.map((d, idx) => {
        const specs = d.specialties ? d.specialties.split('|').filter(Boolean) : []
        return (
          <div key={d.id} className="cn-team-card" data-reveal data-delay={String(idx % 3 + 1)}>
            <div className="cn-team-photo">
              {d.photo ? (
                <img src={d.photo} alt={d.name} loading="lazy" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '48px', fontWeight: 700 }}>
                  {d.name.charAt(0)}
                </div>
              )}
              {d.tag && <div className="cn-team-tag">{d.tag}</div>}
            </div>
            <div className="cn-team-body">
              <div className="cn-team-name">{d.name}</div>
              <div className="cn-team-role">{d.role}</div>
              {d.description && <p className="cn-team-desc">{d.description}</p>}
              {specs.length > 0 && (
                <div className="cn-team-meta">
                  {d.experience_years > 0 && (
                    <span>{d.experience_years} năm kinh nghiệm</span>
                  )}
                  {specs.map(s => <span key={s}>{s}</span>)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
