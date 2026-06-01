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

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: number; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState('')

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

  return (
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
  )
}
