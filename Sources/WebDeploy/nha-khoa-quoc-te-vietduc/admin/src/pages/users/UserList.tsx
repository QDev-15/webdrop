import { useState, useEffect } from 'react'
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
  const [items, setItems]     = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<User[]>('/users')) }
    finally { setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setSaving(true)
    try {
      await api.post('/users', form)
      setForm({ name: '', email: '', password: '', role: 'user' })
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tạo tài khoản thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (id === me?.id) { alert('Không thể xóa tài khoản đang đăng nhập.'); return }
    if (!confirm('Xóa tài khoản này?')) return
    await api.delete(`/users/${id}`)
    load()
  }

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Người Dùng</h1>
          <p className="adm-page-sub">{items.length} tài khoản</p>
        </div>
        {me?.role === 'superadmin' && (
          <button onClick={() => setShowForm(s => !s)} className="adm-btn-primary">+ Thêm tài khoản</button>
        )}
      </div>

      {showForm && (
        <div className="adm-form" style={{ maxWidth: 480, marginBottom: 24, padding: 24, border: '1px solid var(--border)', borderRadius: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Thêm tài khoản mới</h2>
          {error && <div className="adm-alert adm-alert-error">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="adm-field">
              <label className="adm-label">Họ tên *</label>
              <input className="adm-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="adm-field">
              <label className="adm-label">Email *</label>
              <input type="email" className="adm-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="adm-field">
              <label className="adm-label">Mật khẩu *</label>
              <input type="password" className="adm-input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <div className="adm-field">
              <label className="adm-label">Vai trò</label>
              <select className="adm-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="user">Người dùng</option>
                <option value="superadmin">Quản trị viên</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="adm-btn-ghost">Hủy</button>
              <button type="submit" className="adm-btn-primary" disabled={saving}>{saving ? 'Đang tạo...' : 'Tạo tài khoản'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: u.id === me?.id ? 700 : 500 }}>
                  {u.name} {u.id === me?.id && <span style={{ fontSize: 11, color: 'var(--accent)' }}>(bạn)</span>}
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{u.email}</td>
                <td>
                  <span className={`adm-badge ${u.role === 'superadmin' ? 'blue' : 'green'}`}>
                    {u.role === 'superadmin' ? 'Quản trị' : 'Người dùng'}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                <td>
                  {u.id !== me?.id && me?.role === 'superadmin' && (
                    <button onClick={() => handleDelete(u.id)} className="adm-btn-danger adm-btn-sm">Xóa</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="adm-empty">Không có tài khoản nào.</p>}
      </div>
    </div>
  )
}
