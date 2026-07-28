'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'new', label: 'Mới', color: '#1d4ed8' },
  { value: 'confirmed', label: 'Đã xác nhận', color: '#9333ea' },
  { value: 'in_progress', label: 'Đang xử lý', color: '#d97706' },
  { value: 'delivered', label: 'Đã bàn giao', color: '#0369a1' },
  { value: 'completed', label: 'Hoàn thành', color: 'var(--accent)' },
  { value: 'cancelled', label: 'Đã huỷ', color: '#dc2626' },
]

export default function OrderStatusUpdater({ orderId, currentStatus, isPaid }: { orderId: number; currentStatus: string; isPaid: boolean }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState('')

  async function handleUpdate() {
    setSaving(true)
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: note || undefined }),
      })
      router.refresh()
    } finally { setSaving(false) }
  }

  async function handleConfirmPayment() {
    if (!window.confirm('Xác nhận đã nhận được tiền chuyển khoản cho đơn này? Thao tác này sẽ sinh download token, đánh dấu đã thanh toán và ghi nhận doanh thu — dùng khi webhook Sepay không tự xử lý được (vd chạy local, hoặc nội dung chuyển khoản không khớp mã đơn).')) return
    setConfirming(true)
    setConfirmError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setConfirmError(data.error || 'Có lỗi xảy ra'); return }
      router.refresh()
    } catch {
      setConfirmError('Có lỗi xảy ra, thử lại sau')
    } finally { setConfirming(false) }
  }

  return (
    <>
      {!isPaid && (
        <div style={{ background: 'var(--surface)', border: '1px solid #fbbf24', borderRadius: 12, padding: '20px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>⚠️ Chưa xác nhận thanh toán</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 12 }}>
            Nếu khách đã chuyển khoản nhưng webhook Sepay không tự xác nhận (vd site chạy local, hoặc nội dung chuyển khoản không khớp mã đơn), xác nhận thủ công tại đây sau khi đã tự kiểm tra tiền đã về tài khoản.
          </div>
          {confirmError && <div style={{ fontSize: 12, color: 'var(--danger)', marginBottom: 10 }}>{confirmError}</div>}
          <button onClick={handleConfirmPayment} disabled={confirming}
            style={{ width: '100%', padding: '10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: confirming ? 'not-allowed' : 'pointer', opacity: confirming ? .6 : 1 }}>
            {confirming ? 'Đang xử lý...' : 'Xác nhận thanh toán thủ công'}
          </button>
        </div>
      )}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Cập nhật trạng thái</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {STATUSES.map(s => (
          <label key={s.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: status === s.value ? s.color + '12' : 'transparent', border: `1px solid ${status === s.value ? s.color + '40' : 'transparent'}`, transition: 'all .12s' }}>
            <input type="radio" name="status" value={s.value} checked={status === s.value} onChange={() => setStatus(s.value)} style={{ accentColor: s.color }} />
            <span style={{ fontSize: 13, color: status === s.value ? s.color : 'var(--text-2)', fontWeight: status === s.value ? 500 : 400 }}>{s.label}</span>
          </label>
        ))}
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi chú thêm (tùy chọn)..." rows={2}
        style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', fontSize: 12, fontFamily: 'var(--sans)', resize: 'none', outline: 'none', color: 'var(--text)', marginBottom: 12, boxSizing: 'border-box' }} />
        <button onClick={handleUpdate} disabled={saving || status === currentStatus}
          style={{ width: '100%', padding: '10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: (saving || status === currentStatus) ? 'not-allowed' : 'pointer', opacity: (saving || status === currentStatus) ? .6 : 1 }}>
          {saving ? 'Đang lưu...' : 'Cập nhật'}
        </button>
      </div>
    </>
  )
}
