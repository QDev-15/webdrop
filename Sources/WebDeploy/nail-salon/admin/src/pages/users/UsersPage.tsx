import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

interface User { id: number; name: string; email: string; role: string; created_at: string }
const blankNew = { name: '', email: '', password: '', role: 'user' }

export default function UsersPage() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState(blankNew)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  function isSuperAdmin() { return me?.role === 'superadmin' }

  function load() {
    api.get<User[]>('/users').then(data => { setUsers(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  function setA(key: string, v: string) { setAddForm(f => ({ ...f, [key]: v })) }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setAdding(true); setError('')
    try {
      await api.post('/users', addForm)
      setAddForm(blankNew); setShowAdd(false); load()
      setMsg('Đã thêm tài khoản.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
    setAdding(false)
  }

  function startEdit(u: User) { setEditId(u.id); setEditName(u.name); setEditRole(u.role); setError('') }
  function cancelEdit() { setEditId(null) }

  async function handleUpdate(id: number) {
    setSaving(true); setError('')
    try {
      await api.put(`/users/${id}`, { name: editName, role: editRole })
      setEditId(null); load(); setMsg('Đã cập nhật.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
    setSaving(false)
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa tài khoản "${name}"?`)) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi') }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Quản lý tài khoản</div>
          <div className="page-sub">Danh sách người dùng admin</div>
        </div>
        {isSuperAdmin() && (
          <button className="btn-accent" onClick={() => { setShowAdd(!showAdd); setError('') }}>
            {showAdd ? 'Đóng' : '+ Thêm tài khoản'}
          </button>
        )}
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Form thêm tài khoản */}
      {showAdd && isSuperAdmin() && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Tạo tài khoản mới</div>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Họ tên *</label>
                <input className="form-control" value={addForm.name} onChange={e => setA('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className="form-control" value={addForm.email} onChange={e => setA('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu *</label>
                <input type="password" className="form-control" value={addForm.password} onChange={e => setA('password', e.target.value)} required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Quyền</label>
                <select className="form-control" value={addForm.role} onChange={e => setA('role', e.target.value)}>
                  <option value="user">User</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-accent" disabled={adding}>{adding ? 'Đang tạo...' : 'Tạo tài khoản'}</button>
              <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Họ tên</th><th>Email</th><th>Quyền</th><th>Ngày tạo</th><th></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  {editId === u.id
                    ? <input className="form-control" style={{ fontSize: 13 }} value={editName} onChange={e => setEditName(e.target.value)} />
                    : <span style={{ fontWeight: 500 }}>{u.name}{u.id === me?.id ? <span style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 6 }}>(bạn)</span> : null}</span>}
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{u.email}</td>
                <td>
                  {editId === u.id && isSuperAdmin()
                    ? <select className="form-control" style={{ fontSize: 13 }} value={editRole} onChange={e => setEditRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    : <span className={`badge-${u.role === 'superadmin' ? 'superadmin' : 'user'}`} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 5,
                        background: u.role === 'superadmin' ? 'var(--accent-light)' : 'var(--warm)',
                        color: u.role === 'superadmin' ? 'var(--accent)' : 'var(--text-2)',
                        fontWeight: 600,
                      }}>{u.role}</span>}
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  {editId === u.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-accent btn-sm" onClick={() => handleUpdate(u.id)} disabled={saving}>{saving ? '...' : 'Lưu'}</button>
                      <button className="btn-ghost btn-sm" onClick={cancelEdit}>Hủy</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost btn-sm" onClick={() => startEdit(u)}>Sửa</button>
                      {isSuperAdmin() && u.id !== me?.id && (
                        <button className="btn-danger btn-sm" onClick={() => handleDelete(u.id, u.name)}>Xóa</button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
