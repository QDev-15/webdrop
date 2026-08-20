import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingForm {
  name: string
  price: string
  description: string
  features: string
  is_featured: boolean
  cta_text: string
  cta_link: string
  sort_order: number
  status: string
}

const empty: PricingForm = {
  name: '', price: '', description: '', features: '',
  is_featured: false, cta_text: 'Yêu cầu tư vấn', cta_link: '/lien-he',
  sort_order: 0, status: 'published',
}

export default function PricingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<PricingForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<{ id: number; name: string; price: string; description: string; features: string; is_featured: number; cta_text: string; cta_link: string; sort_order: number; status: string }>(`/pricing-plans/${id}`)
      .then(d => setForm({
        name: d.name, price: d.price, description: d.description ?? '', features: d.features ?? '',
        is_featured: d.is_featured === 1, cta_text: d.cta_text ?? 'Yêu cầu tư vấn', cta_link: d.cta_link ?? '/lien-he',
        sort_order: d.sort_order ?? 0, status: d.status ?? 'published',
      }))
      .catch(() => setError('Không tìm thấy gói giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof PricingForm>(k: K, v: PricingForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.price.trim()) { setError('Tên gói và giá là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = { ...form, is_featured: form.is_featured ? 1 : 0 }
      if (isEdit) {
        await api.put(`/pricing-plans/${id}`, payload)
      } else {
        await api.post('/pricing-plans', payload)
      }
      navigate('/pricing')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa gói giá' : 'Thêm gói giá mới'}</div>
        </div>
        <button onClick={() => navigate('/pricing')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên gói *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Gói Standard" required />
        </div>
        <div className="form-group">
          <label className="form-label">Giá *</label>
          <input type="text" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="Vd: 12tr/tháng hoặc Liên hệ" required />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn</label>
          <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn gọn phù hợp với ai" rows={2} />
        </div>
        <div className="form-group">
          <label className="form-label">Tính năng (mỗi dòng 1 mục)</label>
          <textarea className="form-control" value={form.features} onChange={e => set('features', e.target.value)} placeholder={'Chiến lược marketing toàn diện\nQuản lý 4 kênh social media\n8 bài blog/tháng'} rows={6} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chữ nút CTA</label>
            <input type="text" className="form-control" value={form.cta_text} onChange={e => set('cta_text', e.target.value)} placeholder="Chọn gói" />
          </div>
          <div className="form-group">
            <label className="form-label">Liên kết nút CTA</label>
            <input type="text" className="form-control" value={form.cta_link} onChange={e => set('cta_link', e.target.value)} placeholder="/lien-he" />
          </div>
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
            <span className="form-label" style={{ margin: 0 }}>Đánh dấu "Phổ biến" (nổi bật)</span>
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/pricing')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
