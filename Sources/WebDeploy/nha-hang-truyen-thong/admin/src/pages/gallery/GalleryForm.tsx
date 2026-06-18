import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface GalleryForm {
  title: string
  description: string
  image: string
  category: string
  sort_order: number
  status: string
}

const emptyForm: GalleryForm = {
  title: '', description: '', image: '', category: 'khong-gian', sort_order: 0, status: 'published',
}

const CATEGORIES = [
  { value: 'khong-gian', label: 'Không gian' },
  { value: 'mon-an', label: 'Món ăn' },
  { value: 'su-kien', label: 'Sự kiện' },
  { value: 'khac', label: 'Khác' },
]

export default function GalleryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<GalleryForm>(emptyForm)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<GalleryForm & { id: number }>(`/gallery/${id}`)
      .then(d => setForm({
        title: d.title ?? '',
        description: d.description ?? '',
        image: d.image ?? '',
        category: d.category ?? 'khong-gian',
        sort_order: d.sort_order ?? 0,
        status: d.status ?? 'published',
      }))
      .catch(() => setError('Không tải được dữ liệu.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof GalleryForm>(k: K, v: GalleryForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image) { setError('Ảnh là bắt buộc.'); return }
    setError(''); setSaving(true)
    try {
      if (isEdit) { await api.put(`/gallery/${id}`, form) }
      else { await api.post('/gallery', form) }
      navigate('/gallery')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 640 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Tiêu đề ảnh</label>
            <input type="text" className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Không gian chính, Góc bếp..." />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <input type="text" className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về ảnh" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Thứ tự hiển thị</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} />
          </div>
          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="published">Hiển thị</option>
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
