import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

export default function UserList() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setUsers(await api.get<User[]>('/users'))
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa người dùng này?')) return
    await api.delete(`/users/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Người dùng</div>
          <div className="page-sub">Quản lý tài khoản quản trị viên</div>
        </div>
        {currentUser?.role === 'superadmin' && (
          <Link to="/users/new" className="btn-accent">+ Thêm người dùng</Link>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th style={{ width: 140 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500 }}>{u.name}</td>
                <td style={{ fontSize: 13 }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'superadmin' ? 'badge-published' : 'badge-read'}`}>
                    {u.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {new Date(u.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/users/${u.id}`} className="btn-ghost btn-sm">Sửa</Link>
                    {currentUser?.role === 'superadmin' && u.id !== currentUser.id && (
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Xóa</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
