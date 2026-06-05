import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { useSite } from '../../contexts/SiteContext'

interface PostDetail {
  id: number
  title: string
  slug: string
  excerpt?: string
  content?: string
  thumbnail?: string
  read_time?: number
  views?: number
  created_at: string
  updated_at: string
  category_name?: string
  category_slug?: string
  author_name?: string
  tags?: { id: number; name: string; slug: string }[]
  related?: RelatedPost[]
}

interface RelatedPost {
  id: number
  title: string
  slug: string
  thumbnail?: string
  read_time?: number
  created_at: string
  category_name?: string
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSite()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const authorName = settings.author_name ?? 'Nguyễn Văn A'
  const authorAvatar = settings.author_avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80&auto=format&fit=crop&crop=face'

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api.get<PostDetail>(`/public/posts/${slug}`)
      .then(data => {
        setPost(data)
        document.title = `${data.title} — ${settings.site_name ?? 'Blog'}`
      })
      .catch(() => setError('Bài viết không tồn tại hoặc đã bị xóa.'))
      .finally(() => setLoading(false))
  }, [slug, settings.site_name])

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
  }, [post])

  if (loading) {
    return (
      <main style={{ paddingTop: '80px', minHeight: '60vh' }}>
        <div className="wd-container" style={{ maxWidth: '720px', padding: '0 clamp(20px,5vw,80px)' }}>
          <div className="skeleton" style={{ height: '40px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '32px' }} />
          <div className="skeleton" style={{ height: '400px', marginBottom: '24px' }} />
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '16px', marginBottom: '12px' }} />)}
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main style={{ paddingTop: '100px', minHeight: '60vh', textAlign: 'center', paddingBottom: '60px' }}>
        <div className="wd-container">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>404</div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>Bài viết không tồn tại</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>
            {error || 'Bài viết bạn đang tìm kiếm không được tìm thấy.'}
          </p>
          <Link to="/" className="btn-accent">Về trang chủ</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ paddingTop: '80px' }}>
      <article style={{ maxWidth: '720px', margin: '0 auto', padding: '0 clamp(20px,5vw,40px)', paddingBottom: '80px' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-3)', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Trang chủ</Link>
          <span>›</span>
          {post.category_slug && (
            <>
              <Link to={`/danh-muc/${post.category_slug}`} style={{ color: 'var(--text-3)', textDecoration: 'none' }}>
                {post.category_name}
              </Link>
              <span>›</span>
            </>
          )}
          <span style={{ color: 'var(--text-2)' }}>{post.title.slice(0, 50)}{post.title.length > 50 ? '...' : ''}</span>
        </nav>

        {/* Header */}
        <div data-reveal className="reveal">
          {post.category_name && (
            <Link to={`/danh-muc/${post.category_slug}`} className="cat-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
              {post.category_name}
            </Link>
          )}
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: '600', lineHeight: '1.2', letterSpacing: '-.5px', marginBottom: '16px', color: 'var(--text)' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={authorAvatar} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt={post.author_name ?? authorName} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-2)' }}>{post.author_name ?? authorName}</span>
            </div>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>
              {new Date(post.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {post.read_time && (
              <>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>{post.read_time} phút đọc</span>
              </>
            )}
            {post.views && (
              <>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>{post.views.toLocaleString()} lượt xem</span>
              </>
            )}
          </div>
        </div>

        {/* Ảnh đại diện */}
        {post.thumbnail && (
          <div data-reveal className="reveal" style={{ marginBottom: '32px' }}>
            <img
              src={post.thumbnail}
              alt={post.title}
              style={{ width: '100%', borderRadius: '12px', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Nội dung */}
        <div
          className="post-content reveal"
          data-reveal
          dangerouslySetInnerHTML={{ __html: post.content ?? '<p>Nội dung đang được cập nhật...</p>' }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div className="tag-cloud">
              {post.tags.map(tag => (
                <Link key={tag.id} to={`/tag/${tag.slug}`} className="tag">
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bài viết liên quan */}
        {post.related && post.related.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '20px' }}>
              Bài viết liên quan
            </h3>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {post.related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/bai-viet/${rel.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="post-card">
                    {rel.thumbnail && (
                      <div style={{ overflow: 'hidden' }}>
                        <img src={rel.thumbnail} className="post-thumb" alt={rel.title} />
                      </div>
                    )}
                    <div className="post-body">
                      <div className="post-meta">
                        <span className="post-date">{new Date(rel.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <span className="post-title" style={{ fontSize: '14px' }}>{rel.title}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
