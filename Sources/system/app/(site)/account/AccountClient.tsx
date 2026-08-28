'use client'
import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/contexts/AccountContext'

interface OrderItem { id: number; itemName: string; qty: number; unitPrice: number; subtotal: number }
interface OrderRow {
  id: number; code: string; type: string; title: string; total: number; status: string
  createdAt: string; downloadToken: string | null; tokenExpiresAt: string | null; items: OrderItem[]
}
interface CvProfileRow { id: number; slug: string; templateType: string; isPublic: boolean; updatedAt: string }

const TYPE_LABELS: Record<string, string> = { template: 'Template', website: 'Website Gói B', cv: 'CV Builder' }
const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new:         { label: 'Chờ thanh toán', color: '#92400e', bg: '#fffbeb' },
  confirmed:   { label: 'Đã xác nhận',    color: '#1d4ed8', bg: '#eff6ff' },
  in_progress: { label: 'Đang xử lý',     color: '#7e22ce', bg: '#fdf4ff' },
  delivered:   { label: 'Đã bàn giao',    color: '#9a3412', bg: '#fff7ed' },
  completed:   { label: 'Hoàn tất',       color: 'var(--accent)', bg: 'var(--accent-light)' },
  cancelled:   { label: 'Đã hủy',         color: '#991b1b', bg: '#fef2f2' },
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: 8, border: '1px solid var(--border)',
  background: 'var(--bg)', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 }

type Tab = 'orders' | 'cv' | 'profile'

export default function AccountClient() {
  const router = useRouter()
  const { account, loading, refresh, logout } = useAccount()
  const [tab, setTab] = useState<Tab>('orders')

  const [orders, setOrders] = useState<OrderRow[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [cvProfile, setCvProfile] = useState<CvProfileRow | null | undefined>(undefined)

  const [profName, setProfName] = useState('')
  const [profEmail, setProfEmail] = useState('')
  const [profPhone, setProfPhone] = useState('')
  const [profSaved, setProfSaved] = useState(false)
  const [profError, setProfError] = useState('')
  const [profSaving, setProfSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  useEffect(() => {
    if (!loading && !account) router.push('/login?redirect=/account')
  }, [loading, account, router])

  useEffect(() => {
    if (!account) return
    setProfName(account.name); setProfEmail(account.email); setProfPhone(account.phone || '')

    fetch('/api/account/orders').then(r => r.json()).then(d => setOrders(d.orders || [])).finally(() => setOrdersLoading(false))
    fetch('/api/account/cv').then(r => r.json()).then(d => setCvProfile(d.cvProfile ?? null))
  }, [account])

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    setProfError(''); setProfSaved(false); setProfSaving(true)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profName, email: profEmail, phone: profPhone }),
      })
      const data = await res.json()
      if (!res.ok) { setProfError(data.error || 'Lỗi cập nhật'); return }
      await refresh()
      setProfSaved(true); setTimeout(() => setProfSaved(false), 2500)
    } catch { setProfError('Lỗi kết nối server') }
    finally { setProfSaving(false) }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    setPwError(''); setPwSaved(false); setPwSaving(true)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setPwError(data.error || 'Lỗi đổi mật khẩu'); return }
      setCurrentPassword(''); setNewPassword('')
      setPwSaved(true); setTimeout(() => setPwSaved(false), 2500)
    } catch { setPwError('Lỗi kết nối server') }
    finally { setPwSaving(false) }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError(''); setAvatarUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/account/avatar', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setAvatarError(data.error || 'Upload thất bại'); return }
      await refresh()
    } catch { setAvatarError('Lỗi kết nối server') }
    finally { setAvatarUploading(false); e.target.value = '' }
  }

  if (loading || !account) {
    return <section className="sec-pad"><div className="wd-container" style={{ textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div></section>
  }

  return (
    <section className="sec-pad">
      <div className="wd-container">
        <div style={{ marginBottom: 28 }}>
          <div className="eyebrow">Tài khoản của tôi</div>
          <h1 className="sec-title">Quản lý sản phẩm &amp; thông tin cá nhân</h1>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, position: 'sticky', top: 100 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, marginBottom: 12, borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
                  {account.avatarUrl ? <img src={account.avatarUrl} alt={account.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : account.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.email}</div>
                </div>
              </div>
              {([
                ['orders', '🛍 Sản phẩm đã mua'],
                ['cv', '📄 CV của tôi'],
                ['profile', '⚙ Thông tin cá nhân'],
              ] as [Tab, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                    border: 'none', background: tab === key ? 'var(--accent)' : 'transparent',
                    color: tab === key ? '#fff' : 'var(--text-2)', fontSize: 13, fontWeight: 500,
                    fontFamily: 'var(--sans)', cursor: 'pointer', marginBottom: 4,
                  }}>
                  {label}
                </button>
              ))}
              <button onClick={handleLogout}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--danger)', fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: 'pointer', marginTop: 10, borderTop: '1px solid var(--border-light)', paddingTop: 14 }}>
                ↪ Đăng xuất
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            {tab === 'orders' && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Sản phẩm đã mua</h2>
                {ordersLoading ? (
                  <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</p>
                ) : orders.length === 0 ? (
                  <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
                    Bạn chưa có đơn hàng nào. <Link href="/templates" style={{ color: 'var(--accent)', fontWeight: 500 }}>Khám phá template →</Link>
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.map(o => {
                      const st = STATUS_LABELS[o.status] || { label: o.status, color: 'var(--text-2)', bg: 'var(--warm)' }
                      const canDownload = o.downloadToken && o.type !== 'cv' && (!o.tokenExpiresAt || new Date(o.tokenExpiresAt) > new Date())
                      return (
                        <div key={o.id} style={{ border: '1px solid var(--border-light)', borderRadius: 10, padding: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{o.title}</div>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                            #{o.code} · {TYPE_LABELS[o.type] || o.type} · {new Date(o.createdAt).toLocaleDateString('vi-VN')} · {Number(o.total).toLocaleString('vi-VN')}đ
                          </div>
                          {o.type === 'cv' ? (
                            <Link href="/cv-manager/edit" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>Chỉnh sửa CV →</Link>
                          ) : canDownload ? (
                            <a href={`/api/download?token=${o.downloadToken}&file=${o.type === 'website' ? 'web' : 'template'}`}
                              style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                              Tải xuống →
                            </a>
                          ) : o.status === 'new' ? (
                            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Đang chờ xác nhận thanh toán</span>
                          ) : (
                            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Liên kết tải đã hết hạn — liên hệ hỗ trợ nếu cần tải lại</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {tab === 'cv' && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>CV của tôi</h2>
                {cvProfile === undefined ? (
                  <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</p>
                ) : cvProfile === null ? (
                  <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
                    Bạn chưa có CV. <Link href="/cvs" style={{ color: 'var(--accent)', fontWeight: 500 }}>Xem các mẫu CV →</Link>
                  </p>
                ) : (
                  <div style={{ border: '1px solid var(--border-light)', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Mẫu {cvProfile.templateType}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>/cv/{cvProfile.slug} · cập nhật {new Date(cvProfile.updatedAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <a href={`/cv/${cvProfile.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
                        Xem CV
                      </a>
                      <Link href="/cv-manager/edit"
                        style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500 }}>
                        Chỉnh sửa
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Ảnh đại diện</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, overflow: 'hidden', flexShrink: 0 }}>
                      {account.avatarUrl ? <img src={account.avatarUrl} alt={account.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : account.name.charAt(0).toUpperCase()}
                    </div>
                    <label style={{ padding: '9px 18px', borderRadius: 9, border: '1px solid var(--border)', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', cursor: avatarUploading ? 'not-allowed' : 'pointer' }}>
                      {avatarUploading ? 'Đang tải lên...' : 'Đổi ảnh đại diện'}
                      <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={avatarUploading} style={{ display: 'none' }} />
                    </label>
                  </div>
                  {avatarError && <div style={{ marginTop: 12, fontSize: 13, color: 'var(--danger)' }}>{avatarError}</div>}
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Thông tin cá nhân</h2>
                  <form onSubmit={handleSaveProfile} style={{ maxWidth: 420 }}>
                    <div style={{ marginBottom: 14 }}>
                      <label htmlFor="acc-name" style={labelStyle}>Họ và tên</label>
                      <input id="acc-name" value={profName} onChange={e => setProfName(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label htmlFor="acc-email" style={labelStyle}>Email</label>
                      <input id="acc-email" type="email" value={profEmail} onChange={e => setProfEmail(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="acc-phone" style={labelStyle}>Số điện thoại</label>
                      <input id="acc-phone" type="tel" value={profPhone} onChange={e => setProfPhone(e.target.value)} style={inputStyle} required />
                    </div>
                    {profError && <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{profError}</div>}
                    {profSaved && <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 12 }}>✓ Đã lưu thay đổi</div>}
                    <button type="submit" disabled={profSaving}
                      style={{ padding: '10px 22px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: profSaving ? 'not-allowed' : 'pointer', opacity: profSaving ? .7 : 1 }}>
                      {profSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </form>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)' }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Đổi mật khẩu</h2>
                  <form onSubmit={handleChangePassword} style={{ maxWidth: 420 }}>
                    <div style={{ marginBottom: 14 }}>
                      <label htmlFor="acc-cur-pw" style={labelStyle}>Mật khẩu hiện tại</label>
                      <input id="acc-cur-pw" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="acc-new-pw" style={labelStyle}>Mật khẩu mới</label>
                      <input id="acc-new-pw" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} required minLength={6} />
                    </div>
                    {pwError && <div style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{pwError}</div>}
                    {pwSaved && <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 12 }}>✓ Đã đổi mật khẩu</div>}
                    <button type="submit" disabled={pwSaving}
                      style={{ padding: '10px 22px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: pwSaving ? 'not-allowed' : 'pointer', opacity: pwSaving ? .7 : 1 }}>
                      {pwSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
