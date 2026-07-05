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

export default function HeroSlideForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<SlideForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<SlideForm & { id: number }>(`/hero-slides/${id}`)
      .then(d => setForm({ title: d.title, subtitle: d.subtitle ?? '', button_text: d.button_text ?? '', button_link: d.button_link ?? '', image: d.image ?? '', sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
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
      if (isEdit) {
        await api.put(`/hero-slides/${id}`, form)
      } else {
        await api.post('/hero-slides', form)
      }
      navigate('/hero')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page" style={{ maxWidth: 640 }}>
      <div className="adm-page-header">
        <h1 className="adm-page-title">{isEdit ? 'Chỉnh sửa Slide' : 'Thêm Slide mới'}</h1>
        <button onClick={() => navigate('/hero')} className="adm-btn-ghost">Quay lại</button>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="adm-form">
        <div className="adm-field">
          <label className="adm-label" htmlFor="sl-title">Tiêu đề *</label>
          <input id="sl-title" type="text" className="adm-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tiêu đề chính của slide" required />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sl-subtitle">Mô tả</label>
          <textarea id="sl-subtitle" className="adm-input" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Nội dung mô tả slide" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="sl-btn-text">Chữ nút</label>
            <input id="sl-btn-text" type="text" className="adm-input" value={form.button_text} onChange={e => set('button_text', e.target.value)} placeholder="Vd: Đặt lịch ngay" />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="sl-btn-link">Liên kết nút</label>
            <input id="sl-btn-link" type="text" className="adm-input" value={form.button_link} onChange={e => set('button_link', e.target.value)} placeholder="/dat-lich" />
          </div>
        </div>
        <div className="adm-field">
          <ImageField label="Ảnh slide" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="adm-field">
            <label className="adm-label" htmlFor="sl-order">Thứ tự hiển thị</label>
            <input id="sl-order" type="number" className="adm-input" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="sl-status">Trạng thái</label>
            <select id="sl-status" className="adm-input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Đang hiện</option>
              <option value="draft">Ẩn</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/hero')} className="adm-btn-ghost">Hủy</button>
          <button type="submit" className="adm-btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
