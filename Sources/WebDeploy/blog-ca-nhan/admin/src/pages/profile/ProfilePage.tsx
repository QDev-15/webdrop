import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

export default function ProfilePage() {
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (password.length < 6) {
      setMsg({ type: 'error', text: 'Mat khau phai co it nhat 6 ky tu.' })
      return
    }
    if (password !== confirm) {
      setMsg({ type: 'error', text: 'Mat khau xac nhan khong khop.' })
      return
    }
    setSaving(true)
    try {
      await api.post(`/users/${user!.id}/change-password`, { password })
      setMsg({ type: 'success', text: 'Doi mat khau thanh cong!' })
      setPassword('')
      setConfirm('')
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Doi mat khau that bai.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 0' }}>
      <div className="page-header">
        <div>
          <div className="page-title">Tai khoan cua toi</div>
          <div className="page-sub">Thong tin tai khoan va doi mat khau</div>
        </div>
      </div>

      {/* Account info */}
      <div className="form-card" style={{ marginBottom: '16px' }}>
        <div className="form-section-title">Thong tin tai khoan</div>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <div className="form-label" style={{ marginBottom: '4px' }}>Ho ten</div>
            <div style={{ fontWeight: '500', color: 'var(--text)' }}>{user?.name}</div>
          </div>
          <div>
            <div className="form-label" style={{ marginBottom: '4px' }}>Email</div>
            <div style={{ fontWeight: '500', color: 'var(--text)' }}>{user?.email}</div>
          </div>
          <div>
            <div className="form-label" style={{ marginBottom: '4px' }}>Vai tro</div>
            <span className="badge badge-published">
              {user?.role === 'superadmin' ? 'Quan tri vien' : 'Nguoi dung'}
            </span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="form-card">
        <div className="form-section-title">Doi mat khau</div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Mat khau moi <span className="req">*</span></label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Toi thieu 6 ky tu"
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Xac nhan mat khau <span className="req">*</span></label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Nhap lai mat khau moi"
              required
            />
          </div>
          {msg && (
            <div className={`alert alert-${msg.type}`}>{msg.text}</div>
          )}
          <button type="submit" className="btn btn-accent" disabled={saving}>
            {saving ? 'Dang luu...' : 'Doi mat khau'}
          </button>
        </form>
      </div>
    </div>
  )
}
