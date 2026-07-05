import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Doctor {
  id: number
  name: string
  role: string
  photo: string
  experience_years: number
  specialties: string
  tag: string
  sort_order: number
}

export default function TeamList() {
  const [items, setItems] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Doctor[]>('/team').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa bác sĩ này?')) return
    await api.post(`/team/${id}/delete`, {})
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ bác sĩ</div>
          <div className="page-subtitle">Quản lý bác sĩ chuyên khoa nha khoa</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm bác sĩ</Link>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Họ tên</th>
                <th>Chuyên khoa</th>
                <th>Kinh nghiệm</th>
                <th>Tag</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(d => (
                <tr key={d.id}>
                  <td>
                    {d.photo && (
                      <img src={d.photo} alt={d.name} loading="lazy" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{d.name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{d.role}</td>
                  <td style={{ color: 'var(--text-2)' }}>{d.experience_years} năm</td>
                  <td>{d.tag && <span className="badge badge-published"><span className="badge-dot" />{d.tag}</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/team/${d.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(d.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
