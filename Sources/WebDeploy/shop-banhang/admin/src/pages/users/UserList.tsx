import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

interface User { id: number; name: string; email: string; role: string; created_at: string }

const ROLE_LABELS: Record<string, string> = { superadmin: 'Quản lý', user: 'Thu ngân' }

export default function UserList() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setUsers(await api.get<User[]>('/users')) } finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Bạn chắc chắn muốn xóa tài khoản này?')) return
    try { await api.delete(`/users/${id}`); load() }
    catch (err: unknown) { alert(err instanceof Error ? err.message : 'Xóa thất bại.') }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tài khoản</div>
          <div className="page-sub">{users.length} tài khoản — quản lý & thu ngân</div>
        </div>
        <Link to="/users/new" className="btn-accent">+ Thêm tài khoản</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Tên</th><th>Email</th><th>Vai trò</th><th>Ngày tạo</th><th>Hành động</th></tr></thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Chưa có tài khoản nào</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge">{ROLE_LABELS[u.role] ?? u.role}</span></td>
                <td>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  <Link to={`/users/${u.id}`} className="btn-ghost btn-sm">Sửa</Link>
                  {u.id !== me?.id && <button className="btn-ghost btn-sm" onClick={() => handleDelete(u.id)}>Xóa</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
