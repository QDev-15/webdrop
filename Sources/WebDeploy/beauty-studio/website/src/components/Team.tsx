import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface Member {
  id: number
  name: string
  role: string
  bio: string
  avatar: string
}

export default function Team() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    api.get<Member[]>('/public/team').then(setMembers).catch(() => {})
  }, [])

  // Re-observe after async data renders (AppShell fires before data loads on SPA navigation)
  useEffect(() => {
    if (members.length === 0) return
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
  }, [members])

  if (members.length === 0) return null

  return (
    <section className="sec-pad" style={{ background: 'var(--bg-soft)' }}>
      <div className="wd-container">
        <div className="text-center mb-5" data-reveal>
          <div className="bst-eyebrow">Đội ngũ chuyên gia</div>
          <h2 className="bst-title">Những nghệ nhân <em>tài năng</em></h2>
          <p className="bst-sub mx-auto">Đội ngũ được đào tạo chuyên sâu, cập nhật xu hướng liên tục từ các trung tâm đào tạo uy tín.</p>
        </div>

        <div className="row g-3">
          {members.map((m, i) => (
            <div key={m.id} className="col-lg-3 col-md-6" data-reveal data-delay={String((i % 4) + 1)}>
              <div className="bst-team-card">
                {m.avatar
                  ? <img src={m.avatar} alt={m.name} className="bst-team-img" />
                  : <div className="bst-team-img" style={{ background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>👤</div>
                }
                <div className="bst-team-name">{m.name}</div>
                <div className="bst-team-role">{m.role}</div>
                {m.bio && <div className="bst-team-bio">{m.bio}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
