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
  title: '',
  subtitle: '',
  button_text: 'Đặt bàn ngay',
  button_link: '/dat-ban',
  image: '',
  sort_order: 0,
  status: 'published',
}

export default function HeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<SlideForm>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      api.get<SlideForm & { id: number }>(`/hero-slides`)
        .then((slides: unknown) => {
          const list = slides as Array<SlideForm & { id: number }>
          const found = list.find(s => s.id === parseInt(id!))
          if (found) setForm(found)
        })
        .catch(() => {})
    }
  }, [id, isEdit])

  function set(key: keyof SlideForm, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title) { setError('Tiêu đề không được để trống.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/hero-slides/${id}`, form)
      } else {
        await api.post('/hero-slides', form)
      }
      navigate('/slides')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          {isEdit ? 'Sửa slide' : 'Thêm slide mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="form-label">Tiêu đề *</label>
            <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Hương vị đích thực Việt Nam" required />
          </div>
          <div>
            <label className="form-label">Mô tả phụ</label>
            <textarea className="form-control" rows={3} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Mô tả ngắn về slide..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Text nút bấm</label>
              <input type="text" className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Đặt bàn ngay" />
            </div>
            <div>
              <label className="form-label">Link nút bấm</label>
              <input type="text" className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/dat-ban" />
            </div>
          </div>
          <ImageField label="Ảnh nền" value={form.image} onChange={v => set('image', v)} placeholder="https://..." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Thứ tự hiển thị</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="draft">Ẩn</option>
              </select>
            </div>
          </div>
          {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fff0f0', color: 'var(--danger)', fontSize: 13, border: '1px solid #fdd' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm slide'}</button>
            <button type="button" onClick={() => navigate('/slides')} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 14 }}>
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
