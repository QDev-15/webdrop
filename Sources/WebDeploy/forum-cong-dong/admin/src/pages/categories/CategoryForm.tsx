import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'

interface CategoryData {
  id: number
  name: string
  description: string
  icon: string
  sort_order: number
  status: string
}

interface FormData {
  name: string
  description: string
  icon: string
  sort_order: string
  status: string
}

const EMPTY: FormData = { name: '', description: '', icon: '', sort_order: '0', status: 'published' }

export default function CategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get<CategoryData>(`/forum-categories/${id}`)
      .then(d => setForm({
        name: d.name ?? '',
        description: d.description ?? '',
        icon: d.icon ?? '',
        sort_order: String(d.sort_order ?? 0),
        status: d.status ?? 'published',
      }))
      .catch(() => setError('Không thể tải dữ liệu.'))
  }, [id, isEdit])

  function set(field: keyof FormData, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên danh mục không được để trống.'); return }
    setSaving(true)
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) }
      if (isEdit) {
        await api.put(`/forum-categories/${id}`, payload)
      } else {
        await api.post('/forum-categories', payload)
      }
      navigate('/forum-categories')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}</div>
          <div className="page-sub">Quản lý danh mục diễn đàn</div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label className="form-label">Tên danh mục *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Ví dụ: Lập trình & Công nghệ" />
          </div>

          <div>
            <label className="form-label">Biểu tượng (Emoji)</label>
            <input className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="Ví dụ: 💻 🎨 🚀" style={{ fontSize: '18px' }} />
          </div>

          <div>
            <label className="form-label">Mô tả ngắn</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Mô tả ngắn gọn về danh mục này..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} min="0" />
            </div>
            <div>
              <label className="form-label">Trạng thái</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="published">Hiển thị</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-accent" disabled={saving}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/forum-categories')}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
