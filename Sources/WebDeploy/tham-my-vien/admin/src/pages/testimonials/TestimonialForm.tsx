import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormState {
  author_name: string
  author_title: string
  service_name: string
  rating: string
  content: string
  avatar: string
  status: string
}

const EMPTY: FormState = {
  author_name:  '',
  author_title: '',
  service_name: '',
  rating:       '5',
  content:      '',
  avatar:       '',
  status:       'published',
}

export default function TestimonialForm() {
  const { id }        = useParams<{ id: string }>()
  const navigate      = useNavigate()
  const isEdit        = Boolean(id)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Record<string, unknown>>(`/testimonials/${id}`)
      .then(d => setForm({
        author_name:  String(d.author_name ?? ''),
        author_title: String(d.author_title ?? ''),
        service_name: String(d.service_name ?? ''),
        rating:       String(d.rating ?? '5'),
        content:      String(d.content ?? ''),
        avatar:       String(d.avatar ?? ''),
        status:       String(d.status ?? 'published'),
      }))
      .catch(() => setError('Không thể tải dữ liệu đánh giá.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name.trim()) { setError('Tên khách hàng không được để trống.'); return }
    if (!form.content.trim()) { setError('Nội dung đánh giá không được để trống.'); return }
    setSaving(true); setError('')
    const payload = { ...form, rating: Number(form.rating) }
    try {
      if (isEdit) {
        await api.put(`/testimonials/${id}`, payload)
      } else {
        await api.post('/testimonials', payload)
      }
      navigate('/testimonials')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu đánh giá.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}</div>
          <div className="page-sub">Đánh giá từ khách hàng thực</div>
        </div>
        <button onClick={() => navigate('/testimonials')} className="btn-ghost">← Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div className="card" style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tên khách hàng *</label>
                <input className="form-control" value={form.author_name} onChange={e => set('author_name', e.target.value)} placeholder="VD: Chị Ngọc Anh" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Chức danh / Nghề nghiệp</label>
                <input className="form-control" value={form.author_title} onChange={e => set('author_title', e.target.value)} placeholder="VD: Giám đốc Marketing" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Dịch vụ đã sử dụng</label>
              <input className="form-control" value={form.service_name} onChange={e => set('service_name', e.target.value)} placeholder="VD: Nâng mũi S-line" />
            </div>
            <div className="form-group">
              <label className="form-label">Nội dung đánh giá *</label>
              <textarea className="form-control" rows={5} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Cảm nhận thực tế của khách hàng..." required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Số sao (1–5)</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('rating', String(n))}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 24, color: n <= Number(form.rating) ? '#f59e0b' : 'var(--border)',
                      padding: 0, transition: 'color .15s',
                    }}
                  >★</button>
                ))}
                <span style={{ fontSize: 13, color: 'var(--text-3)', marginLeft: 4 }}>{form.rating}/5 sao</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ display: 'grid', gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
            </div>
            <div className="card">
              <label className="form-label">Ảnh đại diện khách hàng</label>
              <ImageField value={form.avatar} onChange={v => set('avatar', v)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} className="btn-accent" style={{ flex: 1 }}>
                {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm đánh giá'}
              </button>
              <button type="button" onClick={() => navigate('/testimonials')} className="btn-ghost">Huỷ</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
