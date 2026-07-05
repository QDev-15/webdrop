import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  bio: string
  photo: string
  experience_years: number
  specialties: string
  sort_order: number
}

interface Props {
  mode?: 'strips' | 'grid'
  limit?: number
  showViewAll?: boolean
}

export default function Team({ mode = 'strips', limit, showViewAll = false }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors').then(setDoctors).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="ks-loading">Đang tải đội ngũ...</div>

  const display = limit ? doctors.slice(0, limit) : doctors
  const getTags = (specialties: string) => specialties ? specialties.split('|').filter(Boolean) : []

  if (mode === 'grid') {
    return (
      <div className="ks-doc-grid">
        {display.map(doc => (
          <article className="ks-doc-card" key={doc.id}>
            <div className="ks-doc-img">
              <img
                src={doc.photo || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=75&auto=format&fit=crop`}
                alt={`Bác sĩ ${doc.name}`}
                loading="lazy"
              />
            </div>
            <div className="ks-doc-body">
              <div className="ks-doc-name">{doc.name}</div>
              <div className="ks-doc-role">{doc.role}</div>
              {doc.bio && <div className="ks-doc-desc">{doc.bio}</div>}
              {getTags(doc.specialties).length > 0 && (
                <div className="ks-doc-tags">
                  {getTags(doc.specialties).map((tag, i) => (
                    <span key={i} className="ks-doc-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    )
  }

  // Alternating strips mode (homepage)
  return (
    <>
      {display.map((doc, i) => (
        <div className={`ks-team-strip${i % 2 === 1 ? ' ks-team-reverse' : ''}`} key={doc.id} data-reveal>
          <div className="ks-team-media">
            <div className="ks-team-photo">
              <img
                src={doc.photo || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=75&auto=format&fit=crop`}
                alt={`Bác sĩ ${doc.name}`}
                loading="lazy"
              />
            </div>
          </div>
          <div className="ks-team-content">
            <div className="ks-team-role">{doc.role}</div>
            <h3 className="ks-team-name">{doc.name}</h3>
            {doc.bio && <p className="ks-team-desc">{doc.bio}</p>}
            {getTags(doc.specialties).length > 0 && (
              <div className="ks-team-tags">
                {getTags(doc.specialties).map((tag, j) => (
                  <span key={j} className="ks-team-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {showViewAll && (
        <div className="ks-text-center" style={{ marginTop: 16 }} data-reveal>
          <Link to="/bac-si" className="ks-btn ks-btn-mint">Xem toàn bộ đội ngũ →</Link>
        </div>
      )}
    </>
  )
}
