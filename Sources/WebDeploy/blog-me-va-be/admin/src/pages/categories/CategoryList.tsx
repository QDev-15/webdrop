import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
  slug: string
  sort_order: number
  post_count: number
}

const emptyForm = { name: '', slug: '', sort_order: 0 }

export default function CategoryList() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Category[]>('/categories')) }
    finally { setLoading(false) }
  }

  function startEdit(c: Category) {
    setEditingId(c.id)
    setForm({ name: c.name, slug: c.slug, sort_order: c.sort_order })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Tên chuyên mục là bắt buộc.'); return }
    setSaving(true)
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form)
      } else {
        await api.post('/categories', form)
      }
      cancelEdit()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại.')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa chuyên mục này? Các bài viết thuộc chuyên mục sẽ không bị xóa nhưng mất liên kết.')) return
    await api.delete(`/categories/${id}`)
    if (editingId === id) cancelEdit()
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Chuyên mục</div>
          <div className="page-sub">Quản lý chuyên mục bài viết ({items.length} chuyên mục)</div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{editingId ? 'Sửa chuyên mục' : 'Thêm chuyên mục mới'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 100px auto', gap: 12, alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tên chuyên mục *</label>
            <input type="text" className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Vd: Mang thai" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Slug (để trống sẽ tự tạo)</label>
            <input type="text" className="form-control" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="mang-thai" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Thứ tự</label>
            <input type="number" className="form-control" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm')}</button>
            {editingId && <button type="button" className="btn-ghost" onClick={cancelEdit}>Hủy</button>}
          </div>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗂</div>
          <div className="empty-state-text">Chưa có chuyên mục nào.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Slug</th>
                <th>Số bài viết</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-3)', fontSize: 12.5 }}>{c.slug}</td>
                  <td>{c.post_count}</td>
                  <td>{c.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(c)} className="btn-ghost btn-sm">Sửa</button>
                      <button onClick={() => handleDelete(c.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
