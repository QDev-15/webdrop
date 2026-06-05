import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  post_count: number
  sort_order: number
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', sort_order: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    api.get<Category[]>('/post-categories').then(setCategories).catch(() => null).finally(() => setLoading(false))
  }

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', slug: '', description: '', sort_order: 0 })
    setShowForm(true)
    setError('')
  }

  function openEdit(cat: Category) {
    setEditItem(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '', sort_order: cat.sort_order })
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editItem) {
        await api.put(`/post-categories/${editItem.id}`, form)
      } else {
        await api.post('/post-categories', form)
      }
      setShowForm(false)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa danh mục "${name}"? Các bài viết thuộc danh mục này sẽ không có danh mục.`)) return
    await api.delete(`/post-categories/${id}`).catch(() => null)
    load()
  }

  function slugify(text: string) {
    return text.toLowerCase()
      .replace(/[àáảãạăằắẳẵặâầấẩẫậ]/g, 'a')
      .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
      .replace(/[ìíỉĩị]/g, 'i')
      .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
      .replace(/[ùúủũụưừứửữự]/g, 'u')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .trim()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục</div>
          <div className="page-sub">{categories.length} danh mục</div>
        </div>
        <button onClick={openCreate} className="btn btn-accent">+ Thêm danh mục</button>
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: '20px' }}>
          <div className="form-section-title">{editItem ? 'Sửa danh mục' : 'Thêm danh mục mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên danh mục <span className="req">*</span></label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={e => {
                    const v = e.target.value
                    setForm(f => ({ ...f, name: v, slug: f.slug || slugify(v) }))
                  }}
                  required
                  placeholder="Công nghệ"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  className="form-control"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="cong-nghe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ tự</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Mô tả ngắn về danh mục" />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        {loading ? (
          <div style={{ padding: '24px' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '44px', marginBottom: '8px' }} />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <p>Chưa có danh mục nào</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Số bài viết</th>
                <th>Thứ tự</th>
                <th style={{ width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text)' }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{cat.slug}</td>
                  <td>{cat.post_count}</td>
                  <td>{cat.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(cat)} className="btn btn-ghost btn-sm">Sửa</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="btn btn-sm" style={{ background: '#fff0f0', color: 'var(--danger)', border: '1px solid #fdd' }}>Xóa</button>
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
