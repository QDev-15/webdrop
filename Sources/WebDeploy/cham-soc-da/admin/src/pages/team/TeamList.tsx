import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number; name: string; role: string; speciality: string; experience: string; image: string; sort_order: number; is_active: number
}

export default function TeamList() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  function load() {
    api.get<TeamMember[]>('/team')
      .then(setItems)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('Xoá bác sĩ này?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Đội ngũ bác sĩ</h1>
          <p className="page-sub">Quản lý thông tin bác sĩ tại phòng khám</p>
        </div>
        <Link to="/team/new" className="btn btn-primary">+ Thêm bác sĩ</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Ảnh</th><th>Tên bác sĩ</th><th>Chức danh</th><th>Chuyên môn</th><th>Kinh nghiệm</th><th>Hiển thị</th><th></th></tr>
        </thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={7} className="table-empty">Chưa có bác sĩ nào.</td></tr>}
          {items.map(m => (
            <tr key={m.id}>
              <td>{m.image && <img src={m.image} alt={m.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}</td>
              <td>{m.name}</td>
              <td>{m.role}</td>
              <td>{m.speciality}</td>
              <td>{m.experience}</td>
              <td><span className={`status-badge ${m.is_active ? 'done' : 'cancelled'}`}>{m.is_active ? 'Hiển thị' : 'Ẩn'}</span></td>
              <td className="table-actions">
                <button className="btn-icon" onClick={() => navigate(`/team/${m.id}/edit`)}>✎</button>
                <button className="btn-icon danger" onClick={() => handleDelete(m.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
