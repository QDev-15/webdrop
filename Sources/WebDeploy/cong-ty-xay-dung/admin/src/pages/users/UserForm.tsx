import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface UserForm {
  name: string
  email: string
  password: string
  role: string
}

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<UserForm>({ name: '', email: '', password: '', role: 'user' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<(UserForm & { id: number })[]>('/users').then(arr => {
        const found = arr.find(u => u.id === Number(id))
        if (found) setForm({ name: found.name, email: found.email, password: '', role: found.role })
      }).catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof UserForm, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, { name: form.name, email: form.email, role: form.role })
      } else {
        await api.post('/users', form)
      }
      navigate('/users')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/users')}>Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Họ tên *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          {!isEdit && (
            <div className="form-group">
              <label className="form-label">Mật khẩu *</label>
              <input type="password" className="form-control" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Vai trò</label>
            <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="user">Người dùng</option>
              <option value="superadmin">Quản trị viên</option>
            </select>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/users')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
