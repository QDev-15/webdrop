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
  short_desc: string
  year: string
  client_name: string
  hero_desc: string
  industry: string
  duration: string
  services_provided: string
  key_result: string
  challenge_title: string
  challenge_intro: string
  challenge_details: string
  solution_items: string
  gallery_images: string
  results_note: string
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
  image: string
  has_case_study: number
}

interface SolutionStep { label: string; image: string; title: string; desc: string }
interface GalleryImg { src: string; alt: string; size: string }
interface ResultItem { value: string; suffix: string; label: string }

function parseSolutionItems(raw: string): SolutionStep[] {
  return parseLines(raw).map(line => {
    const [label, image, title, ...rest] = line.split('|')
    return { label: (label || '').trim(), image: (image || '').trim(), title: (title || '').trim(), desc: rest.join('|').trim() }
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
    title: proj ? `Case Study: ${proj.title} — ${settings.site_name || 'Đỗ Khánh Linh'}` : `Đang tải... — ${settings.site_name || 'Đỗ Khánh Linh'}`,
    description: proj ? (proj.hero_desc || proj.short_desc)?.slice(0, 155) : undefined,
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
          <Link to="/du-an" className="pux-btn pux-btn-ghost">&larr; Tất cả dự án</Link>
        </div>
      </main>
    )
  }

  const solutionSteps = parseSolutionItems(proj.solution_items)
  const gallery = parseGallery(proj.gallery_images)
  const results = parseResults(proj.results_items)

  return (
    <main>
      {/* PAGE HERO */}
      <section className="pux-page-hero">
        <span className="blob blob-a"></span>
        <span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="pux-crumb"><Link to="/">Trang chủ</Link> / <Link to="/du-an">Dự án</Link> / {proj.title}</div>
          <div className="eyebrow eyebrow-light" data-reveal>{proj.category}</div>
          <h1 className="sec-title on-dark" style={{ maxWidth: 720 }} data-reveal>{renderTitle(proj.title)}</h1>
          {proj.hero_desc && <p className="sec-sub on-dark" data-reveal data-reveal-d1>{proj.hero_desc}</p>}
          <div className="d-flex flex-wrap gap-4 mt-4" data-reveal data-reveal-d2>
            {proj.client_name && (
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Khách hàng</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{proj.client_name}</div>
              </div>
            )}
            {proj.year && (
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Năm thực hiện</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{proj.year}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OVERVIEW BAR */}
      <section style={{ padding: '44px 0 0' }}>
        <div className="wd-container">
          <div className="pux-overview-bar" data-reveal>
            <div className="pux-ov-item">
              <div className="pux-ov-label">Ngành</div>
              <div className="pux-ov-value">{proj.industry || '—'}</div>
            </div>
            <div className="pux-ov-item">
              <div className="pux-ov-label">Thời gian thực hiện</div>
              <div className="pux-ov-value">{proj.duration || '—'}</div>
            </div>
            <div className="pux-ov-item">
              <div className="pux-ov-label">Dịch vụ cung cấp</div>
              <div className="pux-ov-value">{proj.services_provided || '—'}</div>
            </div>
            <div className="pux-ov-item">
              <div className="pux-ov-label">Kết quả chính</div>
              <div className="pux-ov-value" style={{ color: 'var(--accent)' }}>{proj.key_result || '—'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* BỐI CẢNH & THÁCH THỨC */}
      {(proj.challenge_intro || proj.challenge_details) && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-6" data-reveal>
                <div className="eyebrow">Bối cảnh &amp; thách thức</div>
                <h2 className="sec-title" style={{ fontSize: 'clamp(24px,3vw,32px)' }}>{renderTitle(proj.challenge_title)}</h2>
                {proj.challenge_intro && <p className="sec-sub">{proj.challenge_intro}</p>}
              </div>
              <div className="col-lg-6" data-reveal data-reveal-d1>
                <div style={{ paddingTop: 44 }}>
                  {paragraphs(proj.challenge_details).map((p, i) => (
                    <p className={`sec-sub${i > 0 ? ' mt-3' : ''}`} key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GIẢI PHÁP / QUY TRÌNH */}
      {solutionSteps.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center mb-5">
              <div className="eyebrow justify-content-center" style={{ display: 'flex' }} data-reveal>Giải pháp</div>
              <h2 className="sec-title" data-reveal>Quy trình <em>4 bước</em> từ nghiên cứu đến kiểm thử.</h2>
            </div>

            {solutionSteps.map((s, i) => (
              <div className={`pux-strip mb-5${i % 2 === 1 ? ' rev' : ''}${i === solutionSteps.length - 1 ? '' : ''}`} data-reveal key={i}>
                <div className="pux-strip-media">
                  {s.image && <img src={s.image} alt={s.title} loading="lazy" />}
                </div>
                <div className="pux-strip-content">
                  <div className="pux-strip-num">{s.label}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                  <p className="sec-sub">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="eyebrow" data-reveal>Gallery</div>
            <h2 className="sec-title mb-4" data-reveal>Một số màn hình <em>trong sản phẩm cuối.</em></h2>
            <div className="pux-gallery" data-reveal>
              {gallery.map((g, i) => (
                <img key={i} className={g.size} src={g.src} alt={g.alt || proj.title} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KẾT QUẢ */}
      {results.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center mb-5">
              <div className="eyebrow justify-content-center" style={{ display: 'flex' }} data-reveal>Kết quả</div>
              <h2 className="sec-title" data-reveal>Số liệu đo được <em>sau khi ra mắt.</em></h2>
            </div>
            <div className="row g-4">
              {results.map((r, i) => (
                <div className="col-6 col-lg-3" data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined} data-reveal-d3={i === 3 ? true : undefined} key={i}>
                  <div className="pux-result-card">
                    <div className="pux-result-num" data-counter={r.value} data-suffix={r.suffix}>0</div>
                    <div className="pux-result-label">{r.label}</div>
                  </div>
                </div>
              ))}
            </div>
            {proj.results_note && <p className="sec-sub mx-auto text-center mt-4" data-reveal>{proj.results_note}</p>}
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {proj.testimonial_content && (
        <section className="sec-pad">
          <div className="wd-container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="pux-card p-5 text-center" data-reveal>
                  <span className="pux-quote-mark">&quot;</span>
                  <p className="pux-quote-text" style={{ fontSize: 18, maxWidth: 'none' }}>{proj.testimonial_content}</p>
                  <div className="pux-quote-author justify-content-center">
                    <div className="text-start"><div className="pux-quote-name">{proj.testimonial_author}</div><div className="pux-quote-role">{proj.testimonial_role}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DỰ ÁN LIÊN QUAN */}
      {related.length > 0 && (
        <section className="sec-pad" style={{ background: 'var(--surface)' }}>
          <div className="wd-container">
            <div className="eyebrow" data-reveal>Dự án liên quan</div>
            <h2 className="sec-title mb-4" data-reveal>Xem thêm <em>dự án khác.</em></h2>
            <div className="row g-4">
              {related.map((r, i) => (
                <div className="col-md-4" data-reveal data-reveal-d1={i === 1 ? true : undefined} data-reveal-d2={i === 2 ? true : undefined} key={r.id}>
                  <Link to={r.has_case_study ? `/du-an/${r.slug}` : '/du-an'} className="pux-card pux-proj-card">
                    <div className="pux-proj-thumb">
                      <span className="tag">{r.category}</span>
                      {r.image && <img src={r.image} alt={r.title} loading="lazy" />}
                    </div>
                    <div className="pux-proj-body">
                      <div className="pux-proj-cat">{r.category}</div>
                      <div className="pux-proj-name">{r.title}</div>
                      <div className="pux-proj-more">Xem case study →</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-5" data-reveal>
              <Link to="/lien-he" className="pux-btn pux-btn-accent">{settings.cta_project_title || 'Bạn có dự án tương tự? Liên hệ tôi'} →</Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
