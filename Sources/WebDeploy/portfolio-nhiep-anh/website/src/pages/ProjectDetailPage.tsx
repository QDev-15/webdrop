import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'

interface ProjectDetail {
  id: number
  title: string
  slug: string
  category: string
  description: string
  image: string
  client_name: string
  year: string
  location: string
  overview2_label: string
  overview2_value: string
  scope_text: string
  duration: string
  challenge: string
  solution: string
  gallery_images: string
  stats: string
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
  description: string
  image: string
}

interface Stat { value: string; suffix: string; label: string }

function parseLines(raw: string): string[] {
  return (raw || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}

function parseStats(raw: string): Stat[] {
  return parseLines(raw).map(line => {
    const [value, suffix, label] = line.split('|')
    return { value: (value || '').trim(), suffix: (suffix || '').trim(), label: (label || '').trim() }
  }).filter(s => s.value && s.label)
}

function paragraphs(text: string): string[] {
  return (text || '').split(/\r?\n\r?\n/).map(s => s.trim()).filter(Boolean)
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [proj, setProj] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState<RelatedProject[]>([])

  useDocumentMeta({
    title: proj ? `${proj.title} — Case Study | Đăng Photography` : 'Đang tải... — Đăng Photography',
    description: proj ? `Case study: ${proj.description}` : undefined,
  })

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    api.get<ProjectDetail>(`/public/projects/${slug}`)
      .then(setProj)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    api.get<RelatedProject[]>('/public/projects')
      .then(items => setRelated(items.filter(p => p.slug !== slug).slice(0, 2)))
      .catch(() => setRelated([]))
  }, [slug])

  useCounterAnimation([proj])

  if (loading) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '160px 24px 80px', color: 'var(--text-3)' }}>Đang tải...</div>
      </main>
    )
  }

  if (notFound || !proj) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '160px 24px 80px' }}>
          <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>Không tìm thấy dự án này.</p>
          <Link to="/du-an" className="pna-btn pna-btn-ghost">&larr; Tất cả dự án</Link>
        </div>
      </main>
    )
  }

  const gallery = parseLines(proj.gallery_images)
  const stats = parseStats(proj.stats)
  const hasOverview = Boolean(proj.location || proj.overview2_value || proj.scope_text || proj.duration)
  const hasCaseStudy = Boolean(proj.challenge || proj.solution)

  return (
    <main>
      <section className="pna-page-hero">
        <div className="wd-container">
          <Link to="/du-an" className="pna-back-link" data-reveal>&larr; Tất cả dự án</Link>
          <div className="pna-ph-tag" data-reveal>Case Study{proj.category ? ` · ${proj.category}` : ''}</div>
          <h1 className="pna-ph-title" data-reveal>{proj.title}</h1>
          <p className="pna-ph-sub" data-reveal>{proj.description}</p>
          <div data-reveal>
            {proj.client_name && <span className="pna-tag-pill">Khách hàng: {proj.client_name}</span>}
            {proj.year && <span className="pna-tag-pill">Năm: {proj.year}</span>}
            {proj.location && <span className="pna-tag-pill">Địa điểm: {proj.location}</span>}
          </div>
        </div>
      </section>

      {hasOverview && (
        <div className="pna-overview-bar">
          <div className="wd-container">
            <div className="pna-overview-inner" data-reveal>
              <div>
                <div className="pna-ov-label">Địa điểm</div>
                <div className="pna-ov-value">{proj.location || '—'}</div>
              </div>
              <div>
                <div className="pna-ov-label">{proj.overview2_label || 'Thông tin thêm'}</div>
                <div className="pna-ov-value">{proj.overview2_value || '—'}</div>
              </div>
              <div>
                <div className="pna-ov-label">Dịch vụ cung cấp</div>
                <div className="pna-ov-value">{proj.scope_text || '—'}</div>
              </div>
              <div>
                <div className="pna-ov-label">Thời lượng tác nghiệp</div>
                <div className="pna-ov-value">{proj.duration || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCaseStudy && (
        <>
          {proj.challenge && (
            <section className="sec-pad" style={{ background: 'var(--bg)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="pna-cs-label">Bối cảnh</div>
                    <h2 className="pna-cs-title">Thách thức</h2>
                  </div>
                  <div className="col-lg-8 pna-cs-body" data-reveal>
                    {paragraphs(proj.challenge).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              </div>
            </section>
          )}

          {proj.solution && (
            <section className="sec-pad" style={{ background: 'var(--surface)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="pna-cs-label">Cách tiếp cận</div>
                    <h2 className="pna-cs-title">Giải pháp</h2>
                  </div>
                  <div className="col-lg-8 pna-cs-body" data-reveal>
                    {paragraphs(proj.solution).map((block, i) => {
                      const lines = block.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
                      const isList = lines.length > 1 && lines.every(l => l.startsWith('-'))
                      if (isList) {
                        return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.replace(/^-\s*/, '')}</li>)}</ul>
                      }
                      return <p key={i}>{block}</p>
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {gallery.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
          <div className="wd-container">
            <div className="pna-gallery" data-reveal>
              {gallery.map((src, i) => (
                <a href={src} target="_blank" rel="noopener noreferrer" key={i}>
                  <img src={src} alt={`${proj.title} — hình ${i + 1}`} loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <div className="pna-stat-bar">
          <div className="wd-container">
            <div className="pna-stats-grid">
              {stats.map((s, i) => (
                <div data-reveal key={i}>
                  <div className="pna-stat-num" data-counter={s.value} data-suffix={s.suffix}>0</div>
                  <div className="pna-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {proj.testimonial_content && (
        <section className="pna-quote-block">
          <div className="wd-container" data-reveal>
            <span className="pna-quote-mark" aria-hidden="true">&quot;</span>
            <p className="pna-quote-text">{proj.testimonial_content}</p>
            <div className="pna-quote-src">
              {proj.testimonial_avatar && <img className="pna-testi-avatar" src={proj.testimonial_avatar} alt={proj.testimonial_author} />}
              <div>
                <div className="pna-quote-name">{proj.testimonial_author}</div>
                <div className="pna-quote-role">{proj.testimonial_role}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="pna-sec-head-row" data-reveal>
              <h2 className="pna-sec-title pna-mb-0">Dự án <em>liên quan</em></h2>
              <Link to="/du-an" className="pna-btn pna-btn-ghost">Xem tất cả &rarr;</Link>
            </div>
            <div className="row g-4">
              {related.map(r => (
                <div className="col-lg-6" key={r.id} data-reveal>
                  <Link to={`/du-an/${r.slug}`} className="pna-card">
                    <div className="pna-card-thumb"><img src={r.image} alt={r.title} loading="lazy" /></div>
                    <div className="pna-card-body">
                      <div className="pna-card-cat">{r.category}</div>
                      <h3 className="pna-card-title">{r.title}</h3>
                      <p className="pna-card-desc">{r.description}</p>
                      <span className="pna-card-link">Xem trong Dự án &rarr;</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ background: 'var(--dark)', padding: 'clamp(72px, 9vw, 112px) 0' }}>
        <div className="wd-container pna-center" data-reveal>
          <div className="pna-eyebrow on-dark" style={{ justifyContent: 'center' }}>Bắt đầu cùng tôi</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4.4vw,44px)', fontWeight: 500, color: '#fff', marginBottom: 28 }}>
            Bạn cũng muốn một<br />câu chuyện <em style={{ color: '#e2a58c', fontStyle: 'italic' }}>như vậy?</em>
          </h2>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="pna-btn pna-btn-accent">Đặt lịch tư vấn</Link>
            <Link to="/du-an" className="pna-btn pna-btn-outline-light">Xem thêm dự án</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
