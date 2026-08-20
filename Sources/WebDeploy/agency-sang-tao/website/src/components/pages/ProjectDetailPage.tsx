import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

interface ProjectDetail {
  id: number
  title: string
  slug: string
  category: string
  description: string
  image: string
  client_name: string
  year: string
  duration: string
  scope_text: string
  result_summary: string
  challenge: string
  solution: string
  gallery_images: string
  stats: string
  testimonial_content: string
  testimonial_author: string
  testimonial_title: string
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

function parseGallery(raw: string): string[] {
  return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
}

function parseStats(raw: string): Stat[] {
  return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(line => {
    const [value, suffix, label] = line.split('|')
    return { value: (value || '').trim(), suffix: (suffix || '').trim(), label: (label || '').trim() }
  }).filter(s => s.value && s.label)
}

function paragraphs(text: string): string[] {
  return text.split(/\r?\n\r?\n/).map(s => s.trim()).filter(Boolean)
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [proj, setProj] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState<RelatedProject[]>([])

  useDocumentMeta({
    title: proj ? `${proj.title} — Case Study | Agency Sáng Tạo` : 'Đang tải... — Agency Sáng Tạo',
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [proj])

  // Counter animation cho stats — giống hero/stat-bar khác trong site
  useEffect(() => {
    if (!proj) return
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<HTMLElement>('[data-counter]:not([data-counted])')
      const cro = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.setAttribute('data-counted', '1')
          const target = +(el.dataset.counter || 0)
          // Admin nhập "value" không phải số trong ô Số liệu kết quả → giữ nguyên text gốc,
          // không chạy animation (tránh NaN hiển thị vĩnh viễn + setInterval không bao giờ dừng)
          if (!Number.isFinite(target)) { cro.unobserve(el); return }
          const suffix = el.dataset.suffix || ''
          let cur = 0
          const step = Math.ceil(target / 60) || 1
          const t = setInterval(() => {
            cur = Math.min(cur + step, target)
            el.textContent = cur + suffix
            if (cur >= target) clearInterval(t)
          }, 25)
          cro.unobserve(el)
        })
      }, { threshold: 0.5 })
      els.forEach(el => cro.observe(el))
      return () => cro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [proj])

  if (loading) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '160px 24px 80px', color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>Đang tải...</div>
      </main>
    )
  }

  if (notFound || !proj) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '160px 24px 80px' }}>
          <p style={{ fontFamily: 'var(--sans)', color: 'var(--text-3)', marginBottom: 24 }}>Không tìm thấy dự án này.</p>
          <Link to="/du-an" className="ag-btn-outline">&larr; Quay lại Dự án</Link>
        </div>
      </main>
    )
  }

  const gallery = parseGallery(proj.gallery_images || '')
  const stats = parseStats(proj.stats || '')
  const hasCaseStudy = Boolean(proj.challenge || proj.solution)

  return (
    <main>
      {/* PAGE HERO */}
      <section className="ag-page-hero">
        <div className="wd-container">
          <Link to="/du-an" className="ag-view-all" style={{ display: 'inline-block', marginBottom: 24 }} data-reveal>&larr; Tất cả dự án</Link>
          <div className="ag-ph-label" data-reveal>Case Study{proj.category ? ` · ${proj.category}` : ''}</div>
          <h1 className="ag-ph-title" data-reveal>{proj.title}</h1>
          <p className="ag-ph-sub" data-reveal>{proj.description}</p>
          <div className="ag-cs-meta-row" data-reveal>
            {proj.client_name && <span className="ag-tag-pill">Khách hàng: {proj.client_name}</span>}
            {proj.year && <span className="ag-tag-pill">Năm: {proj.year}</span>}
          </div>
        </div>
      </section>

      {/* OVERVIEW BAR */}
      {(proj.duration || proj.scope_text || proj.result_summary) && (
        <div className="ag-cs-overview">
          <div className="wd-container">
            <div className="ag-cs-overview-inner" data-reveal>
              <div className="ag-cs-overview-item">
                <div className="ag-cs-overview-label">Thời gian</div>
                <div className="ag-cs-overview-value">{proj.duration || '—'}</div>
              </div>
              <div className="ag-cs-overview-item">
                <div className="ag-cs-overview-label">Dịch vụ</div>
                <div className="ag-cs-overview-value">{proj.scope_text || proj.category || '—'}</div>
              </div>
              <div className="ag-cs-overview-item">
                <div className="ag-cs-overview-label">Khách hàng</div>
                <div className="ag-cs-overview-value">{proj.client_name || '—'}</div>
              </div>
              <div className="ag-cs-overview-item">
                <div className="ag-cs-overview-label">Kết quả chính</div>
                <div className="ag-cs-overview-value">{proj.result_summary || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCaseStudy && (
        <>
          {/* CHALLENGE */}
          {proj.challenge && (
            <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="ag-section-label">Bối cảnh</div>
                    <h2 className="ag-section-title" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Thách thức</h2>
                  </div>
                  <div className="col-lg-8 ag-cs-body" data-reveal>
                    {paragraphs(proj.challenge).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SOLUTION */}
          {proj.solution && (
            <section className="ag-sec-pad" style={{ background: 'var(--surface)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="ag-section-label">Cách tiếp cận</div>
                    <h2 className="ag-section-title" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Giải pháp</h2>
                  </div>
                  <div className="col-lg-8 ag-cs-body" data-reveal>
                    {paragraphs(proj.solution).map((block, i) => {
                      const lines = block.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
                      const isList = lines.length > 1 && lines.every(l => l.startsWith('-'))
                      if (isList) {
                        return (
                          <ul key={i}>
                            {lines.map((l, j) => <li key={j}>{l.replace(/^-\s*/, '')}</li>)}
                          </ul>
                        )
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

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="ag-sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
          <div className="wd-container">
            <div className="ag-cs-gallery" data-reveal>
              {gallery.map((src, i) => (
                <img key={i} src={src} alt={`${proj.title} — hình ${i + 1}`} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RESULT STATS */}
      {stats.length > 0 && (
        <div className="ag-stat-bar">
          <div className="wd-container">
            <div className="ag-stat-bar-inner">
              {stats.map((s, i) => (
                <div className="ag-stat-item" key={i} data-reveal>
                  <div className="ag-stat-number" data-counter={s.value} data-suffix={s.suffix}>{s.value}{s.suffix}</div>
                  <div className="ag-stat-name">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIAL */}
      {proj.testimonial_content && (
        <section className="ag-testimonial-section">
          <div className="wd-container">
            <span className="ag-section-label" data-reveal>Khách hàng nói gì</span>
            <blockquote className="ag-blockquote ag-cs-related-quote" data-reveal>
              <span className="ag-quote-mark" aria-hidden="true">&ldquo;</span>
              <p className="ag-quote-text">&ldquo;{proj.testimonial_content}&rdquo;</p>
              <div className="ag-quote-source">
                {proj.testimonial_avatar && <img className="ag-quote-avatar" src={proj.testimonial_avatar} alt={proj.testimonial_author} />}
                <div className="ag-quote-info">
                  <div className="ag-quote-name">{proj.testimonial_author}</div>
                  <div className="ag-quote-company">{proj.testimonial_title}</div>
                </div>
              </div>
            </blockquote>
          </div>
        </section>
      )}

      {/* RELATED PROJECTS */}
      {related.length > 0 && (
        <section className="ag-sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="ag-work-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }} data-reveal>
              <h2 className="ag-section-title" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Dự án <em>liên quan</em></h2>
              <Link to="/du-an" className="ag-view-all">Xem tất cả &rarr;</Link>
            </div>
            <div className="row g-4">
              {related.map(r => (
                <div className="col-lg-6" key={r.id} data-reveal>
                  <Link to={`/du-an/${r.slug}`} className="ag-project-card">
                    {r.image && (
                      <div style={{ overflow: 'hidden' }}>
                        <img className="ag-project-thumb" src={r.image} alt={r.title} loading="lazy" />
                      </div>
                    )}
                    <div className="ag-project-body">
                      <div className="ag-project-cat">{r.category}</div>
                      <h2 className="ag-project-title">{r.title}</h2>
                      <p className="ag-project-desc">{r.description}</p>
                      <span className="ag-project-link">Xem case study &rarr;</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--dark)', padding: 'clamp(72px, 9vw, 112px) 0' }}>
        <div className="wd-container text-center" data-reveal>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>Bắt đầu cùng chúng tôi</div>
          <h2 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(32px,5vw,64px)', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: '.95', marginBottom: '28px' }}>
            Bạn cũng muốn một<br/>kết quả <span style={{ color: 'var(--accent)' }}>như vậy?</span>
          </h2>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="ag-btn-accent">Nhận báo giá miễn phí</Link>
            <Link to="/du-an" className="ag-btn-ghost-dark">Xem thêm dự án</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
