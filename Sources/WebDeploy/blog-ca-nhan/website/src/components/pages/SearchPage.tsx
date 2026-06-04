import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../api/client'
import { useSite } from '../../contexts/SiteContext'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  thumbnail?: string
  read_time?: number
  created_at: string
  category_name?: string
  category_slug?: string
  author_name?: string
}

interface PostsResponse {
  data: Post[]
  total: number
  totalPages: number
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings } = useSite()
  const q = searchParams.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const authorName = settings.author_name ?? 'Nguyen Van A'
  const authorAvatar = settings.author_avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80&auto=format&fit=crop&crop=face'

  useEffect(() => {
    setInput(q)
    if (!q.trim()) { setPosts([]); setTotal(0); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    api.get<PostsResponse>(`/public/posts?search=${encodeURIComponent(q)}&limit=20`)
      .then(res => { setPosts(res.data); setTotal(res.total) })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [q])

  useEffect(() => {
    document.title = q ? `Tim kiem: ${q} — ${settings.site_name ?? 'Blog'}` : `Tim kiem — ${settings.site_name ?? 'Blog'}`
  }, [q, settings.site_name])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '60vh' }}>
      <div className="wd-container">
        <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: '600', marginBottom: '20px', letterSpacing: '-.4px' }}>
            Tim kiem bai viet
          </h1>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="search"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhap tu khoa tim kiem..."
              style={{
                flex: 1,
                fontFamily: 'var(--sans)',
                fontSize: '14px',
                border: '1px solid var(--border)',
                borderRadius: '9px',
                padding: '10px 16px',
                background: 'var(--surface)',
                color: 'var(--text)',
                outline: 'none',
                transition: 'border-color .2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <button type="submit" className="btn-accent">Tim kiem</button>
          </form>
        </div>

        {loading && (
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '260px' }} />)}
          </div>
        )}

        {!loading && searched && (
          <>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>
              Tim thay <strong style={{ color: 'var(--text)' }}>{total}</strong> ket qua cho &ldquo;{q}&rdquo;
            </p>
            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>
                <p>Khong tim thay ket qua nao.</p>
                <Link to="/" className="btn-accent" style={{ marginTop: '16px', display: 'inline-block' }}>Ve trang chu</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {posts.map(post => (
                  <div key={post.id} className="post-card">
                    {post.thumbnail && (
                      <div style={{ overflow: 'hidden' }}>
                        <img src={post.thumbnail} className="post-thumb" alt={post.title} />
                      </div>
                    )}
                    <div className="post-body">
                      <div className="post-meta">
                        {post.category_name && (
                          <Link to={`/danh-muc/${post.category_slug}`} className="cat-badge">{post.category_name}</Link>
                        )}
                        <span className="post-date">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                        {post.read_time && <span className="post-read">{post.read_time} phut</span>}
                      </div>
                      <Link to={`/bai-viet/${post.slug}`} className="post-title">{post.title}</Link>
                      {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
                      <div className="post-footer">
                        <div className="post-author">
                          <img src={authorAvatar} className="post-av" alt={post.author_name ?? authorName} />
                          <span className="post-author-name">{post.author_name ?? authorName}</span>
                        </div>
                        <Link to={`/bai-viet/${post.slug}`} className="post-more">Doc tiep →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
