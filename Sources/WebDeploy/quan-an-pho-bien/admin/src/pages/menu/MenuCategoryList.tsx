import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import ImageField from '../../components/ImageField'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  image: string
  sort_order: number
  status: string
  item_count: number
}

interface CategoryForm {
  name: string
  description: string
  icon: string
  image: string
  sort_order: number
  status: string
}

const emptyForm: CategoryForm = { name: '', description: '', icon: '', image: '', sort_order: 0, status: 'published' }

export default function MenuCategoryList() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setCats(await api.get<Category[]>('/menu-categories')) }
    finally { setLoading(false) }
  }

  function openNew() {
    setEditing(null); setForm(emptyForm); setError(''); setShowForm(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description ?? '', icon: cat.icon ?? '', image: cat.image ?? '', sort_order: cat.sort_order ?? 0, status: cat.status ?? 'published' })
    setError('')
    setShowForm(true)
  }

  function set<K extends keyof CategoryForm>(k: K, v: CategoryForm[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Tên danh mục là bắt buộc.'); return }
    setSaving(true); setError('')
    try {
      if (editing) {
        await api.put(`/menu-categories/${editing.id}`, form)
      } else {
        await api.post('/menu-categories', form)
      }
      setShowForm(false); load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này? Các món ăn trong danh mục sẽ không bị xóa nhưng sẽ mất danh mục.')) return
    await api.delete(`/menu-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục thực đơn</div>
          <div className="page-sub">{cats.length} danh mục</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm danh mục</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Tên danh mục *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Vd: Món Sáng" required />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="published">Hiển thị</option>
                  <option value="draft">Ẩn</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Mô tả ngắn</label>
                <input type="text" className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="VD: Phục vụ 6:00 – 10:00" />
              </div>
              <div className="form-group">
                <label className="form-label">Biểu tượng (emoji)</label>
                <input type="text" className="form-control" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🌅" style={{ maxWidth: 120 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} min={0} style={{ maxWidth: 120 }} />
            </div>
            <div className="form-group">
              <ImageField label="Ảnh đại diện" value={form.image} onChange={v => set('image', v)} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Hủy</button>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Thêm mới')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Số món</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(cat => (
              <tr key={cat.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{cat.icon && <span style={{ marginRight: 6 }}>{cat.icon}</span>}{cat.name}</div>
                  {cat.description && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{cat.description}</div>}
                </td>
                <td>{cat.item_count ?? 0} món</td>
                <td>{cat.sort_order}</td>
                <td><span className={`badge badge-${cat.status}`}>{cat.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(cat)} className="btn-ghost btn-sm">Sửa</button>
                    <button onClick={() => handleDelete(cat.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cats.length === 0 && <div className="empty-state"><div className="empty-state-icon">📂</div><div className="empty-state-text">Chưa có danh mục nào.</div></div>}
      </div>
    </div>
  )
}
