import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Stats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalContacts: number
  newContacts: number
  totalCategories: number
  totalTags: number
  newsletters: number
  recentPosts: RecentPost[]
}

interface RecentPost {
  id: number
  title: string
  slug: string
  status: string
  views: number
  created_at: string
  category_name?: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div><div className="page-title">Dashboard</div></div>
        </div>
        <div className="stats-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="stat-card skeleton" style={{ height: '90px' }} />)}
        </div>
      </div>
    )
  }

  const s = stats
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan blog cá nhân</div>
        </div>
        <Link to="/posts/new" className="btn btn-accent">+ Bài viết mới</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✍</div>
          <div className="stat-label">Tổng bài viết</div>
          <div className="stat-value">{s?.totalPosts ?? 0}</div>
          <div className="stat-sub">{s?.publishedPosts ?? 0} đã xuất bản · {s?.draftPosts ?? 0} bản nháp</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁</div>
          <div className="stat-label">Lượt xem</div>
          <div className="stat-value">{((s?.totalViews ?? 0) / 1000).toFixed(1)}k</div>
          <div className="stat-sub">Tổng lượt đọc tất cả bài</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-label">Danh mục</div>
          <div className="stat-value">{s?.totalCategories ?? 0}</div>
          <div className="stat-sub">{s?.totalTags ?? 0} tags</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✉</div>
          <div className="stat-label">Liên hệ</div>
          <div className="stat-value">{s?.totalContacts ?? 0}</div>
          {(s?.newContacts ?? 0) > 0 && (
            <div className="stat-sub" style={{ color: 'var(--danger)' }}>{s?.newContacts} mới chưa đọc</div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-label">Newsletter</div>
          <div className="stat-value">{s?.newsletters ?? 0}</div>
          <div className="stat-sub">Người đăng ký nhận bài</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <div className="table-title">Bài viết gần đây</div>
          <Link to="/posts" className="btn btn-ghost btn-sm">Xem tất cả</Link>
        </div>
        {!s?.recentPosts.length ? (
          <div className="empty-state">
            <div className="empty-state-icon">✍</div>
            <p>Chưa có bài viết nào</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {s.recentPosts.map(p => (
                <tr key={p.id}>
                  <td style={{ maxWidth: '260px' }}>
                    <div className="text-truncate" style={{ fontWeight: '500', color: 'var(--text)' }}>
                      {p.title}
                    </div>
                  </td>
                  <td>{p.category_name ?? '—'}</td>
                  <td>{(p.views ?? 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${p.status}`}>
                      {p.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Link to={`/posts/${p.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
