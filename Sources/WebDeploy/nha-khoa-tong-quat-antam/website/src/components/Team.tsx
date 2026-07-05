import { useEffect, useRef, useState } from 'react'
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
  /** If true, show alternating strip layout (homepage) — show first 2; else show grid (team page) */
  layout?: 'strips' | 'grid'
  limit?: number
}

export default function Team({ layout = 'strips', limit }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors')
      .then(data => setDoctors(limit ? data.slice(0, limit) : data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [limit])

  useEffect(() => {
    const el = ref.current
    if (!el || loading) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    el.querySelectorAll('.at-reveal').forEach(el2 => obs.observe(el2))
    return () => obs.disconnect()
  }, [loading, doctors])

  if (loading) return (
    <div ref={ref} style={{ padding: '40px 0' }}>
      <div className="at-skeleton" style={{ height: 300, marginBottom: 16 }} />
    </div>
  )

  if (layout === 'strips') {
    return (
      <div ref={ref}>
        {doctors.map((doc, i) => {
          const tags = doc.specialties ? doc.specialties.split('|') : []
          return (
            <div key={doc.id} className={`at-doc-item at-reveal${i % 2 === 1 ? ' at-doc-reverse' : ''}`}>
              <div className="at-doc-media">
                <img
                  src={doc.photo || `https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=600&q=75&auto=format&fit=crop`}
                  alt={doc.name}
                  loading="lazy"
                />
              </div>
              <div>
                <div className="at-doc-role">{doc.role}</div>
                <h3 className="at-doc-name">{doc.name}</h3>
                {doc.bio && <p className="at-doc-bio">{doc.bio}</p>}
                {tags.length > 0 && (
                  <div className="at-doc-tags">
                    {tags.map((tag, j) => (
                      <span key={j} className="at-doc-tag">{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Grid layout (team page)
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 40 }}>
      {doctors.map((doc, i) => {
        const tags = doc.specialties ? doc.specialties.split('|') : []
        return (
          <div key={doc.id} className={`at-doc-card at-reveal at-reveal-d${Math.min(i + 1, 4)}`}>
            <div className="at-doc-card-media">
              <img
                src={doc.photo || `https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=600&q=75&auto=format&fit=crop`}
                alt={doc.name}
                loading="lazy"
              />
            </div>
            <div className="at-doc-card-role">{doc.role}</div>
            <h3 className="at-doc-card-name">{doc.name}</h3>
            {doc.bio && <p className="at-doc-card-desc">{doc.bio}</p>}
            {tags.length > 0 && (
              <div className="at-doc-tags" style={{ marginTop: 12 }}>
                {tags.map((tag, j) => (
                  <span key={j} className="at-doc-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
