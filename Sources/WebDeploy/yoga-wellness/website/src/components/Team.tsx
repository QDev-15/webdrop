import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface TeamMember {
  id: number
  name: string
  role: string
  image: string
  experience: string
  cert: string
  specialties: string
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<TeamMember[]>('/public/team').then(data => {
      setMembers(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <section className="sec-pad yw-strip">
      <div className="wd-container">
        <div className="yw-sec-header text-center mb-5" data-reveal>
          <div className="yw-eyebrow">Đội Ngũ</div>
          <h2 className="yw-title">Các giáo viên <em>chuyên nghiệp</em></h2>
          <p className="yw-sub centered">Những huấn luyện viên yoga được chứng nhận, giàu kinh nghiệm</p>
        </div>

        {loading ? (
          <div className="text-center py-5">Đang tải...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-5 text-muted">Chưa có thông tin giáo viên</div>
        ) : (
          <div className="row g-4">
            {members.map((member, idx) => (
              <div key={member.id} className={`col-md-6 col-lg-4 rd${(idx % 3) + 1}`} data-reveal>
                <div className="yw-teacher">
                  <img src={member.image} alt={member.name} className="yw-teacher-img" onError={e => { e.currentTarget.src = 'https://via.placeholder.com/120?text=' + encodeURIComponent(member.name) }} />
                  <h3 className="yw-teacher-name">{member.name}</h3>
                  {member.role && <div className="yw-teacher-role">{member.role}</div>}
                  {member.experience && <p className="yw-teacher-exp">{member.experience}</p>}
                  {member.specialties && (
                    <div className="yw-teacher-styles">
                      {member.specialties.split(',').map((spec, i) => (
                        <span key={i}>{spec.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
