import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface PricingFormData {
  name: string
  price: string
  description: string
  features: string
  is_featured: number
  cta_text: string
  cta_link: string
  sort_order: number
  status: string
}

const INIT: PricingFormData = { name: '', price: '', description: '', features: '', is_featured: 0, cta_text: 'Liên hệ ngay', cta_link: '/lien-he', sort_order: 0, status: 'published' }

export default function PricingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<PricingFormData>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<PricingFormData & { id: number }>(`/pricing-plans/${id}`)
        .then(d => setForm({
          name: d.name, price: d.price, description: d.description || '', features: d.features || '',
          is_featured: d.is_featured, cta_text: d.cta_text || 'Liên hệ ngay', cta_link: d.cta_link || '/lien-he',
          sort_order: d.sort_order, status: d.status,
        }))
        .catch(() => setError('Không tìm thấy gói giá.'))
    }
  }, [id, isEdit])

  const set = (k: keyof PricingFormData, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) { setError('Tên gói và giá không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/pricing-plans/${id}`, form) }
      else { await api.post('/pricing-plans', form) }
      navigate('/pricing')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout title={isEdit ? 'Sửa gói giá' : 'Thêm gói giá'}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa gói giá' : 'Thêm gói giá'}</h1>
        <button className="btn-ghost" onClick={() => navigate('/pricing')}>Quay lại</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên gói *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full Brand Identity" required />
            </div>
            <div className="form-group">
              <label className="form-label">Giá *</label>
              <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Từ 45 triệu / Liên hệ" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Danh sách tính năng (mỗi dòng 1 mục)</label>
            <textarea className="form-control" value={form.features} onChange={e => set('features', e.target.value)} rows={5} placeholder={'Logo design\nBrand guideline\n3 vòng revision'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input className="form-control" value={form.cta_text} onChange={e => set('cta_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input className="form-control" value={form.cta_link} onChange={e => set('cta_link', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Nổi bật (★ Phổ biến nhất)</label>
              <select className="form-control" value={form.is_featured} onChange={e => set('is_featured', parseInt(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Đã đăng</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/pricing')}>Hủy</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
