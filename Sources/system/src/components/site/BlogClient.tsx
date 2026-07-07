'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type BlogPostItem = {
  id: number
  title: string
  slug: string
  excerpt: string
  category: { name: string; slug: string } | null
  createdAt: Date | string
  featured: boolean
  thumbnail: string | null
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('vi-VN')
}

function Thumb({ post, height }: { post: BlogPostItem; height: number }) {
  return post.thumbnail ? (
    <img src={post.thumbnail} alt={post.title} loading="lazy" style={{ width: '100%', height, objectFit: 'cover' }} />
  ) : (
    <div style={{ height, background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📝</div>
  )
}

function CategoryBadge({ category }: { category: { name: string } | null }) {
  if (!category) return null
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>
      {category.name}
    </div>
  )
}

export function PostCard({ post }: { post: BlogPostItem }) {
  return (
    <article style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform .2s, box-shadow .2s' }}>
      <Thumb post={post} height={180} />
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CategoryBadge category={post.category} />
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.5, flex: 1 }}>{post.title}</h3>
        {post.excerpt && <p style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.6, marginBottom: 14 }}>{post.excerpt}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatDate(post.createdAt)}</span>
          <Link href={`/blog/${post.slug}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Đọc tiếp →</Link>
        </div>
      </div>
    </article>
  )
}

function HotCardLarge({ post }: { post: BlogPostItem }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', height: '100%' }}>
        <Thumb post={post} height={280} />
        <div style={{ padding: '22px 24px' }}>
          <CategoryBadge category={post.category} />
          <h2 style={{ fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 600, marginBottom: 10, lineHeight: 1.35 }}>{post.title}</h2>
          {post.excerpt && <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>{post.excerpt}</p>}
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{formatDate(post.createdAt)}</span>
        </div>
      </article>
    </Link>
  )
}

function HotCardSmall({ post }: { post: BlogPostItem }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', display: 'flex', gap: 14, alignItems: 'stretch' }}>
        <div style={{ width: 108, flexShrink: 0 }}>
          <Thumb post={post} height={92} />
        </div>
        <div style={{ padding: '10px 14px 10px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <CategoryBadge category={post.category} />
          <h3 style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4, marginBottom: 6 }}>{post.title}</h3>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatDate(post.createdAt)}</span>
        </div>
      </article>
    </Link>
  )
}

export default function BlogClient({ posts, categories }: { posts: BlogPostItem[]; categories: { name: string; slug: string }[] }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const sorted = useMemo(
    () => [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts]
  )

  const hot = useMemo(() => {
    const featured = sorted.filter(p => p.featured)
    return (featured.length > 0 ? featured : sorted).slice(0, 3)
  }, [sorted])

  const isBrowsing = query.trim() !== '' || activeCategory !== 'all'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sorted.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category?.slug === activeCategory
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [sorted, activeCategory, query])

  const hotIds = useMemo(() => new Set(hot.map(p => p.id)), [hot])
  const gridPosts = isBrowsing ? filtered : sorted.filter(p => !hotIds.has(p.id))

  return (
    <>
      <section style={{ background: 'var(--dark2)', padding: 'clamp(56px,8vw,88px) 0 clamp(40px,5vw,60px)', textAlign: 'center' }}>
        <div className="wd-container">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>Blog & Tips</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,50px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>
            Kiến thức <em style={{ color: '#4ade80', fontStyle: 'italic', fontWeight: 300 }}>hữu ích</em> về web
          </h1>
          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.4)', maxWidth: 440, margin: '0 auto' }}>
            Hướng dẫn thực tế về thiết kế, kỹ thuật và marketing cho doanh nghiệp Việt Nam.
          </p>

          <div style={{ maxWidth: 460, margin: '28px auto 0', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: .5 }}>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm bài viết theo từ khóa..."
              aria-label="Tìm bài viết"
              style={{
                width: '100%', padding: '13px 20px 13px 42px', borderRadius: 24,
                border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.07)',
                color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'var(--sans)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
            {[{ name: 'Tất cả', slug: 'all' }, ...categories].map(c => {
              const active = activeCategory === c.slug
              return (
                <button
                  key={c.slug}
                  onClick={() => setActiveCategory(c.slug)}
                  style={{
                    padding: '8px 18px', borderRadius: 20, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'var(--sans)', transition: 'all .2s',
                    border: active ? 'none' : '1px solid rgba(255,255,255,.18)',
                    background: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#fff' : 'rgba(255,255,255,.65)',
                  }}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {!isBrowsing && hot.length > 0 && (
        <section className="sec-pad">
          <div className="wd-container">
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>🔥 Nổi bật</div>
            <div className="row g-4">
              <div className="col-lg-7">
                <HotCardLarge post={hot[0]} />
              </div>
              {hot.length > 1 && (
                <div className="col-lg-5">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
                    {hot.slice(1, 3).map(p => <HotCardSmall key={p.id} post={p} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="sec-pad" style={{ paddingTop: isBrowsing ? 'clamp(56px,8vw,88px)' : 0 }}>
        <div className="wd-container">
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 14 }}>
            {isBrowsing ? `Kết quả (${filtered.length})` : 'Bài viết mới nhất'}
          </div>
          {gridPosts.length === 0 ? (
            <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Không tìm thấy bài viết phù hợp.</p>
          ) : (
            <div className="row g-4">
              {gridPosts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
