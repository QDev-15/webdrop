import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface SlideData { title: string; subtitle: string; button_text: string; button_link: string; image: string; sort_order: number; status: string }

export default function SlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<SlideData>({ title: '', subtitle: '', button_text: '', button_link: '', image: '', sort_order: 0, status: 'published' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<Array<SlideData & { id: number }>>('/hero-slides').then(arr => {
      const found = arr.find(s => s.id === Number(id))
      if (found) setForm(found)
    }).catch(console.error)
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Tiêu đề không được để trống.'); return }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await api.put(`/hero-slides/${id}`, form)
      } else {
        await api.post('/hero-slides', form)
      }
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa Slide' : 'Thêm Slide mới'}</div>
        </div>
        <button onClick={() => navigate('/slides')} className="btn-ghost">← Quay lại</button>
      </div>

      <div className="card" style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề hiển thị trên slider" required />
          </div>
          <div className="form-group">
            <label className="form-label">Phụ đề</label>
            <textarea className="form-control" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Mô tả ngắn..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input className="form-control" value={form.button_text} onChange={e => setForm({ ...form, button_text: e.target.value })} placeholder="Xem ngay" />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input className="form-control" value={form.button_link} onChange={e => setForm({ ...form, button_link: e.target.value })} placeholder="/dich-vu" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ảnh nền (URL)</label>
            <input className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            {form.image && <img src={form.image} alt="preview" className="img-preview" />}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu slide'}</button>
            <button type="button" onClick={() => navigate('/slides')} className="btn-ghost">Hủy</button>
          </div>
        </form>
      </div>
    </>
  )
}
