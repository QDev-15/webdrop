import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useAccount } from '../contexts/AccountContext'
import { api } from '../api/client'
import { TIER_LABELS, formatFullVND, formatDateVN } from '../lib/listings'

interface MyListing {
  id: number; title: string; slug: string; images: string[]; tier: string; tier_label: string
  status: string; posted_at: string; days_left: number; expired: boolean
}
interface Txn { id: number; type: string; amount: number; method: string; note: string; status: string; created_at: string }

const METHOD_LABELS: Record<string, string> = { sepay: 'SePay (chuyển khoản QR)', 'chuyen-khoan-thu-cong': 'Chuyển khoản ngân hàng', 'he-thong': 'Trừ từ ví' }
const STATUS_LABELS: Record<string, string> = { pending: 'Đang xử lý', approved: 'Đang hiển thị', rejected: 'Bị từ chối' }

export default function AccountPage() {
  useDocumentMeta({ title: 'Tài khoản của tôi | RaoNhà', description: 'Quản lý tin đăng, ví credit và thông tin tài khoản RaoNhà của bạn.' })
  const { account, loading, logout, updateProfile, refresh } = useAccount()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'listings' | 'wallet' | 'profile'>('listings')

  const [listings, setListings] = useState<MyListing[]>([])
  const [txns, setTxns] = useState<Txn[]>([])
  const [busyId, setBusyId] = useState<number | null>(null)

  const [profName, setProfName] = useState('')
  const [profEmail, setProfEmail] = useState('')
  const [profPhone, setProfPhone] = useState('')
  const [profSaved, setProfSaved] = useState(false)
  const [profError, setProfError] = useState('')

  useEffect(() => {
    if (!account) return
    setProfName(account.name); setProfEmail(account.email); setProfPhone(account.phone)
    loadListings()
    api.get<Txn[]>('/public/my-wallet-transactions').then(setTxns).catch(() => {})
  }, [account])

  async function loadListings() {
    api.get<MyListing[]>('/public/my-listings').then(setListings).catch(() => {})
  }

  async function renew(id: number) {
    setBusyId(id)
    try { await api.post(`/public/my-listings/${id}/renew`, {}); await loadListings(); await refresh() }
    catch (e) { alert(e instanceof Error ? e.message : 'Gia hạn thất bại.') }
    finally { setBusyId(null) }
  }
  async function upgrade(id: number) {
    if (!confirm('Nâng cấp gói VIP cho tin đăng này? Số tiền sẽ trừ thẳng vào ví credit.')) return
    setBusyId(id)
    try { await api.post(`/public/my-listings/${id}/upgrade`, {}); await loadListings(); await refresh() }
    catch (e) { alert(e instanceof Error ? e.message : 'Nâng cấp thất bại.') }
    finally { setBusyId(null) }
  }
  async function removeListing(id: number) {
    if (!confirm('Xoá tin đăng này khỏi danh sách của bạn?')) return
    setBusyId(id)
    try { await api.delete(`/public/my-listings/${id}`); await loadListings() }
    finally { setBusyId(null) }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfError(''); setProfSaved(false)
    try {
      await updateProfile({ name: profName, email: profEmail, phone: profPhone })
      setProfSaved(true)
      setTimeout(() => setProfSaved(false), 2500)
    } catch (err) {
      setProfError(err instanceof Error ? err.message : 'Lưu thất bại.')
    }
  }

  async function handleLogout() { await logout(); navigate('/') }

  if (loading) return <div style={{ padding: '160px 0', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <section className="rn-page-hero" style={{ paddingBottom: 32 }}>
        <div className="rn-container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Tài khoản của tôi</div>
          <h1 className="sec-title">Quản lý tin đăng &amp; ví của bạn</h1>
        </div>
      </section>

      <section className="sec-pad" style={{ paddingTop: 24 }}>
        <div className="rn-container">
          {!account ? (
            <div className="rn-auth-wrap" style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: 16, marginBottom: 16 }}>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem tin đăng, ví credit và quản lý tài khoản.</p>
              <Link to="/dang-nhap" className="btn-rn btn-rn-primary">Đăng nhập ngay</Link>
            </div>
          ) : (
            <div className="rn-account-layout">
              <aside className="rn-account-side">
                <div className="rn-account-user">
                  <div className="av">{account.name.trim().charAt(0).toUpperCase()}</div>
                  <div><div className="name">{account.name}</div><div className="sub">{account.email}</div></div>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 12 }}>Số dư ví: <strong style={{ color: 'var(--accent)' }}>{formatFullVND(account.credit_balance)}</strong></p>
                <button type="button" className={'rn-account-tab' + (tab === 'listings' ? ' active' : '')} onClick={() => setTab('listings')}>🏠 Tin đăng của tôi</button>
                <button type="button" className={'rn-account-tab' + (tab === 'wallet' ? ' active' : '')} onClick={() => setTab('wallet')}>💳 Ví &amp; Gói VIP</button>
                <button type="button" className={'rn-account-tab' + (tab === 'profile' ? ' active' : '')} onClick={() => setTab('profile')}>👤 Thông tin tài khoản</button>
                <button type="button" className="rn-account-tab logout" onClick={handleLogout}>↪ Đăng xuất</button>
              </aside>

              <div className="rn-account-content">
                {tab === 'listings' && (
                  <div className="rn-account-panel active">
                    <div className="rn-account-panel-head">
                      <h2>Tin đăng của tôi</h2>
                      <Link to="/dang-tin" className="btn-rn btn-rn-primary">+ Đăng tin mới</Link>
                    </div>
                    {listings.length === 0 ? (
                      <p style={{ color: 'var(--text-3)', padding: '20px 0' }}>Bạn chưa có tin đăng nào. <Link to="/dang-tin" style={{ color: 'var(--accent)', fontWeight: 700 }}>Đăng tin ngay →</Link></p>
                    ) : (
                      listings.map(l => (
                        <div className="rn-mylisting" key={l.id}>
                          <img src={l.images[0]} alt={l.title} />
                          <div className="info">
                            <Link to={`/chi-tiet-bds?slug=${l.slug}`}>{l.title}</Link>
                            <div className="meta">
                              {TIER_LABELS[l.tier] ?? l.tier_label} · {STATUS_LABELS[l.status] ?? l.status} · Đăng {formatDateVN(l.posted_at)} ·{' '}
                              {l.expired
                                ? <span className="rn-expiry-pill rn-expiry-over">Hết hạn {Math.abs(l.days_left)} ngày trước</span>
                                : l.days_left <= 5
                                  ? <span className="rn-expiry-pill rn-expiry-soon">Còn {l.days_left} ngày</span>
                                  : <span className="rn-expiry-pill rn-expiry-ok">Còn {l.days_left} ngày</span>}
                            </div>
                          </div>
                          <div className="actions">
                            <button type="button" className="primary" disabled={busyId === l.id} onClick={() => renew(l.id)}>{l.expired ? 'Đăng lại' : 'Gia hạn'}</button>
                            <button type="button" disabled={busyId === l.id} onClick={() => upgrade(l.id)}>Nâng cấp VIP</button>
                            <button type="button" className="danger" disabled={busyId === l.id} onClick={() => removeListing(l.id)}>Xoá tin</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {tab === 'wallet' && (
                  <div className="rn-account-panel active">
                    <div className="rn-account-panel-head"><h2>Ví &amp; Gói VIP</h2></div>
                    <div className="rn-wallet-box">
                      <div><div className="lbl">Số dư credit hiện tại</div><div className="val">{formatFullVND(account.credit_balance)}</div></div>
                      <Link to="/nap-tien" className="btn-rn btn-rn-white">+ Nạp credit</Link>
                    </div>
                    <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginBottom: 10 }}>Dùng credit để mua/gia hạn gói VIP ngay từ tab "Tin đăng của tôi" — mỗi gói trừ thẳng vào số dư ví, không cần chuyển khoản lại từng lần.</p>
                    <h3 style={{ fontSize: 15, margin: '24px 0 12px' }}>Lịch sử giao dịch</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="rn-txn-table">
                        <thead><tr><th>Ngày</th><th>Nội dung</th><th>Phương thức</th><th>Số tiền</th></tr></thead>
                        <tbody>
                          {txns.length === 0 ? (
                            <tr><td colSpan={4} style={{ color: 'var(--text-3)' }}>Chưa có giao dịch nào.</td></tr>
                          ) : txns.map(t => (
                            <tr key={t.id}>
                              <td>{formatDateVN(t.created_at)}</td>
                              <td>{t.note}{t.status === 'pending' ? ' (đang chờ xác nhận)' : ''}</td>
                              <td>{METHOD_LABELS[t.method] ?? t.method}</td>
                              <td className={'rn-txn-amount ' + (t.type === 'nap' ? 'plus' : 'minus')}>
                                {t.type === 'nap' ? '+' : '-'}{formatFullVND(t.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {tab === 'profile' && (
                  <div className="rn-account-panel active">
                    <div className="rn-account-panel-head"><h2>Thông tin tài khoản</h2></div>
                    <form onSubmit={saveProfile} style={{ maxWidth: 440 }}>
                      {profError && <div className="alert-danger" style={{ marginBottom: 12 }}>{profError}</div>}
                      <div className="rn-form-group"><label htmlFor="account-profile-name">Họ và tên</label><input id="account-profile-name" type="text" value={profName} onChange={e => setProfName(e.target.value)} required /></div>
                      <div className="rn-form-group"><label htmlFor="account-profile-email">Email</label><input id="account-profile-email" type="email" value={profEmail} onChange={e => setProfEmail(e.target.value)} required /></div>
                      <div className="rn-form-group"><label htmlFor="account-profile-phone">Số điện thoại</label><input id="account-profile-phone" type="tel" value={profPhone} onChange={e => setProfPhone(e.target.value)} required /></div>
                      <button type="submit" className="btn-rn btn-rn-primary">Lưu thay đổi</button>
                      {profSaved && <p style={{ marginTop: 12, color: 'var(--accent)', fontWeight: 700 }}>✓ Đã lưu thông tin tài khoản.</p>}
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
