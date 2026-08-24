import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { renderTitle, paragraphs, parseLines } from '../utils/text'

interface ProjectDetail {
  id: number
  title: string
  slug: string
  category: string
  location: string
  year: string
  client_name: string
  area: string
  duration: string
  budget: string
  cover_image: string
  challenge_title: string
  challenge_body: string
  solution_title: string
  solution_layout: string
  solution_items: string
  gallery_images: string
  results_title: string
  results_items: string
  testimonial_content: string
  testimonial_author: string
  testimonial_role: string
}

interface RelatedProject {
  id: number
  title: string
  slug: string
  category: string
  location: string
  year: string
  image: string
  has_case_study: number
}

interface SolutionItem { title: string; desc: string }
interface GalleryImg { src: string; alt: string; size: string }
interface ResultItem { value: string; suffix: string; label: string }

function parseSolutionItems(raw: string): SolutionItem[] {
  return parseLines(raw).map(line => {
    const [title, ...rest] = line.split('::')
    return { title: (title || '').trim(), desc: rest.join('::').trim() }
  }).filter(s => s.title)
}

function parseGallery(raw: string): GalleryImg[] {
  return parseLines(raw).map(line => {
    const [src, alt, size] = line.split('|')
    return { src: (src || '').trim(), alt: (alt || '').trim(), size: (size || 'g2').trim() }
  }).filter(g => g.src)
}

function parseResults(raw: string): ResultItem[] {
  return parseLines(raw).map(line => {
    const [value, suffix, label] = line.split('|')
    return { value: (value || '').trim(), suffix: (suffix || '').trim(), label: (label || '').trim() }
  }).filter(r => r.value && r.label)
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSite()
  const [proj, setProj] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState<RelatedProject[]>([])

  useDocumentMeta({
    title: proj ? `${proj.title} — Dự án ${settings.site_name || 'Tuấn Đặng Studio'}` : `Đang tải... — ${settings.site_name || 'Tuấn Đặng Studio'}`,
    description: proj ? `Case study ${proj.title} tại ${proj.location} — ${proj.category}.` : undefined,
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
      .then(items => setRelated(items.filter(p => p.slug !== slug).slice(0, 3)))
      .catch(() => setRelated([]))
  }, [slug])

  useCounterAnimation([proj])

  if (loading) {
    return <main><div style={{ textAlign: 'center', padding: '160px 24px 80px', color: 'var(--text-3)' }}>Đang tải...</div></main>
  }

  if (notFound || !proj) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '160px 24px 80px' }}>
          <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>Không tìm thấy dự án này.</p>
          <Link to="/du-an" className="pkt-btn">&larr; Tất cả dự án</Link>
        </div>
      </main>
    )
  }

  const solutionItems = parseSolutionItems(proj.solution_items)
  const gallery = parseGallery(proj.gallery_images)
  const results = parseResults(proj.results_items)

  return (
    <main>
      {/* CASE STUDY HERO */}
      <section className="pkt-cs-hero sec-light">
        <div className="pkt-container" data-reveal>
          <div className="pkt-cs-tag">{proj.category}</div>
          <h1 className="pkt-cs-title">{renderTitle(proj.title)}</h1>
          <div className="pkt-cs-meta">
            {proj.client_name && <>Khách hàng: <b>{proj.client_name}</b></>}
            {proj.year && <>&nbsp;·&nbsp; Năm thực hiện: <b>{proj.year}</b></>}
          </div>
        </div>
      </section>

      {proj.cover_image && (
        <img src={proj.cover_image} alt={`${proj.title} — ${proj.location}`} style={{ width: '100%', aspectRatio: '16/8', objectFit: 'cover' }} data-reveal />
      )}

      {/* OVERVIEW BAR */}
      <div className="pkt-container">
        <div className="pkt-ov-bar" data-reveal>
          <div className="pkt-ov-item">
            <div className="pkt-ov-label">Diện tích</div>
            <div className="pkt-ov-value">{proj.area || '—'}</div>
          </div>
          <div className="pkt-ov-item">
            <div className="pkt-ov-label">Địa điểm</div>
            <div className="pkt-ov-value">{proj.location || '—'}</div>
          </div>
          <div className="pkt-ov-item">
            <div className="pkt-ov-label">Thời gian thi công</div>
            <div className="pkt-ov-value">{proj.duration || '—'}</div>
          </div>
          <div className="pkt-ov-item">
            <div className="pkt-ov-label">Ngân sách</div>
            <div className="pkt-ov-value">{proj.budget || '—'}</div>
          </div>
        </div>
      </div>

      {/* BỐI CẢNH & THÁCH THỨC */}
      {proj.challenge_body && (
        <section className="sec-pad sec-light">
          <div className="pkt-container-narrow">
            <div className="pkt-eyebrow" data-reveal>Bối cảnh & thách thức</div>
            <h2 className="pkt-sec-title" style={{ fontSize: 'clamp(26px,3.4vw,38px)' }} data-reveal>{renderTitle(proj.challenge_title)}</h2>
            <div data-reveal data-reveal-d1 style={{ fontSize: 15.5, color: 'var(--text-2)', lineHeight: 1.9 }}>
              {paragraphs(proj.challenge_body).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>
      )}

      {/* GIẢI PHÁP THIẾT KẾ */}
      {solutionItems.length > 0 && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-eyebrow" data-reveal>{proj.solution_layout === 'list' ? 'Giải pháp / Cách tiếp cận' : 'Giải pháp thiết kế'}</div>
            <h2 className="pkt-sec-title" style={{ fontSize: 'clamp(26px,3.4vw,38px)' }} data-reveal>{renderTitle(proj.solution_title)}</h2>

            {proj.solution_layout === 'list' ? (
              <ul className="pkt-list-elegant mt-4" data-reveal data-reveal-d1>
                {solutionItems.map((s, i) => (
                  <li key={i}>
                    <span className="pkt-list-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pkt-list-title">{s.title}</span>
                    <span className="pkt-list-desc">{s.desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="row g-5 mt-2">
                {solutionItems.map((s, i) => (
                  <div className="col-lg-6" data-reveal data-reveal-d1={i % 2 === 0 ? true : undefined} data-reveal-d2={i % 2 === 1 ? true : undefined} key={i}>
                    <h4 style={{ fontFamily: 'var(--sans)', fontSize: 17, fontWeight: 600, marginBottom: 14 }}>{s.title}</h4>
                    <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.85 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="sec-pad sec-light">
          <div className="pkt-container">
            <div className="pkt-eyebrow" data-reveal>Hình ảnh công trình</div>
            <div className="pkt-gallery" data-reveal data-reveal-d1>
              {gallery.map((g, i) => (
                <img key={i} className={g.size} src={g.src} alt={g.alt || proj.title} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KẾT QUẢ */}
      {results.length > 0 && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-eyebrow" data-reveal>Kết quả</div>
            <h2 className="pkt-sec-title" style={{ fontSize: 'clamp(26px,3.4vw,38px)' }} data-reveal>{renderTitle(proj.results_title)}</h2>
            <ul className="pkt-result-list mt-4" data-reveal data-reveal-d1>
              {results.map((r, i) => (
                <li className="pkt-result-item" key={i}>
                  <span className="pkt-result-num" data-counter={r.value} data-suffix={r.suffix}>0{r.suffix}</span>
                  <span className="pkt-result-label">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {proj.testimonial_content && (
        <section className="sec-pad sec-light">
          <div className="pkt-container">
            <div className="pkt-quote" data-reveal>
              <blockquote>&quot;{proj.testimonial_content}&quot;</blockquote>
              <div className="pkt-quote-name">{proj.testimonial_author}</div>
              <div className="pkt-quote-role">{proj.testimonial_role}</div>
            </div>
          </div>
        </section>
      )}

      {/* DỰ ÁN LIÊN QUAN */}
      {related.length > 0 && (
        <section className="sec-pad sec-surface">
          <div className="pkt-container">
            <div className="pkt-sec-head" data-reveal>
              <div className="pkt-eyebrow">Dự án liên quan</div>
              <h2 className="pkt-sec-title" style={{ fontSize: 'clamp(24px,3vw,34px)' }}>Công trình <em>cùng chuyên môn</em></h2>
            </div>
            <div className="pkt-related-grid">
              {related.map((r, i) => (
                <Link
                  key={r.id}
                  to={r.has_case_study ? `/du-an/${r.slug}` : '/du-an'}
                  className="pkt-project-card"
                  data-reveal
                  data-reveal-d1={i === 1 ? true : undefined}
                  data-reveal-d2={i === 2 ? true : undefined}
                >
                  <img className="pkt-project-thumb" src={r.image} alt={r.title} loading="lazy" />
                  <div className="pkt-project-cat">{r.category}</div>
                  <div className="pkt-project-name">{r.title}</div>
                  <div className="pkt-project-loc">{r.location} · {r.year}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pkt-cta-band sec-light">
        <div className="pkt-container-narrow" data-reveal>
          <div className="pkt-eyebrow center">Bắt đầu dự án của bạn</div>
          <h2>{renderTitle(settings.cta_project_title || 'Bắt đầu dự án *của bạn*')}</h2>
          <Link to="/lien-he" className="pkt-btn pkt-btn-accent">
            Đặt lịch tư vấn miễn phí
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>
    </main>
  )
}
