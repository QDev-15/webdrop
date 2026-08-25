import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormData { author_name: string; author_role: string; avatar: string; content: string; sort_order: number }
const empty: FormData = { author_name: '', author_role: '', avatar: '', content: '', sort_order: 0 }

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
    api.get<FormData & { id: number }>(`/testimonials/${id}`)
      .then(d => setForm({ author_name: d.author_name, author_role: d.author_role ?? '', avatar: d.avatar ?? '', content: d.content ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy đánh giá.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof FormData>(k: K, v: FormData[K]) { setForm(f => ({ ...f, [k]: v })) }

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
        <div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tên khách hàng *</label>
            <input type="text" className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="Vd: Nguyễn Minh Anh" required />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò / căn hộ sở hữu</label>
            <input type="text" className="form-control" value={form.author_role} onChange={e => set('author_role', e.target.value)} placeholder="Vd: Chủ căn 4-08, Tháp Aqua" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh đại diện" value={form.avatar} onChange={v => set('avatar', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Nội dung đánh giá</label>
          <textarea className="form-control" value={form.content} onChange={e => set('content', e.target.value)} rows={4} placeholder="Nội dung đánh giá của khách hàng..." />
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
