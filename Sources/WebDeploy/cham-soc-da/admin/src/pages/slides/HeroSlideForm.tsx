import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface SlideForm {
  title: string
  subtitle: string
  badge_text: string
  btn_label: string
  btn_url: string
  image: string
  sort_order: number
  is_active: number
}

const empty: SlideForm = {
  title: '', subtitle: '', badge_text: '', btn_label: '', btn_url: '',
  image: '', sort_order: 0, is_active: 1,
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
      .then(d => setForm({
        title: d.title ?? '',
        subtitle: d.subtitle ?? '',
        badge_text: d.badge_text ?? '',
        btn_label: d.btn_label ?? '',
        btn_url: d.btn_url ?? '',
        image: d.image ?? '',
        sort_order: d.sort_order ?? 0,
        is_active: d.is_active ?? 1,
      }))
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
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Nội dung mô tả slide" />
        </div>
        <div className="form-group">
          <label className="form-label">Badge text</label>
          <input type="text" className="form-control" value={form.badge_text} onChange={e => set('badge_text', e.target.value)} placeholder="Vd: Phòng khám Da liễu Chuyên sâu" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Chữ nút</label>
            <input type="text" className="form-control" value={form.btn_label} onChange={e => set('btn_label', e.target.value)} placeholder="Vd: Đặt lịch tư vấn" />
          </div>
          <div className="form-group">
            <label className="form-label">Liên kết nút</label>
            <input type="text" className="form-control" value={form.btn_url} onChange={e => set('btn_url', e.target.value)} placeholder="/dat-lich" />
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
            <select className="form-control" value={String(form.is_active)} onChange={e => set('is_active', parseInt(e.target.value))}>
              <option value="1">Đang hiện</option>
              <option value="0">Ẩn</option>
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
