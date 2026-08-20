import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface FormState {
  name: string; price: string; description: string; features: string
  is_featured: number; cta_text: string; cta_link: string; sort_order: number; status: string
}

const DEFAULT: FormState = {
  name: '', price: '', description: '', features: '',
  is_featured: 0, cta_text: 'Nhận báo giá', cta_link: '/lien-he', sort_order: 0, status: 'published',
}

export default function PricingForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) api.get<FormState>(`/pricing-plans/${id}`).then(p => setForm(p)).catch(() => nav('/pricing'))
  }, [id])

  const set = (k: keyof FormState, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim()) { setError('Tên gói và giá không được để trống.'); return }
    setLoading(true)
    try {
      if (isEdit) await api.put(`/pricing-plans/${id}`, form)
      else await api.post('/pricing-plans', form)
      nav('/pricing')
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/pricing" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>{isEdit ? 'Sửa gói giá' : 'Thêm gói giá'}</h1>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Tên gói *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Chuyên Nghiệp" required />
            </div>
            <div className="form-group">
              <label className="form-label">Giá *</label>
              <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="VD: 15 triệu/tháng" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Danh sách tính năng (mỗi dòng 1 mục)</label>
            <textarea className="form-control" style={{ minHeight: '120px' }} value={form.features} onChange={e => set('features', e.target.value)} placeholder={'Tư vấn hoạch định tài chính cơ bản\nBáo cáo hàng quý\nHỗ trợ email & điện thoại'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input className="form-control" value={form.cta_text} onChange={e => set('cta_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input className="form-control" value={form.cta_link} onChange={e => set('cta_link', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.is_featured} onChange={e => set('is_featured', parseInt(e.target.value))}>
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
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <Link to="/pricing" className="btn btn-ghost">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
