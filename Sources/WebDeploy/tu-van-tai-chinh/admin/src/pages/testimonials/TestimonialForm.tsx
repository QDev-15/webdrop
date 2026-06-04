import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'

interface FormState { author_name: string; author_title: string; author_avatar: string; content: string; rating: number; sort_order: number; status: string }

const DEFAULT: FormState = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormState>(DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) api.get<FormState>(`/testimonials/${id}`).then(t => setForm(t)).catch(() => nav('/testimonials'))
  }, [id])

  const set = (k: keyof FormState, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name || !form.content) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setLoading(true)
    try {
      if (isEdit) await api.put(`/testimonials/${id}`, form)
      else await api.post('/testimonials', form)
      nav('/testimonials')
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: '540px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/testimonials" className="btn btn-ghost btn-sm">← Quay lại</Link>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h1>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên tác giả *</label>
            <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức vụ / Công ty</label>
            <input className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="VD: Giám đốc điều hành, Công ty ABC" />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={4} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Sao đánh giá</label>
              <select className="form-control" value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
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
            <Link to="/testimonials" className="btn btn-ghost">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
