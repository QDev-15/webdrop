'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { HeroSlide as DBSlide } from '@prisma/client'

type TitlePart =
  | { text: string; variant?: 'normal' }
  | { text: string; variant: 'em' }
  | { text: string; variant: 'muted' }
  | { br: true }

type ButtonAction =
  | { type: 'scroll'; target: string }
  | { type: 'link';   href: string }

interface SlideButton {
  label:   string
  action:  ButtonAction
  variant: 'primary' | 'outline'
}

type Slide =
  | { type: 'intro'; bg: string; badge: string; title: TitlePart[]; subtitle: string; stats: { value: string; label: string }[]; buttons: SlideButton[] }
  | { type: 'features'; bg: string; badge: string; title: TitlePart[]; features: { icon: string; text: string; highlight?: string }[]; tags?: string[]; buttons: SlideButton[] }
  | { type: 'grid'; bg: string; badge: string; title: TitlePart[]; items: { icon: string; label: string; desc: string }[]; buttons: SlideButton[] }
  | { type: 'pricing'; bg: string; badge: string; title: TitlePart[]; plans: { name: string; price: string; desc: string; hot?: boolean }[]; tags?: string[]; buttons: SlideButton[] }
  | { type: 'testimonial'; bg: string; badge: string; quote: string; author: { name: string; role: string; avatar: string }; buttons: SlideButton[] }

const AUTO_MS = 5000

// Cast DB row → typed Slide (JSON fields cần cast lại)
function toSlide(row: DBSlide): Slide {
  return {
    type:    row.type as Slide['type'],
    bg:      row.bg,
    badge:   row.badge,
    title:   row.title   as unknown as TitlePart[],
    buttons: row.buttons as unknown as SlideButton[],
    ...row.data as unknown as object,
  } as Slide
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleButton(btn: SlideButton) {
  if (btn.action.type === 'scroll') scrollTo(btn.action.target)
  else window.location.href = btn.action.href
}

function renderTitle(parts: TitlePart[]) {
  return parts.map((p, i) => {
    if ('br' in p) return <br key={i} />
    if (p.variant === 'em')    return <em key={i}>{p.text}</em>
    if (p.variant === 'muted') return <span key={i} className="muted">{p.text}</span>
    return <span key={i}>{p.text}</span>
  })
}

function Buttons({ buttons }: { buttons: SlideButton[] }) {
  return (
    <div className="sl-actions">
      {buttons.map((btn, i) => (
        <button key={i}
          className={btn.variant === 'primary' ? 'btn-sl-p' : 'btn-sl-o'}
          onClick={() => handleButton(btn)}>
          {btn.label}
        </button>
      ))}
    </div>
  )
}

// ── Slide renderers ───────────────────────────────────────────────────────────

function SlideIntro({ s }: { s: Extract<Slide, { type: 'intro' }> }) {
  return (
    <>
      <h1 className="sl-title">{renderTitle(s.title)}</h1>
      <p className="sl-sub">{s.subtitle}</p>
      <Buttons buttons={s.buttons} />
      <div className="sl-stats">
        {s.stats.map(st => (
          <div key={st.label}>
            <div className="sl-stat-num">{st.value}</div>
            <div className="sl-stat-label">{st.label}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function SlideFeatures({ s }: { s: Extract<Slide, { type: 'features' }> }) {
  return (
    <>
      <h1 className="sl-title">{renderTitle(s.title)}</h1>
      <div className="sl-features">
        {s.features.map((f, i) => (
          <div key={i} className="sl-feat">
            <div className="sl-feat-icon">{f.icon}</div>
            <span>
              {f.text}{' '}
              {f.highlight && <strong style={{ color: 'rgba(255,255,255,.8)', fontWeight: 500 }}>{f.highlight}</strong>}
            </span>
          </div>
        ))}
      </div>
      <Buttons buttons={s.buttons} />
      {s.tags && (
        <div className="sl-tags">
          {s.tags.map(t => <span key={t} className="sl-tag">{t}</span>)}
        </div>
      )}
    </>
  )
}

function SlideGrid({ s }: { s: Extract<Slide, { type: 'grid' }> }) {
  return (
    <>
      <h1 className="sl-title">{renderTitle(s.title)}</h1>
      <div className="sl-cards">
        {s.items.map(item => (
          <div key={item.label} className="sl-card">
            <div className="sl-card-icon">{item.icon}</div>
            <div className="sl-card-title">{item.label}</div>
            <div className="sl-card-desc">{item.desc}</div>
          </div>
        ))}
      </div>
      <Buttons buttons={s.buttons} />
    </>
  )
}

function SlidePricing({ s }: { s: Extract<Slide, { type: 'pricing' }> }) {
  return (
    <>
      <h1 className="sl-title">{renderTitle(s.title)}</h1>
      <div className="sl-pricing">
        {s.plans.map(p => (
          <div key={p.name} className={`sl-pkg${p.hot ? ' hot' : ''}`}>
            {p.hot && <div className="sl-pkg-badge">PHỔ BIẾN NHẤT</div>}
            <div className="sl-pkg-name">{p.name}</div>
            <div className="sl-pkg-price">{p.price}</div>
            <div className="sl-pkg-desc">{p.desc}</div>
          </div>
        ))}
      </div>
      <Buttons buttons={s.buttons} />
      {s.tags && (
        <div className="sl-tags">
          {s.tags.map(t => <span key={t} className="sl-tag">{t}</span>)}
        </div>
      )}
    </>
  )
}

function SlideTestimonial({ s }: { s: Extract<Slide, { type: 'testimonial' }> }) {
  return (
    <>
      <span className="sl-quote-mark">&ldquo;</span>
      <p className="sl-quote">{s.quote}</p>
      <div className="sl-author">
        <img src={s.author.avatar} width={44} height={44}
          style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(74,222,128,.25)' }}
          alt={s.author.name} />
        <div>
          <div className="sl-author-name">{s.author.name}</div>
          <div className="sl-author-role">{s.author.role}</div>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <Buttons buttons={s.buttons} />
      </div>
    </>
  )
}

function renderSlide(s: Slide) {
  switch (s.type) {
    case 'intro':       return <SlideIntro s={s} />
    case 'features':    return <SlideFeatures s={s} />
    case 'grid':        return <SlideGrid s={s} />
    case 'pricing':     return <SlidePricing s={s} />
    case 'testimonial': return <SlideTestimonial s={s} />
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const total = slides.length
  const [cur, setCur]   = useState(0)
  const [anim, setAnim] = useState<{ [key: number]: string }>({ 0: 'active' })
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch slides from API
  useEffect(() => {
    async function fetchSlides() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/slides')
        if (!res.ok) {
          throw new Error('Failed to fetch slides')
        }
        const data: DBSlide[] = await res.json()
        if (data && data.length > 0) {
          setSlides(data.map(toSlide))
        } else {
          setError('No slides found')
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Failed to load hero slides:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [])

  const goSlide = useCallback((next: number, dir?: 'next' | 'prev') => {
    setCur(prev => {
      if (next === prev) return prev
      const d = dir ?? (next > prev ? 'next' : 'prev')
      const leaveClass = d === 'next' ? 'leaving-left' : 'leaving-right'
      const enterClass = d === 'next' ? 'entering-right' : 'entering-left'
      setAnim({ [prev]: leaveClass, [next]: `active ${enterClass}` })
      setTimeout(() => setAnim({ [prev]: '', [next]: 'active' }), 750)
      return next
    })
  }, [])

  const resetAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCur(c => { const next = (c + 1) % total; goSlide(next, 'next'); return c })
    }, AUTO_MS)
  }, [goSlide, total])

  useEffect(() => { resetAuto(); return () => { if (timerRef.current) clearInterval(timerRef.current) } }, [resetAuto])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (window.scrollY > window.innerHeight * .6) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { goSlide((cur + 1) % total, 'next'); resetAuto() }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { goSlide((cur - 1 + total) % total, 'prev'); resetAuto() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [cur, goSlide, resetAuto, total])

  // Show error state if slides failed to load
  if (error && !loading) {
    return (
      <div className="hero" id="hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wd-container text-center" style={{ padding: '40px 20px' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '12px' }}>Unable to load hero content</h2>
          <p style={{ color: 'var(--text-2)' }}>Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading || slides.length === 0) {
    return (
      <div className="hero" id="hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: 'var(--text-2)' }}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero" id="hero">
      <div className="hero-grain" />
      <div className="hero-glow glow-1" />
      <div className="hero-glow glow-2" />
      <div className="hero-glow glow-3" />
      <div className="slides-wrap">
        {slides.map((s, i) => (
          <div key={i} className={`slide ${anim[i] ?? ''}`} data-idx={i}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${s.bg}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: .07, zIndex: 0 }} />
            <div className="wd-container w-100">
              <div className="slide-inner">
                <div className="sl-badge"><span className="sl-badge-dot" />{s.badge}</div>
                {renderSlide(s)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-bottom">
        <div className="slide-indicators">
          {slides.map((_, i) => (
            <div key={i} className={`si${cur === i ? ' active' : ''}`}
              onClick={() => { goSlide(i); resetAuto() }} />
          ))}
        </div>
      </div>
    </div>
  )
}
