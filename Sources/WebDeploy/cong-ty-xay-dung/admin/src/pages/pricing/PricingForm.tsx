import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingForm {
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

const DEFAULT: PricingForm = {
  name: '', price: '', description: '', features: '',
  is_featured: 0, cta_text: 'Nhận báo giá', cta_link: '/lien-he', sort_order: 0, status: 'published'
}

export default function PricingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<PricingForm>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<(PricingForm & { id: number })[]>('/pricing-plans').then(arr => {
        const found = arr.find(p => p.id === Number(id))
        if (found) setForm({ ...found })
      }).catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof PricingForm, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim()) { setError('Tên gói và giá không được để trống.'); return }
    setError('')
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/pricing-plans/${id}`, form)
      } else {
        await api.post('/pricing-plans', form)
      }
      navigate('/pricing')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa gói giá' : 'Thêm gói giá mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/pricing')}>Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Tên gói *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Gói Tiêu Chuẩn" required />
            </div>
            <div className="form-group">
              <label className="form-label">Giá *</label>
              <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Từ 5.800.000đ/m²" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Danh sách tính năng (mỗi dòng 1 mục)</label>
            <textarea className="form-control" style={{ minHeight: 120 }} value={form.features} onChange={e => set('features', e.target.value)} placeholder={'Thi công phần thô\nHoàn thiện sơn nước, ốp lát\nBảo hành công trình 5 năm'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input className="form-control" value={form.cta_text} onChange={e => set('cta_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input className="form-control" value={form.cta_link} onChange={e => set('cta_link', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.is_featured} onChange={e => set('is_featured', Number(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Có (Phổ biến nhất)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/pricing')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
