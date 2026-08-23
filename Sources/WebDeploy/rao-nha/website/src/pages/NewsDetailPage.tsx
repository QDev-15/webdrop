import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { formatDateVN } from '../lib/listings'

interface Article { id: number; slug: string; title: string; category: string; thumbnail: string; content: string; author: string; published_at: string }

export default function NewsDetailPage() {
  const [params] = useSearchParams()
  const slug = params.get('slug') || ''
  const [data, setData] = useState<{ article: Article; related: Article[] } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setData(null); setError('')
    api.get<{ article: Article; related: Article[] }>(`/public/articles/${encodeURIComponent(slug)}`)
      .catch(() => { setError('Không tìm thấy bài viết.'); return null })
      .then(d => { if (d) setData(d) })
  }, [slug])

  useDocumentMeta({
    title: data ? `${data.article.title} | Tin tức RaoNhà` : 'Tin tức RaoNhà',
    description: data?.article.content?.slice(0, 155),
  })

  if (error) {
    return (
      <section className="sec-pad" style={{ paddingTop: 140, textAlign: 'center' }}>
        <div className="rn-container">
          <h1 className="sec-title">Không tìm thấy bài viết</h1>
          <Link to="/tin-tuc" className="btn-rn btn-rn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Xem tin tức khác</Link>
        </div>
      </section>
    )
  }
  if (!data) return <div style={{ padding: '160px 0', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>

  const a = data.article

  return (
    <article>
      <section style={{ padding: '150px 0 0' }}>
        <div className="rn-container" style={{ maxWidth: 760 }}>
          <div className="rn-breadcrumb"><Link to="/">Trang chủ</Link> / <Link to="/tin-tuc">Tin tức</Link></div>
          <span className="eyebrow">{a.category}</span>
          <h1 className="sec-title" style={{ marginBottom: 14 }}>{a.title}</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24 }}>{formatDateVN(a.published_at)} · {a.author}</p>
          <img src={a.thumbnail} alt={a.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 32, aspectRatio: '16/9', objectFit: 'cover' }} />
          <div style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--text-2)' }}>
            {a.content.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </div>
      </section>

      {data.related.length > 0 && (
        <section className="sec-pad">
          <div className="rn-container">
            <div className="eyebrow">Đọc thêm</div>
            <h2 className="sec-title" style={{ marginBottom: 24 }}>Bài viết <em>liên quan</em></h2>
            <div className="rn-news-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {data.related.map(r => (
                <Link key={r.id} to={`/tin-tuc-chi-tiet?slug=${r.slug}`} className="rn-news-card rn-news-card-sm" data-reveal>
                  <div className="rn-news-thumb"><img src={r.thumbnail} alt={r.title} loading="lazy" /></div>
                  <div className="rn-news-body"><span className="rn-news-cat">{r.category}</span><h3>{r.title}</h3></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
