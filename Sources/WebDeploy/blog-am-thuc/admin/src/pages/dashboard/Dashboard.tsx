import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  total_posts: number
  total_articles: number
  total_recipes: number
  total_categories: number
  total_views: number
  new_contacts: number
  total_contacts: number
  total_testimonials: number
  total_faqs: number
  recent_posts: { id: number; title: string; type: string; status: string; published_at: string }[]
  recent_contacts: { id: number; name: string; subject: string; status: string; created_at: string }[]
}

const CARDS: { key: keyof Stats; label: string; icon: string; bg: string; color: string }[] = [
  { key: 'total_posts',      label: 'Tổng bài viết & công thức', icon: '📝', bg: 'var(--accent-light)', color: 'var(--accent)' },
  { key: 'total_articles',   label: 'Bài viết (article)',        icon: '📰', bg: '#eff6ff', color: '#1d4ed8' },
  { key: 'total_recipes',    label: 'Công thức nấu ăn',          icon: '🍲', bg: '#fffbeb', color: '#92400e' },
  { key: 'total_categories', label: 'Chuyên mục',                icon: '📂', bg: '#fdf4ff', color: '#7e22ce' },
  { key: 'total_views',      label: 'Lượt xem tích lũy',         icon: '👁', bg: '#f0f9ff', color: '#075985' },
  { key: 'new_contacts',     label: 'Liên hệ mới',               icon: '✉', bg: '#fff0f0', color: 'var(--danger)' },
  { key: 'total_testimonials', label: 'Đánh giá độc giả',        icon: '⭐', bg: '#fffbeb', color: '#92400e' },
  { key: 'total_faqs',       label: 'Câu hỏi thường gặp',        icon: '❓', bg: 'var(--accent-light)', color: 'var(--accent)' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => null).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-loading">Đang tải...</div>
  if (!stats) return <div className="empty-state"><div className="empty-state-text">Không thể tải dữ liệu thống kê.</div></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan hoạt động của Bếp Xanh</div>
        </div>
      </div>

      <div className="stats-grid">
        {CARDS.map(c => (
          <div key={c.key} className="stat-card">
            <div className="stat-card-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <div className="stat-card-value">{stats[c.key] as number}</div>
            <div className="stat-card-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 8 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Bài viết / công thức mới nhất</div>
            <Link to="/posts" className="btn-ghost btn-sm">Xem tất cả</Link>
          </div>
          {stats.recent_posts.length === 0 ? (
            <div className="empty-state"><div className="empty-state-text">Chưa có bài viết nào.</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recent_posts.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13.5, flex: 1 }}>{p.title}</div>
                  <span className={`badge badge-${p.status}`} style={{ marginLeft: 10, flexShrink: 0 }}>{p.type === 'recipe' ? 'Công thức' : 'Bài viết'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Liên hệ gần đây</div>
            <Link to="/contacts" className="btn-ghost btn-sm">Xem tất cả</Link>
          </div>
          {stats.recent_contacts.length === 0 ? (
            <div className="empty-state"><div className="empty-state-text">Chưa có liên hệ nào.</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recent_contacts.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13.5, flex: 1 }}>{c.name} — {c.subject || 'Không có chủ đề'}</div>
                  <span className={`badge badge-${c.status}`} style={{ marginLeft: 10, flexShrink: 0 }}>{c.status === 'new' ? 'Mới' : c.status === 'replied' ? 'Đã trả lời' : 'Đã đọc'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
