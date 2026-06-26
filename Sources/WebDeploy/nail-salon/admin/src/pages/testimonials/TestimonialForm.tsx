import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Testimonial {
  id: number; author_name: string; author_location: string
  author_avatar: string; content: string; rating: number; sort_order: number
}

const blank = { author_name: '', author_location: '', author_avatar: '', content: '', rating: '5', sort_order: '0' }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(blank)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Testimonial[]>('/testimonials').then(items => {
      const t = items.find(x => x.id === +id!)
      if (t) setForm({
        author_name: t.author_name, author_location: t.author_location,
        author_avatar: t.author_avatar, content: t.content,
        rating: t.rating.toString(), sort_order: t.sort_order.toString(),
      })
      setLoading(false)
    })
  }, [id, isEdit])

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    const payload = {
      author_name: form.author_name, author_location: form.author_location,
      author_avatar: form.author_avatar, content: form.content,
      rating: +form.rating, sort_order: +form.sort_order,
    }
    try {
      if (isEdit) await api.put(`/testimonials/${id}`, payload)
      else await api.post('/testimonials', payload)
      navigate('/testimonials')
    } catch (e) { setError(e instanceof Error ? e.message : 'Lỗi'); setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div></div>
        <button className="btn-ghost" onClick={() => navigate('/testimonials')}>← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Họ tên khách hàng *</label>
              <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input className="form-control" value={form.author_location} onChange={e => set('author_location', e.target.value)} placeholder="VD: Quận 1, TP.HCM" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)} placeholder="URL ảnh avatar" />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} required placeholder="Nội dung nhận xét của khách hàng..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Số sao (1-5)</label>
              <select className="form-control" value={form.rating} onChange={e => set('rating', e.target.value)}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n} sao)</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự sắp xếp</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm đánh giá')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
