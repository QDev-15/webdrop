import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface SlideData { title: string; subtitle: string; button_text: string; button_link: string; image: string; sort_order: number; status: string }

export default function SlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<SlideData>({ title: '', subtitle: '', button_text: '', button_link: '', image: '', sort_order: 0, status: 'published' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<SlideData & { id: number }>(`/hero-slides`).then((items: unknown) => {
        const arr = items as Array<SlideData & { id: number }>
        const found = arr.find(s => s.id === Number(id))
        if (found) setForm(found)
      }).catch(() => setError('Không tìm thấy slide'))
    }
  }, [id, isEdit])

  const set = (field: keyof SlideData, value: string | number) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) await api.put(`/hero-slides/${id}`, form)
      else await api.post('/hero-slides', form)
      navigate('/slides')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Sửa slide' : 'Thêm slide mới'}</h1>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phụ đề</label>
            <textarea className="form-control" rows={3} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Text nút CTA</label>
              <input type="text" className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút CTA</label>
              <input type="text" className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/bang-gia" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL ảnh</label>
            <input type="text" className="form-control" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/slides')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
