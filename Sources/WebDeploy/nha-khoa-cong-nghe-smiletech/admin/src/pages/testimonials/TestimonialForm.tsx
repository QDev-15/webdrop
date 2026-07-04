import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Testimonial {
  id?: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  is_active: number
}

const INIT: Testimonial = {
  author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, is_active: 1,
}

export default function TestimonialForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<Testimonial>(INIT)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<Testimonial[]>('/testimonials').then(list => {
        const found = list.find((t: Testimonial & { id?: number }) => t.id === Number(id))
        if (found) setForm(found)
      }).catch(console.error).finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (k: keyof Testimonial, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) {
      setError('Tên tác giả và nội dung không được để trống.')
      return
    }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (e: unknown) {
      setError((e as Error).message || 'Lỗi khi lưu.')
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-grid">
          <div className="form-field">
            <label>Tên khách hàng *</label>
            <input value={form.author_name} onChange={e => set('author_name', e.target.value)} required placeholder="Nguyễn Thị A" />
          </div>
          <div className="form-field">
            <label>Chức danh / Dịch vụ đã dùng</label>
            <input value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="Niềng răng Invisalign AI" />
          </div>
        </div>

        <div className="form-field">
          <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>

        <div className="form-field">
          <label>Nội dung đánh giá *</label>
          <textarea rows={4} value={form.content} onChange={e => set('content', e.target.value)} required placeholder="Nội dung nhận xét..." />
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>Số sao (1–5)</label>
            <select value={form.rating} onChange={e => set('rating', Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Thứ tự</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} min={0} />
          </div>
          <div className="form-field">
            <label>Trạng thái</label>
            <select value={form.is_active} onChange={e => set('is_active', Number(e.target.value))}>
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/testimonials')}>Huỷ</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm đánh giá'}
          </button>
        </div>
      </form>
    </div>
  )
}
