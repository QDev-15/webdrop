import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { formatDateVN } from '../utils/format'
import PostList, { type PostCardData } from './PostList'

interface FullPost {
  id: number
  title: string
  slug: string
  thumbnail: string
  excerpt: string
  content: string
  tags: string
  gallery_images: string
  read_time: number
  published_date: string
  updated_date: string
  category_name?: string | null
  category_slug?: string | null
  tag_class?: string | null
}

interface RelatedPost {
  id: number
  title: string
  slug: string
  thumbnail: string
  read_time: number
  category_name?: string | null
  tag_class?: string | null
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSite()
  const [post, setPost] = useState<FullPost | null>(null)
  const [related, setRelated] = useState<RelatedPost[]>([])
  const [more, setMore] = useState<PostCardData[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'notfound'>('loading')

  useEffect(() => {
    if (!slug) return
    setState('loading')
    api.get<FullPost>(`/public/posts/${slug}`)
      .then(p => { setPost(p); setState('ready') })
      .catch(() => setState('notfound'))
    api.get<RelatedPost[]>(`/public/related-posts/${slug}`).then(setRelated).catch(() => null)
    api.get<PostCardData[]>('/public/posts?limit=100')
      .then(list => setMore(list.filter(p => p.slug !== slug).slice(0, 3)))
      .catch(() => null)
  }, [slug])

  useDocumentMeta({
    title: post ? `${post.title} — ${settings.site_name || 'Xê Dịch'}` : `Đang tải… — ${settings.site_name || 'Xê Dịch'}`,
    description: post?.excerpt,
  })

  if (state === 'loading') {
    return <div className="bdl-container" style={{ padding: '160px 0 100px' }}>Đang tải bài viết…</div>
  }
  if (state === 'notfound' || !post) {
    return (
      <div className="bdl-container" style={{ padding: '160px 0 100px', textAlign: 'center' }}>
        <h1 className="bdl-ph-title">Không tìm thấy bài viết</h1>
        <p className="bdl-ph-sub" style={{ margin: '12px auto 24px' }}>Bài viết này có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
        <Link to="/chuyen-muc" className="bdl-btn bdl-btn-accent">Xem chuyên mục</Link>
      </div>
    )
  }

  const tags = (post.tags || '').split(/[,|]/).map(t => t.trim()).filter(Boolean)
  const author = settings.author_name || 'Lam Trang'

  return (
    <>
      <header className="bdl-page-hero">
        <div className="bdl-container">
          <div><Link to="/chuyen-muc" className="bdl-ph-back">← Quay lại Chuyên mục</Link></div>
          {post.category_name && (
            <span className={`bdl-stamp-tag ${post.tag_class || ''}`} style={{ marginBottom: 16, display: 'inline-flex' }}>{post.category_name}</span>
          )}
          <h1 className="bdl-ph-title">{post.title}</h1>
          {post.excerpt && <p className="bdl-ph-sub">{post.excerpt}</p>}
          <div className="bdl-ph-meta">
            <span className="bdl-ph-meta-author">
              {settings.author_avatar && <img className="bdl-ph-meta-av" src={settings.author_avatar} alt={`Ảnh đại diện ${author}`} />}
              {author}
            </span>
            {post.published_date && <><span>·</span><span>{formatDateVN(post.published_date)}</span></>}
            {post.read_time > 0 && <><span>·</span><span>{post.read_time} phút đọc</span></>}
            {post.updated_date && <><span>·</span><span>Cập nhật: {formatDateVN(post.updated_date)}</span></>}
          </div>
        </div>
      </header>

      <section className="bdl-sec-pad">
        <div className="bdl-container">
          <div className="bdl-article-layout">
            <article className="bdl-article-body" data-reveal>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />

              {tags.length > 0 && (
                <div className="bdl-article-tags">
                  {tags.map(t => <span className="bdl-tag-pill" key={t}>{t}</span>)}
                </div>
              )}

              <div className="bdl-author-box">
                {settings.author_avatar && <img src={settings.author_avatar} alt={`Ảnh đại diện tác giả ${author}`} />}
                <div>
                  <div className="bdl-author-name">Viết bởi {author}</div>
                  {settings.author_bio && <p className="bdl-author-bio">{settings.author_bio}</p>}
                </div>
              </div>
            </article>

            {related.length > 0 && (
              <aside>
                <div className="bdl-sidebar-widget" data-reveal>
                  <div className="bdl-sw-title">Bài viết liên quan</div>
                  {related.map(r => (
                    <Link to={`/bai-viet/${r.slug}`} className="bdl-sw-item" key={r.id}>
                      {r.thumbnail && <img className="bdl-sw-thumb" src={r.thumbnail} alt={r.title} loading="lazy" />}
                      <div>
                        <div className="bdl-sw-title-sm">{r.title}</div>
                        <div className="bdl-sw-meta">{r.read_time} phút đọc</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bdl-sec-pad" style={{ background: 'var(--surface)', paddingTop: 0 }}>
          <div className="bdl-container">
            <div className="bdl-sec-head" data-reveal>
              <div className="bdl-eyebrow">Đọc tiếp</div>
              <h2 className="bdl-sec-title">Có thể bạn <strong>cũng sẽ thích</strong></h2>
            </div>
            <PostList posts={more} />
          </div>
        </section>
      )}
    </>
  )
}
