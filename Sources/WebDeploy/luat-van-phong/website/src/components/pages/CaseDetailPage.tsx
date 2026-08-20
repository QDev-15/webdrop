import { Link, useParams } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import Reveal from '../Reveal'
import CtaForm from '../CtaForm'
import { usePageTitle } from '../../hooks/usePageTitle'

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

// Mỗi dòng bullet lưu dạng "Nhãn — mô tả" — bold phần nhãn trước dấu em-dash để khớp CSS
// .lv-cs-body ul li strong; nếu không có "—" thì hiển thị nguyên dòng.
function renderListLine(line: string, key: number) {
  const idx = line.indexOf('—')
  if (idx > 0) {
    return <li key={key}><strong style={{ color: 'var(--text)', fontWeight: 500 }}>{line.slice(0, idx).trim()}</strong> — {line.slice(idx + 1).trim()}</li>
  }
  return <li key={key}>{line}</li>
}

export default function CaseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { cases, settings, loading } = useSite()
  const item = cases.find(c => c.slug === slug)
  const phone = settings.site_phone || '0900 000 000'

  usePageTitle(
    item ? `${item.title} — Case Study Vụ Việc` : 'Đang tải...',
    item ? `Case study: ${item.summary}` : undefined
  )

  if (loading) {
    return (
      <section className="lv-page-hero">
        <div className="wd-container">
          <h1 className="lv-ph-title">Đang tải...</h1>
        </div>
      </section>
    )
  }

  if (!item) {
    return (
      <section className="lv-page-hero">
        <div className="wd-container">
          <div className="lv-ph-kicker">Case Study</div>
          <h1 className="lv-ph-title">Không tìm thấy vụ việc</h1>
          <p className="lv-ph-sub">Vụ việc này có thể đã bị gỡ hoặc đường link không chính xác.</p>
          <Link to="/du-an" className="lv-view-all" style={{ display: 'inline-block', marginTop: 22 }}>&larr; Tất cả vụ việc</Link>
        </div>
      </section>
    )
  }

  const gallery = parseGallery(item.gallery_images || '')
  const stats = parseStats(item.stats || '')
  const hasOverview = Boolean(item.practice_area || item.duration_text || item.scope_text || item.result_headline)
  const related = cases.filter(c => c.slug !== item.slug).slice(0, 2)

  return (
    <>
      {/* PAGE HERO */}
      <section className="lv-page-hero" aria-label="Case study vụ việc">
        <div className="wd-container">
          <Link to="/du-an" className="lv-view-all" style={{ display: 'inline-block', marginBottom: 22 }}>&larr; Tất cả vụ việc</Link>
          <Reveal tag="div" className="lv-ph-kicker">Case Study{(item.practice_area || item.category) ? ` · ${item.practice_area || item.category}` : ''}</Reveal>
          <Reveal tag="h1" delay={1} className="lv-ph-title">{item.title}</Reveal>
          {item.summary && <Reveal tag="p" delay={2} className="lv-ph-sub">{item.summary}</Reveal>}
          <Reveal delay={3} className="lv-cs-meta-row">
            {item.client_name && <span className="lv-tag">Thân chủ: {item.client_name}</span>}
            {item.year ? <span className="lv-tag">Năm: {item.year}</span> : null}
          </Reveal>
        </div>
      </section>

      {/* OVERVIEW BAR */}
      {hasOverview && (
        <div className="lv-cs-overview">
          <div className="wd-container">
            <Reveal className="lv-cs-overview-inner">
              <div className="lv-cs-overview-item">
                <div className="lv-cs-overview-label">Lĩnh vực pháp lý</div>
                <div className="lv-cs-overview-value">{item.practice_area || item.category || '—'}</div>
              </div>
              <div className="lv-cs-overview-item">
                <div className="lv-cs-overview-label">Thời gian xử lý</div>
                <div className="lv-cs-overview-value">{item.duration_text || '—'}</div>
              </div>
              <div className="lv-cs-overview-item">
                <div className="lv-cs-overview-label">Phạm vi công việc</div>
                <div className="lv-cs-overview-value">{item.scope_text || '—'}</div>
              </div>
              <div className="lv-cs-overview-item">
                <div className="lv-cs-overview-label">Kết quả chính</div>
                <div className="lv-cs-overview-value">{item.result_headline || item.outcome || '—'}</div>
              </div>
            </Reveal>
          </div>
        </div>
      )}

      {/* BỐI CẢNH & THÁCH THỨC */}
      {item.challenge && (
        <section className="lv-sec-pad" style={{ background: 'var(--bg)' }} aria-labelledby="challenge-heading">
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-4">
                <Reveal>
                  <span className="lv-section-label">Bối cảnh</span>
                  <h2 className="lv-section-title" id="challenge-heading" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Thách thức <em>pháp lý</em></h2>
                </Reveal>
              </div>
              <div className="col-lg-8">
                <Reveal delay={1} className="lv-cs-body">
                  {paragraphs(item.challenge).map((p, i) => <p key={i}>{p}</p>)}
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GIẢI PHÁP / CHIẾN LƯỢC PHÁP LÝ */}
      {item.solution && (
        <section className="lv-sec-pad" style={{ background: 'var(--surface)' }} aria-labelledby="solution-heading">
          <div className="wd-container">
            <div className="row g-5">
              <div className="col-lg-4">
                <Reveal>
                  <span className="lv-section-label">Cách tiếp cận</span>
                  <h2 className="lv-section-title" id="solution-heading" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Chiến lược <em>áp dụng</em></h2>
                </Reveal>
              </div>
              <div className="col-lg-8">
                <Reveal delay={1} className="lv-cs-body">
                  {paragraphs(item.solution).map((block, i) => {
                    const lines = block.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
                    const isList = lines.length > 1 && lines.every(l => l.startsWith('-'))
                    if (isList) {
                      return <ul key={i}>{lines.map((l, j) => renderListLine(l.replace(/^-\s*/, ''), j))}</ul>
                    }
                    return <p key={i}>{block}</p>
                  })}
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="lv-sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
          <div className="wd-container">
            <Reveal className="lv-cs-gallery">
              {gallery.map((src, i) => (
                <img key={i} src={src} alt={`${item.title} — hình ${i + 1}`} loading="lazy" />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* KẾT QUẢ */}
      {stats.length > 0 && (
        <section className="lv-stats-bar" aria-label="Kết quả đạt được">
          <div className="wd-container">
            <div className="lv-stats-grid">
              {stats.map((s, i) => (
                <Reveal key={i} delay={i} className="lv-stat-cell">
                  <div className="lv-stat-big"><span>{s.value}{s.suffix}</span></div>
                  <div className="lv-stat-desc">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL */}
      {item.testimonial_content && (
        <section className="lv-testimonials-section lv-sec-pad" aria-labelledby="quote-heading">
          <div className="wd-container">
            <Reveal className="text-center" style={{ marginBottom: 'clamp(36px,5vw,52px)' }}>
              <span className="lv-section-label" id="quote-heading">Thân chủ nói gì</span>
            </Reveal>
            <Reveal delay={1} className="lv-cs-quote-wrap">
              <div className="lv-quote">
                <p className="lv-quote-text">"{item.testimonial_content}"</p>
                <div className="lv-quote-author">
                  <div className="lv-quote-name">{item.testimonial_author}</div>
                  <div className="lv-quote-company">{item.testimonial_title}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* VỤ VIỆC LIÊN QUAN */}
      {related.length > 0 && (
        <section className="lv-sec-pad" style={{ background: 'var(--warm)' }} aria-labelledby="related-heading">
          <div className="wd-container">
            <Reveal style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
              <h2 className="lv-section-title" id="related-heading" style={{ fontSize: 'clamp(24px,3vw,36px)', marginBottom: 0 }}>Vụ việc <em>liên quan</em></h2>
              <Link to="/du-an" className="lv-view-all on-light">Xem tất cả &rarr;</Link>
            </Reveal>
            <div className="row g-4">
              {related.map((r, i) => (
                <div key={r.id} className="col-lg-6">
                  <Reveal delay={i} to={r.slug ? `/vu-viec/${r.slug}` : undefined} className="lv-case-card" style={{ marginBottom: 0 }}>
                    <div className="lv-case-meta">
                      <span className="lv-case-badge">{r.category}</span>
                      <span className="lv-case-date">{r.year} · {r.location}</span>
                    </div>
                    <h3 className="lv-case-card-title">{r.title}</h3>
                    <p className="lv-case-summary">{r.summary}</p>
                    <span className="lv-case-card-link">Xem chi tiết vụ việc</span>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaForm
        heading="Vụ việc của bạn<br/><em>cũng xứng đáng</em> một chiến lược như vậy."
        phone={`Hotline: ${phone}`}
        buttonLabel="Tư Vấn Miễn Phí"
        subtext="Bảo mật · Miễn phí · 24/7"
      />
    </>
  )
}
