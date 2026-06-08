import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import ImageField from '../../components/ImageField'
import { api } from '../../api/client'

interface SlideForm {
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
  status: string
}

const INIT: SlideForm = { title: '', subtitle: '', button_text: '', button_link: '', image: '', sort_order: 0, status: 'published' }

export default function SlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<SlideForm>(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<SlideForm & { id: number }>(`/hero-slides/${id}`)
        .then(d => setForm({ title: d.title, subtitle: d.subtitle || '', button_text: d.button_text || '', button_link: d.button_link || '', image: d.image || '', sort_order: d.sort_order, status: d.status }))
        .catch(() => setError('Không tìm thấy slide.'))
    }
  }, [id, isEdit])

  const set = (k: keyof SlideForm, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title) { setError('Tiêu đề không được để trống.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) { await api.put(`/hero-slides/${id}`, form) }
      else { await api.post('/hero-slides', form) }
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  return (
    <AdminLayout title={isEdit ? 'Sửa slide' : 'Thêm slide'}>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa hero slide' : 'Thêm hero slide'}</h1>
        <button className="btn-ghost" onClick={() => navigate('/slides')}>Quay lại</button>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="WE BUILD BRANDS & STORIES" required />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả phụ</label>
            <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Text nút</label>
              <input className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Xem dự án" />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút</label>
              <input className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/du-an" />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh nền" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Đã đăng</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2">
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/slides')}>Hủy</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
