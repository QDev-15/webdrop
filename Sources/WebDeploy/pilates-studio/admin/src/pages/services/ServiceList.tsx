import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  slug: string
  category_name: string
  level: string
  duration_min: number
  price_per_session: number
  tag: string
  is_featured: number
  sort_order: number
  image_url: string
}

export default function ServiceList() {
  const [items, setItems]     = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Service[]>('/services')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lớp học này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Lớp học</div>
          <div className="page-sub">{items.length} lớp học</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm lớp học</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên lớp</th>
              <th>Danh mục</th>
              <th>Cấp độ</th>
              <th>Thời lượng</th>
              <th>Giá/buổi</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s.id}>
                <td>
                  {s.image_url
                    ? <img src={s.image_url} alt={s.name} className="thumb" />
                    : <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧘</div>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  {s.tag && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.tag}</div>}
                  {s.is_featured ? <span className="badge badge-confirmed" style={{ marginTop: 2 }}>Nổi bật</span> : null}
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.category_name ?? '—'}</td>
                <td style={{ fontSize: 13 }}>{s.level ?? '—'}</td>
                <td style={{ fontSize: 13 }}>{s.duration_min ? `${s.duration_min} phút` : '—'}</td>
                <td style={{ fontSize: 13 }}>{s.price_per_session ? s.price_per_session.toLocaleString('vi-VN') + 'đ' : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && (
          <div className="empty-state">
            <div className="empty-state-icon">🧘</div>
            <div className="empty-state-text">Chưa có lớp học nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
