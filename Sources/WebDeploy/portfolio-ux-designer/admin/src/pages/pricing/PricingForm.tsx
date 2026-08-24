import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  name: string
  tag: string
  price: string
  unit: string
  features: string
  is_featured: boolean
  cta_text: string
  cta_link: string
  sort_order: number
  status: string
}

const empty: FormData = {
  name: '', tag: '', price: '', unit: '', features: '',
  is_featured: false, cta_text: 'Chọn gói này', cta_link: '/lien-he', sort_order: 0, status: 'published',
}

export default function PricingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/pricing-plans/${id}`)
      .then(d => setForm({
        name: String(d.name ?? ''), tag: String(d.tag ?? ''), price: String(d.price ?? ''), unit: String(d.unit ?? ''),
        features: String(d.features ?? ''), is_featured: Number(d.is_featured ?? 0) === 1,
        cta_text: String(d.cta_text ?? 'Chọn gói này'), cta_link: String(d.cta_link ?? '/lien-he'),
        sort_order: Number(d.sort_order ?? 0), status: String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không tìm thấy gói giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.price.trim()) { setError('Tên gói và giá không được để trống.'); return }
    setSaving(true)
    try {
      const payload = { ...form, is_featured: form.is_featured ? 1 : 0 }
      if (isEdit) await api.put(`/pricing-plans/${id}`, payload)
      else await api.post('/pricing-plans', payload)
      navigate('/pricing')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa gói giá' : 'Thêm gói giá mới'}</div></div>
        <button onClick={() => navigate('/pricing')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Tên gói *</label>
            <input id="name" type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="UX Audit" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="tag">Nhãn (tag)</label>
            <input id="tag" type="text" className="form-control" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Phổ biến nhất" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="price">Giá *</label>
            <input id="price" type="text" className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="8 – 15 triệu" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="unit">Đơn vị</label>
            <input id="unit" type="text" className="form-control" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="/ dự án" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="features">Tính năng (mỗi dòng 1 mục)</label>
          <textarea id="features" className="form-control" rows={6} value={form.features} onChange={e => set('features', e.target.value)}
            placeholder={'Heuristic evaluation toàn bộ luồng chính\nPhỏng vấn nhanh 5-6 người dùng'} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="cta_text">Chữ nút CTA</label>
            <input id="cta_text" type="text" className="form-control" value={form.cta_text} onChange={e => set('cta_text', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cta_link">Liên kết nút</label>
            <input id="cta_link" type="text" className="form-control" value={form.cta_link} onChange={e => set('cta_link', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="sort_order">Thứ tự hiển thị</label>
            <input id="sort_order" type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Trạng thái</label>
            <select id="status" className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 28 }}>
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
              <span className="form-label" style={{ margin: 0 }}>Gói nổi bật (featured)</span>
            </label>
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
