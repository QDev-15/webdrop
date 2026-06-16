import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface ItemForm {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const emptyForm: ItemForm = {
  author_name: '', author_title: '', author_avatar: '', content: '',
  rating: 5, sort_order: 0, status: 'published',
}

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ItemForm>(emptyForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<ItemForm & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({ author_name: d.author_name, author_title: d.author_title ?? '', author_avatar: d.author_avatar ?? '', content: d.content, rating: d.rating ?? 5, sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) { setError('Tên và nội dung là bắt buộc.'); return }
    setError(''); setSaving(true)
    try {
      if (isEdit) { await api.put(`/testimonials/${id}`, form) }
      else { await api.post('/testimonials', form) }
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div>
        </div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên tác giả *</label>
            <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Vd: Nguyễn Văn An" required />
          </div>
          <div className="form-group">
            <label className="form-label">Chức vụ / Địa chỉ</label>
            <input type="text" className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="Vd: Thực dưỡng · TP.HCM" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá *</label>
          <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nội dung đánh giá..." rows={4} required />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Số sao</label>
            <select className="form-control" value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} sao</option>)}
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
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
