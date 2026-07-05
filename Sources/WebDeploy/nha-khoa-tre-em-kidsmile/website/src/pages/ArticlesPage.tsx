import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  tag: string
  read_time: string
  status: string
  sort_order: number
}

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=75&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=75&auto=format&fit=crop',
]

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Article[]>('/public/articles').then(setArticles).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      {/* Page header */}
      <div className="ks-page-head">
        <div className="wd-container">
          <div className="ks-crumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            Cẩm nang cha mẹ
          </div>
          <h1 className="ks-title" style={{ fontSize: 'clamp(30px,4.5vw,50px)' }}>
            Cẩm nang <strong>cha mẹ</strong>
          </h1>
          <p className="ks-sub ks-mx-auto" style={{ textAlign: 'center', marginTop: 12 }}>
            Những bí quyết chăm sóc răng miệng cho bé từ các chuyên gia nha khoa Nhi tại KidSmile.
          </p>
        </div>
      </div>

      <section className="ks-sec-pad" aria-label="Cẩm nang cho cha mẹ">
        <div className="wd-container">
          {loading ? (
            <div className="ks-loading">Đang tải bài viết...</div>
          ) : (
            <div className="ks-article-grid">
              {articles.map((article, i) => (
                <article className="ks-article-card" key={article.id} data-reveal data-delay={i % 3 > 0 ? String(i % 3) : undefined}>
                  <div className="ks-article-img">
                    <img
                      src={article.thumbnail || FALLBACK_IMGS[i % FALLBACK_IMGS.length]}
                      alt={article.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="ks-article-body">
                    {article.tag && (
                      <span className="ks-article-tag">{article.tag}</span>
                    )}
                    <div className="ks-article-title">{article.title}</div>
                    {article.excerpt && (
                      <div className="ks-article-excerpt">{article.excerpt}</div>
                    )}
                    <div className="ks-article-meta">
                      {article.read_time && <span>⏱ {article.read_time}</span>}
                    </div>
                  </div>
                </article>
              ))}
              {articles.length === 0 && (
                <div className="ks-loading">Chưa có bài viết nào.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
