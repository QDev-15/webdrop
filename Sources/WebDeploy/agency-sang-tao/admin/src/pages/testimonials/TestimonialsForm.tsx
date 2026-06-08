import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import ImageField from '../../components/ImageField'
import { api } from '../../api/client'

interface TForm {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const INIT: TForm = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TForm>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<TForm & { id: number }>(`/testimonials/${id}`)
        .then(d => setForm({ author_name: d.author_name, author_title: d.author_title || '', author_avatar: d.author_avatar || '', content: d.content, rating: d.rating, sort_order: d.sort_order, status: d.status }))
        .catch(() => setError('Không tìm thấy.'))
    }
  }, [id, isEdit])

  const set = (k: keyof TForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.author_name || !form.content) { setError('Tên tác giả và nội dung không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/testimonials/${id}`, form) }
      else { await api.post('/testimonials', form) }
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout title={isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h1>
        <button className="btn-ghost" onClick={() => navigate('/testimonials')}>Quay lại</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên tác giả *</label>
              <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chức danh / Công ty</label>
              <input className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="CEO · Tên Công ty" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh tác giả" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={4} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Số sao (1-5)</label>
              <select className="form-control" value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} sao {'★'.repeat(r)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
