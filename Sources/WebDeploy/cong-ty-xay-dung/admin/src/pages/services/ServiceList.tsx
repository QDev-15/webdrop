import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  image: string
  sort_order: number
  featured: number
  status: string
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setItems(await api.get<Service[]>('/services'))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ</div>
          <div className="page-sub">Quản lý danh sách dịch vụ xây dựng</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏗</div>
          <div className="empty-state-text">Chưa có dịch vụ nào</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 64 }}>Ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Mô tả</th>
                <th>Nổi bật</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id}>
                  <td>
                    {s.image ? (
                      <img src={s.image} alt={s.name} className="thumb" />
                    ) : (
                      <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏗</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{s.name}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.description?.substring(0, 80)}...</div>
                  </td>
                  <td>
                    {s.featured ? <span className="badge badge-published">Có</span> : <span className="badge badge-draft">Không</span>}
                  </td>
                  <td>{s.sort_order}</td>
                  <td>
                    <span className={`badge badge-${s.status}`}>{s.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/services/${s.id}`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
