import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../api/client'

type Msg = { type: 'success' | 'error'; text: string } | null

export default function Profile() {
  const { user, refreshUser } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameMsg, setNameMsg] = useState<Msg>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<Msg>(null)

  async function handleNameSubmit(e: FormEvent) {
    e.preventDefault()
    setNameMsg(null)
    if (!name.trim()) { setNameMsg({ type: 'error', text: 'Tên không được để trống.' }); return }
    setNameSaving(true)
    try {
      await api.post('/profile/update', { name: name.trim() })
      await refreshUser()
      setNameMsg({ type: 'success', text: 'Đã cập nhật tên hiển thị.' })
    } catch (err) {
      setNameMsg({ type: 'error', text: err instanceof Error ? err.message : 'Cập nhật thất bại.' })
    } finally {
      setNameSaving(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setPwMsg(null)
    if (!currentPassword) { setPwMsg({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' }); return }
    if (newPassword.length < 6) { setPwMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }); return }
    if (newPassword !== confirmPassword) { setPwMsg({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp.' }); return }
    setPwSaving(true)
    try {
      await api.post('/profile/change-password', { current_password: currentPassword, password: newPassword })
      setPwMsg({ type: 'success', text: 'Đổi mật khẩu thành công.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwMsg({ type: 'error', text: err instanceof Error ? err.message : 'Đổi mật khẩu thất bại.' })
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tài khoản</h1>
          <p className="page-sub">Thông tin tài khoản và bảo mật đăng nhập</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, maxWidth: 520 }}>
        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Thông tin tài khoản</h2>
          <p className="page-sub" style={{ marginBottom: 18 }}>
            Email: {user?.email} · Vai trò: {user?.role === 'superadmin' ? 'Quản trị viên' : 'Người dùng'}
          </p>
          <form onSubmit={handleNameSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Tên hiển thị</label>
              <input
                id="profile-name"
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            {nameMsg && <div className={nameMsg.type === 'error' ? 'login-error' : 'login-success'}>{nameMsg.text}</div>}
            <button type="submit" className="btn btn-primary" disabled={nameSaving}>
              {nameSaving ? 'Đang lưu...' : 'Lưu tên'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Đổi mật khẩu</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="current-password">Mật khẩu hiện tại</label>
              <input
                id="current-password"
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">Mật khẩu mới</label>
              <input
                id="new-password"
                type="password"
                className="form-control"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
              <input
                id="confirm-password"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
              />
            </div>
            {pwMsg && <div className={pwMsg.type === 'error' ? 'login-error' : 'login-success'}>{pwMsg.text}</div>}
            <button type="submit" className="btn btn-primary" disabled={pwSaving}>
              {pwSaving ? 'Đang lưu...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
