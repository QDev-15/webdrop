import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/site/Footer'
import { ARTICLES } from '../articles'
import RevealObserver from '@/components/site/RevealObserver'

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) return {}
  return {
    title: `${article.title} | WC 2026 — webdrop.store`,
    description: article.excerpt,
    alternates: { canonical: `${BASE}/lich-bong-da/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.thumbnail, alt: article.thumbnailAlt }],
      type: 'article',
      publishedTime: article.publishedAt,
      locale: 'vi_VN',
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt, images: [article.thumbnail] },
  }
}

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00Z')
  return `${d.getUTCDate()} tháng ${d.getUTCMonth() + 1}, ${d.getUTCFullYear()}`
}

function formatViews(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)
}

export default async function ArticleDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) notFound()

  const mostRead = ARTICLES
    .filter(a => a.slug !== slug)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  return (
    <>
      <RevealObserver />
      <div style={{ paddingTop: 62, minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--sans)' }}>

        {/* Hero image */}
        <div style={{ width: '100%', maxHeight: 480, overflow: 'hidden', position: 'relative' }}>
          <img
            src={article.thumbnail}
            alt={article.thumbnailAlt}
            style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.55) 100%)' }} />
          {/* Category + back */}
          <div style={{ position: 'absolute', top: 24, left: 0, right: 0 }}>
            <div className="wd-container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/lich-bong-da" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,.75)', textDecoration: 'none', background: 'rgba(0,0,0,.3)', padding: '5px 12px', borderRadius: 6 }}>
                ← Lịch bóng đá
              </Link>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(0,0,0,.3)', padding: '5px 12px', borderRadius: 6 }}>
                {article.category}
              </span>
            </div>
          </div>
          {/* Title on hero */}
          <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0 }}>
            <div className="wd-container">
              <h1 style={{ fontSize: 'clamp(20px,3.5vw,38px)', fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,.4)' }}>
                {article.title}
              </h1>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>✍️ {article.author}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>📅 {formatDate(article.publishedAt)}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>⏱ {article.readTime} phút đọc</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>👁 {formatViews(article.views)} lượt xem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="wd-container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 56 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 28, padding: '18px 20px', background: 'var(--accent-light)', borderLeft: '3px solid var(--accent)', borderRadius: '0 8px 8px 0' }}>
            {article.excerpt}
          </p>
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Most read articles */}
        <div style={{ background: 'var(--dark2)', padding: 'clamp(40px,6vw,64px) 0' }}>
          <div className="wd-container">
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Đọc thêm</div>
              <h2 style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 700, color: '#fff', margin: 0 }}>Bài viết được đọc nhiều nhất</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {mostRead.map(a => (
                <Link key={a.slug} href={`/lich-bong-da/${a.slug}`} style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, overflow: 'hidden', transition: 'border-color .15s, transform .15s' }}>
                  <img src={a.thumbnail} alt={a.title} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{a.category}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                      {a.title}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,.35)', display: 'flex', gap: 10 }}>
                      <span>👁 {formatViews(a.views)}</span>
                      <span>⏱ {a.readTime} phút</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .article-body { color: var(--text); line-height: 1.85; font-size: 15px; font-weight: 300; }
        .article-body h2 { font-size: clamp(18px,2.5vw,24px); font-weight: 700; color: var(--text); margin: 36px 0 14px; letter-spacing: -.3px; }
        .article-body h3 { font-size: 15px; font-weight: 700; color: var(--text); margin: 24px 0 8px; }
        .article-body p { margin: 0 0 16px; }
        .article-body strong { font-weight: 600; color: var(--text); }
        .article-body ul { padding-left: 20px; margin: 0 0 16px; }
        .article-body li { margin-bottom: 6px; }
      `}</style>
      <Footer />
    </>
  )
}
