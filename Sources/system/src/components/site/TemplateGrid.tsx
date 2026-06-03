'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { templates as mockTemplates } from '../../data/templates'
import type { Template } from '../../data/templates'

function TemplateImage({ src, alt, name, category }: { src: string; alt: string; name: string; category: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--warm2) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
        <div style={{ fontSize: 32 }}>🎨</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', textAlign: 'center', lineHeight: 1.3 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{category}</div>
      </div>
    )
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} />
}

const PAGE_SIZES = [20, 50, 100]

function getPageNums(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

function PageBtn({ active, disabled, onClick, children }: { active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 36, height: 36, borderRadius: 8, fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--sans)', transition: 'all .15s',
        opacity: disabled ? 0.35 : 1,
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? '#fff' : 'var(--text-2)',
      }}
    >
      {children}
    </button>
  )
}

export default function TemplateGrid({ templates: propTemplates, homepage, pageType }: {
  templates?: Template[]
  homepage?: boolean
  pageType?: 'starter' | 'standard'
}) {
  const templates = propTemplates || mockTemplates
  const categoryList = Array.from(new Set(templates.map(t => t.category)))

  const [active, setActive]       = useState(() => categoryList[0] || '')
  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(20)
  const topRef = useRef<HTMLDivElement>(null)

  // Reset active category khi templates prop thay đổi
  useEffect(() => {
    const firstCat = Array.from(new Set((propTemplates || mockTemplates).map(t => t.category)))[0] || ''
    setActive(firstCat)
    setPage(1)
  }, [propTemplates])

  // Re-observe reveal elements sau filter change (homepage)
  useEffect(() => {
    if (!homepage) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    const id = setTimeout(() => {
      document.querySelectorAll('.tc.reveal:not(.visible)').forEach(el => observer.observe(el))
    }, 0)
    return () => { clearTimeout(id); observer.disconnect() }
  }, [active, homepage])

  function handleCategory(cat: string) {
    setActive(cat)
    setPage(1)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handlePage(p: number) {
    setPage(p)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handlePageSize(size: number) {
    setPageSize(size)
    setPage(1)
  }

  // ── HOMEPAGE ─────────────────────────────────────────────────────────────────
  if (homepage) {
    const homeItems = templates.slice(0, 9)
    return (
      <section id="templates" className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-4">
            <div className="eyebrow">Mẫu thiết kế</div>
            <h2 className="sec-title">Chọn mẫu <em>phù hợp</em> với bạn</h2>
            <p className="sec-sub">Mỗi mẫu được thiết kế bởi chuyên gia, responsive hoàn toàn, tối ưu tốc độ và SEO.</p>
          </div>

          <div className="row g-3">
            {homeItems.map((t, i) => {
              let colClass = 'col-12 col-sm-6 col-lg-4'
              if (i >= 6) colClass += ' d-none d-lg-block'
              else if (i >= 3) colClass += ' d-none d-sm-block'
              return (
                <div key={t.slug} className={colClass}>
                  <Link href={`/templates/${t.slug}`} style={{ textDecoration: 'none' }}>
                    <div className={`tc reveal reveal-d${(i % 3) + 1}`}>
                      <div className="tc-thumb">
                        <TemplateImage src={t.image} alt={t.name} name={t.name} category={t.category} />
                        <div className="tc-hover-layer"><div className="tc-demo-btn">Xem demo →</div></div>
                      </div>
                      <div className="tc-body">
                        <div className="tc-name">{t.name}{t.badge && <span className="tc-badge">{t.badge}</span>}</div>
                        <div className="tc-meta">
                          <span className="tc-cat">{t.category}</span>
                          <span className="tc-price">{t.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-5 reveal">
            <Link href="/templates" className="btn-more" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Xem tất cả {templates.length}+ mẫu →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // ── /TEMPLATES PAGE ──────────────────────────────────────────────────────────
  const filtered   = templates.filter(t => t.category === active)
  const total      = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd   = Math.min(page * pageSize, total)

  return (
    <section id="templates" className="sec-pad" style={{ background: 'var(--bg)', paddingTop: 30 }}>
      <div className="wd-container">

        {/* Scroll anchor */}
        <div ref={topRef} style={{ scrollMarginTop: 110 }} />

        {/* ── Sticky filter bar ── */}
        <div style={{
          position: 'sticky', top: 62, zIndex: 100,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border-light)',
          padding: '12px 0',
          marginBottom: 24,
        }}>
          {/* Filter pills */}
          <div className="d-flex gap-2 justify-content-center flex-wrap mb-2">
            {categoryList.map(cat => (
              <div key={cat} className={`pill${active === cat ? ' active' : ''}`} onClick={() => handleCategory(cat)}>
                {cat}
              </div>
            ))}
          </div>

          {/* Info bar + Page size */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {total === 0 ? 'Không có mẫu nào' : `Hiển thị ${rangeStart}–${rangeEnd} trong ${total} mẫu`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Số mẫu/trang:</span>
              {PAGE_SIZES.map(size => (
                <button key={size} onClick={() => handlePageSize(size)}
                  style={{
                    padding: '4px 11px', borderRadius: 6, fontSize: 12,
                    cursor: 'pointer', fontFamily: 'var(--sans)', transition: 'all .15s',
                    border: `1px solid ${pageSize === size ? 'var(--accent)' : 'var(--border)'}`,
                    background: pageSize === size ? 'var(--accent)' : 'transparent',
                    color: pageSize === size ? '#fff' : 'var(--text-2)',
                  }}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)', fontSize: 14 }}>
            Chưa có mẫu nào trong danh mục này.
          </div>
        ) : (
          <div className="row g-3">
            {paginated.map(t => (
              <div key={t.slug} className="col-md-4">
                <Link href={`/templates/${t.slug}`} style={{ textDecoration: 'none' }}>
                  {/* Không dùng reveal — card luôn visible, không ẩn khi phân trang */}
                  <div className="tc">
                    <div className="tc-thumb">
                      <TemplateImage src={t.image} alt={t.name} name={t.name} category={t.category} />
                      <div className="tc-hover-layer"><div className="tc-demo-btn">Xem demo →</div></div>
                    </div>
                    <div className="tc-body">
                      <div className="tc-name">{t.name}{t.badge && <span className="tc-badge">{t.badge}</span>}</div>
                      <div className="tc-meta">
                        <span className="tc-cat">{t.category}</span>
                        <span className="tc-price">{t.price}</span>
                      </div>
                      {/* Chỉ hiện type badge khi đang xem tất cả (không filter type) */}
                      {!pageType && (
                        <div style={{ marginTop: 6 }}>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 500, background: t.hasWebsite ? '#eff6ff' : 'var(--accent-light)', color: t.hasWebsite ? '#1d4ed8' : 'var(--accent)' }}>
                            {t.hasWebsite ? '🌐 Web + Admin' : '📦 Template'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 36, flexWrap: 'wrap' }}>
            <PageBtn disabled={page === 1} onClick={() => handlePage(page - 1)}>←</PageBtn>

            {getPageNums(page, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`dot${i}`} style={{ padding: '0 2px', fontSize: 13, color: 'var(--text-3)', userSelect: 'none' }}>…</span>
              ) : (
                <PageBtn key={p} active={p === page} onClick={() => handlePage(p as number)}>
                  {p}
                </PageBtn>
              )
            )}

            <PageBtn disabled={page === totalPages} onClick={() => handlePage(page + 1)}>→</PageBtn>
          </div>
        )}

      </div>
    </section>
  )
}
