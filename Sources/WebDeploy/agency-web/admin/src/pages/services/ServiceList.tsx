import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service { id: number; name: string; icon: string; description: string; featured: number; sort_order: number; status: string }

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<Service[]>('/services').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Dịch vụ</div><div className="page-subtitle">Quản lý danh sách dịch vụ</div></div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">⚡</div><div className="empty-state-text">Chưa có dịch vụ nào.</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Icon</th><th>Tên dịch vụ</th><th>Mô tả</th><th>Nổi bật</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontSize: '20px' }}>{item.icon || '🌐'}</td>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: 'var(--text-2)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</td>
                    <td>{item.featured ? '✓' : '—'}</td>
                    <td><span className={`badge badge-${item.status}`}><span className="badge-dot" />{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td><div className="td-actions">
                      <Link to={`/services/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/services/${item.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
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
