import { useEffect, useState } from 'react'
import { api } from '../api/client'

interface TeamMember {
  id: number
  name: string
  title: string | null
  bio: string | null
  image: string | null
  specialties: string | null
  is_published: number
  sort_order: number
}

const AVATAR_FALLBACKS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=70&auto=format&fit=crop',
]

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    api.get<TeamMember[]>('/public/team')
      .then(setMembers)
      .catch(() => {})
  }, [])

  // Re-trigger reveal after data loads
  useEffect(() => {
    if (!members.length) return
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible')
              observer.unobserve(e.target)
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
      )
      document.querySelectorAll('[data-reveal]:not(.visible)').forEach(el => observer.observe(el))
      return () => observer.disconnect()
    }, 80)
    return () => clearTimeout(t)
  }, [members])

  if (!members.length) return null

  return (
    <section className="sl-team-bg sl-section">
      <div className="sl-container">
        <div className="sl-sec-head" data-reveal>
          <p className="sl-eyebrow">Đội ngũ chuyên gia</p>
          <h2 className="sl-sec-title">Những <em>bàn tay vàng</em></h2>
          <p className="sl-sec-sub">
            Được đào tạo chuyên nghiệp tại Thái Lan, Bali và các trung tâm wellness hàng đầu thế giới.
          </p>
        </div>

        <div className="sl-team-grid">
          {members.map((member, i) => {
            const specs = member.specialties
              ? member.specialties.split(',').map(s => s.trim()).filter(Boolean)
              : []

            return (
              <article key={member.id} className="sl-team-card" data-reveal>
                <div className="sl-team-img">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      onError={e => {
                        const img = e.currentTarget
                        img.src = AVATAR_FALLBACKS[i % AVATAR_FALLBACKS.length]
                      }}
                    />
                  ) : (
                    <div className="sl-team-avatar-placeholder">
                      <img
                        src={AVATAR_FALLBACKS[i % AVATAR_FALLBACKS.length]}
                        alt={member.name}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                <div className="sl-team-body">
                  <h3 className="sl-team-name">{member.name}</h3>
                  {member.title && <p className="sl-team-title">{member.title}</p>}
                  {member.bio && <p className="sl-team-bio">{member.bio}</p>}
                  {specs.length > 0 && (
                    <div className="sl-team-specs">
                      {specs.map(spec => (
                        <span key={spec} className="sl-team-spec">{spec}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
