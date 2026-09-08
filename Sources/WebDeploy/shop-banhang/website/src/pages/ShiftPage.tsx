import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ShiftStats { order_count: number; total_revenue: number; cash_revenue: number }
interface Shift {
  id: number; opened_at: string; opening_cash: number; status: string; stats: ShiftStats
}

function fmtVND(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }
function fmtDateTime(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  return isNaN(d.getTime()) ? iso : d.toLocaleString('vi-VN')
}

export default function ShiftPage() {
  useDocumentMeta({ title: 'Ca làm việc — POS Bán hàng', description: 'Quản lý ca làm việc — mở ca, đóng ca, kiểm kê tiền mặt.' })
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [shift, setShift] = useState<Shift | null>(null)
  const [loading, setLoading] = useState(true)
  const [openingCash, setOpeningCash] = useState('')
  const [openError, setOpenError] = useState('')
  const [closingCash, setClosingCash] = useState('')
  const [closeError, setCloseError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setShift(await api.get<Shift | null>('/shifts/current')) }
    finally { setLoading(false) }
  }

  async function handleOpen() {
    setOpenError('')
    try {
      await api.post('/shifts/open', { opening_cash: openingCash })
      setOpeningCash('')
      load()
    } catch (err: unknown) {
      setOpenError(err instanceof Error ? err.message : 'Mở ca thất bại.')
    }
  }

  async function handleClose() {
    setCloseError('')
    try {
      const res = await api.post<{ difference: number }>('/shifts/close', { closing_cash_counted: closingCash })
      const msg = res.difference === 0
        ? 'Đóng ca thành công — khớp quỹ.'
        : res.difference > 0
          ? `Đóng ca thành công — dư ${fmtVND(res.difference)}.`
          : `Đóng ca thành công — thiếu ${fmtVND(Math.abs(res.difference))}.`
      alert(msg + '\nBạn sẽ được chuyển về trang đăng nhập.')
      await logout()
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setCloseError(err instanceof Error ? err.message : 'Đóng ca thất bại.')
    }
  }

  const expected = shift ? shift.opening_cash + shift.stats.cash_revenue : 0
  const counted = Number(closingCash) || 0
  const diff = counted - expected

  if (loading) return <div className="bp-page-content"><div className="bp-container" style={{ maxWidth: 720 }}><p>Đang tải...</p></div></div>

  return (
    <div className="bp-page-content">
      <div className="bp-container" style={{ maxWidth: 720 }}>
        <h1>Ca làm việc</h1>

        {!shift ? (
          <div className="bp-card">
            <h3>Mở ca mới</h3>
            <p style={{ color: 'var(--text-2)' }}>Nhập số tiền mặt có sẵn trong quầy trước khi bắt đầu ca làm việc.</p>
            <div className="bp-input-group">
              <label htmlFor="openingCashInput">Tiền mặt đầu ca</label>
              <input type="number" id="openingCashInput" min={0} value={openingCash} onChange={e => setOpeningCash(e.target.value)} placeholder="VD: 500000" />
            </div>
            {openError && <div className="bp-alert error show">{openError}</div>}
            <button className="bp-btn bp-btn-primary" onClick={handleOpen}>Mở ca</button>
          </div>
        ) : (
          <div>
            <div className="bp-card" style={{ marginBottom: '1.5rem' }}>
              <h3>Ca đang mở <span className="bp-shift-status open">● Đang hoạt động</span></h3>
              <p style={{ color: 'var(--text-2)' }}>
                Nhân viên: {user?.name} · Mở lúc: {fmtDateTime(shift.opened_at)} · Tiền mặt đầu ca: {fmtVND(shift.opening_cash)}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Số đơn</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{shift.stats.order_count}</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Tổng doanh thu</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{fmtVND(shift.stats.total_revenue)}</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>Tiền mặt thu được</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{fmtVND(shift.stats.cash_revenue)}</div>
                </div>
              </div>
            </div>

            <div className="bp-card">
              <h3>Đóng ca</h3>
              <p style={{ color: 'var(--text-2)' }}>Đếm tiền mặt thực tế trong quầy và nhập vào bên dưới để đối chiếu.</p>
              <div className="bp-input-group">
                <label htmlFor="closingCashInput">Tiền mặt đếm thực tế cuối ca</label>
                <input type="number" id="closingCashInput" min={0} value={closingCash} onChange={e => setClosingCash(e.target.value)} placeholder="Nhập số tiền đếm được" />
              </div>
              {closingCash !== '' && (
                <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 8, marginBottom: '1rem' }}>
                  <div>Dự kiến: <strong>{fmtVND(expected)}</strong> (đầu ca + tiền mặt thu được)</div>
                  <div style={{ marginTop: '0.5rem', fontWeight: 600, color: diff === 0 ? 'var(--accent)' : diff > 0 ? 'var(--accent)' : 'var(--danger)' }}>
                    {diff === 0 ? 'Khớp — không lệch' : diff > 0 ? `Dư: +${fmtVND(diff)}` : `Thiếu: ${fmtVND(diff)}`}
                  </div>
                </div>
              )}
              {closeError && <div className="bp-alert error show">{closeError}</div>}
              <button className="bp-btn bp-btn-primary" onClick={handleClose}>Xác nhận đóng ca</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
