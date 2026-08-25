import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData { phase: string; percent: number; milestone: string; sort_order: number }
const empty: FormData = { phase: '', percent: 0, milestone: '', sort_order: 0 }

export default function PaymentPhaseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData & { id: number }>(`/payment-phases/${id}`)
      .then(d => setForm({ phase: d.phase, percent: d.percent ?? 0, milestone: d.milestone ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy đợt thanh toán.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.phase.trim()) { setError('Tên đợt thanh toán là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/payment-phases/${id}`, form)
      else await api.post('/payment-phases', form)
      navigate('/payment-phases')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Chỉnh sửa đợt thanh toán' : 'Thêm đợt thanh toán mới'}</div>
        <button onClick={() => navigate('/payment-phases')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên đợt *</label>
          <input type="text" className="form-control" value={form.phase} onChange={e => set('phase', e.target.value)} placeholder="Vd: Đợt 1" required />
        </div>
        <div className="form-group">
          <label className="form-label">Tỷ lệ (%)</label>
          <input type="number" className="form-control" value={form.percent} onChange={e => set('percent', parseFloat(e.target.value) || 0)} min={0} max={100} step={0.5} />
        </div>
        <div className="form-group">
          <label className="form-label">Mốc thanh toán</label>
          <input type="text" className="form-control" value={form.milestone} onChange={e => set('milestone', e.target.value)} placeholder="Vd: Ký Hợp đồng mua bán (HĐMB)" />
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/payment-phases')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
