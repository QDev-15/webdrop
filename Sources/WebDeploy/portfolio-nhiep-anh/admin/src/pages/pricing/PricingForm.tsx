import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingForm {
  name: string
  price: string
  unit: string
  description: string
  features: string
  is_featured: boolean
  badge_text: string
  cta_text: string
  cta_link: string
  sort_order: number
  status: string
}

const empty: PricingForm = {
  name: '', price: '', unit: '/ trọn gói', description: '', features: '',
  is_featured: false, badge_text: 'Phổ biến nhất', cta_text: 'Chọn gói này', cta_link: '/lien-he',
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
    api.get<Record<string, unknown>>(`/pricing-plans/${id}`)
      .then(d => setForm({
        name: String(d.name ?? ''), price: String(d.price ?? ''), unit: String(d.unit ?? '/ trọn gói'),
        description: String(d.description ?? ''), features: String(d.features ?? ''),
        is_featured: Number(d.is_featured ?? 0) === 1, badge_text: String(d.badge_text ?? 'Phổ biến nhất'),
        cta_text: String(d.cta_text ?? 'Chọn gói này'), cta_link: String(d.cta_link ?? '/lien-he'),
        sort_order: Number(d.sort_order ?? 0), status: String(d.status ?? 'published'),
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
          <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Gói Nâng Cao" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Giá *</label>
            <input type="text" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="28.000.000đ" required />
          </div>
          <div className="form-group">
            <label className="form-label">Đơn vị</label>
            <input type="text" className="form-control" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="/ trọn gói" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ngắn</label>
          <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Phù hợp với lễ cưới quy mô nào" rows={2} />
        </div>
        <div className="form-group">
          <label className="form-label">Tính năng (mỗi dòng 1 mục)</label>
          <textarea className="form-control" value={form.features} onChange={e => set('features', e.target.value)} placeholder={'1 photographer chính\n6 giờ tác nghiệp trong ngày\n200 ảnh đã chỉnh sửa hoàn chỉnh'} rows={6} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chữ nút CTA</label>
            <input type="text" className="form-control" value={form.cta_text} onChange={e => set('cta_text', e.target.value)} placeholder="Chọn gói này" />
          </div>
          <div className="form-group">
            <label className="form-label">Liên kết nút CTA</label>
            <input type="text" className="form-control" value={form.cta_link} onChange={e => set('cta_link', e.target.value)} placeholder="/lien-he" />
          </div>
        </div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
            <span className="form-label" style={{ margin: 0 }}>Đánh dấu nổi bật (gói giữa)</span>
          </label>
        </div>
        {form.is_featured && (
          <div className="form-group">
            <label className="form-label">Chữ badge nổi bật</label>
            <input type="text" className="form-control" value={form.badge_text} onChange={e => set('badge_text', e.target.value)} placeholder="Phổ biến nhất" style={{ maxWidth: 260 }} />
          </div>
        )}
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
