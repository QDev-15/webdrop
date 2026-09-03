import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  code: string
  description: string
  sort_order: number
}

const EMPTY: FormData = { code: '', description: '', sort_order: 0 }

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
    api.get<FormData & { id: number }>(`/coupons/${id}`)
      .then(d => setForm({ code: d.code, description: d.description ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tải được mã khuyến mãi'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) { setError('Mã khuyến mãi không được để trống'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.post(`/coupons/${id}/update`, form)
      } else {
        await api.post('/coupons', form)
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
        <h1 className="admin-page-title">{isEdit ? 'Sửa mã khuyến mãi' : 'Thêm mã khuyến mãi mới'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-group">
          <label>Mã khuyến mãi <span className="req">*</span></label>
          <input type="text" className="form-control" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="VD: VANG50" style={{ fontFamily: 'monospace' }} />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea rows={3} className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="VD: Giảm 50.000₫ cho đơn hàng từ 500.000₫" />
        </div>

        <div className="form-group">
          <label>Thứ tự sắp xếp</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/coupons')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  )
}
