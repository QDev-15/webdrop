import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderTitle } from '../utils/text'

function fmtDate(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PostList() {
  const { settings, categories, posts } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<string>(searchParams.get('cat') || 'all')

  useDocumentMeta({
    title: `Chuyên mục bài viết — ${settings.site_name || 'La Bàn Tài Chính'}`,
    description: settings.category_page_sub,
  })

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat) setFilter(cat)
  }, [searchParams])

  function handleFilter(slug: string) {
    setFilter(slug)
    if (slug === 'all') setSearchParams({})
    else setSearchParams({ cat: slug })
  }

  const trending = useMemo(
    () => posts.filter(p => p.trending_order > 0).sort((a, b) => a.trending_order - b.trending_order).slice(0, 5),
    [posts]
  )

  const filtered = filter === 'all' ? posts : posts.filter(p => p.category_slug === filter)

  return (
    <>
      <header className="btc-page-header" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1600&auto=format&fit=crop&q=60')" }}>
        <div className="wd-container btc-page-header-in">
          <div className="btc-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>Chuyên mục</span></div>
          <div className="btc-tag">{posts.length}+ bài viết</div>
          <h1>{renderTitle(settings.category_page_title || 'Toàn bộ *bài viết*')}</h1>
          <p>{settings.category_page_sub}</p>
        </div>
      </header>

      {trending.length > 0 && (
        <section className="btc-sec-sm" style={{ paddingBottom: 0 }}>
          <div className="wd-container">
            <div className="btc-tag" data-reveal>{settings.category_trending_tag || 'Đọc nhiều nhất tuần này'}</div>
            <div className="btc-trending-scroll" data-reveal data-delay="1">
              {trending.map((p, i) => (
                <Link key={p.id} to={`/bai-viet/${p.slug}`} className="btc-post-card btc-trending-card" style={{ position: 'relative' }}>
                  <span className="btc-trending-num">{i + 1}</span>
                  <div className="btc-post-thumb"><img src={p.thumbnail} alt={p.title} /></div>
                  <div className="btc-post-body"><h3 className="btc-post-title">{p.title}</h3></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="btc-sec">
        <div className="wd-container">
          <div className="btc-filter-row" data-reveal>
            <button className={`btc-filter-chip${filter === 'all' ? ' active' : ''}`} onClick={() => handleFilter('all')}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} className={`btc-filter-chip${filter === c.slug ? ' active' : ''}`} onClick={() => handleFilter(c.slug)}>{c.name}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>Chưa có bài viết nào trong chuyên mục này.</div>
          ) : (
            <div className="btc-masonry" data-reveal data-delay="1">
              {filtered.map((p, i) => (
                <Link key={p.id} to={`/bai-viet/${p.slug}`} className={`btc-post-card ${i % 2 === 0 ? 'tall' : 'short'}`}>
                  <div className="btc-post-thumb">
                    {p.category_name && <span className="btc-post-cat">{p.category_name}</span>}
                    <img src={p.thumbnail} alt={p.title} />
                  </div>
                  <div className="btc-post-body">
                    <h3 className="btc-post-title">{p.title}</h3>
                    <p className="btc-post-excerpt">{p.excerpt}</p>
                    <div className="btc-post-meta"><span>{fmtDate(p.published_at)}</span><span>·</span><span>{p.read_time} phút đọc</span></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
