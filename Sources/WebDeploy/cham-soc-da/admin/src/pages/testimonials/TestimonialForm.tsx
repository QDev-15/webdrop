import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface FormState {
  author_name: string; author_avatar: string; condition: string; content: string; rating: string; sort_order: string; is_active: string
}

export default function TestimonialForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    author_name: '', author_avatar: '', condition: '', content: '', rating: '5', sort_order: '0', is_active: '1',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<Record<string, string>>(`/testimonials/${id}`)
        .then(data => setForm({
          author_name: data.author_name ?? '', author_avatar: data.author_avatar ?? '',
          condition: data.condition ?? '', content: data.content ?? '',
          rating: String(data.rating ?? '5'), sort_order: String(data.sort_order ?? '0'),
          is_active: String(data.is_active ?? '1'),
        }))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.author_name.trim()) { setError('Tên khách hàng là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, rating: Number(form.rating), sort_order: Number(form.sort_order), is_active: Number(form.is_active) }
      if (isEdit) await api.put(`/testimonials/${id}`, payload)
      else await api.post('/testimonials', payload)
      navigate('/testimonials')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}</h1>
        <button className="btn btn-ghost" onClick={() => navigate('/testimonials')}>← Quay lại</button>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Tên khách hàng *</label>
            <input className="form-input" value={form.author_name} onChange={set('author_name')} required placeholder="Nguyễn Thị Bích Ngọc" />
          </div>
          <div className="form-group">
            <label className="form-label">Điều trị (ví dụ: Điều trị mụn)</label>
            <input className="form-input" value={form.condition} onChange={set('condition')} placeholder="Điều trị mụn" />
          </div>
        </div>

        <div className="form-group">
          <ImageField
            label="Ảnh đại diện"
            value={form.author_avatar}
            onChange={url => setForm(f => ({ ...f, author_avatar: url }))}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nội dung đánh giá</label>
          <textarea className="form-input" rows={4} value={form.content} onChange={set('content')} placeholder="Chia sẻ trải nghiệm điều trị..." />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Điểm đánh giá (1–5)</label>
            <select className="form-input" value={form.rating} onChange={set('rating')}>
              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r} sao)</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-input" value={form.sort_order} onChange={set('sort_order')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Hiển thị</label>
          <select className="form-input" value={form.is_active} onChange={set('is_active')}>
            <option value="1">Có</option>
            <option value="0">Không</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/testimonials')}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu đánh giá'}</button>
        </div>
      </form>
    </div>
  )
}
