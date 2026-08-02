import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  code: string
  type: 'percent' | 'fixed'
  value: string
  min_order: string
  max_uses: string
  expires_at: string
  is_active: boolean
}

const EMPTY: FormData = {
  code: '', type: 'percent', value: '', min_order: '0', max_uses: '0', expires_at: '', is_active: true,
}

export default function CouponForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm]     = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/coupons/${id}`)
      .then(c => setForm({
        code:       String(c.code ?? ''),
        type:       (c.type === 'fixed' ? 'fixed' : 'percent') as 'percent' | 'fixed',
        value:      String(c.value ?? ''),
        min_order:  String(c.min_order ?? '0'),
        max_uses:   String(c.max_uses ?? '0'),
        expires_at: c.expires_at ? String(c.expires_at).slice(0, 10) : '',
        is_active:  Boolean(Number(c.is_active ?? 1)),
      }))
      .catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) { setError('Vui lòng nhập mã giảm giá'); return }
    const val = Number(form.value)
    if (!val || val <= 0) { setError('Giá trị giảm phải lớn hơn 0'); return }
    if (form.type === 'percent' && val > 100) { setError('Phần trăm giảm không được vượt quá 100%'); return }
    setSaving(true); setError('')
    const payload = {
      code:      form.code.trim().toUpperCase(),
      type:      form.type,
      value:     val,
      min_order: Number(form.min_order) || 0,
      max_uses:  Number(form.max_uses) || 0,
      expires_at: form.expires_at || '',
      is_active: form.is_active ? 1 : 0,
    }
    try {
      if (isEdit) {
        await api.post(`/coupons/${id}/update`, payload)
      } else {
        await api.post('/coupons', payload)
      }
      navigate('/coupons')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Sửa phiếu giảm giá' : 'Thêm phiếu giảm giá'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Mã giảm giá <span className="req">*</span></label>
            <input
              type="text"
              value={form.code}
              onChange={e => set('code', e.target.value.toUpperCase())}
              placeholder="VD: WELCOME10"
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: 1 }}
            />
            <small style={{ color: 'var(--text-3)', fontSize: 11 }}>Tự động chuyển thành chữ HOA khi nhập</small>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Loại giảm</label>
            <select value={form.type} onChange={e => set('type', e.target.value as 'percent' | 'fixed')}>
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Cố định (đ)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá trị giảm <span className="req">*</span></label>
            <input
              type="number"
              value={form.value}
              onChange={e => set('value', e.target.value)}
              min={1}
              max={form.type === 'percent' ? 100 : undefined}
              placeholder={form.type === 'percent' ? 'VD: 10 (= 10%)' : 'VD: 50000 (= 50.000đ)'}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đơn hàng tối thiểu (đ)</label>
            <input type="number" value={form.min_order} onChange={e => set('min_order', e.target.value)} min={0} placeholder="0 = không giới hạn" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Số lần dùng tối đa</label>
            <input type="number" value={form.max_uses} onChange={e => set('max_uses', e.target.value)} min={0} placeholder="0 = không giới hạn" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Ngày hết hạn</label>
            <input type="date" value={form.expires_at} onChange={e => set('expires_at', e.target.value)} />
            <small style={{ color: 'var(--text-3)', fontSize: 11 }}>Để trống = không hết hạn</small>
          </div>
          <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'flex-end', paddingBottom: 6 }}>
            <label className="form-check" style={{ margin: 0 }}>
              <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
              <span>Kích hoạt (cho phép khách dùng)</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/coupons')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu phiếu giảm giá'}
          </button>
        </div>
      </form>
    </div>
  )
}
