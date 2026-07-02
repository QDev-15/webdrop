import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  tag: string
  sort_order: number
}

const empty = { name: '', icon: '', tag: '', sort_order: 0 }

export default function ServiceCategoryList() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/service-categories')) }
    finally { setLoading(false) }
  }

  function startEdit(c: Category) {
    setEditId(c.id)
    setForm({ name: c.name, icon: c.icon, tag: c.tag, sort_order: c.sort_order })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(empty)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên danh mục là bắt buộc.'); return }
    setSaving(true)
    try {
      if (editId) await api.put(`/service-categories/${editId}`, form)
      else await api.post('/service-categories', form)
      cancelEdit()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa danh mục này? Các dịch vụ thuộc danh mục cũng sẽ bị xóa.')) return
    await api.delete(`/service-categories/${id}`)
    if (editId === id) cancelEdit()
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Danh mục dịch vụ</div>
          <div className="page-sub">Quản lý nhóm dịch vụ hiển thị trên bảng giá ({items.length} danh mục)</div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Tag</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: 18 }}>{c.icon || '—'}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.slug}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.tag || '—'}</td>
                  <td>{c.sort_order}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => startEdit(c)} className="btn-ghost btn-sm">Sửa</button>
                    <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">📂</div><div className="empty-state-text">Chưa có danh mục nào.</div></div>}
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{editId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tên danh mục *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Cắt & Tạo kiểu Nam" required />
            </div>
            <div className="form-group">
              <label className="form-label">Icon (emoji)</label>
              <input className="form-control" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="✂" />
            </div>
            <div className="form-group">
              <label className="form-label">Tag (nhãn card nổi bật)</label>
              <input className="form-control" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Tóc Nam" />
            </div>
            <div className="form-group">
              <label className="form-label">Thứ tự hiển thị</label>
              <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} min={0} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm mới'}</button>
              {editId && <button type="button" onClick={cancelEdit} className="btn-ghost">Hủy</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
