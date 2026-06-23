import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialData {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  is_visible: number
}

const empty: TestimonialData = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, is_visible: 1 }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]       = useState<TestimonialData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<TestimonialData & { id: number }>(`/testimonials/${id}`)
        .then(d => setForm({ author_name: d.author_name, author_title: d.author_title, author_avatar: d.author_avatar, content: d.content, rating: d.rating, sort_order: d.sort_order, is_visible: d.is_visible }))
        .catch(() => setError('Không tải được đánh giá.'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/testimonials/${id}`, form) }
      else { await api.post('/testimonials', form) }
      navigate('/testimonials')
    } catch (err) { setError(err instanceof Error ? err.message : 'Lỗi lưu') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/testimonials')}>← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Ảnh đại diện</label>
            <ImageField value={form.author_avatar} onChange={v => setForm(p => ({ ...p, author_avatar: v }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Tên khách hàng *</label>
            <input className="form-control" value={form.author_name} onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức danh / Ghi chú</label>
            <input className="form-control" value={form.author_title} onChange={e => setForm(p => ({ ...p, author_title: e.target.value }))} placeholder="vd: Khách hàng thân thiết, Tháng 11/2024" />
          </div>
          <div className="form-group">
            <label className="form-label">Nội dung đánh giá *</label>
            <textarea className="form-control" rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Số sao (1–5)</label>
              <select className="form-control" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: +e.target.value }))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.is_visible} onChange={e => setForm(p => ({ ...p, is_visible: +e.target.value }))}>
                <option value={1}>Hiển thị</option>
                <option value={0}>Ẩn</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu đánh giá'}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
