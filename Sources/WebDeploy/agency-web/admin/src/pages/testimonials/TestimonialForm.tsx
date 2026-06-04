import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface TData { author_name: string; author_title: string; author_avatar: string; content: string; rating: number; sort_order: number; status: string }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TData>({ author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Array<TData & { id: number }>>('/testimonials').then(arr => {
      const found = arr.find(t => t.id === Number(id))
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) { setError('Tên và nội dung bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      isEdit ? await api.put(`/testimonials/${id}`, form) : await api.post('/testimonials', form)
      navigate('/testimonials')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</div></div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">← Quay lại</button>
      </div>
      <div className="card" style={{ maxWidth: '540px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên khách hàng *</label>
              <input className="form-control" value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ / Công ty</label>
              <input className="form-control" value={form.author_title} onChange={e => setForm({ ...form, author_title: e.target.value })} placeholder="CEO · Công ty ABC" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh đại diện (URL)</label>
            <input className="form-control" value={form.author_avatar} onChange={e => setForm({ ...form, author_avatar: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Số sao (1–5)</label>
              <select className="form-select" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao {'★'.repeat(n)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
