import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface ProjectDetail {
  id: number; title: string; slug: string; category: string; description: string; image: string; client: string
  year: string; duration: string; scope_text: string; result_summary: string; challenge: string; solution: string
  gallery_images: string; stats: string
  testimonial_content: string; testimonial_author: string; testimonial_title: string; testimonial_avatar: string
}

interface RelatedProject {
  id: number; title: string; slug: string; category: string; description: string; image: string
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

// Mỗi dòng bullet lưu dạng "Nhãn — mô tả" — bold phần nhãn trước dấu em-dash để khớp CSS .cs-body ul li strong
function renderListLine(line: string, key: number) {
  const idx = line.indexOf('—')
  if (idx > 0) {
    return <li key={key}><strong>{line.slice(0, idx).trim()}</strong> — {line.slice(idx + 1).trim()}</li>
  }
  return <li key={key}>{line}</li>
}

const catLabels: Record<string, string> = { web: 'Website', app: 'App', brand: 'Thương hiệu' }

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [proj, setProj] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState<RelatedProject[]>([])

  usePageTitle(
    proj ? `${proj.title} — Case Study` : undefined,
    proj ? `Case study: ${proj.description}` : undefined,
  )

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

  // Counter animation cho stats — cùng cơ chế data-counter/data-suffix đã dùng ở các stat-bar khác trong site
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
          // Nếu admin nhập giá trị không phải số → giữ nguyên text gốc, không chạy animation
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
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Case Study</div>
          <h1 className="ph-title">Đang tải...</h1>
        </div>
      </section>
    )
  }

  if (notFound || !proj) {
    return (
      <section className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Case Study</div>
          <h1 className="ph-title">Không tìm thấy dự án</h1>
          <p className="ph-sub">Dự án này có thể đã bị gỡ hoặc đường link không chính xác.</p>
          <Link to="/du-an" className="btn-white" style={{ marginTop: 24 }}>← Tất cả dự án</Link>
        </div>
      </section>
    )
  }

  const gallery = parseGallery(proj.gallery_images || '')
  const stats = parseStats(proj.stats || '')
  const hasCaseStudy = Boolean(proj.challenge || proj.solution)

  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="wd-container">
          <Link to="/du-an" className="cs-back" data-reveal>← Tất cả dự án</Link>
          <div className="ph-eyebrow" data-reveal>Case Study{proj.category ? ` · ${catLabels[proj.category] || proj.category}` : ''}</div>
          <h1 className="ph-title" data-reveal>{proj.title}</h1>
          <p className="ph-sub" data-reveal>{proj.description}</p>
          <div className="cs-meta-row" data-reveal>
            {proj.client && <span className="cs-tag-pill">Khách hàng: {proj.client}</span>}
            {proj.year && <span className="cs-tag-pill">Năm: {proj.year}</span>}
          </div>
        </div>
      </section>

      {/* OVERVIEW BAR */}
      {(proj.duration || proj.scope_text || proj.result_summary) && (
        <div className="cs-overview">
          <div className="wd-container">
            <div className="cs-overview-inner" data-reveal>
              <div className="cs-overview-item">
                <div className="cs-overview-label">Ngành</div>
                <div className="cs-overview-value">{catLabels[proj.category] || proj.category || '—'}</div>
              </div>
              <div className="cs-overview-item">
                <div className="cs-overview-label">Thời gian thực hiện</div>
                <div className="cs-overview-value">{proj.duration || '—'}</div>
              </div>
              <div className="cs-overview-item">
                <div className="cs-overview-label">Dịch vụ cung cấp</div>
                <div className="cs-overview-value">{proj.scope_text || '—'}</div>
              </div>
              <div className="cs-overview-item">
                <div className="cs-overview-label">Kết quả chính</div>
                <div className="cs-overview-value">{proj.result_summary || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCaseStudy && (
        <>
          {/* CHALLENGE */}
          {proj.challenge && (
            <section className="sec-pad" style={{ background: 'var(--bg)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="cs-label">Bối cảnh</div>
                    <h2 className="cs-heading">Thách thức</h2>
                  </div>
                  <div className="col-lg-8 cs-body" data-reveal>
                    {paragraphs(proj.challenge).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SOLUTION */}
          {proj.solution && (
            <section className="sec-pad" style={{ background: 'var(--surface)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="cs-label">Cách tiếp cận</div>
                    <h2 className="cs-heading">Giải pháp</h2>
                  </div>
                  <div className="col-lg-8 cs-body" data-reveal>
                    {paragraphs(proj.solution).map((block, i) => {
                      const lines = block.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
                      const isList = lines.length > 1 && lines.every(l => l.startsWith('-'))
                      if (isList) {
                        return <ul key={i}>{lines.map((l, j) => renderListLine(l.replace(/^-\s*/, ''), j))}</ul>
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
        <section className="sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
          <div className="wd-container">
            <div className="cs-gallery" data-reveal>
              {gallery.map((src, i) => (
                <img key={i} src={src} alt={`${proj.title} — hình ${i + 1}`} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RESULT STATS */}
      {stats.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
          <div className="wd-container">
            <div className="text-center mb-5" data-reveal>
              <div className="eyebrow">Kết quả</div>
              <h2 className="sec-title">Số liệu <em>thực tế</em></h2>
            </div>
            <div className="row g-4 text-center">
              {stats.map((s, i) => (
                <div className={`col-6 col-md-3 reveal${i > 0 ? ` reveal-d${Math.min(i, 3)}` : ''}`} data-reveal key={i}>
                  <div className="stat-num" style={{ color: '#fff' }} data-counter={s.value} data-suffix={s.suffix}>{s.value}{s.suffix}</div>
                  <div className="stat-label" style={{ color: 'rgba(255,255,255,.35)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {proj.testimonial_content && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="cs-quote-wrap" data-reveal>
              <span className="cs-quote-mark" aria-hidden="true">&ldquo;</span>
              <p className="cs-quote-text">{proj.testimonial_content}</p>
              <div className="cs-quote-source">
                {proj.testimonial_avatar && <img className="cs-quote-av" src={proj.testimonial_avatar} alt={proj.testimonial_author} />}
                <div>
                  <div className="cs-quote-name">{proj.testimonial_author}</div>
                  <div className="cs-quote-role">{proj.testimonial_title}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RELATED PROJECTS */}
      {related.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4" data-reveal>
              <h2 className="sec-title mb-0">Dự án <em>liên quan</em></h2>
              <Link to="/du-an" className="btn-ghost">Xem tất cả →</Link>
            </div>
            <div className="row g-3">
              {related.map((r, i) => (
                <div className="col-md-6" key={r.id}>
                  <Link className={`pf-card-full reveal${i === 1 ? ' reveal-d1' : ''}`} to={`/du-an/${r.slug}`} data-reveal>
                    {r.image && <img className="pf-img" src={r.image} alt={r.title} loading="lazy" />}
                    <div className="pf-body">
                      <div className="pf-tags">
                        <span className="pf-tag">{catLabels[r.category] || r.category}</span>
                      </div>
                      <div className="pf-title">{r.title}</div>
                      <div className="pf-desc">{r.description}</div>
                      <span className="pf-link">Xem case study →</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-sec">
        <div className="wd-container" data-reveal>
          <h2 className="cta-title">Bạn cũng muốn kết quả như vậy?</h2>
          <p className="cta-sub">Tư vấn miễn phí. Báo giá trong 24 giờ. Không ràng buộc.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap position-relative">
            <Link to="/lien-he" className="btn-white">Nhận báo giá miễn phí →</Link>
            <Link to="/du-an" className="btn-outline-white">Xem thêm dự án</Link>
          </div>
        </div>
      </section>
    </>
  )
}
