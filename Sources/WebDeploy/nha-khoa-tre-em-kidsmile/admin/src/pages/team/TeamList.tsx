import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  specialties: string
  is_active: number
  sort_order: number
}

export default function TeamList() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setDoctors(await api.get<Doctor[]>('/team')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa bác sĩ này?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ bác sĩ</div>
          <div className="page-sub">{doctors.length} bác sĩ</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm bác sĩ</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Họ tên</th>
              <th>Chức danh</th>
              <th>Kinh nghiệm</th>
              <th>Chuyên môn</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doc => (
              <tr key={doc.id}>
                <td>
                  {doc.photo ? (
                    <img src={doc.photo} alt={doc.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      👤
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 500 }}>{doc.name}</td>
                <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{doc.role}</td>
                <td>{doc.experience_years > 0 ? `${doc.experience_years} năm` : '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {doc.specialties ? doc.specialties.split('|').join(', ') : '—'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/team/${doc.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(doc.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {doctors.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍⚕️</div>
            <div className="empty-state-text">Chưa có bác sĩ nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
