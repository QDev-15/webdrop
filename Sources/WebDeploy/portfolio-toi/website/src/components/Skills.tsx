import { useEffect } from 'react'
import { SkillGroup } from '../App'

interface Props {
  skillGroups: SkillGroup[]
}

export default function Skills({ skillGroups }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [skillGroups])

  return (
    <section className="sec-pad sec-light" id="ky-nang">
      <div className="wd-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <div className="eyebrow eyebrow-dark reveal">Kỹ năng</div>
            <h2 className="sec-title reveal" style={{ color: 'var(--text)' }}>Công cụ &amp;<br /><em>công nghệ</em></h2>
            <p className="sec-sub reveal reveal-d1" style={{ color: 'var(--text-2)' }}>
              Tôi làm việc với một bộ công cụ hiện đại — từ thiết kế đến code, từ prototype đến production.
            </p>
          </div>
          <div>
            {skillGroups.map((group, gi) => (
              <div key={group.id} style={{ marginBottom: 24 }} className={`reveal${gi > 0 ? ` reveal-d${gi}` : ''}`}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
                  {group.name}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {group.skills.map(skill => (
                    <span key={skill.id} className="skill-tag">
                      <span className="skill-dot"></span>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(min-width:992px){
          #ky-nang .wd-container > div { grid-template-columns: 4fr 8fr !important; }
        }
      `}</style>
    </section>
  )
}
