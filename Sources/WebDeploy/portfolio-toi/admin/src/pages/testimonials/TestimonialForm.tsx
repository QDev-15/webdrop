import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TForm {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const empty: TForm = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<TForm>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean(id)

  useEffect(() => {
    if (id) {
      api.get<TForm & { id: number }>(`/testimonials/${id}`).then(t => {
        setForm({ author_name: t.author_name, author_title: t.author_title ?? '', author_avatar: t.author_avatar ?? '', content: t.content, rating: t.rating, sort_order: t.sort_order, status: t.status })
      }).catch(() => setError('Không thể tải dữ liệu.'))
    }
  }, [id])

  const set = (key: keyof TForm, val: string | number) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name || !form.content) { setError('Tên và nội dung là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) await api.put(`/testimonials/${id}`, form)
      else await api.post('/testimonials', form)
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</div></div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">← Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Tên tác giả *</label>
              <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Nguyễn Văn A" required />
            </div>
            <div>
              <label className="form-label">Chức danh</label>
              <input type="text" className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="CEO · Công ty ABC" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" style={{ minHeight: 120 }} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nội dung nhận xét..." required />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Số sao (1-5)</label>
              <input type="number" className="form-control" min={1} max={5} value={form.rating} onChange={e => set('rating', parseInt(e.target.value) || 5)} />
            </div>
            <div>
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu đánh giá'}</button>
            <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
