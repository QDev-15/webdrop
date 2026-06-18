'use client'
import AdminLayout from '@/components/admin/AdminLayout'
import { useState, useEffect, FormEvent } from 'react'

interface AdminUser {
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

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'superadmin'>('user')
  const [creating, setCreating] = useState(false)
  const [modalError, setModalError] = useState('')
  const [togglingId, setTogglingId] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users'),
      fetch('/api/admin/profile'),
    ]).then(async ([usersRes, profileRes]) => {
      if (!usersRes.ok) {
        setFetchError(usersRes.status === 403 ? 'Bạn không có quyền xem trang này' : 'Lỗi tải danh sách người dùng')
        setLoading(false)
        return
      }
      const [usersData, profileData] = await Promise.all([usersRes.json(), profileRes.json()])
      if (usersData.users) setUsers(usersData.users)
      if (profileData.user) setCurrentUserId(profileData.user.id)
      setLoading(false)
    }).catch(() => {
      setFetchError('Lỗi kết nối server')
      setLoading(false)
    })
  }, [])

  function openModal() {
    setName(''); setEmail(''); setPassword(''); setRole('user'); setModalError('')
    setShowModal(true)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    setModalError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) { setModalError(data.error || 'Lỗi tạo tài khoản'); return }
      setUsers(prev => [...prev, data])
      setShowModal(false)
    } catch {
      setModalError('Lỗi kết nối server')
    } finally { setCreating(false) }
  }

  async function handleToggleRole(user: AdminUser) {
    if (togglingId !== null) return
    const newRole = user.role === 'superadmin' ? 'user' : 'superadmin'
    if (!confirm(`${newRole === 'superadmin' ? 'Nâng cấp' : 'Hạ cấp'} tài khoản "${user.name}" thành ${newRole === 'superadmin' ? 'Super Admin' : 'User'}?`)) return
    setTogglingId(user.id)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) {
        const d = await res.json()
        alert(d.error || 'Lỗi cập nhật vai trò')
        return
      }
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    } catch {
      alert('Lỗi kết nối server')
    } finally { setTogglingId(null) }
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`Xóa tài khoản "${user.name}"?\nHành động này không thể hoàn tác.`)) return
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const d = await res.json()
        alert(d.error || 'Lỗi xóa người dùng')
        return
      }
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch {
      alert('Lỗi kết nối server')
    }
  }

  return (
    <AdminLayout title="Quản lý người dùng">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
          Tổng: <strong>{users.length}</strong> tài khoản
        </div>
        <button onClick={openModal}
          style={{ marginLeft: 'auto', padding: '8px 18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: 'pointer' }}>
          + Thêm người dùng
        </button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
        ) : fetchError ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--danger)', fontSize: 14 }}>{fetchError}</div>
        ) : users.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Chưa có người dùng nào</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                  {['Người dùng', 'Email', 'Vai trò', 'Ngày tạo', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.id === currentUserId ? 'var(--accent)' : 'var(--warm2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: u.id === currentUserId ? '#fff' : 'var(--text-2)', flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{u.name}</div>
                          {u.id === currentUserId && (
                            <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 1 }}>Đây là bạn</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 5, background: u.role === 'superadmin' ? 'var(--accent-light)' : 'var(--warm)', color: u.role === 'superadmin' ? 'var(--accent)' : 'var(--text-2)' }}>
                        {u.role === 'superadmin' ? 'Super Admin' : 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>
                      {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {u.id !== currentUserId && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleToggleRole(u)} disabled={togglingId === u.id}
                            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', fontSize: 11, cursor: togglingId === u.id ? 'not-allowed' : 'pointer', color: 'var(--text-2)', fontFamily: 'var(--sans)', whiteSpace: 'nowrap', opacity: togglingId === u.id ? .5 : 1 }}>
                            {u.role === 'superadmin' ? '↓ Hạ cấp' : '↑ Nâng cấp'}
                          </button>
                          <button onClick={() => handleDelete(u)}
                            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff5f5', fontSize: 11, cursor: 'pointer', color: 'var(--danger)', fontFamily: 'var(--sans)' }}>
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: 'var(--surface)', borderRadius: 14, padding: '28px 32px', width: 440, maxWidth: '90vw' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Thêm người dùng mới</div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Tên hiển thị *</label>
                  <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Mật khẩu * (tối thiểu 6 ký tự)</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required autoComplete="new-password" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }}>Vai trò</label>
                  <select value={role} onChange={e => setRole(e.target.value as 'user' | 'superadmin')} style={inputStyle}>
                    <option value="user">User</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                {modalError && (
                  <div style={{ fontSize: 13, color: 'var(--danger)' }}>✕ {modalError}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '9px 20px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)', color: 'var(--text-2)' }}>
                  Hủy
                </button>
                <button type="submit" disabled={creating}
                  style={{ padding: '9px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? .7 : 1 }}>
                  {creating ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
