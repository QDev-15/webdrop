import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface TeamMember {
  id: number
  name: string
  role: string
  cert: string
  image_url: string
  tags: string
}

const FALLBACK: TeamMember[] = [
  { id:1, name: 'Nguyễn Lan Anh', role: 'Head Instructor — Mat & Reformer', cert: 'STOTT Pilates® Certified', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop', tags: 'Mat Pilates,Prenatal,Spine Rehab' },
  { id:2, name: 'Trần Quốc Bảo', role: 'Clinical Pilates Specialist', cert: 'APPI Clinical Pilates', image_url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&q=80&auto=format&fit=crop', tags: 'Clinical,Rehabilitation,Sports Injury' },
  { id:3, name: 'Lê Minh Thư', role: 'Reformer Pilates Instructor', cert: 'Balanced Body® Certified', image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop', tags: 'Reformer,Core Strength,Flexibility' },
]

function Avatar({ src, name }: { src: string; name: string }) {
  const initials = (name || '?').split(' ').slice(-2).map(w => w[0] || '').join('').toUpperCase() || '?'
  if (src) return (
    <div className="ps-team-img-wrap">
      <img src={src} alt={name} className="ps-team-img" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
    </div>
  )
  return (
    <div className="ps-team-img-wrap" style={{ background: 'var(--green-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 32 }}>{initials}</span>
    </div>
  )
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    api.get<TeamMember[]>('/public/team')
      .then(d => setMembers(d.length > 0 ? d : FALLBACK))
      .catch(() => setMembers(FALLBACK))
  }, [])

  return (
    <section className="ps-team sec-pad">
      <div className="wd-container">
        <div className="text-center reveal">
          <div className="ps-eyebrow">Đội ngũ</div>
          <h2 className="ps-sec-title">Huấn luyện viên<br /><em>của chúng tôi.</em></h2>
          <p className="ps-sec-sub">Mỗi huấn luyện viên đều được đào tạo chuyên sâu và có chứng chỉ quốc tế.</p>
        </div>
        <div className="row g-4 mt-3 justify-content-center">
          {members.map((m, i) => (
            <div key={m.id} className={`col-md-4 col-lg-3 reveal reveal-d${Math.min(i % 4, 3) as 0|1|2|3}`}>
              <div className="ps-team-card">
                <Avatar src={m.image_url} name={m.name} />
                <div className="ps-team-body">
                  <div className="ps-team-name">{m.name}</div>
                  <div className="ps-team-role">{m.role}</div>
                  {m.cert && <div className="ps-team-cert">{m.cert}</div>}
                  {m.tags && (
                    <div className="ps-team-tags">
                      {m.tags.split(',').filter(Boolean).map(tag => (
                        <span key={tag} className="ps-team-tag">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
