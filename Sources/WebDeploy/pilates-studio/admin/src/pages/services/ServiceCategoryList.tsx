import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  sort_order: number
}

export default function ServiceCategoryList() {
  const [items, setItems]   = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm]     = useState({ name: '', slug: '', description: '', sort_order: 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  function openNew() {
    setEditing(null)
    setForm({ name: '', slug: '', description: '', sort_order: 0 })
    setError('')
  }

  function openEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, description: c.description, sort_order: c.sort_order })
    setError('')
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Tên danh mục không được trống.'); return }
    setSaving(true); setError('')
    try {
      if (editing) {
        await api.put(`/service-categories/${editing.id}`, form)
      } else {
        await api.post('/service-categories', form)
      }
      setEditing(null)
      load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu dữ liệu.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này? Các lớp học trong danh mục sẽ không bị xóa.')) return
    await api.delete(`/service-categories/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục lớp học</div>
          <div className="page-sub">{items.length} danh mục</div>
        </div>
        <button onClick={openNew} className="btn-accent">+ Thêm danh mục</button>
      </div>

      {(editing !== null || !items.length) && (
        <div className="card" style={{ marginBottom: 20, maxWidth: 560 }}>
          <div style={{ fontWeight: 600, marginBottom: 16 }}>{editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Tên danh mục *</label>
            <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Mat Pilates" />
          </div>
          <div className="form-group">
            <label className="form-label">Slug</label>
            <input className="form-control" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="mat-pilates" />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
            <button onClick={() => setEditing(null)} className="btn-ghost">Hủy</button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Slug</th>
              <th>Mô tả</th>
              <th>Thứ tự</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.slug}</td>
                <td style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 300 }}>{c.description}</td>
                <td>{c.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(c)} className="btn-ghost btn-sm">Sửa</button>
                    <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && <div className="empty-state"><div className="empty-state-icon">🏷️</div><div className="empty-state-text">Chưa có danh mục nào.</div></div>}
      </div>
    </div>
  )
}
