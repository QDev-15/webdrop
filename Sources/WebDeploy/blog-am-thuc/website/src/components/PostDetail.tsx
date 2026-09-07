import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { Post } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { formatDate, parseTags } from '../utils'
import PostGrid from './PostList'

interface FullPost extends Post {
  content: string
  pullquote: string
  author_bio: string
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<FullPost | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setNotFound(false)
    api.get<FullPost>(`/public/posts/${slug}`)
      .then(p => {
        setPost(p)
        return api.get<Post[]>(`/public/posts?type=article&category=${p.category_slug ?? ''}&exclude=${slug}&limit=3`)
      })
      .then(r => setRelated(r))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useDocumentMeta({
    title: post ? `${post.title} — Bếp Xanh` : 'Đang tải... — Bếp Xanh',
    description: post?.excerpt,
  })

  if (loading) return <div className="bam-container" style={{ paddingTop: 150, paddingBottom: 80 }}>Đang tải...</div>
  if (notFound || !post) {
    return (
      <div className="bam-container" style={{ paddingTop: 150, paddingBottom: 80, textAlign: 'center' }}>
        <h1 className="bam-page-title">Không tìm thấy bài viết</h1>
        <p style={{ marginTop: 16 }}><Link to="/chuyen-muc" className="bam-btn bam-btn-primary">Xem chuyên mục</Link></p>
      </div>
    )
  }

  const tags = parseTags(post.tags)

  return (
    <>
      <header className="bam-article-header bam-container-sm">
        {post.category_name && <div className="bam-eyebrow" style={{ justifyContent: 'center' }}>{post.category_name}</div>}
        <h1 className="bam-article-title">{post.title}</h1>
        <div className="bam-article-meta-row">
          {post.author_name && <span><i className="bi bi-person" /> {post.author_name}</span>}
          <span><i className="bi bi-calendar3" /> {formatDate(post.published_at)}</span>
          <span><i className="bi bi-clock" /> {post.read_minutes} phút đọc</span>
        </div>
      </header>

      <div className="bam-container-sm">
        {post.image && (
          <div className="bam-article-cover" data-reveal>
            <img src={post.image} alt={post.title} loading="lazy" />
          </div>
        )}

        <article className="bam-prose" style={{ marginTop: 36 }} data-reveal data-reveal-d1
          dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.pullquote && (
          <blockquote className="bam-pullquote" data-reveal>{post.pullquote}</blockquote>
        )}

        {tags.length > 0 && (
          <div className="bam-article-tags" data-reveal>
            {tags.map(t => <Link key={t} to={`/chuyen-muc?q=${encodeURIComponent(t)}`} className="bam-tag">{t}</Link>)}
          </div>
        )}

        {post.author_name && (
          <div className="bam-author-box" data-reveal>
            {post.author_avatar && <img src={post.author_avatar} alt={`Ảnh đại diện tác giả ${post.author_name}`} />}
            <div>
              <div className="bam-author-box-name">{post.author_name}</div>
              {post.author_bio && <div className="bam-author-box-desc">{post.author_bio}</div>}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="bam-sec" style={{ background: 'var(--bg)' }}>
          <div className="bam-container">
            <div className="bam-sec-head" data-reveal>
              <div className="bam-eyebrow">Đọc tiếp</div>
              <h2 className="bam-sec-title">Bài viết <em>liên quan</em></h2>
            </div>
            <div data-reveal data-reveal-d1>
              <PostGrid posts={related} />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
