import { useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setAlert('')
    try {
      const body: Record<string, string> = { name }
      if (oldPw && newPw) { body.old_password = oldPw; body.new_password = newPw }
      await api.post('/auth/profile', body)
      setAlert('success:Đã cập nhật thông tin thành công.')
      setOldPw(''); setNewPw('')
    } catch (err: unknown) {
      setAlert('error:' + (err instanceof Error ? err.message : 'Lỗi khi lưu'))
    } finally { setSaving(false) }
  }

  const alertType = alert.startsWith('success:') ? 'success' : 'error'
  const alertMsg  = alert.replace(/^(success:|error:)/, '')

  return (
    <>
      <div className="page-hdr"><h1>Tài khoản của tôi</h1></div>
      {alert && <div className={`alert alert-${alertType}`}>{alertMsg}</div>}
      <div className="form-card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Họ tên</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.name || ''} disabled style={{ opacity: 0.5 }} />
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '14px' }}>Để trống nếu không muốn đổi mật khẩu</p>
          <div className="form-group">
            <label className="form-label">Mật khẩu hiện tại</label>
            <input className="form-input" type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu mới</label>
            <input className="form-input" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </>
  )
}
