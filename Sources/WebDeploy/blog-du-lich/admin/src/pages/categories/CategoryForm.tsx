import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface CategoryForm {
  name: string
  slug: string
  icon: string
  tag_class: string
  sort_order: number
}

const empty: CategoryForm = { name: '', slug: '', icon: '', tag_class: '', sort_order: 0 }

const TAG_CLASSES = ['domestic', 'intl', 'tips', 'stay', 'food']

export default function CategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<CategoryForm>(empty)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!id

  useEffect(() => {
    if (!id) return
    api.get<CategoryForm & { id: number }>(`/categories/${id}`)
      .then(d => setForm({ name: d.name, slug: d.slug ?? '', icon: d.icon ?? '', tag_class: d.tag_class ?? '', sort_order: d.sort_order ?? 0 }))
      .catch(() => setError('Không tìm thấy chuyên mục.'))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof CategoryForm>(k: K, v: CategoryForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên chuyên mục là bắt buộc.'); return }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/categories/${id}`, form)
      } else {
        await api.post('/categories', form)
      }
      navigate('/categories')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Chỉnh sửa chuyên mục' : 'Thêm chuyên mục mới'}</div>
        </div>
        <button onClick={() => navigate('/categories')} className="btn-ghost">Quay lại</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label className="form-label">Tên chuyên mục *</label>
          <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Điểm đến trong nước" required />
        </div>
        <div className="form-group">
          <label className="form-label">Slug (để trống sẽ tự tạo từ tên)</label>
          <input type="text" className="form-control" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="trong-nuoc" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Icon (emoji)</label>
            <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🏔️" />
          </div>
          <div className="form-group">
            <label className="form-label">Nhãn màu (tag class)</label>
            <select className="form-control" value={form.tag_class} onChange={e => set('tag_class', e.target.value)}>
              <option value="">— Chọn —</option>
              {TAG_CLASSES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Thứ tự hiển thị</label>
          <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} style={{ maxWidth: 160 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <button type="button" onClick={() => navigate('/categories')} className="btn-ghost">Hủy</button>
          <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}</button>
        </div>
      </form>
    </div>
  )
}
