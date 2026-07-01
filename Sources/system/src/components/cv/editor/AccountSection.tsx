'use client'

import { useState, useEffect } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 11px', border: '1px solid #e8e5df', borderRadius: 8,
  fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none',
  boxSizing: 'border-box', color: '#1a1917', background: '#fff',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6760', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function StatusMsg({ type, msg }: { type: 'ok' | 'err'; msg: string }) {
  return (
    <div style={{ fontSize: 13, padding: '9px 12px', borderRadius: 8, marginBottom: 12, background: type === 'ok' ? '#e8f4ef' : '#fef2f2', color: type === 'ok' ? '#1a6b52' : '#e24b4a' }}>
      {type === 'ok' ? '✓ ' : '✕ '}{msg}
    </div>
  )
}

export default function AccountSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [infoStatus, setInfoStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [savingInfo, setSavingInfo] = useState(false)

  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdStatus, setPwdStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null)
  const [savingPwd, setSavingPwd] = useState(false)

  useEffect(() => {
    fetch('/api/cv/account').then(r => r.json()).then(d => {
      if (d.user) { setName(d.user.name); setEmail(d.user.email) }
    })
  }, [])

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault()
    setSavingInfo(true); setInfoStatus(null)
    try {
      const res = await fetch('/api/cv/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const d = await res.json()
      if (!res.ok) { setInfoStatus({ type: 'err', msg: d.error }); return }
      setInfoStatus({ type: 'ok', msg: 'Đã cập nhật thông tin' })
    } catch {
      setInfoStatus({ type: 'err', msg: 'Lỗi kết nối' })
    } finally { setSavingInfo(false) }
  }

  async function savePwd(e: React.FormEvent) {
    e.preventDefault()
    if (newPwd !== confirmPwd) { setPwdStatus({ type: 'err', msg: 'Mật khẩu xác nhận không khớp' }); return }
    setSavingPwd(true); setPwdStatus(null)
    try {
      const res = await fetch('/api/cv/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      })
      const d = await res.json()
      if (!res.ok) { setPwdStatus({ type: 'err', msg: d.error }); return }
      setPwdStatus({ type: 'ok', msg: 'Đã đổi mật khẩu thành công' })
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
    } catch {
      setPwdStatus({ type: 'err', msg: 'Lỗi kết nối' })
    } finally { setSavingPwd(false) }
  }

  return (
    <div>
      {/* Profile info */}
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1917', marginBottom: 16 }}>Thông tin tài khoản</div>
      <form onSubmit={saveInfo}>
        <Field label="Họ và tên">
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required />
        </Field>
        <Field label="Email">
          <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </Field>
        {infoStatus && <StatusMsg {...infoStatus} />}
        <button type="submit" disabled={savingInfo}
          style={{ padding: '9px 20px', background: savingInfo ? '#a09d97' : '#1a6b52', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: savingInfo ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: 28 }}>
          {savingInfo ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </form>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e8e5df', marginBottom: 24 }} />

      {/* Change password */}
      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1917', marginBottom: 16 }}>Đổi mật khẩu</div>
      <form onSubmit={savePwd}>
        <Field label="Mật khẩu hiện tại">
          <input style={inputStyle} type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} required autoComplete="current-password" />
        </Field>
        <Field label="Mật khẩu mới (tối thiểu 6 ký tự)">
          <input style={inputStyle} type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required autoComplete="new-password" minLength={6} />
        </Field>
        <Field label="Xác nhận mật khẩu mới">
          <input style={inputStyle} type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required autoComplete="new-password" />
        </Field>
        {pwdStatus && <StatusMsg {...pwdStatus} />}
        <button type="submit" disabled={savingPwd}
          style={{ padding: '9px 20px', background: savingPwd ? '#a09d97' : '#1a6b52', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: savingPwd ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {savingPwd ? 'Đang đổi...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  )
}
