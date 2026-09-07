import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  thumbnail: string
  author_name: string
  author_avatar: string
  read_time: number
  category_name: string | null
  category_slug: string | null
  created_at: string
}

export default function CategoryPage() {
  useDocumentMeta({
    title: 'Chuyên mục — PIXEL. Blog Công Nghệ',
    description: 'Duyệt toàn bộ bài viết của PIXEL. theo chuyên mục: Tin tức công nghệ, Đánh giá sản phẩm, Thủ thuật & Mẹo, AI & Xu hướng, Bảo mật, Di động.',
  })

  const { categories } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const activeFilter = searchParams.get('cat') || 'all'

  useEffect(() => {
    api.get<Post[]>('/public/posts?limit=100').then(setPosts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.category_slug === activeFilter)

  function setFilter(slug: string) {
    if (slug === 'all') setSearchParams({})
    else setSearchParams({ cat: slug })
  }

  return (
    <>
      <header className="bcn-page-hero">
        <div className="bcn-page-hero-grid" aria-hidden="true"></div>
        <div className="bcn-container bcn-page-hero-inner">
          <div className="bcn-hero-label" style={{ marginBottom: 18 }}>Thư viện bài viết</div>
          <h1>Chuyên mục</h1>
          <p>Duyệt toàn bộ bài viết của PIXEL. theo từng chủ đề — từ tin tức nóng hổi đến thủ thuật thực dụng mỗi ngày.</p>
        </div>
      </header>

      <section className="bcn-sec">
        <div className="bcn-container">
          <div className="bcn-tabs" data-reveal>
            <button className={`bcn-tab${activeFilter === 'all' ? ' bcn-tab-active' : ''}`} onClick={() => setFilter('all')}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} className={`bcn-tab${activeFilter === c.slug ? ' bcn-tab-active' : ''}`} onClick={() => setFilter(c.slug)}>{c.name}</button>
            ))}
          </div>

          {loading ? (
            <div className="bcn-empty-state bcn-show">Đang tải bài viết...</div>
          ) : (
            <>
              <div className="bcn-post-grid" data-reveal>
                {filtered.map(p => (
                  <Link key={p.id} to={`/bai-viet/${p.slug}`} className="bcn-post-card" style={{ textDecoration: 'none' }}>
                    <div className="bcn-post-thumb">
                      <span className="bcn-post-cat-tag">{p.category_name ?? 'Bài viết'}</span>
                      <img src={p.thumbnail} alt={p.title} />
                    </div>
                    <div className="bcn-post-body">
                      <div className="bcn-post-meta"><span>{new Date(p.created_at).toLocaleDateString('vi-VN')}</span><span>{p.read_time} phút đọc</span></div>
                      <h4 className="bcn-post-title">{p.title}</h4>
                      <p className="bcn-post-excerpt">{p.excerpt}</p>
                      <div className="bcn-post-foot">
                        <div className="bcn-post-author">
                          <img src={p.author_avatar} className="bcn-post-av" alt={p.author_name} />
                          <span className="bcn-post-author-name">{p.author_name}</span>
                        </div>
                        <span className="bcn-post-more">Đọc tiếp →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className={`bcn-empty-state${filtered.length === 0 ? ' bcn-show' : ''}`}>Không tìm thấy bài viết nào trong chuyên mục này.</div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
