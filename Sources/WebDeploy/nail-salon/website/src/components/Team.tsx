import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface Member { id: number; name: string; role: string; image: string; specialty1: string; specialty2: string }

export default function Team() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    api.get<Member[]>('/public/team').then(setMembers).catch(() => {})
  }, [])

  if (!members.length) return null

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div className="text-center mb-4" data-reveal>
          <div className="ns-eyebrow">Đội ngũ thợ</div>
          <h2 className="ns-title">Những <strong>Nghệ Nhân</strong> Của Chúng Tôi</h2>
          <p className="ns-sub centered">Mỗi thợ nail đều được đào tạo bài bản và đam mê với nghề.</p>
        </div>
        <div className="row g-4 mt-2 justify-content-center">
          {members.map((m, i) => (
            <div key={m.id} className="col-6 col-md-4 col-lg-3" data-reveal data-reveal-d={`d${i % 4}`}>
              <div className="ns-team-card">
                <div className="ns-team-img-wrap">
                  {m.image
                    ? <img className="ns-team-img" src={m.image} alt={m.name} loading="lazy" />
                    : <div style={{ width: '100%', height: '100%', background: 'var(--blush-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👩</div>}
                </div>
                <div className="ns-team-name">{m.name}</div>
                <div className="ns-team-role">{m.role}</div>
                <div className="ns-team-spec">
                  {m.specialty1 && <span className="ns-spec-tag">{m.specialty1}</span>}
                  {m.specialty2 && <span className="ns-spec-tag">{m.specialty2}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
