import { useEffect } from 'react'
import { Project, Settings } from '../App'

interface Props {
  projects: Project[]
  settings: Settings
}

export default function Projects({ projects, settings }: Props) {
  const githubUrl = settings.social_github || 'https://github.com'

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
  }, [projects])

  const featuredProjects = projects.filter(p => p.featured === 1).slice(0, 2)
  const otherProjects = projects.filter(p => p.featured !== 1).slice(0, 3)

  return (
    <section className="sec-pad" id="du-an">
      <div className="wd-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="eyebrow reveal">Dự án</div>
          <h2 className="sec-title reveal" style={{ color: '#fff' }}>Một số công việc <em>gần đây</em></h2>
          <p className="sec-sub reveal reveal-d1" style={{ color: 'rgba(255,255,255,.35)', margin: '0 auto' }}>
            Từ thiết kế giao diện đến sản phẩm hoàn chỉnh — mỗi dự án là một câu chuyện riêng.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {featuredProjects.map((p, i) => (
            <div key={p.id} className={`reveal${i > 0 ? ' reveal-d1' : ''}`} style={{ gridColumn: 'span 1' }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>

        {otherProjects.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginTop: 16 }}>
            {otherProjects.map((p, i) => (
              <div key={p.id} className={`reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }} className="reveal">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
            Xem thêm trên GitHub ↗
          </a>
        </div>
      </div>
      <style>{`
        @media(min-width:992px){
          #du-an .wd-container > div:first-of-type {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const tags = project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <div className="pj-card">
      {project.image && (
        <div style={{ overflow: 'hidden' }}>
          <img src={project.image} className="pj-img" alt={project.title} />
        </div>
      )}
      <div className="pj-body">
        <div className="pj-cat">{project.category}</div>
        <div className="pj-name">{project.title}</div>
        <div className="pj-desc">{project.description}</div>
        <div className="pj-tags">
          {tags.map(tag => <span key={tag} className="pj-tag">{tag}</span>)}
        </div>
        {(project.project_url || project.github_url) && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {project.project_url && (
              <a href={project.project_url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: 'var(--accent-mid)', textDecoration: 'none' }}>
                Demo ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', textDecoration: 'none' }}>
                GitHub ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
