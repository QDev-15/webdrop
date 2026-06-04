import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface ServiceData { name: string; description: string; content: string; icon: string; image: string; price: string; featured: number; sort_order: number; status: string }

export default function ServiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<ServiceData>({ name: '', description: '', content: '', icon: '', image: '', price: '', featured: 0, sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<ServiceData & { id: number }>(`/services/${id}`).then(d => setForm(d)).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên dịch vụ không được để trống.'); return }
    setSaving(true); setError('')
    try {
      isEdit ? await api.put(`/services/${id}`, form) : await api.post('/services', form)
      navigate('/services')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</div></div>
        <button onClick={() => navigate('/services')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên dịch vụ *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input className="form-control" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="🖥️" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung chi tiết</label>
            <textarea className="form-control" style={{ minHeight: '140px' }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ảnh (URL)</label>
              <input className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Giá (text)</label>
              <input className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Từ 5.000.000đ" />
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
              <input type="checkbox" checked={form.featured === 1} onChange={e => setForm({ ...form, featured: e.target.checked ? 1 : 0 })} />
              <span className="toggle-slider" />
              <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Dịch vụ nổi bật</span>
            </label>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu dịch vụ'}</button>
            <button type="button" onClick={() => navigate('/services')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
