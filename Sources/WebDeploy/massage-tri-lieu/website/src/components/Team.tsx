import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Therapist {
  id: number
  name: string
  specialty: string
  experience: string
  image: string
  active: number
}

export default function Team() {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Therapist[]>('/public/team')
      .then(data => setTherapists(data.filter(t => t.active)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Re-observe after async data renders (Rule 26)
  useEffect(() => {
    if (therapists.length === 0) return
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
  }, [therapists])

  if (loading || therapists.length === 0) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--surface)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="mrt-label">
            <span className="mrt-label-line" />
            Đội ngũ
            <span className="mrt-label-line" />
          </div>
          <h2 className="mrt-heading">Chuyên viên <em>trị liệu</em> chuyên nghiệp</h2>
          <p className="mrt-subtext mx-auto">
            Đội ngũ chuyên viên được đào tạo bài bản tại các trung tâm uy tín — đảm bảo mỗi liệu trình đạt chuẩn chất lượng cao nhất.
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          {therapists.map(th => (
            <div key={th.id} className="col-6 col-sm-4 col-md-3 col-lg-2" data-reveal>
              <div className="mrt-therapist-card">
                <div className="mrt-therapist-wrap">
                  {th.image ? (
                    <img src={th.image} alt={th.name} className="mrt-therapist-img" loading="lazy" />
                  ) : (
                    <div
                      className="mrt-therapist-img"
                      style={{ background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--accent)', fontWeight: 600 }}
                    >
                      {th.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="mrt-therapist-name">{th.name}</div>
                <div className="mrt-therapist-title">{th.specialty}</div>
                <div className="mrt-therapist-exp">{th.experience}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
