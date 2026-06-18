'use client'
import AdminLayout from '@/components/admin/AdminLayout'
import { useState, useEffect, FormEvent } from 'react'

interface UserProfile {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid var(--border)', background: 'var(--bg)',
  fontSize: 13, fontFamily: 'var(--sans)', outline: 'none',
  color: 'var(--text)', boxSizing: 'border-box',
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [name, setName] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    fetch('/api/admin/profile')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setName(data.user.name)
        }
        setLoading(false)
      })
      .catch((status) => {
        setFetchError(status === 401 ? 'Phiên đăng nhập hết hạn' : 'Lỗi tải thông tin tài khoản')
        setLoading(false)
      })
  }, [])

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSavingProfile(true)
    setProfileMsg(null)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        setUser(prev => prev ? { ...prev, name: name.trim() } : prev)
        sessionStorage.setItem('wd_admin_profile', JSON.stringify({ ...(user || {}), name: name.trim() }))
        setProfileMsg({ type: 'ok', text: 'Đã lưu tên hiển thị' })
      } else {
        const d = await res.json()
        setProfileMsg({ type: 'err', text: d.error || 'Lỗi cập nhật' })
      }
    } catch {
      setProfileMsg({ type: 'err', text: 'Lỗi kết nối server' })
    } finally { setSavingProfile(false) }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    if (!currentPw || !newPw || !confirmPw) {
      setPwMsg({ type: 'err', text: 'Vui lòng điền đầy đủ các trường' })
      return
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'err', text: 'Mật khẩu mới không khớp' })
      return
    }
    setSavingPw(true)
    setPwMsg(null)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      if (res.ok) {
        setCurrentPw('')
        setNewPw('')
        setConfirmPw('')
        setPwMsg({ type: 'ok', text: 'Đã đổi mật khẩu thành công' })
      } else {
        const d = await res.json()
        setPwMsg({ type: 'err', text: d.error || 'Lỗi đổi mật khẩu' })
      }
    } catch {
      setPwMsg({ type: 'err', text: 'Lỗi kết nối server' })
    } finally { setSavingPw(false) }
  }

  if (loading) {
    return (
      <AdminLayout title="Hồ sơ cá nhân">
        <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
      </AdminLayout>
    )
  }

  if (fetchError) {
    return (
      <AdminLayout title="Hồ sơ cá nhân">
        <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--danger)', fontSize: 14 }}>{fetchError}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Hồ sơ cá nhân">
      <div style={{ maxWidth: 640 }}>

        {/* Avatar + info card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 32px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-light)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
            {user ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>{user?.name || '—'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 3 }}>{user?.email}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 5, background: user?.role === 'superadmin' ? 'var(--accent-light)' : 'var(--warm)', color: user?.role === 'superadmin' ? 'var(--accent)' : 'var(--text-2)' }}>
                {user?.role === 'superadmin' ? 'Super Admin' : 'User'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                Tham gia {user ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit name */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Thông tin tài khoản</div>
          <form onSubmit={handleSaveProfile}>
            <div className="row g-3">
              <div className="col-12">
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Tên hiển thị</label>
                <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
              </div>
              <div className="col-12">
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Email</label>
                <input value={user?.email || ''} disabled style={{ ...inputStyle, opacity: .55, cursor: 'not-allowed' }} />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Email không thể thay đổi</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              {profileMsg && (
                <span style={{ fontSize: 13, color: profileMsg.type === 'ok' ? 'var(--accent)' : 'var(--danger)' }}>
                  {profileMsg.type === 'ok' ? '✓ ' : '✕ '}{profileMsg.text}
                </span>
              )}
              <button type="submit" disabled={savingProfile}
                style={{ marginLeft: 'auto', padding: '9px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: savingProfile ? 'not-allowed' : 'pointer', opacity: savingProfile ? .7 : 1 }}>
                {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>

        {/* Change password */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Đổi mật khẩu</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>Để trống nếu không muốn thay đổi mật khẩu</div>
          <form onSubmit={handleChangePassword}>
            <div className="row g-3">
              <div className="col-12">
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Mật khẩu hiện tại</label>
                <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} style={inputStyle} autoComplete="current-password" />
              </div>
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Mật khẩu mới</label>
                <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} style={inputStyle} autoComplete="new-password" />
              </div>
              <div className="col-md-6">
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Xác nhận mật khẩu mới</label>
                <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} style={inputStyle} autoComplete="new-password" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              {pwMsg && (
                <span style={{ fontSize: 13, color: pwMsg.type === 'ok' ? 'var(--accent)' : 'var(--danger)' }}>
                  {pwMsg.type === 'ok' ? '✓ ' : '✕ '}{pwMsg.text}
                </span>
              )}
              <button type="submit" disabled={savingPw}
                style={{ marginLeft: 'auto', padding: '9px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: savingPw ? 'not-allowed' : 'pointer', opacity: savingPw ? .7 : 1 }}>
                {savingPw ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </AdminLayout>
  )
}
