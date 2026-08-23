import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface TestimonialForm { name: string; role: string; avatar: string; content: string; rating: number; sort_order: number }
const empty: TestimonialForm = { name: '', role: '', avatar: '', content: '', rating: 5, sort_order: 0 }

export default function TestimonialFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<TestimonialForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<TestimonialForm & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({ name: d.name, role: d.role ?? '', avatar: d.avatar ?? '', content: d.content, rating: d.rating ?? 5, sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TestimonialForm>(k: K, v: TestimonialForm[K]) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.content.trim()) { setError('Tên và nội dung là bắt buộc.'); return }
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
        <div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò / mô tả ngắn</label>
            <input type="text" className="form-control" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Vd: Người mua nhà tại Cầu Giấy, Hà Nội" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.avatar} onChange={v => set('avatar', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá *</label>
          <textarea className="form-control" rows={4} value={form.content} onChange={e => set('content', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Số sao (1-5)</label>
            <input type="number" className="form-control" min={1} max={5} value={form.rating} onChange={e => set('rating', parseInt(e.target.value) || 5)} />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
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
