import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useSite } from '../../contexts/SiteContext'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  thumbnail?: string
  read_time?: number
  views?: number
  created_at: string
  category_name?: string
  category_slug?: string
  author_name?: string
  author_email?: string
}

type FeaturedPost = Post

interface Tag {
  id: number
  name: string
  slug: string
}

interface PostsResponse {
  data: Post[]
  total: number
  totalPages: number
  page: number
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function HomePage() {
  const { settings, categories } = useSite()
  const [featured, setFeatured] = useState<FeaturedPost | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [popularPosts, setPopularPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [newsletter, setNewsletter] = useState('')
  const [newsletterMsg, setNewsletterMsg] = useState('')

  useEffect(() => {
    api.get<FeaturedPost>('/public/featured-post').then(setFeatured).catch(() => null)
    api.get<Post[]>('/public/popular-posts?limit=3').then(setPopularPosts).catch(() => [])
    api.get<Tag[]>('/public/tags').then(setTags).catch(() => [])
  }, [])

  useEffect(() => {
    setLoading(true)
    const cat = activeCategory ? `&category=${activeCategory}` : ''
    api.get<PostsResponse>(`/public/posts?page=${page}&limit=8${cat}`)
      .then(res => {
        setPosts(res.data)
        setTotalPages(res.totalPages)
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [page, activeCategory])

  // Reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            ro.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [posts, featured, popularPosts])

  function handleCategoryClick(slug: string) {
    setActiveCategory(slug)
    setPage(1)
  }

  async function handleNewsletter(e: FormEvent) {
    e.preventDefault()
    if (!newsletter.trim()) return
    try {
      const res = await api.post<{ message: string }>('/public/newsletter', { email: newsletter })
      setNewsletterMsg(res.message)
      setNewsletter('')
    } catch {
      setNewsletterMsg('Co loi xay ra, vui long thu lai.')
    }
  }

  const authorName = settings.author_name ?? 'Nguyen Van A'
  const authorTitle = settings.author_title ?? 'Developer & Writer'
  const authorBio = settings.author_bio ?? 'Toi viet ve cong nghe, tu duy va cuoc song. Moi tuan mot bai, dung gio.'
  const authorAvatar = settings.author_avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80&auto=format&fit=crop&crop=face'

  return (
    <main style={{ paddingTop: '60px' }}>
      {/* FEATURED */}
      {featured && (
        <section style={{ padding: 'clamp(32px,5vw,56px) 0 0' }}>
          <div className="wd-container">
            <div className="feat-post reveal" data-reveal>
              <img
                src={featured.thumbnail ?? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&q=80&auto=format&fit=crop'}
                className="feat-img"
                alt={featured.title}
              />
              <div className="feat-overlay" />
              <div className="feat-body">
                <span className="feat-cat">✦ Bai noi bat</span>
                <h2 className="feat-title">
                  <Link to={`/bai-viet/${featured.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {featured.title}
                  </Link>
                </h2>
                <div className="feat-meta">
                  <span>{featured.author_name ?? authorName}</span>
                  <span>·</span>
                  <span>{formatDate(featured.created_at)}</span>
                  {featured.read_time && (
                    <>
                      <span>·</span>
                      <span>{featured.read_time} phut doc</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <section style={{ padding: 'clamp(40px,6vw,70px) 0 clamp(60px,8vw,100px)' }}>
        <div className="wd-container">
          <div className="row">
            {/* Posts */}
            <div style={{ padding: '8px', width: '100%', flex: '0 0 100%' }}
              className="col-lg-8">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.8px', margin: 0 }}>
                  Bai viet moi nhat
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className={`cat-badge${activeCategory === '' ? ' active' : ''}`}
                    onClick={() => handleCategoryClick('')}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    Tat ca
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`cat-badge${activeCategory === cat.slug ? ' active' : ''}`}
                      onClick={() => handleCategoryClick(cat.slug)}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton" style={{ height: '160px' }} />
                  ))}
                </div>
              ) : (
                <div className="row" style={{ gap: '0' }}>
                  {posts.length === 0 && (
                    <div style={{ padding: '32px', color: 'var(--text-3)', textAlign: 'center', width: '100%' }}>
                      Chua co bai viet nao trong danh muc nay.
                    </div>
                  )}
                  {posts.map((post, idx) => (
                    <div
                      key={post.id}
                      className={`col-md-6 reveal${idx === 0 ? ' col-12' : ''}${idx % 2 === 1 ? ' reveal-d1' : ''}`}
                      style={{ padding: '6px' }}
                      data-reveal
                    >
                      <PostCard post={post} wide={idx === 0} authorName={authorName} authorAvatar={authorAvatar} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }} data-reveal>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`pagination-btn${p === page ? ' active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  {page < totalPages && (
                    <button className="pagination-next" onClick={() => setPage(p => p + 1)}>
                      Tiep →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ padding: '8px', width: '100%', flex: '0 0 100%' }}
              className="col-lg-4">
              {/* About Author */}
              <div className="sidebar-widget reveal" data-reveal>
                <div className="sw-title">Ve tac gia</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img
                    src={authorAvatar}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                    alt={authorName}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{authorName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{authorTitle}</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', fontWeight: '300', color: 'var(--text-2)', lineHeight: '1.7', margin: 0 }}>
                  {authorBio}
                </p>
                <button
                  onClick={() => {
                    const el = document.getElementById('newsletter-sidebar')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-accent"
                  style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '13px', padding: '9px', width: '100%' }}
                >
                  Dang ky nhan bai moi
                </button>
              </div>

              {/* Categories */}
              <div className="sidebar-widget reveal reveal-d1" data-reveal>
                <div className="sw-title">Danh muc</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/danh-muc/${cat.slug}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13.5px',
                        color: 'var(--text-2)',
                        textDecoration: 'none',
                        padding: '6px 0',
                        borderBottom: '1px solid var(--border-light)',
                        transition: 'color .15s',
                      }}
                      onMouseOver={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseOut={e => (e.currentTarget.style.color = 'var(--text-2)')}
                    >
                      {cat.name}
                      <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{cat.post_count ?? 0}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular */}
              {popularPosts.length > 0 && (
                <div className="sidebar-widget reveal reveal-d2" data-reveal>
                  <div className="sw-title">Bai doc nhieu</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {popularPosts.map(post => (
                      <Link
                        key={post.id}
                        to={`/bai-viet/${post.slug}`}
                        style={{ display: 'flex', gap: '12px', textDecoration: 'none' }}
                      >
                        <img
                          src={post.thumbnail ?? ''}
                          style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                          alt={post.title}
                        />
                        <div>
                          <div
                            style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', lineHeight: '1.4', marginBottom: '4px', transition: 'color .15s' }}
                            onMouseOver={e => (e.currentTarget.style.color = 'var(--accent)')}
                            onMouseOut={e => (e.currentTarget.style.color = 'var(--text)')}
                          >
                            {post.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>
                            {((post.views ?? 0) / 1000).toFixed(1)}k luot doc
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="sidebar-widget reveal" data-reveal>
                  <div className="sw-title">Tags</div>
                  <div className="tag-cloud">
                    {tags.map(tag => (
                      <Link key={tag.id} to={`/tag/${tag.slug}`} className="tag">
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div id="newsletter-sidebar" className="reveal" data-reveal
                style={{ background: 'var(--accent)', borderRadius: '12px', padding: '22px 20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>
                  Nhan bai viet qua email
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)', marginBottom: '14px', fontWeight: '300' }}>
                  Moi tuan mot bai. Khong spam.
                </div>
                {newsletterMsg ? (
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.8)', padding: '8px 0' }}>{newsletterMsg}</div>
                ) : (
                  <form onSubmit={handleNewsletter}>
                    <input
                      type="email"
                      placeholder="Email cua ban"
                      value={newsletter}
                      onChange={e => setNewsletter(e.target.value)}
                      required
                      className="newsletter-input"
                    />
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        fontFamily: 'var(--sans)',
                        fontSize: '13px',
                        fontWeight: '500',
                        background: '#fff',
                        color: 'var(--accent)',
                        border: 'none',
                        borderRadius: '7px',
                        padding: '9px',
                        cursor: 'pointer',
                        transition: 'all .15s',
                      }}
                    >
                      Dang ky →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function PostCard({ post, wide, authorName, authorAvatar }: {
  post: Post
  wide: boolean
  authorName: string
  authorAvatar: string
}) {
  return (
    <div className="post-card" style={wide ? { display: 'flex', flexDirection: 'row' } : {}}>
      {post.thumbnail && (
        <div style={wide
          ? { flexShrink: 0, width: '200px', overflow: 'hidden' }
          : { overflow: 'hidden' }
        }>
          <img
            src={post.thumbnail}
            className="post-thumb"
            alt={post.title}
            style={wide ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
          />
        </div>
      )}
      <div className="post-body" style={{ flex: 1 }}>
        <div className="post-meta">
          {post.category_name && (
            <Link to={`/danh-muc/${post.category_slug}`} className="cat-badge">
              {post.category_name}
            </Link>
          )}
          <span className="post-date">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
          {post.read_time && <span className="post-read">{post.read_time} phut</span>}
        </div>
        <Link to={`/bai-viet/${post.slug}`} className="post-title">
          {post.title}
        </Link>
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
  )
}
