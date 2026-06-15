import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface SlideForm {
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
}

const empty: SlideForm = { title: '', subtitle: '', button_text: '', button_link: '', image: '', sort_order: 0, status: 'published' }

export default function HeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<SlideForm>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean(id)

  useEffect(() => {
    if (id) {
      api.get<SlideForm & { id: number }>(`/hero-slides/${id}`).then(s => {
        setForm({ title: s.title, subtitle: s.subtitle ?? '', button_text: s.button_text ?? '', button_link: s.button_link ?? '', image: s.image ?? '', sort_order: s.sort_order, status: s.status })
      }).catch(() => setError('Không thể tải dữ liệu.'))
    }
  }, [id])

  const set = (key: keyof SlideForm, val: string | number) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) await api.put(`/hero-slides/${id}`, form)
      else await api.post('/hero-slides', form)
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa slide' : 'Thêm slide mới'}</div>
        </div>
        <button onClick={() => navigate('/slides')} className="btn-ghost">← Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tiêu đề slide" required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả phụ</label>
            <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Mô tả ngắn..." />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Nội dung nút</label>
              <input type="text" className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Xem dự án" />
            </div>
            <div>
              <label className="form-label">Liên kết nút</label>
              <input type="text" className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="#du-an" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh nền" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu slide'}</button>
            <button type="button" onClick={() => navigate('/slides')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
