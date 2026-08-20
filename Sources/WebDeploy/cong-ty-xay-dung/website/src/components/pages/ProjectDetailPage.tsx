import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'

interface ProjectDetail {
  id: number; name: string; slug: string; category: string; description: string; location: string
  year_completed: string; area: string; floors: string; duration: string; value: string; image: string
  investor_name: string; project_type_label: string; scale_text: string; result_summary: string
  challenge: string; solution: string; gallery_images: string; stats: string
  testimonial_content: string; testimonial_author: string; testimonial_title: string
}

interface RelatedProject {
  id: number; name: string; slug: string; category: string; description: string; image: string
}

interface Stat { value: string; suffix: string; label: string }

const CATEGORY_LABELS: Record<string, string> = {
  'dan-dung': 'Dân dụng',
  'cong-nghiep': 'Công nghiệp',
  'thuong-mai': 'Thương mại',
  'biet-thu': 'Biệt thự',
}

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

// Mỗi dòng bullet có thể lưu dạng "Nhãn — mô tả" — bold phần nhãn trước dấu em-dash
// để khớp CSS .xd-cs-body ul li strong; nếu không có "—" thì hiển thị nguyên dòng.
function renderListLine(line: string, key: number) {
  const idx = line.indexOf('—')
  if (idx > 0) {
    return <li key={key}><strong>{line.slice(0, idx).trim()}</strong> — {line.slice(idx + 1).trim()}</li>
  }
  return <li key={key}>{line}</li>
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [proj, setProj] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState<RelatedProject[]>([])

  useDocumentMeta({
    title: proj ? `${proj.name} — Case Study Thi Công` : 'Đang tải...',
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
  }, [proj, related])

  // Counter animation cho stats — cùng cơ chế data-counter/data-suffix đã dùng ở bản HTML tĩnh
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
      <div className="xd-page-hero">
        <div className="wd-container xd-page-hero-content">
          <div className="xd-ph-eyebrow">Case Study</div>
          <h1 className="xd-ph-title">Đang tải...</h1>
        </div>
      </div>
    )
  }

  if (notFound || !proj) {
    return (
      <div className="xd-page-hero">
        <div className="wd-container xd-page-hero-content">
          <div className="xd-ph-eyebrow">Case Study</div>
          <h1 className="xd-ph-title">Không tìm thấy công trình</h1>
          <p className="xd-ph-sub">Công trình này có thể đã bị gỡ hoặc đường link không chính xác.</p>
          <Link to="/du-an" className="xd-btn-solid" style={{ marginTop: 24, display: 'inline-block' }}>← Tất cả dự án</Link>
        </div>
      </div>
    )
  }

  const gallery = parseGallery(proj.gallery_images || '')
  const stats = parseStats(proj.stats || '')
  const hasCaseStudy = Boolean(proj.challenge || proj.solution)
  const catLabel = CATEGORY_LABELS[proj.category] || proj.category

  return (
    <>
      {/* PAGE HERO */}
      <div className="xd-page-hero" aria-label={proj.name}>
        {proj.image && (
          <div className="xd-page-hero-bg" aria-hidden="true">
            <img src={proj.image} alt="" loading="eager" />
          </div>
        )}
        <div className="wd-container xd-page-hero-content">
          <div className="xd-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="xd-breadcrumb-sep" aria-hidden="true">/</span>
            <Link to="/du-an">Dự án</Link>
            <span className="xd-breadcrumb-sep" aria-hidden="true">/</span>
            <span className="xd-breadcrumb-current">{proj.name}</span>
          </div>
          <div className="xd-ph-eyebrow" data-reveal>Case Study{catLabel ? ` · ${catLabel}` : ''}</div>
          <h1 className="xd-ph-title" data-reveal>{proj.name}</h1>
          <p className="xd-ph-sub" data-reveal>{proj.description}</p>
          <div className="xd-cs-meta-row" data-reveal>
            {proj.investor_name && <span className="xd-tag-inline">Chủ đầu tư: {proj.investor_name}</span>}
            {proj.year_completed && <span className="xd-tag-inline">Năm hoàn thành: {proj.year_completed}</span>}
            {proj.location && <span className="xd-tag-inline">Địa điểm: {proj.location}</span>}
          </div>
        </div>
      </div>

      {/* OVERVIEW BAR */}
      {(proj.project_type_label || proj.scale_text || proj.duration || proj.result_summary) && (
        <div className="xd-cs-overview">
          <div className="wd-container">
            <div className="xd-cs-overview-inner" data-reveal>
              <div className="xd-cs-overview-item">
                <div className="xd-cs-overview-label">Loại công trình</div>
                <div className="xd-cs-overview-value">{proj.project_type_label || catLabel || '—'}</div>
              </div>
              <div className="xd-cs-overview-item">
                <div className="xd-cs-overview-label">Quy mô</div>
                <div className="xd-cs-overview-value">{proj.scale_text || '—'}</div>
              </div>
              <div className="xd-cs-overview-item">
                <div className="xd-cs-overview-label">Thời gian thi công</div>
                <div className="xd-cs-overview-value">{proj.duration || '—'}</div>
              </div>
              <div className="xd-cs-overview-item">
                <div className="xd-cs-overview-label">Kết quả chính</div>
                <div className="xd-cs-overview-value">{proj.result_summary || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCaseStudy && (
        <>
          {/* BỐI CẢNH & THÁCH THỨC */}
          {proj.challenge && (
            <section className="sec-pad" style={{ background: 'var(--bg)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="xd-eyebrow">Bối cảnh</div>
                    <h2 className="xd-sec-title" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Thách thức</h2>
                  </div>
                  <div className="col-lg-8 xd-cs-body" data-reveal data-delay="1">
                    {paragraphs(proj.challenge).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* GIẢI PHÁP THI CÔNG */}
          {proj.solution && (
            <section className="sec-pad" style={{ background: 'var(--surface)' }}>
              <div className="wd-container">
                <div className="row g-5">
                  <div className="col-lg-4" data-reveal>
                    <div className="xd-eyebrow">Cách tiếp cận</div>
                    <h2 className="xd-sec-title" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Giải pháp thi công</h2>
                  </div>
                  <div className="col-lg-8 xd-cs-body" data-reveal data-delay="1">
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
            <div className="xd-cs-gallery" data-reveal>
              {gallery.map((src, i) => (
                <img key={i} src={src} alt={`${proj.name} — hình ${i + 1}`} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KẾT QUẢ */}
      {stats.length > 0 && (
        <section className="xd-stats-bar" aria-label="Kết quả dự án">
          <div className="wd-container">
            <div className="row g-0 align-items-center justify-content-around text-center">
              {stats.map((s, i) => (
                <div className="col-6 col-md-3" data-reveal data-delay={i.toString()} key={i}>
                  <span className="xd-stat-num" data-counter={s.value} data-suffix={s.suffix}>{s.value}{s.suffix}</span>
                  <span className="xd-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {proj.testimonial_content && (
        <section className="xd-cs-testi" aria-label="Khách hàng nói gì">
          <div className="wd-container">
            <div className="xd-cs-quote" data-reveal>
              <div className="xd-cs-quote-mark" aria-hidden="true">&ldquo;</div>
              <p className="xd-cs-quote-text">&quot;{proj.testimonial_content}&quot;</p>
              <div className="xd-cs-quote-author">{proj.testimonial_author}</div>
              {proj.testimonial_title && <div className="xd-cs-quote-role">{proj.testimonial_title}</div>}
            </div>
          </div>
        </section>
      )}

      {/* CÔNG TRÌNH LIÊN QUAN */}
      {related.length > 0 && (
        <>
        <section className="sec-pad" style={{ background: 'var(--bg)' }}>
          <div className="wd-container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4" data-reveal>
              <h2 className="xd-sec-title mb-0" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Công trình <span className="xd-accent">liên quan</span></h2>
              <Link to="/du-an" className="xd-tag-inline">Xem tất cả dự án →</Link>
            </div>
            <div className="row g-4">
              {related.map((r, i) => (
                <div className="col-md-6" key={r.id}>
                  <Link className="xd-project-card-full" to={`/du-an/${r.slug}`} data-reveal data-delay={i === 1 ? '1' : '0'}>
                    {r.image && <img src={r.image} alt={r.name} loading="lazy" />}
                    <div className="xd-project-card-overlay">
                      <div className="xd-proj-tag">{CATEGORY_LABELS[r.category] || r.category}</div>
                      <div className="xd-proj-title-card">{r.name}</div>
                      <div className="xd-proj-meta">Xem case study →</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        </>
      )}

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: '56px 0' }} aria-label="Kêu gọi hành động">
        <div className="wd-container">
          <div className="row align-items-center gy-4">
            <div className="col-md-8" data-reveal>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
                Bạn cũng muốn một công trình như vậy?
              </div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1 }}>
                Hãy để chúng tôi xây dựng<br />công trình mơ ước của bạn.
              </h2>
            </div>
            <div className="col-md-4 text-md-end" data-reveal data-delay="1">
              <Link to="/lien-he" style={{ display: 'inline-block', background: '#fff', color: 'var(--accent)', padding: '15px 36px', borderRadius: 2, fontSize: 12, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                Nhận báo giá miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
