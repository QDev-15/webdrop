import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface SlideData {
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
}

export default function SlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<SlideData>({
    title: '', subtitle: '', button_text: 'Xem thực đơn', button_link: '/menu',
    image: '', sort_order: 0, status: 'published',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<SlideData & { id: number }>(`/hero-slides/${id}`)
        .then(data => setForm({
          title: data.title, subtitle: data.subtitle || '',
          button_text: data.button_text || '', button_link: data.button_link || '',
          image: data.image || '', sort_order: data.sort_order, status: data.status,
        }))
        .catch(() => navigate('/slides'))
    }
  }, [id, isEdit, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/hero-slides/${id}`, form)
      } else {
        await api.post('/hero-slides', form)
      }
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi lưu slide')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa Slide' : 'Thêm Slide'}</div>
        </div>
        <button className="btn-ghost btn-sm" onClick={() => navigate('/slides')}>← Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả phụ</label>
            <textarea className="form-control" rows={3} value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Text nút</label>
              <input className="form-control" value={form.button_text} onChange={e => setForm(p => ({ ...p, button_text: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút</label>
              <input className="form-control" value={form.button_link} onChange={e => setForm(p => ({ ...p, button_link: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL ảnh</label>
            <input className="form-control" type="url" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
            {form.image && <img src={form.image} style={{ marginTop: '8px', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} alt="preview" onError={e => (e.currentTarget.style.display = 'none')} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="published">Công khai</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu slide'}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/slides')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
