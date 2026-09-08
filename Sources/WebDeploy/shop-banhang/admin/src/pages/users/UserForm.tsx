import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface UserData { id: number; name: string; email: string; role: string }

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    // GET /users trả mảng — không có endpoint show riêng theo id
    api.get<UserData[]>('/users').then(list => {
      const u = list.find(x => x.id === Number(id))
      if (u) { setName(u.name); setEmail(u.email); setRole(u.role) }
      else setError('Không tìm thấy tài khoản.')
    }).finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, { name, role })
      } else {
        if (!password || password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); setSaving(false); return }
        await api.post('/users', { name, email, password, role })
      }
      navigate('/users')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa tài khoản' : 'Thêm tài khoản'}</div></div>
        <button onClick={() => navigate('/users')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="uf-name">Tên</label>
          <input id="uf-name" className="form-control" value={name} onChange={e => setName(e.target.value)} required placeholder="Nhập tên nhân viên" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="uf-email">Email đăng nhập</label>
          <input id="uf-email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required disabled={isEdit} placeholder="vd: nv02@pos-banhang.local" />
        </div>
        {!isEdit && (
          <div className="form-group">
            <label className="form-label" htmlFor="uf-password">Mật khẩu</label>
            <input id="uf-password" type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Tối thiểu 6 ký tự" />
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="uf-role">Vai trò</label>
          <select id="uf-role" className="form-control" value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">Thu ngân — chỉ vào được POS bán hàng</option>
            <option value="superadmin">Quản lý — toàn quyền quản trị</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/users')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
