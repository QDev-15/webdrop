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

const DEFAULT: SlideForm = {
  title: '', subtitle: '', button_text: 'Nhận báo giá ngay',
  button_link: '/lien-he', image: '', sort_order: 0, status: 'published'
}

export default function HeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<SlideForm>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<SlideForm & { id: number }>(`/hero-slides`).then(slides => {
        const arr = Array.isArray(slides) ? slides : []
        const found = arr.find((s: { id: number }) => s.id === Number(id))
        if (found) setForm({ ...found })
      }).catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof SlideForm, val: string | number) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
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
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa Slide' : 'Thêm Slide mới'}</div>
        </div>
        <button className="btn-ghost" onClick={() => navigate('/slides')}>Quay lại</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Tiêu đề slide" />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Mô tả ngắn" rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Văn bản nút bấm</label>
              <input className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Link nút bấm</label>
              <input className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <ImageField label="Ảnh nền" value={form.image} onChange={v => set('image', v)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/slides')}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  )
}
