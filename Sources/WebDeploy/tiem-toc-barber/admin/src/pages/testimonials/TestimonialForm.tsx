import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialFormState {
  customer_name: string
  avatar: string
  meta: string
  rating: number
  content: string
  sort_order: number
  status: string
}

const empty: TestimonialFormState = {
  customer_name: '', avatar: '', meta: '', rating: 5, content: '', sort_order: 0, status: 'published',
}

export default function TestimonialForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<TestimonialFormState>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<TestimonialFormState & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({
        customer_name: d.customer_name, avatar: d.avatar ?? '', meta: d.meta ?? '',
        rating: d.rating ?? 5, content: d.content ?? '', sort_order: d.sort_order ?? 0,
        status: d.status ?? 'published',
      }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TestimonialFormState>(k: K, v: TestimonialFormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.customer_name.trim()) { setError('Tên khách hàng là bắt buộc.'); return }
    if (!form.content.trim()) { setError('Nội dung đánh giá là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/testimonials/${id}`, form)
      else await api.post('/testimonials', form)
      navigate('/testimonials')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div>
        </div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên khách hàng *</label>
          <input className="form-control" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Nguyễn Văn A" required />
        </div>
        <div className="form-group">
          <label className="form-label">Ghi chú (nguồn / thời gian gắn bó)</label>
          <input className="form-control" value={form.meta} onChange={e => set('meta', e.target.value)} placeholder="Khách thường xuyên · 2 năm" />
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.avatar} onChange={v => set('avatar', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá *</label>
          <textarea className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Tìm được tiệm tóc ưng ý..." required />
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
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
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
