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
          <div className="page-sub">Tong quan blog ca nhan</div>
        </div>
        <Link to="/posts/new" className="btn btn-accent">+ Bai viet moi</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✍</div>
          <div className="stat-label">Tong bai viet</div>
          <div className="stat-value">{s?.totalPosts ?? 0}</div>
          <div className="stat-sub">{s?.publishedPosts ?? 0} da xuat ban · {s?.draftPosts ?? 0} ban nhap</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁</div>
          <div className="stat-label">Luot xem</div>
          <div className="stat-value">{((s?.totalViews ?? 0) / 1000).toFixed(1)}k</div>
          <div className="stat-sub">Tong luot doc tat ca bai</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-label">Danh muc</div>
          <div className="stat-value">{s?.totalCategories ?? 0}</div>
          <div className="stat-sub">{s?.totalTags ?? 0} tags</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✉</div>
          <div className="stat-label">Lien he</div>
          <div className="stat-value">{s?.totalContacts ?? 0}</div>
          {(s?.newContacts ?? 0) > 0 && (
            <div className="stat-sub" style={{ color: 'var(--danger)' }}>{s?.newContacts} moi chua doc</div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-label">Newsletter</div>
          <div className="stat-value">{s?.newsletters ?? 0}</div>
          <div className="stat-sub">Nguoi dang ky nhan bai</div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="table-wrap">
        <div className="table-header">
          <div className="table-title">Bai viet gan day</div>
          <Link to="/posts" className="btn btn-ghost btn-sm">Xem tat ca</Link>
        </div>
        {!s?.recentPosts.length ? (
          <div className="empty-state">
            <div className="empty-state-icon">✍</div>
            <p>Chua co bai viet nao</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tieu de</th>
                <th>Danh muc</th>
                <th>Luot xem</th>
                <th>Trang thai</th>
                <th>Ngay tao</th>
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
                    <span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Da xuat ban' : 'Ban nhap'}</span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Link to={`/posts/${p.id}/edit`} className="btn btn-ghost btn-sm">Sua</Link>
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
