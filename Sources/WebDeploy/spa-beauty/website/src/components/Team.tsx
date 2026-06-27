import { useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'

export default function Team() {
  const { team } = useSite()

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [team])

  if (team.length === 0) return null

  return (
    <div className="row g-4">
      {team.map((m, i) => (
        <div key={m.id} className="col-6 col-md-3">
          <div className="sb-team-card" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="sb-team-img-wrap">
              {m.image
                ? <img className="sb-team-img" src={m.image} alt={m.name} loading="lazy" />
                : <div style={{ width: '100%', height: '100%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👩</div>
              }
            </div>
            <div className="sb-team-name">{m.name}</div>
            <div className="sb-team-role">{m.role}</div>
            {m.experience && <div className="sb-team-exp">{m.experience}</div>}
            {(m.specialty1 || m.specialty2) && (
              <div className="sb-spec-tags">
                {m.specialty1 && <span className="sb-spec-tag">{m.specialty1}</span>}
                {m.specialty2 && <span className="sb-spec-tag">{m.specialty2}</span>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
