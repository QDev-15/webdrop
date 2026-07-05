import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  flag: string
  experience_years: number
  tags: string[]
  is_active: number
  sort_order: number
}

export default function TeamList() {
  const [items, setItems]     = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Doctor[]>('/team')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa bác sĩ này?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  const filtered = filter ? items.filter(d => d.flag === filter) : items

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Đội Ngũ Bác Sĩ</h1>
          <p className="adm-page-sub">{items.length} bác sĩ</p>
        </div>
        <Link to="/team/new" className="adm-btn-primary">+ Thêm bác sĩ</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['', 'Trong nuoc', 'Quoc te'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? 'adm-btn-primary adm-btn-sm' : 'adm-btn-ghost adm-btn-sm'}
          >
            {f === '' ? 'Tất cả' : f === 'Trong nuoc' ? 'Trong nước' : 'Quốc tế'} ({items.filter(d => f === '' || d.flag === f).length})
          </button>
        ))}
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Chức danh</th>
              <th>Phân loại</th>
              <th>Kinh nghiệm</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{d.role || '—'}</td>
                <td>
                  <span className={`adm-badge ${d.flag === 'Quoc te' ? 'blue' : 'green'}`}>
                    {d.flag === 'Quoc te' ? 'Quốc tế' : 'Trong nước'}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>{d.experience_years > 0 ? `${d.experience_years} năm` : '—'}</td>
                <td><span className={`adm-badge ${d.is_active ? 'active' : 'inactive'}`}>{d.is_active ? 'Hiện' : 'Ẩn'}</span></td>
                <td>
                  <Link to={`/team/${d.id}/edit`} className="adm-btn-ghost adm-btn-sm">Sửa</Link>
                  {' '}
                  <button onClick={() => handleDelete(d.id)} className="adm-btn-danger adm-btn-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="adm-empty">Không có bác sĩ nào.</p>}
      </div>
    </div>
  )
}
