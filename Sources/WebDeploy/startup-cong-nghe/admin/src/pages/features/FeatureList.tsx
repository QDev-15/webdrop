import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Feature { id: number; name: string; tag: string; icon: string; featured: number; sort_order: number; status: string }

export default function FeatureList() {
  const [items, setItems]     = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Feature[]>('/features')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa tính năng này?')) return
    await api.delete(`/features/${id}`)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tính năng sản phẩm</h1>
          <p className="page-sub">Quản lý tính năng hiển thị trên trang Sản phẩm</p>
        </div>
        <Link to="/features/new" className="btn btn-primary">+ Thêm tính năng</Link>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">⚙</div><div className="empty-state-text">Chưa có tính năng nào</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Icon</th><th>Tên tính năng</th><th>Tag</th><th>Nổi bật</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontSize: 22 }}>{item.icon}</td>
                    <td><strong>{item.name}</strong></td>
                    <td className="td-muted">{item.tag}</td>
                    <td>{item.featured ? <span className="badge badge-published">Nổi bật</span> : <span className="badge badge-draft">Thường</span>}</td>
                    <td className="td-muted">{item.sort_order}</td>
                    <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/features/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
