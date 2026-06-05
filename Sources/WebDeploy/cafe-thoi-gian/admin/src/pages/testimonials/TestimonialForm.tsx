import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface FormData {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>({ author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<FormData & { id: number }>(`/testimonials/${id}`)
        .then(data => setForm({ author_name: data.author_name, author_title: data.author_title || '', author_avatar: data.author_avatar || '', content: data.content, rating: data.rating, sort_order: data.sort_order, status: data.status }))
        .catch(() => navigate('/testimonials'))
    }
  }, [id, isEdit, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (isEdit) { await api.put(`/testimonials/${id}`, form) }
      else { await api.post('/testimonials', form) }
      navigate('/testimonials')
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi lưu') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</div></div>
        <button className="btn-ghost btn-sm" onClick={() => navigate('/testimonials')}>← Quay lại</button>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Tên khách *</label>
              <input className="form-control" value={form.author_name} onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức danh/Mô tả</label>
              <input className="form-control" value={form.author_title} onChange={e => setForm(p => ({ ...p, author_title: e.target.value }))} placeholder="Freelancer · TP.HCM" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL ảnh avatar</label>
            <input className="form-control" type="url" value={form.author_avatar} onChange={e => setForm(p => ({ ...p, author_avatar: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Số sao (1-5)</label>
              <input className="form-control" type="number" min={1} max={5} value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) || 5 }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="published">Công khai</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu đánh giá'}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
