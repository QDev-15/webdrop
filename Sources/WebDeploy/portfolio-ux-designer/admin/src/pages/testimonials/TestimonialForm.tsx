import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData {
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  sort_order: number
  status: string
}

const empty: FormData = { author_name: '', author_title: '', author_avatar: '', content: '', rating: 5, sort_order: 0, status: 'published' }

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<Record<string, unknown>>(`/testimonials/${id}`)
      .then(d => setForm({
        author_name: String(d.author_name ?? ''), author_title: String(d.author_title ?? ''),
        author_avatar: String(d.author_avatar ?? ''),
        content: String(d.content ?? ''), rating: Number(d.rating ?? 5),
        sort_order: Number(d.sort_order ?? 0), status: String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.author_name.trim()) { setError('Tên khách hàng là bắt buộc.'); return }
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
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div></div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="author_name">Tên khách hàng *</label>
            <input id="author_name" type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Nguyễn Hoàng Phúc" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="author_title">Vai trò / bối cảnh</label>
            <input id="author_title" type="text" className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="CPO, FinPay Technologies" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện (avatar)" value={form.author_avatar} onChange={v => set('author_avatar', v)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="content">Nội dung đánh giá</label>
          <textarea id="content" className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="rating">Số sao</label>
            <input id="rating" type="number" className="form-control" min={1} max={5} value={form.rating} onChange={e => set('rating', parseInt(e.target.value) || 5)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sort_order">Thứ tự hiển thị</label>
            <input id="sort_order" type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Trạng thái</label>
            <select id="status" className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
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
