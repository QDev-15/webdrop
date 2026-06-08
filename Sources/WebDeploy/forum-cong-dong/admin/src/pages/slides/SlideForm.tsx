import { useEffect, useState } from 'react'
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

const defaults: SlideForm = {
  title: '', subtitle: '', button_text: '', button_link: '',
  image: '', sort_order: 0, status: 'published'
}

export default function SlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<SlideForm>(defaults)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<SlideForm & { id: number }>(`/hero-slides/${id}`)
        .then(d => setForm({ title: d.title, subtitle: d.subtitle ?? '', button_text: d.button_text ?? '', button_link: d.button_link ?? '', image: d.image ?? '', sort_order: d.sort_order, status: d.status }))
        .catch(() => setError('Không tìm thấy slide'))
    }
  }, [id, isEdit])

  const set = (k: keyof SlideForm, v: string | number) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (isEdit) await api.put(`/hero-slides/${id}`, form)
      else await api.post('/hero-slides', form)
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu slide')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa slide' : 'Thêm slide mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/slides')}>Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên nút bấm</label>
              <input className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút bấm</label>
              <input className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/trang-nao-do" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh slide" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm slide')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/slides')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
