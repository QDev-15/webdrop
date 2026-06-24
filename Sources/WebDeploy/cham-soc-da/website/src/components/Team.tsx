import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  image: string
  experience: string
  speciality: string
  is_active: number
}

export default function Team() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Doctor[]>('/public/team')
      .then(data => setDoctors(data.filter(d => d.is_active)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Rule 26: Re-observe after async data renders
  useEffect(() => {
    if (doctors.length === 0) return
    const t = setTimeout(() => {
      const els = document.querySelectorAll('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      )
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [doctors])

  if (loading) return (
    <section className="csd-sec" style={{ background: 'var(--mint)' }}>
      <div className="wd-container text-center" style={{ color: 'var(--text-3)', fontWeight: 300 }}>Đang tải...</div>
    </section>
  )

  if (doctors.length === 0) return null

  return (
    <section className="csd-sec" style={{ background: 'var(--mint)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="csd-eyebrow">Đội ngũ bác sĩ</div>
          <h2 className="csd-title">Chuyên gia da liễu —<br /><em>kinh nghiệm thực chiến</em></h2>
          <p className="csd-sub centered mt-3">Đội ngũ bác sĩ được đào tạo chuyên sâu, cập nhật kỹ thuật mới nhất, tận tâm với từng bệnh nhân.</p>
        </div>

        <div className="row g-4">
          {doctors.map((doc, i) => (
            <div key={doc.id} className="col-6 col-md-3" data-reveal data-delay={String(i % 4)}>
              <div className="csd-doctor-card">
                <div style={{ overflow: 'hidden' }}>
                  <img
                    src={doc.image || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop&sig=${doc.id}`}
                    alt={doc.name}
                    className="csd-doc-img"
                    loading="lazy"
                  />
                </div>
                <div className="csd-doc-body">
                  <div className="csd-doc-name">{doc.name}</div>
                  <div className="csd-doc-role">{doc.role}</div>
                  {doc.experience && <div className="csd-doc-exp">{doc.experience}</div>}
                  {doc.speciality && <div className="csd-doc-tag">{doc.speciality}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
