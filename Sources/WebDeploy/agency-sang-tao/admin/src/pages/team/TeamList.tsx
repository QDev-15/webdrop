import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Member {
  id: number
  name: string
  position: string
  avatar: string
  experience: string
  sort_order: number
  status: string
}

export default function TeamList() {
  const [items, setItems]     = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Member[]>('/team-members').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa thành viên này?')) return
    await api.delete(`/team-members/${id}`)
    load()
  }

  return (
    <AdminLayout title="Đội ngũ">
      <div className="page-header">
        <div>
          <h1 className="page-title">Đội ngũ</h1>
          <p className="page-sub">Quản lý thành viên team</p>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm thành viên</Link>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Avatar</th><th>Tên</th><th>Chức vụ</th><th>Kinh nghiệm</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.avatar ? <img src={item.avatar} alt="" className="thumb" style={{ borderRadius: '50%' }} /> : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warm)' }} />}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.position}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.experience}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/team/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có thành viên nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
