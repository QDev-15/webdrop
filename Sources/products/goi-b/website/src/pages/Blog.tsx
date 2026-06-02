import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { get } from '../api/client'
import { useSite } from '../contexts/SiteContext'

interface Post {
  id: number; title: string; slug: string; excerpt: string
  thumbnail: string; category_name: string; category_slug: string; created_at: string
}
interface PostsResponse { posts: Post[]; total: number; limit: number; offset: number }
interface Category { id: number; name: string; slug: string; post_count: number }

const LIMIT = 9

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Blog() {
  const { settings }                = useSite()
  const [params, setParams]         = useSearchParams()
  const page                        = parseInt(params.get('page') ?? '1')
  const cat                         = params.get('cat') ?? ''

  const [data, setData]       = useState<PostsResponse | null>(null)
  const [categories, setCats] = useState<Category[]>([])
  const [loading, setLoad]    = useState(true)

  useEffect(() => {
    get<Category[]>('/categories').then(setCats).catch(() => {})
  }, [])

  useEffect(() => {
    setLoad(true)
    const offset = (page - 1) * LIMIT
    const query  = `/posts?limit=${LIMIT}&offset=${offset}` + (cat ? `&category=${cat}` : '')
    get<PostsResponse>(query)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoad(false))
  }, [page, cat])

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  useEffect(() => {
    document.title = `Tin tức — ${settings.site_name || 'Website'}`
  }, [settings.site_name])

  return (
    <div style={{ paddingTop: 62 }}>
      {/* Page header */}
      <div style={{ background: 'var(--dark2)', padding: 'clamp(40px,6vw,70px) 0 clamp(30px,4vw,50px)', textAlign: 'center' }}>
        <div className="site-container">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Tin tức & Cập nhật</div>
          <h1 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, color: '#fff', letterSpacing: '-1px', lineHeight: 1.15, margin: 0 }}>
            Bài viết <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>mới nhất</em>
          </h1>
        </div>
      </div>

      <section className="site-section bg-warm" style={{ paddingTop: 32 }}>
        <div className="site-container">
          {/* Category filter */}
          {categories.length > 0 && (
            <div className="d-flex gap-2 flex-wrap mb-4">
              <button
                onClick={() => setParams({})}
                style={{
                  background: !cat ? 'var(--accent)' : 'var(--surface)',
                  color: !cat ? '#fff' : 'var(--text-2)',
                  border: `1px solid ${!cat ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 20, padding: '5px 14px', fontSize: 13,
                  fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all .15s',
                }}
              >
                Tất cả
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setParams({ cat: c.slug })}
                  style={{
                    background: cat === c.slug ? 'var(--accent)' : 'var(--surface)',
                    color: cat === c.slug ? '#fff' : 'var(--text-2)',
                    border: `1px solid ${cat === c.slug ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 20, padding: '5px 14px', fontSize: 13,
                    fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  {c.name} <span style={{ opacity: .6 }}>({c.post_count})</span>
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="row g-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="col-md-6 col-lg-4" key={i}>
                  <div className="post-card">
                    <div className="post-card-thumb skeleton" />
                    <div className="post-card-body">
                      <div className="skeleton" style={{ height: 14, marginBottom: 8, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.posts.length ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
              <p>Chưa có bài viết nào.</p>
            </div>
          ) : (
            <div className="row g-3">
              {data.posts.map(p => (
                <div className="col-md-6 col-lg-4" key={p.id}>
                  <Link to={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                    <div className="post-card">
                      <div className="post-card-thumb">
                        {p.thumbnail
                          ? <img src={p.thumbnail} alt={p.title} loading="lazy" />
                          : <div style={{ height: '100%', background: 'var(--warm2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📝</div>
                        }
                      </div>
                      <div className="post-card-body">
                        {p.category_name && <div className="post-card-cat">{p.category_name}</div>}
                        <span className="post-card-title">{p.title}</span>
                        {p.excerpt && <p className="post-card-excerpt">{p.excerpt}</p>}
                        <div className="post-card-date">{formatDate(p.created_at)}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button className="page-btn" disabled={page <= 1} onClick={() => setParams({ page: String(page - 1), ...(cat ? { cat } : {}) })}>←</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setParams({ page: String(i + 1), ...(cat ? { cat } : {}) })}
                >
                  {i + 1}
                </button>
              ))}
              <button className="page-btn" disabled={page >= totalPages} onClick={() => setParams({ page: String(page + 1), ...(cat ? { cat } : {}) })}>→</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
