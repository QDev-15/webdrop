import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  code: string
  description: string
  sort_order: number
  active: boolean
}

const EMPTY: FormData = { code: '', description: '', sort_order: 0, active: true }

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
    api.get<{ code: string; description: string; sort_order: number; active: number }>(`/coupons/${id}`)
      .then(d => setForm({ code: d.code, description: d.description ?? '', sort_order: d.sort_order ?? 0, active: Boolean(d.active) }))
      .catch(() => setError('Không tải được mã giảm giá'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) { setError('Mã giảm giá không được để trống'); return }
    setSaving(true); setError('')
    const payload = { ...form, active: form.active ? 1 : 0 }
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

        <div className="form-group">
          <label>Mã giảm giá <span className="req">*</span></label>
          <input type="text" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="VD: MOCAN10" style={{ textTransform: 'uppercase' }} />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <input type="text" value={form.description} onChange={e => set('description', e.target.value)} placeholder="VD: Giảm 10% cho đơn từ 2.000.000₫" />
        </div>

        <div className="form-row" style={{ gap: 24 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Thứ tự sắp xếp</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
          </div>
          <label className="form-check" style={{ alignSelf: 'center' }}>
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
            <span>Hiển thị trên trang Khuyến mãi</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/coupons')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
