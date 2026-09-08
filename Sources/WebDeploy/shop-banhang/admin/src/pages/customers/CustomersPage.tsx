import { useEffect, useRef, useState } from 'react'
import { api } from '../../api/client'

interface Order { id: number; code: string; created_at: string; total: number; item_qty: number }
interface Customer {
  id: number; name: string; phone: string; email: string; birthday: string;
  total_spent: number; points: number; created_at: string; tier: string; last_purchase: string | null
}
interface CustomerDetail extends Customer { orders: Order[] }

const TIER_LABELS: Record<string, string> = { dong: 'Đồng', bac: 'Bạc', vang: 'Vàng', 'kim-cuong': 'Kim Cương' }
const TIER_THRESHOLDS: Record<string, number> = { dong: 0, bac: 2000000, vang: 10000000, 'kim-cuong': 30000000 }
const TIER_ORDER = ['dong', 'bac', 'vang', 'kim-cuong']

function fmtVND(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }
function fmtDateTime(iso: string): string {
  const d = new Date(iso.replace(' ', 'T'))
  return isNaN(d.getTime()) ? iso : d.toLocaleString('vi-VN')
}
function tierProgress(totalSpent: number) {
  const tier = TIER_ORDER.slice().reverse().find(t => totalSpent >= TIER_THRESHOLDS[t]) ?? 'dong'
  const idx = TIER_ORDER.indexOf(tier)
  const nextTier = TIER_ORDER[idx + 1]
  if (!nextTier) return { tier, percent: 100, label: 'Đã đạt hạng cao nhất' }
  const min = TIER_THRESHOLDS[tier], max = TIER_THRESHOLDS[nextTier]
  const percent = Math.max(0, Math.min(100, ((totalSpent - min) / (max - min)) * 100))
  return { tier, percent, label: `Còn ${fmtVND(max - totalSpent)} để lên hạng ${TIER_LABELS[nextTier]}` }
}

const emptyForm = { name: '', phone: '', email: '', birthday: '' }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [detail, setDetail] = useState<CustomerDetail | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setCustomers(await api.get<Customer[]>('/customers')) } finally { setLoading(false) }
  }

  function set<K extends keyof typeof emptyForm>(k: K, v: string) { setForm(f => ({ ...f, [k]: v })) }

  function resetForm() { setEditingId(null); setForm(emptyForm); setError('') }

  function editCustomer(c: Customer) {
    setEditingId(c.id)
    setForm({ name: c.name, phone: c.phone, email: c.email, birthday: c.birthday })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      if (editingId) await api.put(`/customers/${editingId}`, form)
      else await api.post('/customers', form)
      setSuccess('Lưu khách hàng thành công')
      resetForm(); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Bạn chắc chắn muốn xóa khách hàng này?')) return
    await api.delete(`/customers/${id}`)
    setSuccess('Xóa khách hàng thành công')
    if (detail?.id === id) setDetail(null)
    load()
  }

  const detailRef = useRef<HTMLDivElement>(null)

  async function viewDetail(id: number) {
    const d = await api.get<CustomerDetail>(`/customers/${id}`)
    setDetail(d)
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  const filtered = customers.filter(c => {
    const q = search.toLowerCase().trim()
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q)
  })

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Quản lý khách hàng</div>
          <div className="page-sub">{customers.length} khách hàng</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editingId ? 'Sửa khách hàng' : 'Thêm khách hàng'}</div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="cf-name">Tên khách hàng</label>
              <input id="cf-name" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nhập tên khách hàng" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cf-phone">Số điện thoại</label>
              <input id="cf-phone" className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="VD: 0901234567" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cf-email">Email (tuỳ chọn)</label>
              <input id="cf-email" type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Nhập email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cf-birthday">Ngày sinh (tuỳ chọn)</label>
              <input id="cf-birthday" type="date" className="form-control" value={form.birthday} onChange={e => set('birthday', e.target.value)} />
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn-accent">Lưu</button>
            <button type="button" className="btn-ghost" onClick={resetForm}>Hủy</button>
          </div>
        </form>
      </div>

      <div className="form-group">
        <input className="form-control" placeholder="Tìm khách hàng theo tên/SĐT..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tên</th><th>SĐT</th><th>Hạng</th><th>Điểm</th><th>Tổng chi tiêu</th><th>Lần mua gần nhất</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Không tìm thấy khách hàng nào</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td><span className={`badge tier-badge tier-${c.tier}`}>{TIER_LABELS[c.tier]}</span></td>
                <td>{c.points.toLocaleString('vi-VN')}</td>
                <td>{fmtVND(c.total_spent)}</td>
                <td>{c.last_purchase ? fmtDateTime(c.last_purchase) : '—'}</td>
                <td>
                  <button className="btn-ghost btn-sm" onClick={() => viewDetail(c.id)}>Xem</button>
                  <button className="btn-ghost btn-sm" onClick={() => editCustomer(c)}>Sửa</button>
                  <button className="btn-ghost btn-sm" onClick={() => handleDelete(c.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="card" ref={detailRef} style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Chi tiết khách hàng — {detail.name}</div>
          {(() => {
            const progress = tierProgress(detail.total_spent)
            return (
              <div style={{ marginBottom: 16 }}>
                <span className={`badge tier-badge tier-${progress.tier}`}>{TIER_LABELS[progress.tier]}</span> · {detail.points.toLocaleString('vi-VN')} điểm · Tổng chi tiêu {fmtVND(detail.total_spent)}
                <div style={{ width: '100%', height: 8, background: 'var(--border-light)', borderRadius: 20, overflow: 'hidden', margin: '8px 0' }}>
                  <div style={{ height: '100%', width: `${progress.percent}%`, background: 'var(--accent)', borderRadius: 20 }} />
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{progress.label}</div>
              </div>
            )
          })()}
          <div style={{ fontWeight: 600, marginTop: 16, marginBottom: 8 }}>Lịch sử đơn hàng</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Mã HD</th><th>Thời gian</th><th>Số lượng</th><th>Thành tiền</th></tr></thead>
              <tbody>
                {detail.orders.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-2)' }}>Chưa có đơn hàng nào</td></tr>
                ) : detail.orders.map(o => (
                  <tr key={o.id}><td>{o.code}</td><td>{fmtDateTime(o.created_at)}</td><td>{o.item_qty}</td><td>{fmtVND(o.total)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => setDetail(null)}>Đóng</button>
        </div>
      )}
    </div>
  )
}
