import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
}

interface PostsResponse {
  data: Post[]
  total: number
  totalPages: number
  page: number
}

export default function ArchivePage() {
  const { settings } = useSite()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const authorName = settings.author_name ?? 'Nguyễn Văn A'
  const authorAvatar = settings.author_avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80&auto=format&fit=crop&crop=face'

  useEffect(() => {
    document.title = `Tất cả bài viết — ${settings.site_name ?? 'Blog'}`
  }, [settings.site_name])

  useEffect(() => {
    setLoading(true)
    api.get<PostsResponse>(`/public/posts?page=${page}&limit=9`)
      .then(res => {
        setPosts(res.data)
        setTotal(res.total)
        setTotalPages(res.totalPages)
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08 })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [posts])

  return (
    <main style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="wd-container">
        <div style={{ marginBottom: '32px' }}>
          <nav style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '12px' }}>
            <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Trang chủ</Link>
            <span> › </span>
            <span>Tất cả bài viết</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: '600', letterSpacing: '-.4px', marginBottom: '8px' }}>
            Tất cả bài viết
          </h1>
          {!loading && (
            <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>{total} bài viết</p>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '280px' }} />)}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>
            <p style={{ fontSize: '15px', marginBottom: '16px' }}>Chưa có bài viết nào.</p>
            <button className="btn-accent" onClick={() => navigate('/')}>Về trang chủ</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {posts.map((post, idx) => (
              <div key={post.id} className={`reveal${idx % 3 === 1 ? ' reveal-d1' : idx % 3 === 2 ? ' reveal-d2' : ''}`} data-reveal>
                <div className="post-card">
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
                      {post.read_time && <span className="post-read">{post.read_time} phút</span>}
                    </div>
                    <Link to={`/bai-viet/${post.slug}`} className="post-title">{post.title}</Link>
                    {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
                    <div className="post-footer">
                      <div className="post-author">
                        <img src={authorAvatar} className="post-av" alt={authorName} />
                        <span className="post-author-name">{authorName}</span>
                      </div>
                      <Link to={`/bai-viet/${post.slug}`} className="post-more">Đọc tiếp →</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`pagination-btn${p === page ? ' active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
