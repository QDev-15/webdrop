import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import { formatDateVN } from '../lib/listings'

interface Article { id: number; slug: string; title: string; category: string; thumbnail: string; excerpt: string; author: string; published_at: string }

export default function NewsPage() {
  useDocumentMeta({ title: 'Tin tức bất động sản | RaoNhà', description: 'Cập nhật xu hướng giá, kinh nghiệm mua bán nhà đất, thủ tục pháp lý và phân tích khu vực từ đội ngũ biên tập RaoNhà.' })
  const [items, setItems] = useState<Article[]>([])

  useEffect(() => { api.get<Article[]>('/public/articles').then(setItems).catch(() => {}) }, [])

  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Kiến thức bất động sản</div>
          <h1 className="sec-title">Tin tức &amp; <em>kinh nghiệm</em></h1>
          <p className="sec-sub" style={{ margin: '0 auto' }}>Xu hướng giá, thủ tục pháp lý, kinh nghiệm mua bán và phân tích khu vực — cập nhật từ đội ngũ biên tập RaoNhà.</p>
        </div>
      </section>

      <section className="sec-pad">
        <div className="rn-container">
          <div className="rn-news-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {items.map(a => (
              <Link key={a.id} to={`/tin-tuc-chi-tiet?slug=${a.slug}`} className="rn-news-card" data-reveal>
                <div className="rn-news-thumb"><img src={a.thumbnail} alt={a.title} loading="lazy" /></div>
                <div className="rn-news-body">
                  <span className="rn-news-cat">{a.category}</span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <span className="rn-news-date">{formatDateVN(a.published_at)} · {a.author}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
