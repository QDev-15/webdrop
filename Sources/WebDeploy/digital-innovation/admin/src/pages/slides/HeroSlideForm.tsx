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

const empty: SlideForm = {
  title: '', subtitle: '', button_text: '', button_link: '',
  image: '', sort_order: 0, status: 'published',
}

// Website tách subtitle thành [nhãn nhỏ phía trên tiêu đề, đoạn mô tả] theo dòng đầu tiên
// (xem website/src/components/HeroSlider.tsx#splitSubtitle) — form này giữ đúng convention đó.
function splitSubtitle(subtitle: string): [string, string] {
  const idx = subtitle.indexOf('\n')
  if (idx === -1) return ['', subtitle]
  return [subtitle.slice(0, idx), subtitle.slice(idx + 1)]
}

export default function HeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<SlideForm>(empty)
  const [eyebrow, setEyebrow] = useState('')
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<SlideForm & { id: number }>(`/hero-slides/${id}`)
      .then(d => {
        const [label, desc] = splitSubtitle(d.subtitle ?? '')
        setEyebrow(label)
        setForm({ title: d.title, subtitle: desc, button_text: d.button_text ?? '', button_link: d.button_link ?? '', image: d.image ?? '', sort_order: d.sort_order ?? 0, status: d.status ?? 'published' })
      })
      .catch(() => setError('Không tìm thấy slide.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof SlideForm>(k: K, v: SlideForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('Tiêu đề là bắt buộc.'); return }
    setSaving(true)
    try {
      const payload = { ...form, subtitle: eyebrow.trim() ? `${eyebrow}\n${form.subtitle}` : form.subtitle }
      if (isEdit) {
        await api.put(`/hero-slides/${id}`, payload)
      } else {
        await api.post('/hero-slides', payload)
      }
      navigate('/slides')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa Slide' : 'Thêm Slide mới'}</div>
        </div>
        <button onClick={() => navigate('/slides')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tiêu đề chính của slide" required />
        </div>
        <div className="form-group">
          <label className="form-label">Nhãn nhỏ (eyebrow)</label>
          <input type="text" className="form-control" value={eyebrow} onChange={e => setEyebrow(e.target.value)} placeholder="Vd: Công nghệ Digital Tiên tiến — hiện phía trên tiêu đề chính" />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Nội dung mô tả slide" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chữ nút</label>
            <input type="text" className="form-control" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Vd: Đặt bàn ngay" />
          </div>
          <div className="form-group">
            <label className="form-label">Liên kết nút</label>
            <input type="text" className="form-control" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/dat-ban" />
          </div>
        </div>
        <div className="form-group">
          <ImageField label="Ảnh slide" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/slides')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
