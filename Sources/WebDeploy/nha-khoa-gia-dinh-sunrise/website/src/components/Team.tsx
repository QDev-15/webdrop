import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  tags: string
  quote: string
}

export default function Team() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Doctor[]>('/public/doctors')
      .then(setDoctors)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featured = doctors.slice(0, 3)

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }} data-reveal>
          <div className="sr-eyebrow">Đội ngũ bác sĩ</div>
          <h2 className="sr-sec-title sr-center">Bác sĩ <em>tận tâm</em> cho cả gia đình</h2>
          <p className="sr-sec-sub sr-center">
            Đội ngũ bác sĩ Sunrise được đào tạo bài bản, có kinh nghiệm chuyên sâu, giàu lòng nhân ái và cảm thông với mọi lứa tuổi.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '48px 0' }}>Đang tải...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {featured.map((d, i) => (
              <div key={d.id} className="sr-doc-card" data-reveal data-delay={String(i + 1)}>
                {d.photo && (
                  <div className="sr-doc-photo">
                    <img src={d.photo} alt={d.name} loading="lazy" />
                  </div>
                )}
                <div className="sr-doc-body">
                  <div className="sr-doc-name">{d.name}</div>
                  <div className="sr-doc-role">{d.role}</div>
                  {d.tags && (
                    <div className="sr-doc-tags">
                      {d.tags.split(',').map((t, j) => (
                        <span key={j}>{t.trim()}</span>
                      ))}
                      <span>{d.experience_years} năm kinh nghiệm</span>
                    </div>
                  )}
                  {d.quote && (
                    <div className="sr-doc-quote">"{d.quote}"</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }} data-reveal>
          <Link to="/bac-si" className="sr-btn sr-btn-ghost">
            Xem tất cả bác sĩ
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
