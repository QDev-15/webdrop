import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useCounterAnimation } from '../hooks/useCounterAnimation'
import { renderTitle, paragraphs, parseLines } from '../utils/text'

interface ProjectDetail {
  id: number
  title: string
  slug: string
  category: string
  image: string
  year: string
  client_name: string
  industry: string
  duration: string
  services_provided: string
  key_result: string
  challenge_title: string
  challenge_details: string
  solution_heading: string
  solution_items: string
  solution_image: string
  gallery_images: string
  results_items: string
  testimonial_content: string
  testimonial_author: string
  testimonial_role: string
  testimonial_avatar: string
  cta_title: string
}

interface RelatedProject {
  id: number
  title: string
  slug: string
  category: string
  image: string
  has_case_study: number
}

interface SolutionStep { title: string; desc: string }
interface ResultItem { value: string; suffix: string; label: string }

function parseSolutionItems(raw: string): SolutionStep[] {
  return parseLines(raw).map(line => {
    const [title, ...rest] = line.split('|')
    return { title: (title || '').trim(), desc: rest.join('|').trim() }
  }).filter(s => s.title)
}

function parseGallery(raw: string): { src: string; alt: string }[] {
  return parseLines(raw).map(line => {
    const [src, alt] = line.split('|')
    return { src: (src || '').trim(), alt: (alt || '').trim() }
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
  const [proj, setProj] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related, setRelated] = useState<RelatedProject[]>([])

  useDocumentMeta({
    title: proj ? `${proj.title} — KHOA Design Studio` : 'Đang tải... — KHOA Design Studio',
    description: proj ? `Case study: ${proj.title} — ${proj.category}. Khách hàng: ${proj.client_name}.` : undefined,
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
    return <main><div style={{ textAlign: 'center', padding: '200px 24px 100px', color: 'var(--text-3)' }}>Đang tải...</div></main>
  }

  if (notFound || !proj) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '200px 24px 100px' }}>
          <p style={{ color: 'var(--text-3)', marginBottom: 24 }}>Không tìm thấy dự án này.</p>
          <Link to="/du-an" className="ptk-btn">&larr; Tất cả dự án</Link>
        </div>
      </main>
    )
  }

  const solutionSteps = parseSolutionItems(proj.solution_items)
  const gallery = parseGallery(proj.gallery_images)
  const results = parseResults(proj.results_items)
  const eyebrowLine = [proj.category, proj.client_name && `Khách hàng: ${proj.client_name}`, proj.year && `Năm: ${proj.year}`].filter(Boolean).join(' · ')

  return (
    <main>
      {/* PAGE HERO */}
      <section className="ptk-page-hero">
        <div className="ptk-container">
          <div className="ptk-crumb"><Link to="/">Trang chủ</Link> / <Link to="/du-an">Dự án</Link> / {proj.title}</div>
          {eyebrowLine && <div className="ptk-eyebrow on-dark">{eyebrowLine}</div>}
          <h1 className="ptk-page-title">{renderTitle(proj.title)}</h1>
        </div>
      </section>

      {/* OVERVIEW BAR */}
      <section>
        <div className="ptk-container">
          <div className="ptk-ov-bar" data-reveal>
            <div className="ptk-ov-item">
              <div className="ptk-ov-label">Ngành</div>
              <div className="ptk-ov-val">{proj.industry || '—'}</div>
            </div>
            <div className="ptk-ov-item">
              <div className="ptk-ov-label">Thời gian thực hiện</div>
              <div className="ptk-ov-val">{proj.duration || '—'}</div>
            </div>
            <div className="ptk-ov-item">
              <div className="ptk-ov-label">Dịch vụ cung cấp</div>
              <div className="ptk-ov-val">{proj.services_provided || '—'}</div>
            </div>
            <div className="ptk-ov-item">
              <div className="ptk-ov-label">Kết quả chính</div>
              <div className="ptk-ov-val">{proj.key_result || '—'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* BỐI CẢNH & THÁCH THỨC */}
      {proj.challenge_details && (
        <section className="ptk-sec">
          <div className="ptk-container">
            <div className="ptk-2col">
              <div data-reveal>
                <div className="ptk-eyebrow">Bối cảnh &amp; Thách thức</div>
                <h2 className="ptk-title">{renderTitle(proj.challenge_title)}</h2>
              </div>
              <div data-reveal>
                {paragraphs(proj.challenge_details).map((p, i) => (
                  <p className="ptk-sub" style={{ maxWidth: 'none', marginBottom: i === 0 ? 16 : 0 }} key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GIẢI PHÁP */}
      {solutionSteps.length > 0 && (
        <section className="ptk-sec ptk-sec-line">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>Giải pháp / Cách tiếp cận</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 44 }}>{renderTitle(proj.solution_heading)}</h2>
            <div className="ptk-strip" style={{ marginTop: 0 }} data-reveal>
              <div>
                <ul className="ptk-list-elegant">
                  {solutionSteps.map((s, i) => (
                    <li key={i}>
                      <div><div className="le-t">{s.title}</div><p className="le-p">{s.desc}</p></div>
                      <span className="le-n">{String(i + 1).padStart(2, '0')}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {proj.solution_image && (
                <div className="ptk-strip-media">
                  <img src={proj.solution_image} alt={`Minh hoạ giải pháp thiết kế ${proj.title}`} loading="lazy" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="ptk-sec">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>Thành phẩm</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 36 }}>Gallery <em>dự án.</em></h2>
            <div className="ptk-masonry" data-reveal>
              {gallery.map((g, i) => (
                <img key={i} src={g.src} alt={g.alt || proj.title} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KẾT QUẢ */}
      {results.length > 0 && (
        <section className="ptk-sec ptk-sec-dark">
          <div className="ptk-container">
            <div className="ptk-eyebrow on-dark" data-reveal>Kết quả</div>
            <h2 className="ptk-title" data-reveal style={{ color: '#fff', marginBottom: 40 }}>Con số <em>biết nói.</em></h2>
            <div className="ptk-stats-grid" data-reveal>
              {results.map((r, i) => (
                <div key={i}>
                  <div className="ptk-stat-num" data-counter={r.value} data-suffix={r.suffix}>0</div>
                  <div className="ptk-stat-label">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {proj.testimonial_content && (
        <section className="ptk-sec">
          <div className="ptk-container">
            <div className="ptk-testi" data-reveal style={{ maxWidth: 720 }}>
              <p className="ptk-testi-quote">&quot;{proj.testimonial_content}&quot;</p>
              <div className="ptk-testi-person">
                {proj.testimonial_avatar && <img src={proj.testimonial_avatar} alt={`Chân dung ${proj.testimonial_author}`} className="ptk-testi-avt" loading="lazy" />}
                <div>
                  <div className="ptk-testi-name">{proj.testimonial_author}</div>
                  <div className="ptk-testi-role">{proj.testimonial_role}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DỰ ÁN LIÊN QUAN */}
      {related.length > 0 && (
        <section className="ptk-sec ptk-sec-line">
          <div className="ptk-container">
            <div className="ptk-eyebrow" data-reveal>Dự án liên quan</div>
            <h2 className="ptk-title" data-reveal style={{ marginBottom: 36 }}>Xem thêm <em>dự án khác.</em></h2>
            <div className="ptk-related-grid" data-reveal>
              {related.map(r => (
                <Link key={r.id} to={r.has_case_study ? `/du-an/${r.slug}` : '/du-an'} className="ptk-proj-card">
                  {r.image && <img src={r.image} alt={r.title} loading="lazy" />}
                  <div className="ptk-proj-arrow">→</div>
                  <div className="ptk-proj-info"><span className="ptk-proj-cat">{r.category}</span><span className="ptk-proj-name">{r.title}</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ptk-cta-band">
        <div className="ptk-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }} data-reveal>
          <h2 className="ptk-cta-h">{renderTitle(proj.cta_title) || 'Có dự án cần tư vấn?'}</h2>
          <Link to="/lien-he" className="ptk-btn ptk-btn-white" style={{ borderColor: '#fff' }}>Nhận báo giá miễn phí</Link>
        </div>
      </section>
    </main>
  )
}
