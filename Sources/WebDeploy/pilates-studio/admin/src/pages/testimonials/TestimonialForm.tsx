import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Testimonial {
  id: number; name: string; role: string; avatar_url: string
  content: string; rating: number; is_active: number; sort_order: number
}

type FormState = Omit<Testimonial, 'id'>

const emptyForm: FormState = {
  name: '', role: '', avatar_url: '', content: '', rating: 5, is_active: 1, sort_order: 0,
}

export default function TestimonialForm() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm]     = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Testimonial>(`/testimonials/${id}`)
      .then(d => setForm({
        name: d.name, role: d.role ?? '', avatar_url: d.avatar_url ?? '',
        content: d.content, rating: d.rating, is_active: d.is_active, sort_order: d.sort_order,
      }))
      .catch(e => setError(e instanceof Error ? e.message : 'Không tải được dữ liệu.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormState, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.content.trim()) { setError('Tên và nội dung không được trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, form)
      } else {
        await api.post('/testimonials', form)
      }
      navigate('/testimonials')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu dữ liệu.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</div></div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          <div className="card">
            <div className="form-group">
              <label className="form-label">Họ tên học viên *</label>
              <input className="form-control" value={form.name}
                onChange={e => set('name', e.target.value)} placeholder="Nguyễn Thanh Mai" required />
            </div>
            <div className="form-group">
              <label className="form-label">Vai trò / Mô tả</label>
              <input className="form-control" value={form.role}
                onChange={e => set('role', e.target.value)} placeholder="Học viên 6 tháng · Dân văn phòng" />
            </div>
            <div className="form-group">
              <label className="form-label">Nội dung đánh giá *</label>
              <textarea className="form-control" rows={5} value={form.content}
                onChange={e => set('content', e.target.value)}
                placeholder="Chia sẻ trải nghiệm của học viên..." required />
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Ảnh đại diện</label>
                <ImageField value={form.avatar_url} onChange={url => set('avatar_url', url)} />
              </div>
              <div className="form-group">
                <label className="form-label">Xếp hạng (1–5 sao)</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      onClick={() => set('rating', n)}
                      style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer',
                        color: n <= form.rating ? '#f59e0b' : 'var(--border)', transition: 'color .15s' }}>★</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự hiển thị</label>
                <input type="number" className="form-control" value={form.sort_order}
                  onChange={e => set('sort_order', +e.target.value)} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form.is_active}
                    onChange={e => set('is_active', e.target.checked ? 1 : 0)} />
                  <span className="form-label" style={{ marginBottom: 0 }}>Hiển thị trên website</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-accent" disabled={saving}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm đánh giá'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
