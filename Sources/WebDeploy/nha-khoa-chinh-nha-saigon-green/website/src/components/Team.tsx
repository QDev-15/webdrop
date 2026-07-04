import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface TeamMember {
  id: number
  name: string
  title: string
  specialty: string
  experience: string
  cases_count: number
  badge: string
  image: string
}

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setTeam).catch(() => {})
  }, [])

  if (team.length === 0) return null

  return (
    <section className="cn-team sec-pad">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }} data-reveal>
          <div className="cn-eyebrow">Đội ngũ chuyên gia</div>
          <h2 className="cn-title">Bác sĩ chỉnh nha <em>chuyên khoa</em></h2>
          <p className="cn-sub" style={{ margin: '0 auto' }}>
            Tốt nghiệp chuyên khoa Chỉnh nha, được chứng nhận quốc tế, cập nhật kỹ thuật hiện đại nhất.
          </p>
        </div>

        <div className="cn-team-grid">
          {team.map((m, i) => (
            <div className="cn-doctor-card" key={m.id} data-reveal data-delay={String(i % 3)}>
              <div className="cn-doctor-img-wrap">
                {m.image && (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="cn-doctor-img"
                    loading="lazy"
                  />
                )}
                {m.badge && <div className="cn-doctor-badge">{m.badge}</div>}
              </div>
              <div className="cn-doctor-body">
                <div className="cn-doctor-name">{m.name}</div>
                <div className="cn-doctor-title">{m.title}</div>
                {m.specialty && <div className="cn-doctor-specialty">{m.specialty}</div>}
                <div className="cn-doctor-meta">
                  {m.experience && <span>⏱ {m.experience}</span>}
                  {m.cases_count > 0 && <span>✦ {Number(m.cases_count).toLocaleString('vi-VN')} ca</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
