import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSite } from '../App'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  description: string
  experience_years: number
  credentials: string
  tag: string
  sort_order: number
}

interface Props {
  limit?: number
  showCta?: boolean
}

export default function Team({ limit, showCta = true }: Props) {
  const { apiBase } = useSite()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${apiBase}/public/doctors`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(res => setDoctors(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [apiBase])

  if (loading) return <div className="lx-loading">Đang tải...</div>

  const display = limit ? doctors.slice(0, limit) : doctors

  return (
    <div>
      <div className="row gy-4">
        {display.map((d, i) => (
          <div key={d.id} className="col-sm-6 col-lg-3" data-reveal data-delay={String((i % 4) + 1)}>
            <div className="lx-doc">
              <div className="lx-doc-img-wrap">
                {d.photo
                  ? <img src={d.photo} alt={d.name} loading="lazy" />
                  : (
                    <div style={{ width: '100%', aspectRatio: '3/3.5', background: 'var(--dark2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.15)', fontSize: 64, fontWeight: 800, textTransform: 'uppercase' }}>
                      {d.name.charAt(0)}
                    </div>
                  )
                }
                {d.tag && <div className="lx-doc-badge">{d.tag}</div>}
              </div>
              <div className="lx-doc-body">
                <div className="lx-doc-name">{d.name}</div>
                <div className="lx-doc-role">{d.role}</div>
                {d.experience_years > 0 && (
                  <div className="lx-doc-creds" style={{ marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                    {d.experience_years} năm kinh nghiệm
                  </div>
                )}
                {d.credentials && (
                  <div className="lx-doc-creds">
                    {d.credentials.split('|').map((c, ci) => (
                      <div key={ci}>{c.trim()}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {display.length === 0 && (
          <div className="col-12" style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-3)' }}>
            Đang cập nhật đội ngũ bác sĩ.
          </div>
        )}
      </div>

      {showCta && limit && doctors.length > limit && (
        <div style={{ textAlign: 'center', marginTop: 40 }} data-reveal>
          <NavLink to="/bac-si" className="lx-btn lx-btn-outline">
            Xem toàn bộ đội ngũ
          </NavLink>
        </div>
      )}
    </div>
  )
}
