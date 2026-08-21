import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Project {
  id: number
  title: string
  slug: string
  category: string
  description: string
  image: string
  year: string
  client_name: string
  role_text: string
  publication_type: string
  duration: string
  illustration_count: string
  challenge: string
  process_heading: string
  process_steps: string
  gallery_images: string
  result_summary: string
  result_stats: string
  testimonial_content: string
  testimonial_author: string
  testimonial_role: string
  testimonial_avatar: string
}

interface RelatedProject {
  id: number
  title: string
  slug: string
  category: string
  image: string
  year: string
}

function renderText(text: string) {
  const parts = (text || '').split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    return <span key={i}>{part}</span>
  })
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let cur = 0
    const step = Math.ceil(target / 60)
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(cur)
      if (cur >= target) clearInterval(t)
    }, 25)
    return () => clearInterval(t)
  }, [target])
  return <>{val}{suffix}</>
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { settings } = useSite()
  const [project, setProject] = useState<Project | null>(null)
  const [related, setRelated] = useState<RelatedProject[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setProject(null)
    setNotFound(false)
    api.get<Project>(`/public/projects/${slug}`)
      .then(setProject)
      .catch(() => setNotFound(true))
    api.get<RelatedProject[]>(`/public/related-projects/${slug}`).then(setRelated).catch(() => {})
  }, [slug])

  useDocumentMeta({
    title: project ? `${project.title} — ${settings.site_name || 'Lam Trúc Illustration'}` : 'Đang tải...',
    description: project?.description?.slice(0, 155),
  })

  if (notFound) {
    return (
      <section className="pmh-sec" style={{ textAlign: 'center' }}>
        <div className="pmh-container">
          <h1>Không tìm thấy dự án</h1>
          <p style={{ margin: '16px 0 28px', color: 'var(--text-2)' }}>Dự án bạn tìm không tồn tại hoặc đã bị gỡ.</p>
          <button className="pmh-btn pmh-btn-primary" onClick={() => navigate('/du-an')}>Xem tất cả dự án</button>
        </div>
      </section>
    )
  }

  if (!project) return <div style={{ padding: '160px 0', textAlign: 'center' }}>Đang tải...</div>

  const hasCaseStudy = !!(project.challenge || project.gallery_images || project.result_summary)
  const galleryUrls = (project.gallery_images || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  const processSteps = (project.process_steps || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    .map(line => { const [title, desc] = line.split('|'); return { title, desc } })
  const resultStats = (project.result_stats || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    .map(line => { const [value, suffix, label] = line.split('|'); return { value, suffix: suffix || '', label } })
  const challengeParagraphs = (project.challenge || '').split(/\n\n+/).filter(Boolean)

  return (
    <>
      <section className="pmh-page-hero">
        <div className="pmh-container inner">
          <div className="pmh-crumb"><Link to="/">Trang chủ</Link> / <Link to="/du-an">Dự án</Link> / {project.title}</div>
          {project.category && <span className="tag">{project.category}</span>}
          <h1>{project.title}</h1>
          {project.description && <p>{project.description}</p>}
          {(project.client_name || project.year || project.role_text) && (
            <div className="meta-row">
              {project.client_name && <div>Khách hàng<strong>{project.client_name}</strong></div>}
              {project.year && <div>Năm thực hiện<strong>{project.year}</strong></div>}
              {project.role_text && <div>Vai trò<strong>{project.role_text}</strong></div>}
            </div>
          )}
        </div>
      </section>

      {hasCaseStudy && (project.publication_type || project.duration || project.illustration_count) && (
        <section className="pmh-sec-sm">
          <div className="pmh-container">
            <div className="pmh-overview-bar" data-reveal>
              <div><div className="lbl">Khách hàng</div><div className="val">{project.client_name || '—'}</div></div>
              <div><div className="lbl">Loại hình xuất bản</div><div className="val">{project.publication_type || '—'}</div></div>
              <div><div className="lbl">Thời gian thực hiện</div><div className="val">{project.duration || '—'}</div></div>
              <div><div className="lbl">Số lượng illustration</div><div className="val">{project.illustration_count || '—'}</div></div>
            </div>
          </div>
        </section>
      )}

      <section className="pmh-sec pmh-sec-sm">
        <div className="pmh-container-sm">

          {challengeParagraphs.length > 0 && (
            <div className="pmh-case-block" data-reveal>
              <h2>Bối cảnh &amp; <span>Thách thức</span></h2>
              {challengeParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          {processSteps.length > 0 && (
            <div className="pmh-case-block" data-reveal>
              <h2>{renderText(project.process_heading || 'Quy trình *sáng tác*')}</h2>
              <div className="pmh-case-steps">
                {processSteps.map((step, i) => (
                  <div className="pmh-case-step" key={i}>
                    <div className="n">{String(i + 1).padStart(2, '0')}</div>
                    <div><h4>{step.title}</h4><p>{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {galleryUrls.length > 0 && (
            <div className="pmh-case-block" data-reveal>
              <h2>Gallery <span>dự án</span></h2>
              <div className="pmh-gallery">
                {galleryUrls.map((url, i) => (
                  <img key={i} className={i === 0 ? 'full' : ''} src={url} alt={`${project.title} — ảnh ${i + 1}`} loading="lazy" />
                ))}
              </div>
            </div>
          )}

          {(project.result_summary || resultStats.length > 0) && (
            <div className="pmh-case-block" data-reveal>
              <h2>Kết <span>quả</span></h2>
              {project.result_summary && <p>{project.result_summary}</p>}
              {resultStats.length > 0 && (
                <div className="pmh-results-grid">
                  {resultStats.map((s, i) => (
                    <div className="pmh-result-item" key={i}>
                      <div className="num"><Counter target={Number(s.value) || 0} suffix={s.suffix} /></div>
                      <div className="lbl">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {project.testimonial_content && (
            <div className="pmh-case-block" data-reveal>
              <div className="pmh-case-quote">
                <div className="mark">"</div>
                <p>{project.testimonial_content}</p>
                <div className="who">
                  {project.testimonial_avatar && <img src={project.testimonial_avatar} alt={project.testimonial_author} loading="lazy" />}
                  <div><strong>{project.testimonial_author}</strong><span>{project.testimonial_role}</span></div>
                </div>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="pmh-case-block" data-reveal>
              <h2>Dự án <span>liên quan</span></h2>
              <div className="pmh-related-grid">
                {related.map(r => (
                  <Link to={`/du-an/${r.slug}`} className="pmh-pcard" key={r.id}>
                    <div className="pmh-pcard-img"><span className="pmh-pcard-tag">{r.category}</span>
                      <img src={r.image} alt={r.title} loading="lazy" /></div>
                    <div className="pmh-pcard-body"><h3>{r.title}</h3><span>{r.category} · {r.year}</span></div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pmh-cta-band" data-reveal>
            <div className="inner">
              <h2>Muốn có một dự án tương tự?</h2>
              <p>Kể mình nghe ý tưởng — cùng lên kế hoạch từ concept đến bản bàn giao cuối cùng.</p>
              <div className="row">
                <Link to="/lien-he" className="pmh-btn pmh-btn-white">Bắt đầu dự án</Link>
                <Link to="/du-an" className="pmh-btn pmh-btn-ghost-dark" style={{ borderColor: 'rgba(255,255,255,.6)' }}>Xem thêm dự án</Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
