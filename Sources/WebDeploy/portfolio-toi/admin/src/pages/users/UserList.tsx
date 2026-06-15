import { useEffect, useState } from 'react'
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
  const { user: me } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    try { setUsers(await api.get<User[]>('/users')) }
    finally { setLoading(false) }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await api.post('/users', form)
      setForm({ name: '', email: '', password: '', role: 'user' })
      setShowAdd(false)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Thêm thất bại.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa người dùng này?')) return
    try { await api.delete(`/users/${id}`); load() }
    catch (err: unknown) { alert(err instanceof Error ? err.message : 'Xóa thất bại.') }
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('vi-VN')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Người dùng</div>
          <div className="page-sub">Quản lý tài khoản admin</div>
        </div>
        {me?.role === 'superadmin' && (
          <button onClick={() => setShowAdd(!showAdd)} className="btn-accent">+ Thêm người dùng</button>
        )}
      </div>

      {showAdd && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Thêm tài khoản mới</div>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label className="form-label">Họ tên</label>
                <input type="text" className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" required />
              </div>
              <div>
                <label className="form-label">Mật khẩu</label>
                <input type="password" className="form-control" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Tối thiểu 6 ký tự" required />
              </div>
              <div>
                <label className="form-label">Vai trò</label>
                <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="user">Người dùng</option>
                  <option value="superadmin">Quản trị viên</option>
                </select>
              </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Thêm tài khoản'}</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost">Hủy</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'superadmin' ? 'badge-confirmed' : 'badge-read'}`}>
                      {u.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmt(u.created_at)}</td>
                  <td>
                    {me?.role === 'superadmin' && u.id !== me.id && (
                      <button onClick={() => handleDelete(u.id)} className="btn-danger btn-sm">Xóa</button>
                    )}
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
