import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface PlanItem { item: string; available: number }
interface PlanData { name: string; description: string; price_monthly: number; price_yearly: number; is_featured: number; is_free: number; cta_text: string; cta_link: string; sort_order: number; status: string; items: PlanItem[] }

const empty: PlanData = { name: '', description: '', price_monthly: 0, price_yearly: 0, is_featured: 0, is_free: 0, cta_text: 'Bắt đầu', cta_link: '/lien-he', sort_order: 0, status: 'published', items: [] }

export default function PricingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<PlanData>(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<PlanData>(`/pricing/${id}`).then(setForm).catch(() => setError('Không tìm thấy'))
    }
  }, [id, isEdit])

  const set = (field: keyof PlanData, value: unknown) => setForm(f => ({ ...f, [field]: value }))

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { item: '', available: 1 }] }))
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))
  const setItem = (i: number, field: keyof PlanItem, value: string | number) => {
    setForm(f => {
      const items = [...f.items]
      items[i] = { ...items[i], [field]: value }
      return { ...f, items }
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) await api.put(`/pricing/${id}`, form)
      else await api.post('/pricing', form)
      navigate('/pricing')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa gói giá' : 'Thêm gói giá'}</h1>
      </div>
      <div className="card" style={{ maxWidth: 800 }}>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên gói *</label>
              <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Gói miễn phí?</label>
              <select className="form-control" value={form.is_free} onChange={e => set('is_free', parseInt(e.target.value))}>
                <option value={0}>Có phí</option>
                <option value={1}>Miễn phí</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Giá hàng tháng (đ)</label>
              <input type="number" className="form-control" value={form.price_monthly} onChange={e => set('price_monthly', parseFloat(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Giá hàng năm (đ/tháng)</label>
              <input type="number" className="form-control" value={form.price_yearly} onChange={e => set('price_yearly', parseFloat(e.target.value))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input type="text" className="form-control" value={form.cta_text} onChange={e => set('cta_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input type="text" className="form-control" value={form.cta_link} onChange={e => set('cta_link', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nổi bật (Phổ biến nhất)</label>
              <select className="form-control" value={form.is_featured} onChange={e => set('is_featured', parseInt(e.target.value))}>
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Danh sách tính năng trong gói</label>
            <div className="feature-items-list">
              {form.items.map((item, i) => (
                <div key={i} className="feature-item-row">
                  <input type="text" className="form-control" value={item.item} onChange={e => setItem(i, 'item', e.target.value)} placeholder="Tên tính năng" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={item.available === 1} onChange={e => setItem(i, 'available', e.target.checked ? 1 : 0)} title="Có trong gói" />
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Có</span>
                  </div>
                  <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => removeItem(i)}>×</button>
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}>+ Thêm tính năng</button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hiển thị</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/pricing')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
