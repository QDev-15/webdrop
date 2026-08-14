import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  role: string
  image: string
  experience: string
  cert?: string
  specialties?: string
}

export default function TeamList() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.get<TeamMember[]>('/team')
      setItems(data)
      setError('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa thành viên này?')) return
    try {
      await api.delete(`/team/${id}`)
      load()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ</div>
          <div className="page-sub">Quản lý giảng viên và nhân viên</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm thành viên</Link>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '12px', background: '#ffe4e4', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Chưa có thành viên nào</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Chức vụ</th>
                <th>Kinh nghiệm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontSize: '18px' }}>{item.image ? '📷' : '❌'}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.role}</td>
                  <td>{item.experience || '—'}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/team/${item.id}`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
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
