import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface GalleryFormState {
  image: string
  alt_text: string
  sort_order: number
  status: string
}

const empty: GalleryFormState = { image: '', alt_text: '', sort_order: 0, status: 'published' }

export default function GalleryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState<GalleryFormState>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<GalleryFormState & { id: number }>(`/gallery/${id}`)
      .then(d => setForm({ image: d.image ?? '', alt_text: d.alt_text ?? '', sort_order: d.sort_order ?? 0, status: d.status ?? 'published' }))
      .catch(() => setError('Không tìm thấy ảnh.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof GalleryFormState>(k: K, v: GalleryFormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.image.trim()) { setError('Ảnh là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) await api.put(`/gallery/${id}`, form)
      else await api.post('/gallery', form)
      navigate('/gallery')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa ảnh' : 'Thêm ảnh mới'}</div>
        </div>
        <button onClick={() => navigate('/gallery')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <ImageField label="Ảnh *" value={form.image} onChange={v => set('image', v)} />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả ảnh (alt text)</label>
          <input className="form-control" value={form.alt_text} onChange={e => set('alt_text', e.target.value)} placeholder="Cắt tóc fade" />
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
          <button type="button" onClick={() => navigate('/gallery')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
