import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  name: string
  category: string
  location: string
  year_completed: string
  area: string
  image: string
  featured: number
  status: string
  sort_order: number
}

const CATEGORIES: Record<string, string> = {
  'dan-dung': 'Dân dụng',
  'cong-nghiep': 'Công nghiệp',
  'thuong-mai': 'Thương mại',
  'biet-thu': 'Biệt thự',
}

export default function ProjectList() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setItems(await api.get<Project[]>('/projects'))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dự án này?')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dự án</div>
          <div className="page-sub">Quản lý danh mục công trình đã thực hiện</div>
        </div>
        <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <div className="empty-state-text">Chưa có dự án nào</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 64 }}>Ảnh</th>
                <th>Tên dự án</th>
                <th>Hạng mục</th>
                <th>Địa điểm</th>
                <th>Năm</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="thumb" />
                    ) : (
                      <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏢</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.area}</div>
                  </td>
                  <td>
                    <span className="badge badge-draft">{CATEGORIES[p.category] ?? p.category}</span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.location}</td>
                  <td style={{ fontSize: 13 }}>{p.year_completed}</td>
                  <td>
                    {p.featured ? <span className="badge badge-published">Có</span> : <span className="badge badge-draft">Không</span>}
                  </td>
                  <td>
                    <span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/projects/${p.id}`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Xóa</button>
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
