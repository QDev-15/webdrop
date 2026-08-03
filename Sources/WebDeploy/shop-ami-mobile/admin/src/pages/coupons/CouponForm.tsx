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
  code: '', type: 'percent', value: '', min_order: '', max_uses: '', expires_at: '', is_active: true,
}

export default function CouponForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/coupons/${id}`)
      .then(d => setForm({
        code: String(d.code ?? ''),
        type: (d.type === 'fixed' ? 'fixed' : 'percent'),
        value: String(d.value ?? ''),
        min_order: String(d.min_order ?? ''),
        max_uses: d.max_uses === null || d.max_uses === undefined ? '' : String(d.max_uses),
        expires_at: d.expires_at ? String(d.expires_at).slice(0, 10) : '',
        is_active: Boolean(d.is_active),
      }))
      .catch(() => setError('Không tải được mã giảm giá'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) { setError('Mã giảm giá không được để trống'); return }
    if (!form.value || Number(form.value) <= 0) { setError('Giá trị giảm giá phải lớn hơn 0'); return }
    setSaving(true); setError('')
    const payload = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: Number(form.value) || 0,
      min_order: Number(form.min_order) || 0,
      max_uses: form.max_uses ? Number(form.max_uses) : '',
      expires_at: form.expires_at || '',
      is_active: form.is_active,
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
        <h1 className="admin-page-title">{isEdit ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Mã giảm giá <span className="req">*</span></label>
            <input type="text" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="VD: AMI10" disabled={isEdit} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Loại giảm giá</label>
            <select value={form.type} onChange={e => set('type', e.target.value as 'percent' | 'fixed')}>
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (đ)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giá trị {form.type === 'percent' ? '(%)' : '(VND)'} <span className="req">*</span></label>
            <input type="number" value={form.value} onChange={e => set('value', e.target.value)} min={0} placeholder={form.type === 'percent' ? 'VD: 10' : 'VD: 50000'} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Đơn hàng tối thiểu (VND)</label>
            <input type="number" value={form.min_order} onChange={e => set('min_order', e.target.value)} min={0} placeholder="VD: 300000" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Giới hạn số lượt dùng (để trống = không giới hạn)</label>
            <input type="number" value={form.max_uses} onChange={e => set('max_uses', e.target.value)} min={0} placeholder="VD: 100" />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Ngày hết hạn (để trống = không giới hạn)</label>
            <input type="date" value={form.expires_at} onChange={e => set('expires_at', e.target.value)} />
          </div>
        </div>

        <label className="form-check">
          <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
          <span>Đang hoạt động</span>
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/coupons')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
