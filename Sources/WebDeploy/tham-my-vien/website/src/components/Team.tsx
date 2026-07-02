import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface TeamMember {
  id: number
  name: string
  title: string
  specialty: string
  experience: string
  cases_count: number
  education: string
  badge: string
  image: string
}

export default function Team() {
  const [team, setTeam]       = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(setTeam).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <section id="doi-ngu" className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="tmv-label">Đội ngũ</div>
          <h2 className="tmv-h2">Chuyên gia <em>hàng đầu</em></h2>
          <p className="tmv-lead center">Đội ngũ bác sĩ được đào tạo chuyên sâu, có kinh nghiệm và chứng chỉ quốc tế trong lĩnh vực thẩm mỹ y khoa.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>Đang tải...</div>
        ) : team.length === 0 ? null : (
          <div className="row g-4 justify-content-center">
            {team.map((m, i) => (
              <div key={m.id} className="col-12 col-sm-6 col-lg-4">
                <div className="tmv-doc-card" data-reveal data-delay={String(Math.min(i % 3 + 1, 4)) as '1'|'2'|'3'|'4'}>
                  <div className="tmv-doc-img-wrap">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="tmv-doc-img" loading="lazy" />
                    ) : (
                      <div className="tmv-doc-img" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 48, opacity: .3 }}>👨‍⚕️</span>
                      </div>
                    )}
                    {m.badge && <div className="tmv-doc-badge">{m.badge}</div>}
                  </div>
                  <div className="tmv-doc-body">
                    <div className="tmv-doc-name">{m.name}</div>
                    <div className="tmv-doc-role">{m.title}</div>
                    <div className="tmv-doc-creds">
                      {m.specialty && <div>{m.specialty}</div>}
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-3)' }}>
                        {m.experience && <span>⏱ {m.experience}</span>}
                        {m.cases_count > 0 && <span>✦ {Number(m.cases_count).toLocaleString('vi-VN')} ca</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
