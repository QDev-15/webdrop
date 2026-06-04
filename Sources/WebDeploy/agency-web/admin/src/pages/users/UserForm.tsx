import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface UserData { name: string; email: string; role: string; password?: string }
interface User extends UserData { id: number }

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<UserData>({ name: '', email: '', role: 'user', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<User[]>('/users').then(arr => {
      const found = arr.find(u => u.id === Number(id))
      if (found) setForm({ name: found.name, email: found.email, role: found.role })
    }).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.email.trim()) { setError('Email không được để trống.'); return }
    if (!isEdit && (!form.password || form.password.length < 6)) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return }
    setSaving(true); setError('')
    try {
      isEdit ? await api.put(`/users/${id}`, { name: form.name, email: form.email, role: form.role }) : await api.post('/users', form)
      navigate('/users')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}</div></div>
        <button onClick={() => navigate('/users')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '480px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ tên</label>
            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          {!isEdit && (
            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Tối thiểu 6 ký tự" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Vai trò</label>
            <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="user">Người dùng</option>
              <option value="superadmin">Quản trị viên</option>
            </select>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" onClick={() => navigate('/users')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
