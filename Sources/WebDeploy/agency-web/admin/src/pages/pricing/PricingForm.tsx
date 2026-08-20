import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingData { name: string; price: string; description: string; features: string; is_featured: number; cta_text: string; cta_link: string; sort_order: number; status: string }

const INIT: PricingData = { name: '', price: '', description: '', features: '', is_featured: 0, cta_text: 'Liên hệ ngay', cta_link: '/lien-he', sort_order: 0, status: 'published' }

export default function PricingForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<PricingData>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<PricingData & { id: number }>(`/pricing-plans/${id}`).then(d => setForm(d)).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price.trim()) { setError('Tên gói và giá không được để trống.'); return }
    setSaving(true); setError('')
    try {
      isEdit ? await api.put(`/pricing-plans/${id}`, form) : await api.post('/pricing-plans', form)
      navigate('/pricing')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa gói giá' : 'Thêm gói giá mới'}</div></div>
        <button onClick={() => navigate('/pricing')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên gói *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Professional" required />
            </div>
            <div className="form-group">
              <label className="form-label">Giá *</label>
              <input className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="35.000.000đ / Liên hệ" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Danh sách tính năng (mỗi dòng 1 mục)</label>
            <textarea className="form-control" style={{ minHeight: '120px' }} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder={'Không giới hạn trang\nCMS quản lý nội dung\nHỗ trợ 3 tháng'} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input className="form-control" value={form.cta_text} onChange={e => setForm({ ...form, cta_text: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input className="form-control" value={form.cta_link} onChange={e => setForm({ ...form, cta_link: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="toggle">
              <input type="checkbox" checked={form.is_featured === 1} onChange={e => setForm({ ...form, is_featured: e.target.checked ? 1 : 0 })} />
              <span className="toggle-slider" />
              <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Gói nổi bật (★ Phổ biến nhất)</span>
            </label>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu gói giá'}</button>
            <button type="button" onClick={() => navigate('/pricing')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
