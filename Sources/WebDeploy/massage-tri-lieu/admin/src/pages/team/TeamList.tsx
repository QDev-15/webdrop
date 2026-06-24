import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Therapist {
  id: number
  name: string
  specialty: string
  experience: string
  image: string
  sort_order: number
  active: number
}

export default function TeamList() {
  const [items, setItems] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Therapist[]>('/team').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa chuyên viên này?')) return
    try { await api.delete(`/team/${id}`); load() } catch {}
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ chuyên viên</div>
          <div className="page-sub">Quản lý các chuyên viên trị liệu</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm chuyên viên</Link>
      </div>

      {loading ? <div style={{ color: 'var(--text-3)' }}>Đang tải...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>ID</th><th>Ảnh</th><th>Tên</th><th>Chuyên môn</th><th>Kinh nghiệm</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>
                    {t.image ? (
                      <img src={t.image} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : <span style={{ color: 'var(--text-3)' }}>—</span>}
                  </td>
                  <td style={{ fontWeight: 500 }}>{t.name}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{t.specialty}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.experience}</td>
                  <td>{t.sort_order}</td>
                  <td><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: t.active ? 'var(--accent-light)' : 'var(--warm)', color: t.active ? 'var(--accent)' : 'var(--text-3)' }}>{t.active ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/team/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Xóa</button>
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
