import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

interface User { id: number; name: string; email: string; role: string; created_at: string }

export default function UserList() {
  const { user: me } = useAuth()
  const [items, setItems] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<User[]>('/users').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Tài khoản</div><div className="page-subtitle">Quản lý người dùng admin</div></div>
        {me?.role === 'superadmin' && <Link to="/users/new" className="btn-accent">+ Thêm tài khoản</Link>}
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Ngày tạo</th><th>Hành động</th></tr></thead>
            <tbody>
              {items.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}{u.id === me?.id && <span style={{ fontSize: '10px', color: 'var(--accent)', marginLeft: '6px' }}>(bạn)</span>}</td>
                  <td style={{ color: 'var(--text-2)' }}>{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'superadmin' ? 'published' : 'draft'}`}><span className="badge-dot" />{u.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}</span></td>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                  <td><div className="td-actions">
                    {me?.role === 'superadmin' && <Link to={`/users/${u.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>}
                    {me?.role === 'superadmin' && u.id !== me.id && (
                      <button onClick={async () => { if (confirm('Xóa tài khoản này?')) { await api.delete(`/users/${u.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
                    )}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
