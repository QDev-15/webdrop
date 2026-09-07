import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const empty: FormData = { author_name: '', author_role: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<FormData>(`/testimonials/${id}`)
      .then(d => setForm({ ...empty, ...d }))
      .catch(() => setError('Không tìm thấy.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.author_name.trim() || !form.content.trim()) { setError('Tên và nội dung không được để trống.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/testimonials/${id}`, form)
      else await api.post('/testimonials', form)
      navigate('/testimonials')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên độc giả *</label>
            <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò / mô tả</label>
            <input className="form-control" value={form.author_role} onChange={e => set('author_role', e.target.value)} placeholder="Độc giả từ 2021" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá *</label>
          <textarea className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Số sao</label>
            <select className="form-control" value={form.rating} onChange={e => set('rating', parseInt(e.target.value))}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
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
