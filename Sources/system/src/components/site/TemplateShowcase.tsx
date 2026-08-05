'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Template } from '../../data/templates'
import { useCart } from '../../contexts/CartContext'
import DemoIframePreview from './DemoIframePreview'

// Tối đa 4 section trên trang chủ, mỗi section tối đa 4 hàng.
// Grid 1 cột (xs) / 2 cột (sm-lg) / 3 cột (lg+) → hiện 4 / 8 / 12 item tương ứng.
const MAX_SECTIONS = 4
const MAX_ITEMS = 12

export function AddToCartButton({ t }: { t: Template }) {
  const { addItem, isInCart } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = added || isInCart(t.slug)

  function handleClick(e: React.SyntheticEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inCart) return
    addItem({
      slug: t.slug,
      name: t.name,
      image: t.image,
      price: t.priceNum ?? 0,
      websitePrice: t.websitePriceNum,
      hasWebsite: !!t.hasWebsite,
    })
    setAdded(true)
  }

  return (
    <button
      onClick={handleClick}
      disabled={inCart}
      className="tc-action-btn tc-action-primary"
      title={inCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
      style={{
        width: 44,
        height: 44,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        borderRadius: '50%',
        background: inCart ? 'var(--accent)' : 'var(--accent)',
        color: '#fff',
        border: 'none',
        cursor: inCart ? 'default' : 'pointer',
        boxShadow: '0 4px 12px rgba(26, 107, 82, 0.3)',
        transition: 'all 0.2s ease',
      }}
    >
      {inCart ? '✓' : '🛒'}
    </button>
  )
}

export function DemoActionButton({ href, label = 'Demo' }: { href?: string; label?: string }) {
  function handleClick(e: React.SyntheticEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (href) window.open(href, '_blank', 'noopener,noreferrer')
  }

  const isProduction = label === 'Production'
  const bgColor = isProduction ? '#1a6b52' : '#f8ae2eff'
  const hoverColor = isProduction ? '#155a44' : '#c9840dff'

  return (
    <button
      onClick={handleClick}
      disabled={!href}
      className="tc-action-btn"
      style={{
        width: '100%',
        flex: 1,
        background: bgColor,
        color: '#fff',
        border: 'none',
        cursor: href ? 'pointer' : 'not-allowed',
        opacity: href ? 1 : 0.5,
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (href) (e.target as HTMLButtonElement).style.background = hoverColor
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.background = bgColor
      }}
    >
      {label}
    </button>
  )
}

function TemplateCard({ t, index }: { t: Template; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  let colClass = 'col-12 col-sm-6 col-lg-4'
  if (index >= 8) colClass += ' d-none d-lg-block'
  else if (index >= 4) colClass += ' d-none d-sm-block'

  const previewLink = t.demoUrl

  return (
    <div className={colClass}>
      <div className={`tc reveal reveal-d${(index % 3) + 1}`} style={{ cursor: 'default' }}>
        <Link href={`/templates/${t.slug}`} style={{ textDecoration: 'none', display: 'block', position: 'relative' }}>
          <div className="tc-thumb tc-thumb-tall" style={{ background: 'var(--border-light)' }}>
            <img
              src={t.image}
              alt={t.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            />
            {previewLink && <DemoIframePreview src={previewLink} title={t.name} />}
            <span style={{
              position: 'absolute', top: 10, left: 10, zIndex: 4,
              fontSize: 11, padding: '3px 9px', borderRadius: 4, fontWeight: 600,
              background: t.hasWebsite ? 'var(--accent)' : 'rgba(255,255,255,.92)',
              color: t.hasWebsite ? '#fff' : 'var(--text-2)',
              boxShadow: '0 2px 8px rgba(0,0,0,.18)',
            }}>
              {t.hasWebsite ? '🌐 Website + Admin' : '📦 Chỉ template'}
            </span>
            <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 5 }}>
              <AddToCartButton t={t} />
            </div>
          </div>
        </Link>
        <div className="tc-body">
          <Link href={`/templates/${t.slug}`} style={{ textDecoration: 'none' }}>
            <div className="tc-name">{t.name}</div>
          </Link>
          <div className="tc-meta" style={{ margin: '6px 0 10px' }}>
            <span className="tc-cat">{t.category}</span>
            <span className="tc-price">{t.price}</span>
          </div>
          <div className="tc-actions" style={{ display: 'flex', gap: 8 }}>
            {t.deployUrl && t.demoUrl ? (
              <>
                <DemoActionButton href={t.deployUrl} label="Production" />
                <DemoActionButton href={t.demoUrl} label="Template" />
              </>
            ) : t.deployUrl ? (
              <DemoActionButton href={t.deployUrl} label="Production" />
            ) : t.demoUrl ? (
              <DemoActionButton href={t.demoUrl} label="Template" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export interface TemplateSection {
  category: string
  templates: Template[]
}

export default function TemplateShowcase({ sections }: { sections: TemplateSection[] }) {
  if (sections.length === 0) return null
  const visibleSections = sections.slice(0, MAX_SECTIONS)

  return (
    <div id="templates">
      {visibleSections.map((s, si) => (
        <section key={s.category} className="sec-pad" style={{ background: si % 2 === 0 ? 'var(--bg)' : 'var(--surface)' }}>
          <div className="wd-container">
            <div className="text-center reveal mb-4">
              <div className="eyebrow">{si === 0 ? 'Sản phẩm chủ đạo' : 'Mẫu thiết kế'}</div>
              <h2 className="sec-title">{s.category}</h2>
              <p className="sec-sub">
                {si === 0
                  ? 'Bộ sưu tập shop bán hàng đa dạng nhất — đầy đủ giỏ hàng, thanh toán, quản trị sản phẩm.'
                  : `${s.templates.length} mẫu ${s.category.toLowerCase()} sẵn sàng triển khai.`}
              </p>
            </div>

            <div className="row g-3">
              {s.templates.slice(0, MAX_ITEMS).map((t, i) => (
                <TemplateCard key={t.slug} t={t} index={i} />
              ))}
            </div>

            <div className="text-center mt-4 reveal">
              <Link href={`/templates?cat=${encodeURIComponent(s.category)}`} className="btn-more" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Xem tất cả {s.templates.length} mẫu {s.category} →
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
