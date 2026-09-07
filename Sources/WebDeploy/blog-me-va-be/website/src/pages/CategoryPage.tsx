import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderEmphasis } from '../utils/renderEmphasis'
import { api } from '../api/client'
import { PostCard, type Post } from '../components/PostList'

export default function CategoryPage() {
  const { settings, categories } = useSite()
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCat, setActiveCat] = useState<string>(searchParams.get('cat') || 'all')

  useDocumentMeta({
    title: `Chuyên mục — ${settings.site_name || 'Cỏ Non Blog'}`,
    description: 'Tất cả bài viết của Cỏ Non Blog theo chuyên mục: Mang thai, Sơ sinh, Dinh dưỡng cho bé, Giáo dục sớm và Góc của mẹ.',
  })

  useEffect(() => {
    api.get<Post[]>('/public/posts').then(setPosts).catch(() => {})
  }, [])

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat) setActiveCat(cat)
  }, [searchParams])

  const visible = activeCat === 'all' ? posts : posts.filter(p => p.category_slug === activeCat)

  return (
    <main>
      <section className="bmb-sec" style={{ paddingTop: 130, paddingBottom: 20 }}>
        <div className="bmb-container bmb-center">
          <div className="bmb-eyebrow" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>🗂 Chuyên mục</div>
          <h1 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.category_hero_title || 'Mọi chủ đề mẹ và bé, *tất cả tại đây*')}</h1>
          <p className="bmb-sec-sub" data-reveal>{settings.category_hero_sub || ''}</p>
        </div>
      </section>

      <section className="bmb-sec" style={{ paddingTop: 24 }}>
        <div className="bmb-container">
          <div className="bmb-cat-tabs" data-reveal>
            <button className={`bmb-cat-tab${activeCat === 'all' ? ' active' : ''}`} onClick={() => setActiveCat('all')}>Tất cả</button>
            {categories.map(c => (
              <button key={c.id} className={`bmb-cat-tab${activeCat === c.slug ? ' active' : ''}`} onClick={() => setActiveCat(c.slug)}>{c.name}</button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="text-center bmb-sec-sub bmb-center" style={{ marginTop: 40 }}>Chưa có bài viết nào trong chuyên mục này — mời bạn xem các chuyên mục khác nhé.</p>
          ) : (
            <div className="bmb-post-grid">
              {visible.map(p => <PostCard post={p} key={p.id} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
