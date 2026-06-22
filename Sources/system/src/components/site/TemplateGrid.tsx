'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
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

function WebsiteBadge() {
  return (
    <div style={{
      position: 'absolute', top: 10, left: 10, zIndex: 3,
      background: 'var(--accent)', color: '#fff',
      fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 4,
      letterSpacing: '.4px', textTransform: 'uppercase',
      boxShadow: '0 2px 8px rgba(26,107,82,.4)',
    }}>
      Có Website
    </div>
  )
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
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()

  const templates    = propTemplates || mockTemplates
  const categoryList = Array.from(new Set(templates.map(t => t.category)))

  // Initialize state from URL (only on /templates, not homepage)
  const urlCat      = !homepage ? (searchParams.get('cat') || '') : ''
  const urlPage     = !homepage ? Math.max(1, parseInt(searchParams.get('page') || '1') || 1) : 1
  const urlSizeRaw  = !homepage ? parseInt(searchParams.get('size') || '') : NaN
  const urlSize     = PAGE_SIZES.includes(urlSizeRaw) ? urlSizeRaw : 20

  const [active, setActive]     = useState(() => {
    if (homepage) return categoryList[0] || ''
    return (urlCat && categoryList.includes(urlCat)) ? urlCat : categoryList[0] || ''
  })
  const [page, setPage]         = useState(() => homepage ? 1 : urlPage)
  const [pageSize, setPageSize] = useState(() => homepage ? 20 : urlSize)
  const topRef = useRef<HTMLDivElement>(null)

  // Skip the first render for URL sync and propTemplates reset
  const syncReady   = useRef(false)
  const propsReady  = useRef(false)

  // Sync state → URL on change (skip initial mount)
  useEffect(() => {
    if (homepage) return
    if (!syncReady.current) { syncReady.current = true; return }
    const params = new URLSearchParams(searchParams.toString())
    active    ? params.set('cat',  active)         : params.delete('cat')
    page > 1  ? params.set('page', String(page))   : params.delete('page')
    pageSize !== 20 ? params.set('size', String(pageSize)) : params.delete('size')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, page, pageSize])

  // Reset category/page when propTemplates changes (e.g. user switches type=starter/standard)
  useEffect(() => {
    if (!propsReady.current) { propsReady.current = true; return }
    const cats = Array.from(new Set((propTemplates || mockTemplates).map(t => t.category)))
    setActive(prev => cats.includes(prev) ? prev : (cats[0] || ''))
    setPage(1)
  }, [propTemplates])

  // Re-observe reveal elements after filter change (homepage only)
  useEffect(() => {
    if (!homepage) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    const id = setTimeout(() => {
      document.querySelectorAll('#templates .reveal:not(.visible)').forEach(el => observer.observe(el))
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
                        {t.hasWebsite && <WebsiteBadge />}
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
                  <div className="tc">
                    <div className="tc-thumb">
                      <TemplateImage src={t.image} alt={t.name} name={t.name} category={t.category} />
                      {t.hasWebsite && <WebsiteBadge />}
                      <div className="tc-hover-layer"><div className="tc-demo-btn">Xem demo →</div></div>
                    </div>
                    <div className="tc-body">
                      <div className="tc-name">{t.name}{t.badge && <span className="tc-badge">{t.badge}</span>}</div>
                      <div className="tc-meta">
                        <span className="tc-cat">{t.category}</span>
                        <span className="tc-price">{t.price}</span>
                      </div>
                      {!pageType && (
                        <div style={{ marginTop: 6 }}>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 500, background: t.hasWebsite ? 'var(--accent-light)' : 'var(--warm2)', color: t.hasWebsite ? 'var(--accent)' : 'var(--text-2)' }}>
                            {t.hasWebsite ? 'Web + Admin' : 'Chỉ template'}
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
