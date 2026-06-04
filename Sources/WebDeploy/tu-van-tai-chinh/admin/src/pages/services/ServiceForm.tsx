import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface FormState { name: string; description: string; content: string; icon: string; image: string; price: string; featured: number; sort_order: number; status: string }

const DEFAULT: FormState = { name: '', description: '', content: '', icon: '', image: '', price: '', featured: 0, sort_order: 0, status: 'published' }

export default function ServiceForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) api.get<FormState>(`/services/${id}`).then(s => setForm(s)).catch(() => nav('/services'))
  }, [id])

  const set = (k: keyof FormState, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) { setError('Tên không được để trống.'); return }
    setLoading(true)
    try {
      if (isEdit) await api.put(`/services/${id}`, form)
      else await api.post('/services', form)
      nav('/services')
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/services" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>{isEdit ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}</h1>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên dịch vụ *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung chi tiết</label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={5} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Giá / Chi phí</label>
              <input className="form-control" value={form.price} onChange={e => set('price', e.target.value)} placeholder="VD: Từ 5 triệu/tháng" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL Hình ảnh</label>
            <input className="form-control" type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nổi bật</label>
              <select className="form-control" value={form.featured} onChange={e => set('featured', parseInt(e.target.value))}>
                <option value={1}>Có</option>
                <option value={0}>Không</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <Link to="/services" className="btn btn-ghost">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
