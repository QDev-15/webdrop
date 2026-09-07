import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  post_count: number
  sort_order: number
}

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/[àáảãạăằắẳẵặâầấẩẫậ]/g, 'a')
    .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
    .replace(/[ùúủũụưừứửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .trim()
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', sort_order: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setCategories(await api.get<Category[]>('/post-categories')) } finally { setLoading(false) }
  }

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', slug: '', sort_order: categories.length + 1 })
    setShowForm(true)
    setError('')
  }

  function openEdit(cat: Category) {
    setEditItem(cat)
    setForm({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order })
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (editItem) await api.put(`/post-categories/${editItem.id}`, form)
      else await api.post('/post-categories', form)
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa chuyên mục "${name}"? Bài viết thuộc chuyên mục này sẽ không còn chuyên mục.`)) return
    await api.delete(`/post-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chuyên mục</div>
          <div className="page-sub">{categories.length} chuyên mục</div>
        </div>
        <button onClick={openCreate} className="btn-accent">+ Thêm chuyên mục</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>{editItem ? 'Sửa chuyên mục' : 'Thêm chuyên mục mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Tên chuyên mục *</label>
              <input className="form-control" value={form.name}
                onChange={e => { const v = e.target.value; setForm(f => ({ ...f, name: v, slug: f.slug || slugify(v) })) }}
                required placeholder="Món chính" />
            </div>
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input className="form-control" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="mon-chinh" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <div className="empty-state-text">Chưa có chuyên mục nào.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Tên chuyên mục</th><th>Slug</th><th>Số bài viết</th><th>Thứ tự</th><th style={{ width: 140 }}>Thao tác</th></tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 500 }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{cat.slug}</td>
                  <td>{cat.post_count}</td>
                  <td>{cat.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(cat)} className="btn-ghost btn-sm">Sửa</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
