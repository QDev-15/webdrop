import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { renderEmphasis } from '../utils/renderEmphasis'
import { api } from '../api/client'
import { PostCard, type Post } from '../components/PostList'

export default function CamNangPage() {
  const { settings } = useSite()
  const [saved, setSaved] = useState<Post[]>([])

  useDocumentMeta({
    title: `Cẩm nang theo giai đoạn phát triển của bé — ${settings.site_name || 'Cỏ Non Blog'}`,
    description: 'Cẩm nang mốc phát triển, mẹo chăm sóc và dấu hiệu cần chú ý cho bé từ 0 đến 6 tuổi — tổng hợp bởi Cỏ Non Blog.',
  })

  useEffect(() => {
    api.get<Post[]>('/public/posts?saved=1&limit=5').then(setSaved).catch(() => {})
  }, [])

  const timeline = [1, 2, 3, 4]
    .map(i => ({
      stage: settings[`camtl${i}_stage`] || '',
      title: settings[`camtl${i}_title`] || '',
      text: settings[`camtl${i}_text`] || '',
      tags: (settings[`camtl${i}_tags`] || '').split(',').map(t => t.trim()).filter(Boolean),
    }))
    .filter(t => t.stage || t.title)

  const bentoItems = [1, 2, 3, 4].map(i => ({
    title: settings[`bento${i}_title`] || '',
    desc: settings[`bento${i}_desc`] || '',
    image: settings[`bento${i}_image`] || '',
  }))

  return (
    <main>
      <section className="bmb-sec bmb-center" style={{ paddingTop: 130, paddingBottom: 20 }}>
        <div className="bmb-container">
          <div className="bmb-eyebrow" data-reveal style={{ display: 'flex', justifyContent: 'center' }}>📚 Cẩm nang</div>
          <h1 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.camnang_hero_title || 'Đồng hành cùng con qua *từng giai đoạn*')}</h1>
          <p className="bmb-sec-sub" data-reveal>{settings.camnang_hero_sub || ''}</p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bmb-sec" style={{ paddingTop: 20 }}>
        <div className="bmb-container">
          <div className="bmb-timeline" data-reveal>
            {timeline.map((t, i) => (
              <div className="bmb-tl-item" key={i}>
                <span className="bmb-tl-dot"></span>
                <div className="bmb-tl-stage">{t.stage}</div>
                <h3 className="bmb-tl-title">{t.title}</h3>
                <p className="bmb-tl-text">{t.text}</p>
                {t.tags.length > 0 && (
                  <div className="bmb-tl-tags">
                    {t.tags.map(tag => <span key={tag}>#{tag}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO-GRID */}
      <section className="bmb-sec bmb-sec-tint">
        <div className="bmb-container">
          <div className="bmb-eyebrow" data-reveal>{settings.camnang_bento_label || '🧩 Cẩm nang theo chủ đề'}</div>
          <h2 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.camnang_bento_title || 'Chọn đúng chủ đề *mẹ đang cần*')}</h2>
          <div style={{ height: 32 }}></div>
          <div className="bmb-bento" data-reveal>
            {bentoItems.map((b, i) => (
              <Link to="/chuyen-muc" key={i} className={`bmb-bento-item${i === 0 ? ' lg' : ''}`}>
                {b.image && <img src={b.image} alt={b.title} loading="lazy" />}
                <div className="bmb-bento-overlay">
                  <div className="bmb-bento-label">{b.title}<small>{b.desc}</small></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL-SCROLL */}
      {saved.length > 0 && (
        <section className="bmb-sec bmb-sec-peach">
          <div className="bmb-container">
            <div className="bmb-eyebrow" data-reveal>{settings.camnang_saved_label || '💾 Được lưu nhiều nhất'}</div>
            <h2 className="bmb-sec-title" data-reveal>{renderEmphasis(settings.camnang_saved_title || 'Cẩm nang mẹ nào cũng *lưu lại*')}</h2>
            <div style={{ height: 32 }}></div>
            <div className="bmb-hscroll">
              {saved.map(p => (
                <div className="bmb-hscroll-card" key={p.id}>
                  <PostCard post={p} revealAttr={false} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
