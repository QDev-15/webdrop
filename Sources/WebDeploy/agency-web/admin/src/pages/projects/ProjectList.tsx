import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project { id: number; title: string; category: string; client: string; featured: number; status: string; image: string }

export default function ProjectList() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<Project[]>('/projects').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const catLabels: Record<string, string> = { web: 'Website', app: 'App', brand: 'Thương hiệu' }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Dự án / Portfolio</div><div className="page-subtitle">Quản lý danh mục dự án</div></div>
        <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">💼</div><div className="empty-state-text">Chưa có dự án nào.</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Ảnh</th><th>Tên dự án</th><th>Danh mục</th><th>Khách hàng</th><th>Nổi bật</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.image && <img src={item.image} alt={item.title} style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />}</td>
                    <td style={{ fontWeight: 500 }}>{item.title}</td>
                    <td>{catLabels[item.category] || item.category || '—'}</td>
                    <td style={{ color: 'var(--text-2)' }}>{item.client || '—'}</td>
                    <td>{item.featured ? '★' : '—'}</td>
                    <td><span className={`badge badge-${item.status}`}><span className="badge-dot" />{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td><div className="td-actions">
                      <Link to={`/projects/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/projects/${item.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}
