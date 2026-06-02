import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { get } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface SitePage {
  id: number; title: string; slug: string; content: string
  meta_title: string; meta_description: string
}

export default function Page() {
  const { slug }     = useParams<{ slug: string }>()
  const navigate     = useNavigate()
  const { settings } = useSite()
  const [page, setPage]    = useState<SitePage | null>(null)
  const [loading, setLoad] = useState(true)

  useEffect(() => {
    setLoad(true)
    setPage(null)
    get<SitePage>(`/pages/${slug}`)
      .then(p => {
        setPage(p)
        document.title = p.meta_title || `${p.title} — ${settings.site_name || 'Website'}`
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc && p.meta_description) metaDesc.setAttribute('content', p.meta_description)
      })
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoad(false))
  }, [slug, settings.site_name, navigate])

  if (loading) return (
    <div style={{ paddingTop: 62 }}>
      <section className="site-section">
        <div className="site-container" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 32, marginBottom: 24, borderRadius: 6, maxWidth: 400 }} />
          {[100, 88, 94, 72, 85].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 10, borderRadius: 4 }} />
          ))}
        </div>
      </section>
    </div>
  )

  if (!page) return null

  return (
    <div style={{ paddingTop: 62 }}>
      {/* Page hero */}
      <div style={{ background: 'var(--dark2)', padding: 'clamp(40px,6vw,70px) 0 clamp(30px,4vw,50px)' }}>
        <div className="site-container">
          <div className="breadcrumb-bar" style={{ color: 'rgba(255,255,255,.35)', marginBottom: 12 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,.5)' }}>Trang chủ</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,.7)' }}>{page.title}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.8px', margin: 0 }}>
            {page.title}
          </h1>
        </div>
      </div>

      <section className="site-section bg-surface">
        <div className="site-container" style={{ maxWidth: 860, margin: '0 auto' }}>
          <div
            className="page-content"
            dangerouslySetInnerHTML={{ __html: page.content || '<p>Trang này chưa có nội dung.</p>' }}
          />
          <div className="mt-5">
            <Link to="/" style={{ color: 'var(--text-2)', textDecoration: 'none', fontSize: 13.5 }}>← Trang chủ</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
